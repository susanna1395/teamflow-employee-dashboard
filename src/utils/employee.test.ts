import { describe, expect, it } from 'vitest';
import { filterAndSortEmployees, getFullName } from './employee';
import type { Employee } from '../types';

const employees: Employee[] = [
  { id: 1, firstName: 'Zoe', lastName: 'Miller', email: 'zoe@example.com', department: 'Design', title: 'Designer', status: 'Active' },
  { id: 2, firstName: 'Alex', lastName: 'Chen', email: 'alex@example.com', department: 'Engineering', title: 'Frontend Engineer', status: 'On leave' },
  { id: 3, firstName: 'Maya', lastName: 'Singh', email: 'maya@example.com', department: 'Engineering', title: 'QA Engineer', status: 'Active' },
];

describe('employee utilities', () => {
  it('creates a full name', () => {
    expect(getFullName(employees[0])).toBe('Zoe Miller');
  });

  it('filters by a case-insensitive search term', () => {
    const result = filterAndSortEmployees(employees, 'ALEX', 'All departments', 'All statuses', 'name', 'asc');
    expect(result.map(getFullName)).toEqual(['Alex Chen']);
  });

  it('combines department and status filters', () => {
    const result = filterAndSortEmployees(employees, '', 'Engineering', 'Active', 'name', 'asc');
    expect(result.map(getFullName)).toEqual(['Maya Singh']);
  });

  it('sorts names in descending order', () => {
    const result = filterAndSortEmployees(employees, '', 'All departments', 'All statuses', 'name', 'desc');
    expect(result.map(getFullName)).toEqual(['Zoe Miller', 'Maya Singh', 'Alex Chen']);
  });
});
