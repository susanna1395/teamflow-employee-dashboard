import { BarChart3, CalendarDays, ChevronDown, CircleHelp, LayoutDashboard, Settings2, Users, WalletCards } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a className="brand" href="#people" aria-label="TeamFlow home">
        <span className="brand-mark"><Users size={19} strokeWidth={2.5} /></span>
        <span>teamflow</span>
      </a>

      <div className="workspace-switcher">
        <div className="workspace-avatar">N</div>
        <div className="workspace-copy"><strong>Northstar Studio</strong><span>Workspace</span></div>
        <ChevronDown size={15} />
      </div>

      <p className="nav-label">WORKSPACE</p>
      <nav className="nav-list">
        <a href="#overview" className="nav-item"><LayoutDashboard size={18} /> Overview</a>
        <a href="#people" className="nav-item active" aria-current="page"><Users size={18} /> People <span className="nav-count">24</span></a>
        <a href="#insights" className="nav-item"><BarChart3 size={18} /> Insights</a>
        <a href="#time-off" className="nav-item"><CalendarDays size={18} /> Time off</a>
        <a href="#payroll" className="nav-item"><WalletCards size={18} /> Payroll</a>
      </nav>

      <div className="sidebar-bottom">
        <a href="#help" className="nav-item"><CircleHelp size={18} /> Help centre</a>
        <a href="#settings" className="nav-item"><Settings2 size={18} /> Settings</a>
        <div className="profile-card">
          <div className="profile-avatar">SG</div>
          <div className="profile-copy"><strong>Sam Green</strong><span>Workspace admin</span></div>
          <ChevronDown size={15} />
        </div>
      </div>
    </aside>
  );
}
