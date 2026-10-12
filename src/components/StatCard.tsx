import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  tone: 'violet' | 'green' | 'amber' | 'blue';
}

export default function StatCard({ label, value, note, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon ${tone}`}><Icon size={18} /></span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </article>
  );
}
