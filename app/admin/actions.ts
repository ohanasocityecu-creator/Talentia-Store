'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';

export type AdminActionState = { ok: boolean; message: string };
const failed = (message: string): AdminActionState => ({ ok: false, message });
const saved = (message = 'Changes saved.'): AdminActionState => ({ ok: true, message });
const text = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();
const optionalText = (formData: FormData, key: string) => text(formData, key) || null;
const checked = (formData: FormData, key: string) => formData.get(key) === 'on';
const optionalNumber = z.preprocess(value => value === '' || value === null ? null : value, z.coerce.number().finite().nonnegative().nullable());

export async function signOut() {
  const supabase = await (await import('@/lib/supabase-server')).createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sku: z.string().min(1).max(80),
  category_id: z.string().uuid().nullable(),
  description: z.string().max(10000).nullable(),
  short_description: z.string().max(500).nullable(),
  price: z.coerce.number().finite().nonnegative(),
  compare_at_price: optionalNumber,
  cost_price: optionalNumber,
  stock_quantity: z.coerce.number().int().nonnegative(),
  low_stock_threshold: z.coerce.number().int().nonnegative(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  is_best_seller: z.boolean(),
});

async function syncProductImages(supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createSupabaseServerClient>>, productId: string, urls: string[]) {
  const { data: current, error: readError } = await supabase.from('product_images').select('id,image_url').eq('product_id', productId);
  if (readError) return false;
  const uniqueUrls = [...new Set(urls)];
  const retained = new Set<string>();
  for (const [sortOrder, imageUrl] of uniqueUrls.entries()) {
    const existing = current?.find(image => image.image_url === imageUrl);
    if (existing) {
      retained.add(existing.id);
      const { error } = await supabase.from('product_images').update({ sort_order: sortOrder, is_primary: sortOrder === 0 }).eq('id', existing.id);
      if (error) return false;
    } else {
      const { error } = await supabase.from('product_images').insert({ product_id: productId, image_url: imageUrl, sort_order: sortOrder, is_primary: sortOrder === 0 });
      if (error) return false;
    }
  }
  const removed = (current ?? []).filter(image => !retained.has(image.id)).map(image => image.id);
  if (removed.length) {
    const { error } = await supabase.from('product_images').delete().in('id', removed);
    if (error) return false;
  }
  return true;
}

