import './globals.css'; import {Header} from '@/components/Header'; import {Footer} from '@/components/Footer';
export const metadata={title:'TALENTIA — Made to Shine. Made to Last.',description:'Premium stainless-steel accessories by TALENTIA.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/>{children}<Footer/></body></html>}
