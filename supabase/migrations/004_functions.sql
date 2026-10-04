create or replace function public.create_order_secure(
	p_customer_name text,
	p_customer_phone text,
	p_customer_email text,
	p_shipping_address jsonb,
	p_items jsonb,
	p_notes text default null
) returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
	v_order_id uuid;
	v_subtotal numeric:=0;
	v_discount numeric:=0;
	v_shipping numeric;
	v_total numeric;
	item jsonb;
	prod products%rowtype;
	qty int;
begin
	if jsonb_array_length(p_items)=0 then
		raise exception 'Cart is empty';
	end if;

	for item in select * from jsonb_array_elements(p_items) loop
		select * into prod from products
		where id=(item->>'product_id')::uuid and is_active=true
		for update;
		if not found then
			raise exception 'Product unavailable';
		end if;
		qty=(item->>'quantity')::int;
		if qty<1 or prod.stock_quantity<qty then
			raise exception 'Insufficient stock for %',prod.name;
		end if;
		v_subtotal:=v_subtotal+(prod.price*qty);
	end loop;

	select coalesce(discount_value,0) into v_discount from pricing_rules
	where is_active=true
		and min_quantity<=jsonb_array_length(p_items)
		and (max_quantity is null or max_quantity>=jsonb_array_length(p_items))
	order by priority desc,min_quantity desc limit 1;
	v_discount:=coalesce(v_discount,0);

	select shipping_fee into v_shipping from shipping_zones
	where is_active=true order by shipping_fee limit 1;
	if not found then
		raise exception 'Shipping is not configured';
	end if;

	v_total:=greatest(0,v_subtotal-v_discount)+v_shipping;
	insert into orders(user_id,subtotal,discount,shipping_fee,total,customer_name,customer_phone,customer_email,shipping_address,notes)
	values(auth.uid(),v_subtotal,v_discount,v_shipping,v_total,p_customer_name,p_customer_phone,p_customer_email,p_shipping_address,p_notes)
	returning id into v_order_id;

	for item in select * from jsonb_array_elements(p_items) loop
		select * into prod from products where id=(item->>'product_id')::uuid for update;
		qty=(item->>'quantity')::int;
		insert into order_items(order_id,product_id,product_name,product_image,quantity,unit_price,total_price)
		values(v_order_id,prod.id,prod.name,(select image_url from product_images where product_id=prod.id order by is_primary desc,sort_order limit 1),qty,prod.price,prod.price*qty);
		update products set stock_quantity=stock_quantity-qty,updated_at=now() where id=prod.id;
	end loop;

	return jsonb_build_object('order_id',v_order_id,'total',v_total);
end;
$$;

revoke all on function public.create_order_secure(text,text,text,jsonb,jsonb,text) from public;
grant execute on function public.create_order_secure(text,text,text,jsonb,jsonb,text) to authenticated;
