import Link from 'next/link';

export default function Account(){
  return (
    <main className="container py-20">
      <div className="mb-8">
        <p className="eyebrow">Account</p>
        <h1 className="serif mt-3 text-5xl text-text">My Account</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['Orders', 'Wishlist', 'Profile', 'Addresses'].map((item) => (
          <Link key={item} href={item === 'Orders' ? '/account/orders' : item === 'Wishlist' ? '/wishlist' : '/account'} className="card p-7 transition hover:border-rose">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{item}</p>
            <p className="serif mt-3 text-2xl text-text">{item}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
