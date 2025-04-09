import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Table,
  ActionIcon,
  Group,
  Button,
  TextInput,
  Stack,
  Text,
  Avatar,
  Badge,
  Select,
  LoadingOverlay,
} from '@mantine/core';
import { Plus, Search, Edit, Trash, Filter, Eye } from 'lucide-react';
import { useOrganizationStore } from '../store/organization';
import type { Employee } from '../types';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'green',
    on_leave: 'yellow',
    inactive: 'gray',
    terminated: 'red',
  };
  return colors[status] || 'gray';
};

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: 'Developer',
    department: 'Engineering',
    hire_date: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    role: 'Designer',
    department: 'Design',
    hire_date: '2024-02-01',
    status: 'active',
  },
];

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = useOrganizationStore((state) => state.userRole);

  useEffect(() => {
    // Simulate API call
    const fetchEmployees = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(mockEmployees);
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  const canManageEmployees = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddEmployee = () => {
    navigate('/employees/add');
  };

  const handleEditEmployee = (employeeId: string) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (employeeId: string) => {
    navigate(`/employees/${employeeId}`);
  };

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Employees</Title>
          {canManageEmployees && (
            <Button leftSection={<Plus size={20} />} onClick={handleAddEmployee}>
              Add Employee
            </Button>
          )}
        </Group>

        <Paper withBorder radius="md" p="md">
          <Group mb="md" grow>
            <TextInput
              placeholder="Search employees..."
              leftSection={<Search size={20} />}
            />
            <Group>
              <Select
                placeholder="Department"
                data={['All', 'Engineering', 'Marketing', 'HR', 'Finance']}
                leftSection={<Filter size={20} />}
              />
              <Select
                placeholder="Status"
                data={['All', 'Active', 'On Leave', 'Inactive']}
                leftSection={<Filter size={20} />}
              />
            </Group>
          </Group>

          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Department</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                {canManageEmployees && <Table.Th>Actions</Table.Th>}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {employees.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={canManageEmployees ? 5 : 4}>
                    <Text ta="center" c="dimmed" py="xl">
                      No employees found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                employees.map((employee) => (
                  <Table.Tr key={employee.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar
                          size={40}
                          radius={40}
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.first_name}${employee.last_name}`}
                        />
                        <div>
                          <Text size="sm" fw={500}>
                            {employee.first_name} {employee.last_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {employee.email}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>{employee.department}</Table.Td>
                    <Table.Td>{employee.role}</Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleViewEmployee(employee.id)}
                        >
                          <Eye size={16} />
                        </ActionIcon>
                        {canManageEmployees && (
                          <>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => handleEditEmployee(employee.id)}
                            >
                              <Edit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash size={16} />
                            </ActionIcon>
                          </>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </div>
  );
}