import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Tabs,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  LoadingOverlay,
  Card,
  Grid,
  Avatar,
  TextInput,
  Modal,
  Textarea,
} from '@mantine/core';
import { 
  Search, 
  MoreVertical, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  LogOut,
  Building,
  Calendar,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';
import type { Employee, OffboardingProcess, ResignationRequest } from '../types';

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

const mockOffboardingProcesses: OffboardingProcess[] = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Developer',
    type: 'resignation',
    status: 'pending',
    initiated_by: 'employee',
    resignation_date: '2024-04-15',
    last_working_day: '2024-05-15',
    reason: 'Career change',
    documents: [
      {
        id: '101',
        offboarding_id: '1',
        name: 'Experience Letter',
        description: 'Letter confirming employment and experience',
        status: 'pending',
      },
      {
        id: '102',
        offboarding_id: '1',
        name: 'Relieving Letter',
        description: 'Letter confirming end of employment',
        status: 'pending',
      },
    ],
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
  },
  {
    id: '2',
    employee_id: '2',
    employee_name: 'Jane Smith',
    department: 'Design',
    position: 'Designer',
    type: 'termination',
    status: 'in_progress',
    initiated_by: 'manager',
    last_working_day: '2024-03-20',
    reason: 'Performance issues',
    manager_comments: 'Multiple instances of missed deadlines and poor quality work',
    documents: [
      {
        id: '201',
        offboarding_id: '2',
        name: 'Experience Letter',
        description: 'Letter confirming employment and experience',
        status: 'generated',
        file_url: 'https://example.com/experience_letter.pdf',
        generated_at: '2024-03-15T10:00:00Z',
      },
      {
        id: '202',
        offboarding_id: '2',
        name: 'Relieving Letter',
        description: 'Letter confirming end of employment',
        status: 'generated',
        file_url: 'https://example.com/relieving_letter.pdf',
        generated_at: '2024-03-15T10:00:00Z',
      },
    ],
    created_at: '2024-03-05T14:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
];

// Mock data for resignation requests
const mockResignationRequests: ResignationRequest[] = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Developer',
    resignation_date: '2024-04-15',
    last_working_day: '2024-05-15',
    reason: 'Career change and better opportunities elsewhere',
    status: 'pending',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
  },
  {
    id: '2',
    employee_id: '2',
    employee_name: 'Jane Smith',
    department: 'Design',
    position: 'Designer',
    resignation_date: '2024-03-20',
    last_working_day: '2024-04-20',
    reason: 'Relocating to another city',
    status: 'approved',
    manager_comments: 'Approved with standard notice period',
    approved_by: 'Manager Name',
    approved_at: '2024-03-15T10:00:00Z',
    created_at: '2024-03-05T14:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '3',
    employee_id: '3',
    employee_name: 'Robert Johnson',
    department: 'Marketing',
    position: 'Marketing Specialist',
    resignation_date: '2024-03-25',
    last_working_day: '2024-04-25',
    reason: 'Personal reasons',
    status: 'rejected',
    manager_comments: 'Rejected due to critical project timeline',
    rejected_by: 'Manager Name',
    rejected_at: '2024-03-18T11:30:00Z',
    created_at: '2024-03-12T09:30:00Z',
    updated_at: '2024-03-18T11:30:00Z',
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    in_progress: 'blue',
    completed: 'teal',
  };
  return colors[status] || 'gray';
};

