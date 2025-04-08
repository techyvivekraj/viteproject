import React, { useState } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  Button,
  Modal,
  TextInput,
  ActionIcon,
  Menu,
  Select,
  LoadingOverlay,
  Avatar,
  PasswordInput,
  Alert,
} from '@mantine/core';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    department: 'Engineering',
    status: 'active',
    lastLogin: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'hr_manager',
    department: 'HR',
    status: 'active',
    lastLogin: '2024-03-19T15:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'employee',
    department: 'Marketing',
    status: 'inactive',
    lastLogin: '2024-03-18T09:00:00Z',
  },
];

const roles = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'employee', label: 'Employee' },
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [addUserModal, setAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userRole = useOrganizationStore((state) => state.userRole);
  const isAdmin = userRole === 'owner' || userRole === 'admin';

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
  });

  const handleAddUser = async () => {
    if (userForm.password !== userForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddUserModal(false);
      setUserForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        department: '',
      });
    } catch (error) {
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'violet',
      admin: 'blue',
      hr_manager: 'green',
      employee: 'gray',
    };
    return colors[role] || 'gray';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'red';
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>User Management</Title>
        {isAdmin && (
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddUserModal(true)}
          >
            Add User
          </Button>
        )}
      </Group>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Group mb="md" grow>
          <TextInput
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
          />
          <Group>
            <Select
              placeholder="Filter by department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              data={['Engineering', 'Design', 'Marketing', 'HR']}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={setRoleFilter}
              data={roles}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
          </Group>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Last Login</Table.Th>
              {isAdmin && <Table.Th>Actions</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockUsers
              .filter(user => {
                const matchesSearch = 
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesDepartment = !departmentFilter || user.department === departmentFilter;
                const matchesRole = !roleFilter || user.role === roleFilter;
                return matchesSearch && matchesDepartment && matchesRole;
              })
              .map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        size={40}
                        radius={40}
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      />
                      <div>
                        <Text size="sm" fw={500}>{user.name}</Text>
                        <Text size="xs" c="dimmed">{user.email}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getRoleColor(user.role)}
                      leftSection={<Shield size={14} />}
                    >
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{user.department}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(user.status)}
                      leftSection={user.status === 'active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    >
                      {user.status.toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(user.lastLogin).toLocaleString()}
                    </Text>
                  </Table.Td>
                  {isAdmin && (
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUserModal(true);
                          }}
                        >
                          <Edit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Add User Modal */}
      <Modal
        opened={addUserModal}
        onClose={() => setAddUserModal(false)}
        title="Add New User"
        size="lg"
      >
        <Stack>
          {error && (
            <Alert
              icon={<AlertTriangle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.currentTarget.value })}
            required
          />

          <TextInput
            label="Email"
            placeholder="Enter email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.currentTarget.value })}
            required
          />

          <Select
            label="Department"
            placeholder="Select department"
            data={['Engineering', 'Design', 'Marketing', 'HR']}
            value={userForm.department}
            onChange={(value) => setUserForm({ ...userForm, department: value || '' })}
            required
          />

          <Select
            label="Role"
            placeholder="Select role"
            data={roles}
            value={userForm.role}
            onChange={(value) => setUserForm({ ...userForm, role: value || '' })}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.currentTarget.value })}
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={userForm.confirmPassword}
            onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.currentTarget.value })}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddUserModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} loading={loading}>
              Add User
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        opened={editUserModal}
        onClose={() => {
          setEditUserModal(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <Stack>
            {error && (
              <Alert
                icon={<AlertTriangle size={16} />}
                title="Error"
                color="red"
                variant="light"
              >
                {error}
              </Alert>
            )}

            <TextInput
              label="Full Name"
              value={selectedUser.name}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.currentTarget.value })}
              required
            />

            <TextInput
              label="Email"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.currentTarget.value })}
              required
            />

            <Select
              label="Department"
              data={['Engineering', 'Design', 'Marketing', 'HR']}
              value={selectedUser.department}
              onChange={(value) => setSelectedUser({ ...selectedUser, department: value })}
              required
            />

            <Select
              label="Role"
              data={roles}
              value={selectedUser.role}
              onChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
              required
            />

            <Select
              label="Status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={selectedUser.status}
              onChange={(value) => setSelectedUser({ ...selectedUser, status: value })}
              required
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditUserModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}