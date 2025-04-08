import {
  Title,
  Paper,
  Table,
  ActionIcon,
  Group,
  Button,
  TextInput,
  Stack,
  Menu,
  Text,
} from '@mantine/core';
import { Plus, Search, MoreVertical, Edit, Trash } from 'lucide-react';

const departments = [
  {
    id: 1,
    name: 'Engineering',
    employees: 45,
    head: 'John Smith',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Marketing',
    employees: 28,
    head: 'Sarah Johnson',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Human Resources',
    employees: 12,
    head: 'Michael Brown',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Finance',
    employees: 18,
    head: 'Emily Davis',
    status: 'Active',
  },
];

export default function Departments() {
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Departments</Title>
        <Button leftSection={<Plus size={20} />}>Add Department</Button>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group mb="md">
          <TextInput
            placeholder="Search departments..."
            leftSection={<Search size={20} />}
            style={{ flex: 1 }}
          />
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Department Name</Table.Th>
              <Table.Th>Employees</Table.Th>
              <Table.Th>Department Head</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {departments.map((department) => (
              <Table.Tr key={department.id}>
                <Table.Td>
                  <Text fw={500}>{department.name}</Text>
                </Table.Td>
                <Table.Td>{department.employees}</Table.Td>
                <Table.Td>{department.head}</Table.Td>
                <Table.Td>
                  <Text c="green">{department.status}</Text>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <MoreVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<Edit size={16} />}>
                        Edit Department
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<Trash size={16} />}
                        color="red"
                      >
                        Delete Department
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}