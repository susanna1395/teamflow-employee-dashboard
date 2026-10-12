import type { Employee, EmployeeStatus } from '../types';

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  company?: { department?: string; title?: string };
  address?: { city?: string };
}

interface DummyUsersResponse {
  users: DummyUser[];
}

const departments = ['Engineering', 'Product', 'Design', 'People', 'Marketing', 'Finance'];
const statuses: EmployeeStatus[] = ['Active', 'Active', 'Active', 'On leave', 'Inactive'];

function mapUser(user: DummyUser, index: number): Employee {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    image: user.image,
    department: user.company?.department || departments[index % departments.length],
    title: user.company?.title || ['Frontend Engineer', 'Product Designer', 'People Partner'][index % 3],
    status: statuses[index % statuses.length],
    location: user.address?.city || 'Amsterdam',
  };
}

export async function fetchEmployees(signal?: AbortSignal): Promise<Employee[]> {
  const response = await fetch('https://dummyjson.com/users?limit=24', { signal });

  if (!response.ok) {
    throw new Error(`Employee data could not be loaded (${response.status}).`);
  }

  const payload = (await response.json()) as DummyUsersResponse;

  if (!Array.isArray(payload.users)) {
    throw new Error('The employee service returned an unexpected response.');
  }

  return payload.users.map(mapUser);
}
