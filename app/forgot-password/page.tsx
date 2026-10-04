import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default function Forgot(){
  return <ForgotContent />;
}

async function ForgotContent(){
  const locale = await getLocale();
  const t = (key: string) => translate(locale, key);
  return (
    <main className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">{t('auth.resetPassword')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('auth.forgotTitle')}</h1>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <div className="card p-6 md:p-8">
          <form className="grid gap-4">
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('auth.email')}</label>
              <input id="reset-email" className="input" type="email" placeholder={t('auth.email')} />
            </div>
            <button className="lux-btn" type="button">{t('auth.sendReset')}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
