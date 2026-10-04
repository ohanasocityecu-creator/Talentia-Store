export default function Signup(){
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Create account</p>
        <h1 className="serif mt-3 text-5xl text-text">Join TALENTIA</h1>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <div className="card p-6 md:p-8">
          <form className="grid gap-4">
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Full name</label>
              <input id="signup-name" className="input" placeholder="Full name" />
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Email</label>
              <input id="signup-email" className="input" type="email" placeholder="Email" />
            </div>
            <div>
              <label htmlFor="signup-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Password</label>
              <input id="signup-password" className="input" type="password" placeholder="Password" />
            </div>
            <button className="lux-btn" type="button">Create Account</button>
          </form>
        </div>
      </div>
    </main>
  );
}
