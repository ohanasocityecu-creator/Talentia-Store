import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default function Track(){
  return <TrackContent />;
}

async function TrackContent(){
  const locale = await getLocale();
  const t = (key: string) => translate(locale, key);
  return (
    <main className="container py-24 max-w-2xl">
      <div className="mb-8">
        <p className="eyebrow">{t('track.eyebrow')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('track.title')}</h1>
      </div>

      <form className="mt-10 grid gap-4 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="order-number" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('track.orderNumber')}</label>
          <input id="order-number" className="input" placeholder={t('track.orderNumber')} />
        </div>
        <div>
          <label htmlFor="order-contact" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-text">{t('track.phoneOrEmail')}</label>
          <input id="order-contact" className="input" placeholder={t('track.phoneOrEmail')} />
        </div>
        <button className="lux-btn mt-2" type="button" disabled>{t('track.track')}</button>
      </form>

      <p className="mt-6 text-muted-text">{t('track.notConfigured')}</p>
    </main>
  );
}
