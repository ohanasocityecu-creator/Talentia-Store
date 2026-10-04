'use client';

export default function AdminError({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
  return <main className="card max-w-2xl p-8" role="alert"><h1 className="serif text-3xl">Dashboard data is unavailable</h1><p className="text-muted-text mt-3">{error.message||'A database request failed. Please retry.'}</p><button className="lux-btn mt-6" onClick={reset}>Try again</button></main>;
}
