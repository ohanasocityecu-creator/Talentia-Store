import {getLocale} from '@/lib/locale-server';
import {translate} from '@/lib/i18n';

export default function Orders(){
  return <OrdersContent />;
}

async function OrdersContent(){
  const locale = await getLocale();
  const t = (key: string) => translate(locale, key);
  return (
    <main className="container py-20">
      <div className="mb-8">
        <p className="eyebrow">{t('account.myOrders')}</p>
        <h1 className="serif mt-3 text-5xl text-text">{t('account.history')}</h1>
      </div>

      <div className="card p-8">
        <p className="text-muted-text">{t('account.ordersUnavailable')}</p>
      </div>
    </main>
  );
}
