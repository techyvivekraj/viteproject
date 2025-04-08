import { useState } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Tabs,
  TextInput,
  Button,
  Avatar,
  Text,
  Card,
  Grid,
  Badge,
  ActionIcon,
  Menu,
  Select,
  Modal,
  Textarea,
  Table,
  LoadingOverlay,
  Alert,
  Image,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  Building2,
  Users,
  Settings,
  Clock,
  Plus,
  Edit,
  Trash,
  MoreVertical,
  MapPin,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';

// Mock data for organization
const mockOrgData = {
  name: 'Acme Corporation',
  email: 'admin@acme.com',
  phone: '+1 234 567 890',
  address: '123 Business Street, Tech City, 12345',
  website: 'www.acme.com',
  industry: 'Technology',
  size: '100-500',
  founded: '2010',
  description: 'Leading provider of innovative solutions',
};

// Mock data for departments
const mockDepartments = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical operations',
    head: 'John Smith',
    employees: 45,
    roles: 8,
    status: 'active',
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Brand management and marketing operations',
    head: 'Jane Doe',
    employees: 25,
    roles: 5,
    status: 'active',
  },
];

// Mock data for roles
const mockRoles = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Develops and maintains software applications',
    department: 'Engineering',
    level: 'IC3',
    permissions: ['code_review', 'deploy', 'access_prod'],
    status: 'active',
  },
  {
    id: '2',
    title: 'Marketing Manager',
    description: 'Manages marketing campaigns and strategy',
    department: 'Marketing',
    level: 'M2',
    permissions: ['budget_approval', 'campaign_management'],
    status: 'active',
  },
];

// Mock data for policies
const mockPolicies = [
  {
    id: '1',
    name: 'Work from Home',
    description: 'Guidelines for remote work arrangements',
    category: 'Work Arrangement',
    status: 'active',
    lastUpdated: '2024-03-01',
    approver: 'HR Manager',
  },
  {
    id: '2',
    name: 'Leave Policy',
    description: 'Rules and procedures for taking leave',
    category: 'Leave Management',
    status: 'active',
    lastUpdated: '2024-02-15',
    approver: 'HR Manager',
  },
];

// Mock data for office locations
const mockLocations = [
  {
    id: '1',
    name: 'Headquarters',
    address: '123 Main Street, Tech City, 12345',
    country: 'United States',
    timezone: 'UTC-8',
    type: 'Main Office',
    employees: 150,
    facilities: ['Cafeteria', 'Gym', 'Parking'],
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    id: '2',
    name: 'Development Center',
    address: '456 Tech Park, Innovation City, 67890',
    country: 'India',
    timezone: 'UTC+5:30',
    type: 'Branch Office',
    employees: 100,
    facilities: ['Cafeteria', 'Parking'],
    coordinates: {
      lat: 12.9716,
      lng: 77.5946,
    },
  },
];

