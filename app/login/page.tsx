import {LoginForm} from './LoginForm';
import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default async function Login({searchParams}:{searchParams:Promise<{next?:string}>}){
  const [{next}, locale] = await Promise.all([searchParams, getLocale()]);
  const nextPath = next?.startsWith('/') && !next.startsWith('//') ? next : '/admin';
  const t = (key: string) => translate(locale, key);

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">{t('auth.welcome')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('auth.signInTitle')}</h1>
      </div>
      <div className="mx-auto mt-10 max-w-md">
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
