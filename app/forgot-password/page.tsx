export default function Forgot(){
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Reset password</p>
        <h1 className="serif mt-3 text-5xl text-text">Forgot your password?</h1>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <div className="card p-6 md:p-8">
          <form className="grid gap-4">
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">Email</label>
              <input id="reset-email" className="input" type="email" placeholder="Email" />
            </div>
            <button className="lux-btn" type="button">Send Reset Link</button>
          </form>
        </div>
      </div>
    </main>
  );
}
