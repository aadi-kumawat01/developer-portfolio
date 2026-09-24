function Block({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.07] ${className}`} />;
}

export default function PublicLoading() {
  return <main aria-label="Loading portfolio content" className="min-h-svh bg-[#0d0b0d] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
    <section className="mx-auto max-w-6xl"><Block className="h-4 w-32" /><Block className="mt-5 h-14 max-w-2xl" /><Block className="mt-4 h-20 max-w-xl" /><div className="mt-8 flex gap-3"><Block className="h-11 w-32" /><Block className="h-11 w-32" /></div></section>
    <section className="mx-auto mt-24 max-w-6xl"><Block className="h-4 w-28" /><Block className="mt-5 h-10 max-w-xl" /><div className="mt-8 grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <Block key={item} className="h-44" />)}</div></section>
    <section className="mx-auto mt-24 max-w-6xl"><Block className="h-4 w-24" /><Block className="mt-5 h-10 max-w-lg" /><div className="mt-8 grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <Block key={item} className="h-64" />)}</div></section>
  </main>;
}
