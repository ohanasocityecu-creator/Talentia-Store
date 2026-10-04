import {LoginForm} from './LoginForm';

export default async function Login({searchParams}:{searchParams:Promise<{next?:string}>}){
  const {next} = await searchParams;
  const nextPath = next?.startsWith('/') && !next.startsWith('//') ? next : '/admin';

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Welcome back</p>
        <h1 className="serif mt-3 text-5xl text-text">Sign in to TALENTIA</h1>
      </div>
      <div className="mx-auto mt-10 max-w-md">
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