export async function saveProductAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = productSchema.safeParse({
    id: text(formData, 'id') || undefined,
    name: text(formData, 'name'), slug: text(formData, 'slug'), sku: text(formData, 'sku'),
    category_id: optionalText(formData, 'category_id'), description: optionalText(formData, 'description'),
    short_description: optionalText(formData, 'short_description'), price: text(formData, 'price'),
    compare_at_price: text(formData, 'compare_at_price'), cost_price: text(formData, 'cost_price'),
    stock_quantity: text(formData, 'stock_quantity'), low_stock_threshold: text(formData, 'low_stock_threshold'),
    is_active: checked(formData, 'is_active'), is_featured: checked(formData, 'is_featured'),
    is_new: checked(formData, 'is_new'), is_best_seller: checked(formData, 'is_best_seller'),
  });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? 'Check the product fields.');

  const imageUrls = text(formData, 'image_urls').split(/\r?\n/).map(url => url.trim()).filter(Boolean);
  const validUrls = z.array(z.string().url()).safeParse(imageUrls);
  if (!validUrls.success) return failed('Each product image must be a valid public URL.');
  const imageFiles = formData.getAll('images').filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const totalImageBytes = imageFiles.reduce((total, file) => total + file.size, 0);
  if (imageFiles.some(file => !file.type.startsWith('image/')) || totalImageBytes > 8 * 1024 * 1024) return failed('Upload image files totaling no more than 8 MB.');

  const { id, ...product } = parsed.data;
  let productId = id;
  if (productId) {
    const { error } = await supabase.from('products').update({ ...product, updated_at: new Date().toISOString() }).eq('id', productId);
    if (error) return failed('Could not save this product. Check that its slug and SKU are unique.');
  } else {
    const { data, error } = await supabase.from('products').insert(product).select('id').single();
    if (error || !data) return failed('Could not create this product. Check that its slug and SKU are unique.');
    productId = data.id;
  }

  const uploadedUrls: string[] = [];
  for (const file of imageFiles) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `products/${productId}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false });
    if (error) return failed('The product was saved, but an image upload failed.');
    uploadedUrls.push(supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl);
  }
  const imagesSaved = await syncProductImages(supabase, productId!, [...imageUrls, ...uploadedUrls]);
  if (!imagesSaved) return failed('The product was saved, but its images could not be synchronized.');

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/category/[slug]', 'page');
  revalidatePath('/product/[slug]', 'page');
  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  return saved(id ? 'Product updated.' : 'Product created.');
}

const categorySchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(1).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().max(2000).nullable(), image_url: z.string().url().nullable(), sort_order: z.coerce.number().int(), is_active: z.boolean() });
export async function saveCategoryAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = categorySchema.safeParse({ id: text(formData, 'id') || undefined, name: text(formData, 'name'), slug: text(formData, 'slug'), description: optionalText(formData, 'description'), image_url: optionalText(formData, 'image_url'), sort_order: text(formData, 'sort_order') || '0', is_active: checked(formData, 'is_active') });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? 'Check the category fields.');
  const { id, ...category } = parsed.data;
  const result = id ? await supabase.from('categories').update({ ...category, updated_at: new Date().toISOString() }).eq('id', id) : await supabase.from('categories').insert(category);
  if (result.error) return failed('Could not save this category. Check that its slug is unique.');
  revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/admin/categories'); revalidatePath('/admin/products');
  return saved(id ? 'Category updated.' : 'Category created.');
}

export async function deleteCategoryAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(text(formData, 'id'));
  if (!id.success) return failed('Invalid category.');
  const { error } = await supabase.from('categories').delete().eq('id', id.data);
  if (error) return failed('Could not delete this category.');
  revalidatePath('/'); revalidatePath('/shop'); revalidatePath('/admin/categories'); revalidatePath('/admin/products');
  return saved('Category deleted.');
}

const variantSchema = z.object({ id: z.string().uuid().optional(), product_id: z.string().uuid(), name: z.string().min(1).max(120), sku: z.string().max(80).nullable(), price: optionalNumber, stock_quantity: z.coerce.number().int().nonnegative(), attributes: z.string().max(2000) });
export async function saveVariantAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = variantSchema.safeParse({ id: text(formData, 'id') || undefined, product_id: text(formData, 'product_id'), name: text(formData, 'name'), sku: optionalText(formData, 'sku'), price: text(formData, 'price'), stock_quantity: text(formData, 'stock_quantity') || '0', attributes: text(formData, 'attributes') || '{}' });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? 'Check the variant fields.');
  let attributes: unknown;
  try { attributes = JSON.parse(parsed.data.attributes); } catch { return failed('Variant attributes must be valid JSON.'); }
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) return failed('Variant attributes must be a JSON object.');
  const { id, attributes: _attributes, ...variant } = parsed.data;
  const value = { ...variant, attributes, updated_at: new Date().toISOString() };
  const result = id ? await supabase.from('product_variants').update(value).eq('id', id) : await supabase.from('product_variants').insert(value);
  if (result.error) return failed('Could not save this variant. Check that its SKU is unique.');
  revalidatePath(`/admin/products/${variant.product_id}`); revalidatePath('/admin/products');
  return saved(id ? 'Variant updated.' : 'Variant created.');
}

export async function deleteVariantAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(text(formData, 'id'));
  const productId = z.string().uuid().safeParse(text(formData, 'product_id'));
  if (!id.success || !productId.success) return failed('Invalid variant.');
  const { error } = await supabase.from('product_variants').delete().eq('id', id.data);
  if (error) return failed('Could not delete this variant.');
  revalidatePath(`/admin/products/${productId.data}`); revalidatePath('/admin/products');
  return saved('Variant deleted.');
}

const orderStatus = z.enum(['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']);
export async function updateOrderStatusAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(text(formData, 'id'));
  const status = orderStatus.safeParse(text(formData, 'status'));
  if (!id.success || !status.success) return failed('Invalid order status.');
  const { error } = await supabase.from('orders').update({ status: status.data, updated_at: new Date().toISOString() }).eq('id', id.data);
  if (error) return failed('Could not update the order status.');
  revalidatePath('/admin/orders'); revalidatePath(`/admin/orders/${id.data}`); revalidatePath('/admin');
  return saved('Order status updated.');
}

const pricingSchema = z.object({ id: z.string().uuid().optional(), min_quantity: z.coerce.number().int().positive(), max_quantity: z.preprocess(value => value === '' || value === null ? null : value, z.coerce.number().int().positive().nullable()), discount_type: z.enum(['percentage', 'fixed']), discount_value: z.coerce.number().finite().nonnegative(), priority: z.coerce.number().int(), is_active: z.boolean() }).refine(value => value.max_quantity === null || value.max_quantity >= value.min_quantity, { message: 'Maximum quantity must be at least the minimum.' });
export async function savePricingRuleAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = pricingSchema.safeParse({ id: text(formData, 'id') || undefined, min_quantity: text(formData, 'min_quantity'), max_quantity: text(formData, 'max_quantity'), discount_type: text(formData, 'discount_type'), discount_value: text(formData, 'discount_value'), priority: text(formData, 'priority') || '0', is_active: checked(formData, 'is_active') });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? 'Check the pricing fields.');
  const { id, ...rule } = parsed.data;
  const result = id ? await supabase.from('pricing_rules').update({ ...rule, updated_at: new Date().toISOString() }).eq('id', id) : await supabase.from('pricing_rules').insert(rule);
  if (result.error) return failed('Could not save this pricing rule.');
  revalidatePath('/admin/pricing'); revalidatePath('/');
  return saved(id ? 'Pricing rule updated.' : 'Pricing rule created.');
}

export async function deletePricingRuleAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(text(formData, 'id'));
  if (!id.success) return failed('Invalid pricing rule.');
  const { error } = await supabase.from('pricing_rules').delete().eq('id', id.data);
  if (error) return failed('Could not delete this pricing rule.');
  revalidatePath('/admin/pricing'); revalidatePath('/');
  return saved('Pricing rule deleted.');
}

const shippingSchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(1).max(120), shipping_fee: z.coerce.number().finite().nonnegative(), free_shipping_threshold: optionalNumber, delivery_notes: z.string().max(2000).nullable(), is_active: z.boolean() });
export async function saveShippingZoneAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const parsed = shippingSchema.safeParse({ id: text(formData, 'id') || undefined, name: text(formData, 'name'), shipping_fee: text(formData, 'shipping_fee'), free_shipping_threshold: text(formData, 'free_shipping_threshold'), delivery_notes: optionalText(formData, 'delivery_notes'), is_active: checked(formData, 'is_active') });
  if (!parsed.success) return failed(parsed.error.issues[0]?.message ?? 'Check the shipping fields.');
  const { id, ...zone } = parsed.data;
  const result = id ? await supabase.from('shipping_zones').update({ ...zone, updated_at: new Date().toISOString() }).eq('id', id) : await supabase.from('shipping_zones').insert(zone);
  if (result.error) return failed('Could not save this shipping zone.');
  revalidatePath('/admin/shipping'); revalidatePath('/admin');
  return saved(id ? 'Shipping zone updated.' : 'Shipping zone created.');
}

export async function deleteShippingZoneAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(text(formData, 'id'));
  if (!id.success) return failed('Invalid shipping zone.');
  const { error } = await supabase.from('shipping_zones').delete().eq('id', id.data);
  if (error) return failed('Could not delete this shipping zone.');
  revalidatePath('/admin/shipping');
  return saved('Shipping zone deleted.');
}

export async function setReviewApprovedAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = z.string().uuid().safeParse(text(formData, 'id'));
  const approved = z.enum(['true', 'false']).safeParse(text(formData, 'approved'));
  if (!id.success || !approved.success) return failed('Invalid review update.');
  const { error } = await supabase.from('reviews').update({ approved: approved.data === 'true' }).eq('id', id.data);
  if (error) return failed('Could not update review moderation.');
  revalidatePath('/admin/reviews'); revalidatePath('/');
  return saved(approved.data === 'true' ? 'Review approved.' : 'Review hidden.');
}

export async function saveSiteContentAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const key = z.string().min(1).max(120).regex(/^[a-zA-Z0-9_.-]+$/).safeParse(text(formData, 'key'));
  if (!key.success) return failed('Use a valid content key.');
  let value: unknown;
  try { value = JSON.parse(text(formData, 'value')); } catch { return failed('Content value must be valid JSON.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return failed('Content value must be a JSON object.');
  const { error } = await supabase.from('site_content').upsert({ key: key.data, value, updated_at: new Date().toISOString() });
  if (error) return failed('Could not save site content.');
  revalidatePath('/admin/content'); revalidatePath('/');
  return saved('Content saved.');
}

export async function deleteSiteContentAction(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const key = z.string().min(1).max(120).regex(/^[a-zA-Z0-9_.-]+$/).safeParse(text(formData, 'key'));
  if (!key.success) return failed('Use a valid content key.');
  const { error } = await supabase.from('site_content').delete().eq('key', key.data);
  if (error) return failed('Could not delete site content.');
  revalidatePath('/admin/content'); revalidatePath('/');
  return saved('Content deleted.');
}
