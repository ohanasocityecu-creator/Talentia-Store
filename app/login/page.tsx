import {LoginForm} from './LoginForm';

export default async function Login({searchParams}:{searchParams:Promise<{next?:string}>}){
	const {next}=await searchParams;
	const nextPath=next?.startsWith('/')&&!next.startsWith('//')?next:'/admin';
	return <main className="container max-w-md py-24"><h1 className="serif text-5xl">Welcome back</h1><LoginForm nextPath={nextPath}/></main>;
}
