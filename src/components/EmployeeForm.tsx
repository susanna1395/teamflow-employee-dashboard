import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Employee, EmployeeDraft, EmployeeStatus } from '../types';

interface EmployeeFormProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (draft: EmployeeDraft, id?: number) => void;
}

const emptyDraft: EmployeeDraft = {
  firstName: '',
  lastName: '',
  email: '',
  department: 'Engineering',
  title: '',
  status: 'Active',
  phone: '',
  location: 'Amsterdam',
};

export default function EmployeeForm({ employee, onClose, onSave }: EmployeeFormProps) {
  const [draft, setDraft] = useState<EmployeeDraft>(emptyDraft);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      const { id: _id, image: _image, ...editable } = employee;
      setDraft(editable);
    } else {
      setDraft(emptyDraft);
    }
    setError('');
  }, [employee]);

  function update<K extends keyof EmployeeDraft>(key: K, value: EmployeeDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      setError('Enter both a first name and a last name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!draft.title.trim()) {
      setError('Enter a job title.');
      return;
    }
    onSave({
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim(),
      title: draft.title.trim(),
    }, employee?.id);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{employee ? 'EMPLOYEE DETAILS' : 'NEW TEAM MEMBER'}</p>
            <h2 id="employee-form-title">{employee ? 'Edit employee' : 'Add employee'}</h2>
            <p className="modal-description">Keep your team's information up to date.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form"><X size={19} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label>First name<input autoFocus value={draft.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="e.g. Alex" /></label>
            <label>Last name<input value={draft.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="e.g. Morgan" /></label>
            <label className="full-field">Work email<input type="email" value={draft.email} onChange={(e) => update('email', e.target.value)} placeholder="alex@company.com" /></label>
            <label>Department<select value={draft.department} onChange={(e) => update('department', e.target.value)}>
              {['Engineering', 'Product', 'Design', 'People', 'Marketing', 'Finance', 'Operations'].map((item) => <option key={item}>{item}</option>)}
            </select></label>
            <label>Job title<input value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Product Designer" /></label>
            <label>Status<select value={draft.status} onChange={(e) => update('status', e.target.value as EmployeeStatus)}>
              <option>Active</option><option>On leave</option><option>Inactive</option>
            </select></label>
            <label>Location<input value={draft.location ?? ''} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Amsterdam" /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary">{employee ? 'Save changes' : 'Add employee'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
