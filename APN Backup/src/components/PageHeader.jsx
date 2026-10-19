import './PageHeader.css';

export default function PageHeader({ label, title, subtitle, bg }) {
  return (
    <div
      className="page-hero"
      style={bg ? {
        backgroundImage: `linear-gradient(to right, rgba(17,28,53,0.88) 60%, rgba(17,28,53,0.55) 100%), url(${bg})`
      } : {}}
    >
      <div className="page-hero-inner">
        {label    && <p className="section-eyebrow page-hero-eyebrow-anim">{label}</p>}
        {title    && <h1 className="page-hero-title page-hero-title-anim">{title}</h1>}
        {subtitle && <p className="page-hero-subtitle page-hero-subtitle-anim">{subtitle}</p>}
        <span className="gold-rule page-hero-rule-anim"></span>
      </div>
    </div>
  );
}
