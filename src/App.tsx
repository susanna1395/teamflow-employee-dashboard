import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Bell, ChevronLeft, ChevronRight, Download, Filter, Plus, Search, Users, UserCheck, UserRoundX, Clock3, MoreHorizontal, RefreshCw, SlidersHorizontal } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import EmployeeForm from './components/EmployeeForm';
import { fetchEmployees } from './data/employeeApi';
import { filterAndSortEmployees, getFullName } from './utils/employee';
import type { Employee, EmployeeDraft, SortDirection, SortField } from './types';

const PAGE_SIZE = 8;

function initials(employee: Employee): string {
  return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
}

function avatarTone(id: number): string {
  return `avatar-tone-${id % 6}`;
}

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All departments');
  const [status, setStatus] = useState('All statuses');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [formEmployee, setFormEmployee] = useState<Employee | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState('');

  async function loadEmployees() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch {
      setLoadError('We couldn’t load the demo employee data. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  const departments = useMemo(
    () => ['All departments', ...Array.from(new Set(employees.map((employee) => employee.department))).sort()],
    [employees],
  );

  const filteredEmployees = useMemo(
    () => filterAndSortEmployees(employees, search, department, status, sortField, sortDirection),
    [employees, search, department, status, sortField, sortDirection],
  );

  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const visibleEmployees = filteredEmployees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = employees.filter((employee) => employee.status === 'Active').length;
  const onLeaveCount = employees.filter((employee) => employee.status === 'On leave').length;
  const inactiveCount = employees.filter((employee) => employee.status === 'Inactive').length;

  useEffect(() => {
    setPage(1);
  }, [search, department, status]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function saveEmployee(draft: EmployeeDraft, id?: number) {
    if (id !== undefined) {
      setEmployees((current) => current.map((employee) => employee.id === id ? { ...employee, ...draft } : employee));
      setNotice('Employee details updated.');
    } else {
      const newEmployee: Employee = { ...draft, id: Date.now() };
      setEmployees((current) => [newEmployee, ...current]);
      setNotice('Employee added to this demo session.');
      setPage(1);
    }
    setFormOpen(false);
    setFormEmployee(null);
    window.setTimeout(() => setNotice(''), 3500);
  }

  function exportCsv() {
    const headers = ['First name', 'Last name', 'Email', 'Department', 'Job title', 'Status', 'Location'];
    const rows = filteredEmployees.map((employee) => [
      employee.firstName, employee.lastName, employee.email, employee.department,
      employee.title, employee.status, employee.location ?? '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teamflow-employees.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function sortIcon(field: SortField) {
    if (sortField !== field) return <ArrowUpDown size={13} />;
    return sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content" id="people">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>People</strong></div>
          <div className="topbar-actions">
            <span className="environment-label"><span className="online-dot" /> Demo workspace</span>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><span /></button>
            <div className="topbar-avatar">SG</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">PEOPLE & CULTURE</p>
              <h1>People</h1>
              <p className="page-subtitle">Manage your team and keep everyone moving forward.</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={exportCsv} disabled={!filteredEmployees.length}><Download size={16} /> Export CSV</button>
              <button className="button button-primary" onClick={() => { setFormEmployee(null); setFormOpen(true); }}><Plus size={17} /> Add employee</button>
            </div>
          </section>

          <section className="stats-grid" aria-label="Employee summary">
            <StatCard label="Total team members" value={employees.length} note="Across all departments" icon={Users} tone="violet" />
            <StatCard label="Active employees" value={activeCount} note="Currently working" icon={UserCheck} tone="green" />
            <StatCard label="On leave" value={onLeaveCount} note="Temporary absence" icon={Clock3} tone="amber" />
            <StatCard label="Inactive" value={inactiveCount} note="Not currently active" icon={UserRoundX} tone="blue" />
          </section>

          <section className="directory-card" aria-labelledby="directory-title">
            <div className="directory-heading">
              <div>
                <div className="title-with-count"><h2 id="directory-title">All employees</h2><span className="result-count">{filteredEmployees.length}</span></div>
                <p>View and manage your organisation’s team members.</p>
              </div>
              <button className="icon-button" aria-label="More employee directory options"><MoreHorizontal size={20} /></button>
            </div>

            <div className="toolbar">
              <div className="search-box"><Search size={17} /><input aria-label="Search employees" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, role or email..." /><kbd>⌘ K</kbd></div>
              <div className="filter-controls">
                <label className="select-wrap"><Filter size={15} /><select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)}>{departments.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="select-wrap"><SlidersHorizontal size={15} /><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>{['All statuses', 'Active', 'On leave', 'Inactive'].map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
            </div>

            {notice && <div className="success-notice" role="status">{notice}</div>}
            {loadError && <div className="error-panel" role="alert"><div><strong>Something went wrong</strong><p>{loadError}</p></div><button className="button button-secondary" onClick={() => void loadEmployees()}><RefreshCw size={15} /> Try again</button></div>}

            <div className="table-scroll">
              <table className="employee-table">
                <thead><tr>
                  <th><button onClick={() => toggleSort('name')}>Employee {sortIcon('name')}</button></th>
                  <th><button onClick={() => toggleSort('department')}>Department {sortIcon('department')}</button></th>
                  <th><button onClick={() => toggleSort('title')}>Job title {sortIcon('title')}</button></th>
                  <th><button onClick={() => toggleSort('status')}>Status {sortIcon('status')}</button></th>
                  <th>Location</th><th><span className="sr-only">Actions</span></th>
                </tr></thead>
                <tbody>
                  {loading && <tr><td colSpan={6}><div className="table-message"><span className="spinner" /> Loading employee directory…</div></td></tr>}
                  {!loading && !loadError && visibleEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td><div className="employee-cell">
                        {employee.image ? <img className="employee-avatar" src={employee.image} alt="" loading="lazy" /> : <span className={`employee-avatar avatar-fallback ${avatarTone(employee.id)}`}>{initials(employee)}</span>}
                        <div className="employee-info"><strong>{getFullName(employee)}</strong><span>{employee.email}</span></div>
                      </div></td>
                      <td><span className="department-label">{employee.department}</span></td>
                      <td className="job-title-cell">{employee.title}</td>
                      <td><span className={`status-pill ${employee.status.toLowerCase().replace(' ', '-')}`}><span />{employee.status}</span></td>
                      <td className="location-cell">{employee.location || '—'}</td>
                      <td><button className="row-action" aria-label={`Edit ${getFullName(employee)}`} onClick={() => { setFormEmployee(employee); setFormOpen(true); }}><MoreHorizontal size={19} /></button></td>
                    </tr>
                  ))}
                  {!loading && !loadError && visibleEmployees.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon"><Search size={20} /></div><strong>No employees found</strong><span>Try a different search or adjust your filters.</span><button className="text-button" onClick={() => { setSearch(''); setDepartment('All departments'); setStatus('All statuses'); }}>Clear filters</button></div></td></tr>}
                </tbody>
              </table>
            </div>

            <footer className="table-footer">
              <span>Showing <strong>{filteredEmployees.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filteredEmployees.length)}</strong> of <strong>{filteredEmployees.length}</strong> employees</span>
              <div className="pagination">
                <button className="button button-secondary page-button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={15} /> Previous</button>
                <span className="page-indicator">Page {page} of {pageCount}</span>
                <button className="button button-secondary page-button" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next <ChevronRight size={15} /></button>
              </div>
            </footer>
          </section>

          <footer className="page-footer"><span>© 2026 TeamFlow, Inc.</span><span>Demo application · Data provided by DummyJSON</span></footer>
        </div>
      </main>

      {formOpen && <EmployeeForm employee={formEmployee} onClose={() => { setFormOpen(false); setFormEmployee(null); }} onSave={saveEmployee} />}
    </div>
  );
}