export default function Offboarding() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offboardingProcesses, setOffboardingProcesses] = useState<OffboardingProcess[]>([]);
  const [resignationRequests, setResignationRequests] = useState<ResignationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ResignationRequest | null>(null);
  const [managerComments, setManagerComments] = useState('');
  const userRole = useOrganizationStore((state) => state.userRole);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(mockEmployees);
      setOffboardingProcesses(mockOffboardingProcesses);
      setResignationRequests(mockResignationRequests);
      setLoading(false);
    };

    fetchData();
  }, []);

  const canManageOffboarding = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleInitiateResignation = (employeeId: string) => {
    navigate(`/offboarding/resignation/initiate/${employeeId}`);
  };

  const handleInitiateTermination = (employeeId: string) => {
    navigate(`/offboarding/termination/initiate/${employeeId}`);
  };

  const handleViewEmployee = (employeeId: string) => {
    navigate(`/offboarding/employees/${employeeId}`);
  };

  const handleViewOffboarding = (offboardingId: string) => {
    navigate(`/offboarding/process/${offboardingId}`);
  };

  const handleOpenApproveModal = (request: ResignationRequest) => {
    setSelectedRequest(request);
    setManagerComments('');
    setApproveModalOpen(true);
  };

  const handleOpenRejectModal = (request: ResignationRequest) => {
    setSelectedRequest(request);
    setManagerComments('');
    setRejectModalOpen(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the state
      setResignationRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'approved', 
                manager_comments: managerComments,
                approved_by: 'Current Manager',
                approved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : req
        )
      );
      
      setApproveModalOpen(false);
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the state
      setResignationRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'rejected', 
                manager_comments: managerComments,
                rejected_by: 'Current Manager',
                rejected_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : req
        )
      );
      
      setRejectModalOpen(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
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
          <Title order={2}>Offboarding</Title>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="employees" leftSection={<UserX size={16} />}>
              Employees
            </Tabs.Tab>
            <Tabs.Tab value="resignations" leftSection={<LogOut size={16} />}>
              Resignation Requests
            </Tabs.Tab>
            <Tabs.Tab value="processes" leftSection={<FileText size={16} />}>
              Offboarding Processes
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="employees" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search employees..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Grid>
                {employees.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No employees found
                    </Text>
                  </Grid.Col>
                ) : (
                  employees.map((employee) => (
                    <Grid.Col key={employee.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.first_name}${employee.last_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {employee.first_name} {employee.last_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {employee.role}
                                </Text>
                              </div>
                            </Group>
                            <Menu withinPortal position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <MoreVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<FileText size={16} />}
                                  onClick={() => handleViewEmployee(employee.id)}
                                >
                                  View Details
                                </Menu.Item>
                                {canManageOffboarding && (
                                  <>
                                    <Menu.Item
                                      leftSection={<LogOut size={16} />}
                                      onClick={() => handleInitiateResignation(employee.id)}
                                    >
                                      Initiate Resignation
                                    </Menu.Item>
                                    <Menu.Item
                                      leftSection={<XCircle size={16} />}
                                      onClick={() => handleInitiateTermination(employee.id)}
                                    >
                                      Initiate Termination
                                    </Menu.Item>
                                  </>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Group gap="xs">
                            <Building size={16} />
                            <Text size="sm">{employee.department}</Text>
                          </Group>
                          <Group gap="xs">
                            <Calendar size={16} />
                            <Text size="sm">Hired: {new Date(employee.hire_date).toLocaleDateString()}</Text>
                          </Group>
                        </Stack>

                        <Group mt="md" justify="space-between">
                          <Badge color={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                          <Button
                            variant="light"
                            size="xs"
                            onClick={() => handleViewEmployee(employee.id)}
                          >
                            View Details
                          </Button>
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="resignations" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search resignation requests..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Grid>
                {resignationRequests.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No resignation requests found
                    </Text>
                  </Grid.Col>
                ) : (
                  resignationRequests.map((request) => (
                    <Grid.Col key={request.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.employee_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {request.employee_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {request.position}
                                </Text>
                              </div>
                            </Group>
                            {request.status === 'pending' && canManageOffboarding && (
                              <Menu withinPortal position="bottom-end">
                                <Menu.Target>
                                  <ActionIcon variant="subtle">
                                    <MoreVertical size={16} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item
                                    leftSection={<CheckCircle size={16} />}
                                    onClick={() => handleOpenApproveModal(request)}
                                  >
                                    Approve
                                  </Menu.Item>
                                  <Menu.Item
                                    leftSection={<XCircle size={16} />}
                                    onClick={() => handleOpenRejectModal(request)}
                                  >
                                    Reject
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            )}
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Group gap="xs">
                            <Building size={16} />
                            <Text size="sm">{request.department}</Text>
                          </Group>
                          <Group gap="xs">
                            <Calendar size={16} />
                            <Text size="sm">Resignation Date: {new Date(request.resignation_date).toLocaleDateString()}</Text>
                          </Group>
                          <Group gap="xs">
                            <Clock size={16} />
                            <Text size="sm">Last Working Day: {new Date(request.last_working_day).toLocaleDateString()}</Text>
                          </Group>
                          <Group gap="xs">
                            <AlertCircle size={16} />
                            <Text size="sm">Reason: {request.reason}</Text>
                          </Group>
                          {request.manager_comments && (
                            <Group gap="xs">
                              <FileText size={16} />
                              <Text size="sm">Manager Comments: {request.manager_comments}</Text>
                            </Group>
                          )}
                        </Stack>

                        <Group mt="md" justify="space-between">
                          <Badge color={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          {request.status === 'approved' && (
                            <Text size="xs" c="dimmed">
                              Approved by {request.approved_by} on {new Date(request.approved_at!).toLocaleDateString()}
                            </Text>
                          )}
                          {request.status === 'rejected' && (
                            <Text size="xs" c="dimmed">
                              Rejected by {request.rejected_by} on {new Date(request.rejected_at!).toLocaleDateString()}
                            </Text>
                          )}
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="processes" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search offboarding processes..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Grid>
                {offboardingProcesses.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No offboarding processes found
                    </Text>
                  </Grid.Col>
                ) : (
                  offboardingProcesses.map((process) => (
                    <Grid.Col key={process.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${process.employee_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {process.employee_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {process.position}
                                </Text>
                              </div>
                            </Group>
                            <Menu withinPortal position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <MoreVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<FileText size={16} />}
                                  onClick={() => handleViewOffboarding(process.id)}
                                >
                                  View Details
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Group gap="xs">
                            <Building size={16} />
                            <Text size="sm">{process.department}</Text>
                          </Group>
                          <Group gap="xs">
                            <LogOut size={16} />
                            <Text size="sm">Type: {process.type}</Text>
                          </Group>
                          <Group gap="xs">
                            <Calendar size={16} />
                            <Text size="sm">Last Working Day: {new Date(process.last_working_day!).toLocaleDateString()}</Text>
                          </Group>
                          {process.reason && (
                            <Group gap="xs">
                              <AlertCircle size={16} />
                              <Text size="sm">Reason: {process.reason}</Text>
                            </Group>
                          )}
                        </Stack>

                        <Group mt="md" justify="space-between">
                          <Badge color={getStatusColor(process.status)}>
                            {process.status.replace('_', ' ')}
                          </Badge>
                          <Button
                            variant="light"
                            size="xs"
                            onClick={() => handleViewOffboarding(process.id)}
                          >
                            View Details
                          </Button>
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Approve Resignation Modal */}
      <Modal
        opened={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Resignation Request"
        size="md"
      >
        {selectedRequest && (
          <Stack>
            <Text>
              Are you sure you want to approve the resignation request from {selectedRequest.employee_name}?
            </Text>
            <Text size="sm" c="dimmed">
              This will initiate the offboarding process for this employee.
            </Text>
            <Textarea
              label="Manager Comments"
              placeholder="Enter any comments about this approval"
              value={managerComments}
              onChange={(e) => setManagerComments(e.currentTarget.value)}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setApproveModalOpen(false)}>
                Cancel
              </Button>
              <Button color="green" onClick={handleApproveRequest}>
                Approve
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Reject Resignation Modal */}
      <Modal
        opened={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Resignation Request"
        size="md"
      >
        {selectedRequest && (
          <Stack>
            <Text>
              Are you sure you want to reject the resignation request from {selectedRequest.employee_name}?
            </Text>
            <Text size="sm" c="dimmed">
              This will require the employee to continue working or submit a new request.
            </Text>
            <Textarea
              label="Manager Comments"
              placeholder="Enter reason for rejection"
              value={managerComments}
              onChange={(e) => setManagerComments(e.currentTarget.value)}
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={handleRejectRequest}>
                Reject
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
} 