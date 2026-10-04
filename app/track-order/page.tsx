export default function Track(){
  return (
    <main className="container py-24 max-w-2xl">
      <div className="mb-8">
        <p className="eyebrow">Track order</p>
        <h1 className="serif mt-3 text-5xl text-text">Track Your Order</h1>
      </div>

      <form className="mt-10 grid gap-4 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="order-number" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Order number</label>
          <input id="order-number" className="input" placeholder="Order number" />
        </div>
        <div>
          <label htmlFor="order-contact" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Phone or email</label>
          <input id="order-contact" className="input" placeholder="Phone or email" />
        </div>
        <button className="lux-btn mt-2" type="button" disabled>Track Order</button>
      </form>

      <p className="mt-6 text-muted-text">Order lookup is not configured yet, but your order progress will appear here once available.</p>
    </main>
  );
}
