'use client';

import {useLanguage} from '@/components/LanguageProvider';

export default function ErrorPage({reset}:{error:Error & {digest?:string}; reset:()=>void}) {
  const {t} = useLanguage();
  return (
    <main className="container py-24 text-center">
      <p className="eyebrow">{t('errors.somethingWrong')}</p>
      <h1 className="serif mt-4 text-4xl text-text">{t('errors.somethingWrong')}</h1>
      <p className="mt-3 text-muted-text">{t('errors.tryAgain')}</p>
      <button type="button" onClick={() => reset()} className="lux-btn mt-8">{t('errors.tryAgain')}</button>
    </main>
  );
}
