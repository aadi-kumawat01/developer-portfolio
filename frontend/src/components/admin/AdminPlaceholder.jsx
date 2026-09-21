export default function AdminPlaceholder({ title }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef6072]">Coming soon</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title} Management</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
        {title} editing controls will be added in the next CMS step.
      </p>
    </section>
  );
}
