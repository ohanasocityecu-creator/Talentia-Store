import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default function Signup(){
  return <SignupContent />;
}

async function SignupContent(){
  const locale = await getLocale();
  const t = (key: string) => translate(locale, key);
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">{t('auth.createAccount')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('auth.join')}</h1>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <div className="card p-6 md:p-8">
          <form className="grid gap-4">
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('auth.fullName')}</label>
              <input id="signup-name" className="input" placeholder={t('auth.fullName')} />
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('auth.email')}</label>
              <input id="signup-email" className="input" type="email" placeholder={t('auth.email')} />
            </div>
            <div>
              <label htmlFor="signup-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('auth.password')}</label>
              <input id="signup-password" className="input" type="password" placeholder={t('auth.password')} />
            </div>
            <button className="lux-btn" type="button">{t('auth.createAccount')}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