export default function Organisation() {
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [addDepartmentModal, setAddDepartmentModal] = useState(false);
  const [editDepartmentModal, setEditDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null);
  
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [editRoleModal, setEditRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  
  const [addPolicyModal, setAddPolicyModal] = useState(false);
  const [editPolicyModal, setEditPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  
  const [addLocationModal, setAddLocationModal] = useState(false);
  const [editLocationModal, setEditLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userRole = useOrganizationStore((state) => state.userRole);
  const isAdmin = userRole === 'owner' || userRole === 'admin';

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
    head: '',
  });

  const [roleForm, setRoleForm] = useState({
    title: '',
    description: '',
    department: '',
    level: '',
    permissions: [] as string[],
  });

  const [policyForm, setPolicyForm] = useState({
    name: '',
    description: '',
    category: '',
    content: '',
    approver: '',
  });

  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    country: '',
    timezone: '',
    type: '',
    facilities: [] as string[],
    coordinates: {
      lat: '',
      lng: '',
    },
  });

  const handleAddDepartment = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddDepartmentModal(false);
      setDepartmentForm({
        name: '',
        description: '',
        head: '',
      });
    } catch (error) {
      setError('Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditDepartmentModal(false);
      setSelectedDepartment(null);
    } catch (error) {
      setError('Failed to update department');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddRoleModal(false);
      setRoleForm({
        title: '',
        description: '',
        department: '',
        level: '',
        permissions: [],
      });
    } catch (error) {
      setError('Failed to add role');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditRoleModal(false);
      setSelectedRole(null);
    } catch (error) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddPolicyModal(false);
      setPolicyForm({
        name: '',
        description: '',
        category: '',
        content: '',
        approver: '',
      });
    } catch (error) {
      setError('Failed to add policy');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPolicy = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditPolicyModal(false);
      setSelectedPolicy(null);
    } catch (error) {
      setError('Failed to update policy');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddLocationModal(false);
      setLocationForm({
        name: '',
        address: '',
        country: '',
        timezone: '',
        type: '',
        facilities: [],
        coordinates: {
          lat: '',
          lng: '',
        },
      });
    } catch (error) {
      setError('Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditLocationModal(false);
      setSelectedLocation(null);
    } catch (error) {
      setError('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const renderProfile = () => (
    <Stack gap="lg">
      <Card withBorder>
        <Group>
          <Avatar
            size={100}
            radius={100}
            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${mockOrgData.name}`}
          />
          <div>
            <Text size="xl" fw={700}>{mockOrgData.name}</Text>
            <Text c="dimmed">{mockOrgData.industry}</Text>
          </div>
        </Group>
      </Card>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder>
            <Title order={4} mb="md">Basic Information</Title>
            <Stack gap="md">
              <TextInput
                label="Organization Name"
                value={mockOrgData.name}
                readOnly={!isAdmin}
              />
              <TextInput
                label="Email"
                value={mockOrgData.email}
                readOnly={!isAdmin}
              />
              <TextInput
                label="Phone"
                value={mockOrgData.phone}
                readOnly={!isAdmin}
              />
              <TextInput
                label="Website"
                value={mockOrgData.website}
                readOnly={!isAdmin}
              />
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder>
            <Title order={4} mb="md">Additional Details</Title>
            <Stack gap="md">
              <Select
                label="Industry"
                value={mockOrgData.industry}
                data={['Technology', 'Healthcare', 'Finance', 'Education']}
                readOnly={!isAdmin}
              />
              <Select
                label="Company Size"
                value={mockOrgData.size}
                data={['1-50', '51-200', '201-500', '500+']}
                readOnly={!isAdmin}
              />
              <DatePickerInput
                label="Founded Date"
                value={new Date(mockOrgData.founded)}
                readOnly={!isAdmin}
              />
              <Textarea
                label="Description"
                value={mockOrgData.description}
                readOnly={!isAdmin}
                minRows={3}
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderDepartments = () => (
    <Stack gap="lg">
      {isAdmin && (
        <Group justify="flex-end">
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddDepartmentModal(true)}
          >
            Add Department
          </Button>
        </Group>
      )}

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Department</Table.Th>
            <Table.Th>Head</Table.Th>
            <Table.Th>Employees</Table.Th>
            <Table.Th>Roles</Table.Th>
            <Table.Th>Status</Table.Th>
            {isAdmin && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {mockDepartments.map((dept) => (
            <Table.Tr key={dept.id}>
              <Table.Td>
                <Text fw={500}>{dept.name}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {dept.description}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Avatar
                    size={30}
                    radius={30}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dept.head}`}
                  />
                  <Text size="sm">{dept.head}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{dept.employees}</Table.Td>
              <Table.Td>{dept.roles}</Table.Td>
              <Table.Td>
                <Badge
                  color={dept.status === 'active' ? 'green' : 'red'}
                  leftSection={dept.status === 'active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                >
                  {dept.status.toUpperCase()}
                </Badge>
              </Table.Td>
              {isAdmin && (
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setEditDepartmentModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </ActionIcon>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="light">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          leftSection={<Trash size={16} />}
                        >
                          Delete Department
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );

  const renderRoles = () => (
    <Stack gap="lg">
      {isAdmin && (
        <Group justify="flex-end">
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddRoleModal(true)}
          >
            Add Role
          </Button>
        </Group>
      )}

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Role</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Level</Table.Th>
            <Table.Th>Permissions</Table.Th>
            <Table.Th>Status</Table.Th>
            {isAdmin && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {mockRoles.map((role) => (
            <Table.Tr key={role.id}>
              <Table.Td>
                <Text fw={500}>{role.title}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {role.description}
                </Text>
              </Table.Td>
              <Table.Td>{role.department}</Table.Td>
              <Table.Td>{role.level}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {role.permissions.map((perm, index) => (
                    <Badge key={index} size="sm">
                      {perm}
                    </Badge>
                  ))}
                </Group>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={role.status === 'active' ? 'green' : 'red'}
                  leftSection={role.status === 'active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                >
                  {role.status.toUpperCase()}
                </Badge>
              </Table.Td>
              {isAdmin && (
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setSelectedRole(role);
                        setEditRoleModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </ActionIcon>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="light">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          leftSection={<Trash size={16} />}
                        >
                          Delete Role
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );

  const renderPolicies = () => (
    <Stack gap="lg">
      {isAdmin && (
        <Group justify="flex-end">
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddPolicyModal(true)}
          >
            Add Policy
          </Button>
        </Group>
      )}

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Policy</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Approver</Table.Th>
            <Table.Th>Last Updated</Table.Th>
            <Table.Th>Status</Table.Th>
            {isAdmin && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {mockPolicies.map((policy) => (
            <Table.Tr key={policy.id}>
              <Table.Td>
                <Text fw={500}>{policy.name}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {policy.description}
                </Text>
              </Table.Td>
              <Table.Td>{policy.category}</Table.Td>
              <Table.Td>{policy.approver}</Table.Td>
              <Table.Td>
                {new Date(policy.lastUpdated).toLocaleDateString()}
              </Table.Td>
              <Table.Td>
                <Badge
                  color={policy.status === 'active' ? 'green' : 'red'}
                  leftSection={policy.status === 'active' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                >
                  {policy.status.toUpperCase()}
                </Badge>
              </Table.Td>
              {isAdmin && (
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setEditPolicyModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </ActionIcon>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="light">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<FileText size={16} />}
                        >
                          View Full Policy
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<Trash size={16} />}
                        >
                          Delete Policy
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );

  const renderLocations = () => (
    <Stack gap="lg">
      {isAdmin && (
        <Group justify="flex-end">
          <Button
            leftSection={<Plus size={20} />}
            onClick={() => setAddLocationModal(true)}
          >
            Add Location
          </Button>
        </Group>
      )}

      <Grid>
        {mockLocations.map((location) => (
          <Grid.Col key={location.id} span={{ base: 12, md: 6 }}>
            <Card withBorder>
              <Group justify="apart" mb="md">
                <div>
                  <Text fw={500}>{location.name}</Text>
                  <Text size="sm" c="dimmed">{location.type}</Text>
                </div>
                {isAdmin && (
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant="light">
                        <MoreVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<Edit size={16} />}
                        onClick={() => {
                          setSelectedLocation(location);
                          setEditLocationModal(true);
                        }}
                      >
                        Edit Location
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<Trash size={16} />}
                      >
                        Delete Location
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>

              <Image
                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${location.coordinates.lng},${location.coordinates.lat},12,0/600x300@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4bG1ja2oxMnozMnFwOWdqcDhqbGx5In0.example`}
                alt="Location Map"
                radius="md"
                mb="md"
              />

              <Stack gap="xs">
                <Group gap="xs">
                  <MapPin size={16} />
                  <Text size="sm">{location.address}</Text>
                </Group>
                <Group gap="xs">
                  <Clock size={16} />
                  <Text size="sm">{location.timezone}</Text>
                </Group>
                <Group gap="xs">
                  <Users size={16} />
                  <Text size="sm">{location.employees} employees</Text>
                </Group>
              </Stack>

              <Group mt="md" gap="xs">
                {location.facilities.map((facility, index) => (
                  <Badge key={index} size="sm">
                    {facility}
                  </Badge>
                ))}
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );

  return (
    <Stack gap="lg">
      <Title order={2}>Organization Settings</Title>

      <Paper withBorder radius="md" p="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="profile"
              leftSection={<Building2 size={16} />}
            >
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="departments"
              leftSection={<Users size={16} />}
            >
              Departments
            </Tabs.Tab>
            <Tabs.Tab
              value="roles"
              leftSection={<Shield size={16} />}
            >
              Roles
            </Tabs.Tab>
            <Tabs.Tab
              value="policies"
              leftSection={<FileText size={16} />}
            >
              Policies
            </Tabs.Tab>
            <Tabs.Tab
              value="locations"
              leftSection={<MapPin size={16} />}
            >
              Locations
            </Tabs.Tab>
            {isAdmin && (
              <Tabs.Tab
                value="settings"
                leftSection={<Settings size={16} />}
              >
                Settings
              </Tabs.Tab>
            )}
          </Tabs.List>

          <LoadingOverlay visible={loading} />

          <Tabs.Panel value="profile" pt="xl">
            {renderProfile()}
          </Tabs.Panel>

          <Tabs.Panel value="departments" pt="xl">
            {renderDepartments()}
          </Tabs.Panel>

          <Tabs.Panel value="roles" pt="xl">
            {renderRoles()}
          </Tabs.Panel>

          <Tabs.Panel value="policies" pt="xl">
            {renderPolicies()}
          </Tabs.Panel>

          <Tabs.Panel value="locations" pt="xl">
            {renderLocations()}
          </Tabs.Panel>

          {isAdmin && (
            <Tabs.Panel value="settings" pt="xl">
              <Text>Organization settings content</Text>
            </Tabs.Panel>
          )}
        </Tabs>
      </Paper>

      {/* Department Modals */}
      <Modal
        opened={addDepartmentModal}
        onClose={() => setAddDepartmentModal(false)}
        title="Add Department"
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
            label="Department Name"
            placeholder="Enter department name"
            value={departmentForm.name}
            onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter department description"
            value={departmentForm.description}
            onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.currentTarget.value })}
            minRows={3}
          />

          <TextInput
            label="Department Head"
            placeholder="Enter department head"
            value={departmentForm.head}
            onChange={(e) => setDepartmentForm({ ...departmentForm, head: e.currentTarget.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddDepartmentModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment} loading={loading}>
              Add Department
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={editDepartmentModal}
        onClose={() => {
          setEditDepartmentModal(false);
          setSelectedDepartment(null);
        }}
        title="Edit Department"
        size="lg"
      >
        {selectedDepartment && (
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
              label="Department Name"
              value={selectedDepartment.name}
              onChange={(e) => setSelectedDepartment({ ...selectedDepartment, name: e.currentTarget.value })}
              required
            />

            <Textarea
              label="Description"
              value={selectedDepartment.description}
              onChange={(e) => setSelectedDepartment({ ...selectedDepartment, description: e.currentTarget.value })}
              minRows={3}
            />

            <TextInput
              label="Department Head"
              value={selectedDepartment.head}
              onChange={(e) => setSelectedDepartment({ ...selectedDepartment, head: e.currentTarget.value })}
            />

            <Select
              label="Status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={selectedDepartment.status}
              onChange={(value) => setSelectedDepartment({ ...selectedDepartment, status: value })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditDepartmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDepartment} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Role Modals */}
      <Modal
        opened={addRoleModal}
        onClose={() => setAddRoleModal(false)}
        title="Add Role"
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
            label="Role Title"
            placeholder="Enter role title"
            value={roleForm.title}
            onChange={(e) => setRoleForm({ ...roleForm, title: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter role description"
            value={roleForm.description}
            onChange={(e) => setRoleForm({ ...roleForm, description: e.currentTarget.value })}
            minRows={3}
          />

          <Select
            label="Department"
            placeholder="Select department"
            data={mockDepartments.map(dept => ({
              value: dept.name,
              label: dept.name,
            }))}
            value={roleForm.department}
            onChange={(value) => setRoleForm({ ...roleForm, department: value || '' })}
            required
          />

          <Select
            label="Level"
            placeholder="Select level"
            data={['IC1', 'IC2', 'IC3', 'M1', 'M2', 'M3']}
            value={roleForm.level}
            onChange={(value) => setRoleForm({ ...roleForm, level: value || '' })}
            required
          />

          <Select
            label="Permissions"
            placeholder="Select permissions"
            data={[
              'code_review',
              'deploy',
              'access_prod',
              'budget_approval',
              'campaign_management',
            ]}
            value={roleForm.permissions as unknown as string}
            onChange={(value: string | string[] | null) => 
              setRoleForm({ ...roleForm, permissions: Array.isArray(value) ? value : [] })}
            multiple
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddRoleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole} loading={loading}>
              Add Role
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={editRoleModal}
        onClose={() => {
          setEditRoleModal(false);
          setSelectedRole(null);
        }}
        title="Edit Role"
        size="lg"
      >
        {selectedRole && (
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
              label="Role Title"
              value={selectedRole.title}
              onChange={(e) => setSelectedRole({ ...selectedRole, title: e.currentTarget.value })}
              required
            />

            <Textarea
              label="Description"
              value={selectedRole.description}
              onChange={(e) => setSelectedRole({ ...selectedRole, description: e.currentTarget.value })}
              minRows={3}
            />

            <Select
              label="Department"
              data={mockDepartments.map(dept => ({
                value: dept.name,
                label: dept.name,
              }))}
              value={selectedRole.department}
              onChange={(value) => setSelectedRole({ ...selectedRole, department: value })}
              required
            />

            <Select
              label="Level"
              data={['IC1', 'IC2', 'IC3', 'M1', 'M2', 'M3']}
              value={selectedRole.level}
              onChange={(value) => setSelectedRole({ ...selectedRole, level: value })}
              required
            />

            <Select
              label="Permissions"
              data={[
                'code_review',
                'deploy',
                'access_prod',
                'budget_approval',
                'campaign_management',
              ]}
              value={selectedRole.permissions as unknown as string}
              onChange={(value: string | string[] | null) => 
                setSelectedRole({ ...selectedRole, permissions: Array.isArray(value) ? value : [] })}
              multiple
            />

            <Select
              label="Status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={selectedRole.status}
              onChange={(value) => setSelectedRole({ ...selectedRole, status: value })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditRoleModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRole} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Policy Modals */}
      <Modal
        opened={addPolicyModal}
        onClose={() => setAddPolicyModal(false)}
        title="Add Policy"
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
            label="Policy Name"
            placeholder="Enter policy name"
            value={policyForm.name}
            onChange={(e) => setPolicyForm({ ...policyForm, name: e.currentTarget.value })}
            required
          />

          <TextInput
            label="Category"
            placeholder="Enter policy category"
            value={policyForm.category}
            onChange={(e) => setPolicyForm({ ...policyForm, category: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter policy description"
            value={policyForm.description}
            onChange={(e) => setPolicyForm({ ...policyForm, description: e.currentTarget.value })}
            minRows={2}
          />

          <Textarea
            label="Policy Content"
            placeholder="Enter policy content"
            value={policyForm.content}
            onChange={(e) => setPolicyForm({ ...policyForm, content: e.currentTarget.value })}
            minRows={5}
          />

          <Select
            label="Approver"
            placeholder="Select approver"
            data={['HR Manager', 'Department Head', 'CEO']}
            value={policyForm.approver}
            onChange={(value) => setPolicyForm({ ...policyForm, approver: value || '' })}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddPolicyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPolicy} loading={loading}>
              Add Policy
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={editPolicyModal}
        onClose={() => {
          setEditPolicyModal(false);
          setSelectedPolicy(null);
        }}
        title="Edit Policy"
        size="lg"
      >
        {selectedPolicy && (
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
              label="Policy Name"
              value={selectedPolicy.name}
              onChange={(e) => setSelectedPolicy({ ...selectedPolicy, name: e.currentTarget.value })}
              required
            />

            <TextInput
              label="Category"
              value={selectedPolicy.category}
              onChange={(e) => setSelectedPolicy({ ...selectedPolicy, category: e.currentTarget.value })}
              required
            />

            <Textarea
              label="Description"
              value={selectedPolicy.description}
              onChange={(e) => setSelectedPolicy({ ...selectedPolicy, description: e.currentTarget.value })}
              minRows={2}
            />

            <Select
              label="Approver"
              data={['HR Manager', 'Department Head', 'CEO']}
              value={selectedPolicy.approver}
              onChange={(value) => setSelectedPolicy({ ...selectedPolicy, approver: value })}
              required
            />

            <Select
              label="Status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={selectedPolicy.status}
              onChange={(value) => setSelectedPolicy({ ...selectedPolicy, status: value })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditPolicyModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPolicy} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Location Modals */}
      <Modal
        opened={addLocationModal}
        onClose={() => setAddLocationModal(false)}
        title="Add Location"
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
            label="Location Name"
            placeholder="Enter location name"
            value={locationForm.name}
            onChange={(e) => setLocationForm({ ...locationForm, name: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Address"
            placeholder="Enter complete address"
            value={locationForm.address}
            onChange={(e) => setLocationForm({ ...locationForm, address: e.currentTarget.value })}
            required
          />

          <Select
            label="Country"
            placeholder="Select country"
            data={['United States', 'India', 'United Kingdom', 'Australia']}
            value={locationForm.country}
            onChange={(value) => setLocationForm({ ...locationForm, country: value || '' })}
            required
          />

          <Select
            label="Timezone"
            placeholder="Select timezone"
            data={['UTC-8', 'UTC-5', 'UTC+0', 'UTC+5:30']}
            value={locationForm.timezone}
            onChange={(value) => setLocationForm({ ...locationForm, timezone: value || '' })}
            required
          />

          <Select
            label="Office Type"
            placeholder="Select office type"
            data={['Main Office', 'Branch Office', 'Development Center']}
            value={locationForm.type}
            onChange={(value) => setLocationForm({ ...locationForm, type: value || '' })}
            required
          />

          <Select
            label="Facilities"
            placeholder="Select facilities"
            data={['Cafeteria', 'Gym', 'Parking', 'Recreation Room']}
            value={locationForm.facilities as unknown as string}
            onChange={(value: string | string[] | null) => 
              setLocationForm({ ...locationForm, facilities: Array.isArray(value) ? value : [] })}
            multiple
          />

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Latitude"
                placeholder="Enter latitude"
                value={locationForm.coordinates.lat}
                onChange={(e) => setLocationForm({
                  ...locationForm,
                  coordinates: { ...locationForm.coordinates, lat: e.currentTarget.value },
                })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Longitude"
                placeholder="Enter longitude"
                value={locationForm.coordinates.lng}
                onChange={(e) => setLocationForm({
                  ...locationForm,
                  coordinates: { ...locationForm.coordinates, lng: e.currentTarget.value },
                })}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAddLocationModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLocation} loading={loading}>
              Add Location
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={editLocationModal}
        onClose={() => {
          setEditLocationModal(false);
          setSelectedLocation(null);
        }}
        title="Edit Location"
        size="lg"
      >
        {selectedLocation && (
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
              label="Location Name"
              value={selectedLocation.name}
              onChange={(e) => setSelectedLocation({ ...selectedLocation, name: e.currentTarget.value })}
              required
            />

            <Textarea
              label="Address"
              value={selectedLocation.address}
              onChange={(e) => setSelectedLocation({ ...selectedLocation, address: e.currentTarget.value })}
              required
            />

            <Select
              label="Country"
              data={['United States', 'India', 'United Kingdom', 'Australia']}
              value={selectedLocation.country}
              onChange={(value) => setSelectedLocation({ ...selectedLocation, country: value })}
              required
            />

            <Select
              label="Timezone"
              data={['UTC-8', 'UTC-5', 'UTC+0', 'UTC+5:30']}
              value={selectedLocation.timezone}
              onChange={(value) => setSelectedLocation({ ...selectedLocation, timezone: value })}
              required
            />

            <Select
              label="Office Type"
              data={['Main Office', 'Branch Office', 'Development Center']}
              value={selectedLocation.type}
              onChange={(value) => setSelectedLocation({ ...selectedLocation, type: value })}
              required
            />

            <Select
              label="Facilities"
              data={['Cafeteria', 'Gym', 'Parking', 'Recreation Room']}
              value={selectedLocation.facilities as unknown as string}
              onChange={(value: string | string[] | null) => 
                setSelectedLocation({ ...selectedLocation, facilities: Array.isArray(value) ? value : [] })}
              multiple
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Latitude"
                  value={selectedLocation.coordinates.lat}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    coordinates: { ...selectedLocation.coordinates, lat: e.currentTarget.value },
                  })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Longitude"
                  value={selectedLocation.coordinates.lng}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    coordinates: { ...selectedLocation.coordinates, lng: e.currentTarget.value },
                  })}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setEditLocationModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditLocation} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}