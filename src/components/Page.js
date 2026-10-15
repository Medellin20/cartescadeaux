import { T } from "@/components/LanguageProvider";
export default function Page({ title, children }) {
  return (
    <section className="container-p max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-extrabold text-brand-900"><T>{title}</T></h1>
      <div className="space-y-4 leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}
