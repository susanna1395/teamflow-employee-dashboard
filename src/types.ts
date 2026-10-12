export type EmployeeStatus = 'Active' | 'On leave' | 'Inactive';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  status: EmployeeStatus;
  image?: string;
  phone?: string;
  location?: string;
}

export type EmployeeDraft = Omit<Employee, 'id' | 'image'>;

export type SortField = 'name' | 'department' | 'title' | 'status';
export type SortDirection = 'asc' | 'desc';
