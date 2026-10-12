import type { Employee, SortDirection, SortField } from '../types';

export function getFullName(employee: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${employee.firstName} ${employee.lastName}`.trim();
}

export function filterAndSortEmployees(
  employees: Employee[],
  search: string,
  department: string,
  status: string,
  sortField: SortField,
  sortDirection: SortDirection,
): Employee[] {
  const query = search.trim().toLocaleLowerCase();

  return employees
    .filter((employee) => {
      const searchable = [
        getFullName(employee),
        employee.email,
        employee.department,
        employee.title,
      ].join(' ').toLocaleLowerCase();

      return (!query || searchable.includes(query))
        && (department === 'All departments' || employee.department === department)
        && (status === 'All statuses' || employee.status === status);
    })
    .sort((a, b) => {
      const left = sortValue(a, sortField).toLocaleLowerCase();
      const right = sortValue(b, sortField).toLocaleLowerCase();
      const comparison = left.localeCompare(right);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
}

function sortValue(employee: Employee, field: SortField): string {
  switch (field) {
    case 'name':
      return getFullName(employee);
    case 'department':
      return employee.department;
    case 'title':
      return employee.title;
    case 'status':
      return employee.status;
  }
}
