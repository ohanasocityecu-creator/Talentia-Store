export default function AdminLoading(){
  return <div aria-label="Loading dashboard" className="animate-pulse space-y-6"><div className="h-12 w-64 rounded bg-blush/70"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:8},(_,index)=><div className="card h-28" key={index}/>)}</div><div className="card h-72"/></div>;
}
