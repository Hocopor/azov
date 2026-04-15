type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8 max-w-3xl space-y-4">
      <span className="kicker">{eyebrow}</span>
      <div className="space-y-3">
        <h2 className="section-title font-black text-slate-950">{title}</h2>
        {description ? <p className="text-lg leading-8 text-slate-600">{description}</p> : null}
      </div>
    </div>
  );
}
