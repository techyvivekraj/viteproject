import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Group,
  Stack,
  Text,
  Button,
  Avatar,
  Badge,
  Grid,
  Card,
  Tabs,
  Divider,
  ActionIcon,
  LoadingOverlay,
  Table,
  Timeline,
  Progress,
  Tooltip,
  Modal,
  Textarea,
  Select,
} from '@mantine/core';
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Briefcase, 
  FileText, 
  Award,
  Clock,
  Calendar as CalendarIcon,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock3,
  UserCheck,
  UserX,
  FileCheck,
  FileX,
  Plus,
  Minus,
  AlertCircle,
  CheckSquare,
  Square,
  Check,
  X,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';
import type { Employee } from '../types';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function EmployeeDetails() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const userRole = useOrganizationStore((state) => state.userRole);
  const canManageEmployees = ['owner', 'admin', 'hr_manager'].includes(userRole || '');
  const [editModalOpened, editModalHandlers] = useDisclosure(false);
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);
  const [approvalModalOpened, approvalModalHandlers] = useDisclosure(false);
  const [approvalType, setApprovalType] = useState<string>('');
  const [approvalId, setApprovalId] = useState<string>('');
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'rejected'>('approved');

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockEmployee: Employee = {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: 'Software Engineer',
          department: 'Engineering',
          hire_date: '2022-01-15',
          status: 'active',
          address: '123 Main St, City, Country',
          date_of_birth: '1990-05-20',
          gender: 'Male',
          emergency_contact: '+1987654321',
          emergency_contact_name: 'Jane Doe',
          reporting_manager: 'Sarah Johnson',
          bank_account_number: '1234567890',
          bank_ifsc: 'ABCD123456',
          bank_name: 'Example Bank',
          documents: [
            { id: '1', name: 'Resume', type: 'pdf', uploaded_at: '2022-01-15' },
            { id: '2', name: 'ID Proof', type: 'jpg', uploaded_at: '2022-01-15' },
          ],
          performance: [
            { year: '2022', rating: '4.5', review_date: '2022-12-15' },
            { year: '2023', rating: '4.8', review_date: '2023-12-15' },
          ],
          attendance: {
            present: 220,
            absent: 10,
            late: 5,
            leave: 15,
            total_days: 250,
            attendance_percentage: 88
          },
          attendance_records: [
            { date: '2023-10-01', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-02', check_in: '09:15 AM', check_out: '06:00 PM', status: 'late' },
            { date: '2023-10-03', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-04', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-05', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-06', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-07', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-08', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-09', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
            { date: '2023-10-10', check_in: '09:00 AM', check_out: '06:00 PM', status: 'present' },
          ],
          leave_balance: {
            annual: 15,
            sick: 10,
            personal: 5,
          },
          leave_requests: [
            { id: '1', type: 'Annual', start_date: '2023-11-15', end_date: '2023-11-20', status: 'approved', days: 5 },
            { id: '2', type: 'Sick', start_date: '2023-12-05', end_date: '2023-12-06', status: 'pending', days: 2 },
            { id: '3', type: 'Personal', start_date: '2023-12-25', end_date: '2023-12-25', status: 'pending', days: 1 },
          ],
          overtime: [
            { id: '1', date: '2023-10-15', hours: 2, reason: 'Project deadline', status: 'approved', amount: 100 },
            { id: '2', date: '2023-10-20', hours: 3, reason: 'Client meeting', status: 'pending', amount: 150 },
            { id: '3', date: '2023-10-25', hours: 1, reason: 'Emergency fix', status: 'pending', amount: 50 },
          ],
          advances: [
            { id: '1', date: '2023-09-10', amount: 1000, reason: 'Medical emergency', status: 'approved', repayment_status: 'completed' },
            { id: '2', date: '2023-10-15', amount: 500, reason: 'Home repair', status: 'pending', repayment_status: 'pending' },
            { id: '3', date: '2023-11-01', amount: 2000, reason: 'Wedding expenses', status: 'pending', repayment_status: 'pending' },
          ],
          fines: [
            { id: '1', date: '2023-09-05', amount: 50, reason: 'Late arrival', status: 'paid' },
            { id: '2', date: '2023-10-10', amount: 100, reason: 'Incomplete task', status: 'pending' },
            { id: '3', date: '2023-11-15', amount: 75, reason: 'Policy violation', status: 'pending' },
          ],
          tasks: [
            { id: '1', title: 'Complete project documentation', assigned_date: '2023-10-01', due_date: '2023-10-15', status: 'completed', priority: 'high' },
            { id: '2', title: 'Review code changes', assigned_date: '2023-10-10', due_date: '2023-10-20', status: 'in_progress', priority: 'medium' },
            { id: '3', title: 'Client presentation', assigned_date: '2023-10-15', due_date: '2023-10-25', status: 'pending', priority: 'high' },
            { id: '4', title: 'Team meeting', assigned_date: '2023-10-20', due_date: '2023-10-22', status: 'pending', priority: 'low' },
          ],
        };
        
        setEmployee(mockEmployee);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const handleEditEmployee = () => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDeleteEmployee = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/employees');
      } catch (error) {
        console.error('Error deleting employee:', error);
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'green',
      on_leave: 'yellow',
      inactive: 'gray',
      terminated: 'red',
      approved: 'green',
      pending: 'yellow',
      rejected: 'red',
      completed: 'green',
      in_progress: 'blue',
      paid: 'green',
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'paid':
        return <CheckCircle size={16} />;
      case 'pending':
      case 'in_progress':
        return <Clock3 size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'present':
        return <UserCheck size={16} />;
      case 'absent':
        return <UserX size={16} />;
      case 'late':
        return <AlertCircle size={16} />;
      case 'leave':
        return <CalendarIcon size={16} />;
      default:
        return null;
    }
  };

  const handleApproval = (type: string, id: string) => {
    setApprovalType(type);
    setApprovalId(id);
    setApprovalComment('');
    setApprovalStatus('approved');
    approvalModalHandlers.open();
  };

  const submitApproval = () => {
    if (!employee) return;

    const updatedEmployee = { ...employee };
    
    switch (approvalType) {
      case 'leave':
        if (updatedEmployee.leave_requests) {
          updatedEmployee.leave_requests = updatedEmployee.leave_requests.map(request => 
            request.id === approvalId ? { ...request, status: approvalStatus } : request
          );
        }
        break;
        
      case 'overtime':
        if (updatedEmployee.overtime) {
          updatedEmployee.overtime = updatedEmployee.overtime.map(ot => 
            ot.id === approvalId ? { ...ot, status: approvalStatus } : ot
          );
        }
        break;
        
      case 'advance':
        if (updatedEmployee.advances) {
          updatedEmployee.advances = updatedEmployee.advances.map(advance => 
            advance.id === approvalId ? { ...advance, status: approvalStatus } : advance
          );
        }
        break;
        
      case 'fine':
        if (updatedEmployee.fines) {
          const newStatus = approvalStatus === 'approved' ? 'paid' : 'pending';
          updatedEmployee.fines = updatedEmployee.fines.map(fine => 
            fine.id === approvalId ? { ...fine, status: newStatus } : fine
          );
        }
        break;
        
      case 'task':
        if (updatedEmployee.tasks) {
          const newStatus = approvalStatus === 'approved' ? 'completed' : 'pending';
          updatedEmployee.tasks = updatedEmployee.tasks.map(task => 
            task.id === approvalId ? { ...task, status: newStatus } : task
          );
        }
        break;
    }
    
    setEmployee(updatedEmployee);
    approvalModalHandlers.close();
    
    notifications.show({
      title: 'Approval Action',
      message: `Request has been ${approvalStatus}`,
      color: approvalStatus === 'approved' ? 'green' : 'red',
    });
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '200px' }}>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
      </div>
    );
  }

  if (!employee) {
    return (
      <Paper p="xl" radius="md">
        <Text ta="center" c="dimmed">Employee not found</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="light" onClick={() => navigate('/employees')}>
            <ArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>Employee Details</Title>
        </Group>
        {canManageEmployees && (
          <Group>
            <Button 
              variant="light" 
              color="blue" 
              leftSection={<Edit size={16} />}
              onClick={handleEditEmployee}
            >
              Edit
            </Button>
            <Button 
              variant="light" 
              color="red" 
              leftSection={<Trash size={16} />}
              onClick={handleDeleteEmployee}
            >
              Delete
            </Button>
          </Group>
        )}
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group align="flex-start">
          <Avatar
            size={100}
            radius={100}
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.first_name}${employee.last_name}`}
          />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between">
              <Title order={3}>{employee.first_name} {employee.last_name}</Title>
              <Badge color={getStatusColor(employee.status)} size="lg">
                {employee.status}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">{employee.role}</Text>
            <Text size="sm" c="dimmed">{employee.department}</Text>
            <Group gap="md" mt="xs">
              <Group gap="xs">
                <Mail size={16} />
                <Text size="sm">{employee.email}</Text>
              </Group>
              {employee.phone && (
                <Group gap="xs">
                  <Phone size={16} />
                  <Text size="sm">{employee.phone}</Text>
                </Group>
              )}
            </Group>
          </Stack>
        </Group>
      </Paper>

      <Tabs defaultValue="personal">
        <Tabs.List>
          <Tabs.Tab value="personal">Personal Information</Tabs.Tab>
          <Tabs.Tab value="employment">Employment Details</Tabs.Tab>
          <Tabs.Tab value="attendance">Attendance</Tabs.Tab>
          <Tabs.Tab value="leave">Leave</Tabs.Tab>
          <Tabs.Tab value="overtime">Overtime</Tabs.Tab>
          <Tabs.Tab value="advance">Advance</Tabs.Tab>
          <Tabs.Tab value="fine">Fine</Tabs.Tab>
          <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
          <Tabs.Tab value="documents">Documents</Tabs.Tab>
          <Tabs.Tab value="performance">Performance</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Personal Details</Title>
                <Stack gap="sm">
                  <Group>
                    <Calendar size={16} />
                    <Text size="sm"><strong>Date of Birth:</strong> {employee.date_of_birth}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Gender:</strong> {employee.gender}</Text>
                  </Group>
                  <Group>
                    <MapPin size={16} />
                    <Text size="sm"><strong>Address:</strong> {employee.address}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Emergency Contact</Title>
                <Stack gap="sm">
                  <Group>
                    <Phone size={16} />
                    <Text size="sm"><strong>Contact:</strong> {employee.emergency_contact}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Name:</strong> {employee.emergency_contact_name}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="employment" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Employment Information</Title>
                <Stack gap="sm">
                  <Group>
                    <Building size={16} />
                    <Text size="sm"><strong>Department:</strong> {employee.department}</Text>
                  </Group>
                  <Group>
                    <Briefcase size={16} />
                    <Text size="sm"><strong>Role:</strong> {employee.role}</Text>
                  </Group>
                  <Group>
                    <Calendar size={16} />
                    <Text size="sm"><strong>Hire Date:</strong> {employee.hire_date}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Reporting Manager:</strong> {employee.reporting_manager}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Bank Details</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Bank Name:</strong> {employee.bank_name}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Account Number:</strong> {employee.bank_account_number}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>IFSC Code:</strong> {employee.bank_ifsc}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="attendance" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Attendance Summary</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Present:</strong> {employee.attendance?.present} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Absent:</strong> {employee.attendance?.absent} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Late:</strong> {employee.attendance?.late} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>On Leave:</strong> {employee.attendance?.leave} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Total Days:</strong> {employee.attendance?.total_days} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Attendance Percentage:</strong> {employee.attendance?.attendance_percentage}%</Text>
                  </Group>
                  <Progress 
                    value={employee.attendance?.attendance_percentage || 0} 
                    color="green" 
                    size="xl" 
                    radius="xl" 
                    mt="md"
                  />
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Recent Attendance</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Check In</Table.Th>
                      <Table.Th>Check Out</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.attendance_records && employee.attendance_records.slice(0, 5).map((record, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{record.date}</Table.Td>
                        <Table.Td>{record.check_in}</Table.Td>
                        <Table.Td>{record.check_out}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(record.status)} leftSection={getStatusIcon(record.status)}>
                            {record.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Attendance History</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Check In</Table.Th>
                      <Table.Th>Check Out</Table.Th>
                      <Table.Th>Status</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.attendance_records && employee.attendance_records.map((record, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{record.date}</Table.Td>
                        <Table.Td>{record.check_in}</Table.Td>
                        <Table.Td>{record.check_out}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(record.status)} leftSection={getStatusIcon(record.status)}>
                            {record.status}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="leave" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Leave Balance</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Annual Leave:</strong> {employee.leave_balance?.annual} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Sick Leave:</strong> {employee.leave_balance?.sick} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Personal Leave:</strong> {employee.leave_balance?.personal} days</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Leave Summary</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Total Leave Days:</strong> {employee.leave_requests?.reduce((sum, req) => sum + req.days, 0)} days</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Approved Leaves:</strong> {employee.leave_requests?.filter(req => req.status === 'approved').length} requests</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Pending Leaves:</strong> {employee.leave_requests?.filter(req => req.status === 'pending').length} requests</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Rejected Leaves:</strong> {employee.leave_requests?.filter(req => req.status === 'rejected').length} requests</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Leave Requests</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Start Date</Table.Th>
                      <Table.Th>End Date</Table.Th>
                      <Table.Th>Days</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.leave_requests?.map((request) => (
                      <Table.Tr key={request.id}>
                        <Table.Td>{request.type}</Table.Td>
                        <Table.Td>{request.start_date}</Table.Td>
                        <Table.Td>{request.end_date}</Table.Td>
                        <Table.Td>{request.days}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {request.status === 'pending' && (
                            <Group gap="xs">
                              <Tooltip label="Approve">
                                <ActionIcon 
                                  color="green" 
                                  variant="light" 
                                  onClick={() => handleApproval('leave', request.id)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon 
                                  color="red" 
                                  variant="light" 
                                  onClick={() => handleApproval('leave', request.id)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="overtime" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Overtime Summary</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Total Hours:</strong> {employee.overtime?.reduce((sum, ot) => sum + ot.hours, 0)} hours</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Total Amount:</strong> ${employee.overtime?.reduce((sum, ot) => sum + ot.amount, 0)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Approved Overtime:</strong> {employee.overtime?.filter(ot => ot.status === 'approved').length} requests</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Pending Overtime:</strong> {employee.overtime?.filter(ot => ot.status === 'pending').length} requests</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Overtime History</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Hours</Table.Th>
                      <Table.Th>Reason</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.overtime?.map((ot) => (
                      <Table.Tr key={ot.id}>
                        <Table.Td>{ot.date}</Table.Td>
                        <Table.Td>{ot.hours} hours</Table.Td>
                        <Table.Td>{ot.reason}</Table.Td>
                        <Table.Td>${ot.amount}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(ot.status)}>
                            {ot.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {ot.status === 'pending' && (
                            <Group gap="xs">
                              <Tooltip label="Approve">
                                <ActionIcon 
                                  color="green" 
                                  variant="light" 
                                  onClick={() => handleApproval('overtime', ot.id)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon 
                                  color="red" 
                                  variant="light" 
                                  onClick={() => handleApproval('overtime', ot.id)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="advance" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Advance Summary</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Total Advance:</strong> ${employee.advances?.reduce((sum, adv) => sum + adv.amount, 0)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Approved Advance:</strong> ${employee.advances?.filter(adv => adv.status === 'approved').reduce((sum, adv) => sum + adv.amount, 0)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Pending Advance:</strong> ${employee.advances?.filter(adv => adv.status === 'pending').reduce((sum, adv) => sum + adv.amount, 0)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Completed Repayments:</strong> {employee.advances?.filter(adv => adv.repayment_status === 'completed').length} advances</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>In Progress Repayments:</strong> {employee.advances?.filter(adv => adv.repayment_status === 'in_progress').length} advances</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Advance History</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Reason</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Repayment Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.advances?.map((advance) => (
                      <Table.Tr key={advance.id}>
                        <Table.Td>{advance.date}</Table.Td>
                        <Table.Td>${advance.amount}</Table.Td>
                        <Table.Td>{advance.reason}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(advance.status)}>
                            {advance.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(advance.repayment_status)}>
                            {advance.repayment_status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {advance.status === 'pending' && (
                            <Group gap="xs">
                              <Tooltip label="Approve">
                                <ActionIcon 
                                  color="green" 
                                  variant="light" 
                                  onClick={() => handleApproval('advance', advance.id)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon 
                                  color="red" 
                                  variant="light" 
                                  onClick={() => handleApproval('advance', advance.id)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="fine" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Fine Summary</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Total Fines:</strong> ${employee.fines?.reduce((sum, fine) => sum + fine.amount, 0)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Paid Fines:</strong> ${employee.fines?.filter(fine => fine.status === 'paid').reduce((sum, fine) => sum + fine.amount, 0)}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Pending Fines:</strong> ${employee.fines?.filter(fine => fine.status === 'pending').reduce((sum, fine) => sum + fine.amount, 0)}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Fine History</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Reason</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.fines?.map((fine) => (
                      <Table.Tr key={fine.id}>
                        <Table.Td>{fine.date}</Table.Td>
                        <Table.Td>${fine.amount}</Table.Td>
                        <Table.Td>{fine.reason}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(fine.status)}>
                            {fine.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {fine.status === 'pending' && (
                            <Group gap="xs">
                              <Tooltip label="Approve">
                                <ActionIcon 
                                  color="green" 
                                  variant="light" 
                                  onClick={() => handleApproval('fine', fine.id)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon 
                                  color="red" 
                                  variant="light" 
                                  onClick={() => handleApproval('fine', fine.id)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="tasks" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Task Summary</Title>
                <Stack gap="sm">
                  <Group>
                    <Text size="sm"><strong>Total Tasks:</strong> {employee.tasks?.length}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Completed Tasks:</strong> {employee.tasks?.filter(task => task.status === 'completed').length}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>In Progress Tasks:</strong> {employee.tasks?.filter(task => task.status === 'in_progress').length}</Text>
                  </Group>
                  <Group>
                    <Text size="sm"><strong>Pending Tasks:</strong> {employee.tasks?.filter(task => task.status === 'pending').length}</Text>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card withBorder radius="md" p="md">
                <Title order={4} mb="md">Task History</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Title</Table.Th>
                      <Table.Th>Assigned Date</Table.Th>
                      <Table.Th>Due Date</Table.Th>
                      <Table.Th>Priority</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {employee.tasks?.map((task) => (
                      <Table.Tr key={task.id}>
                        <Table.Td>{task.title}</Table.Td>
                        <Table.Td>{task.assigned_date}</Table.Td>
                        <Table.Td>{task.due_date}</Table.Td>
                        <Table.Td>
                          <Badge 
                            color={
                              task.priority === 'high' ? 'red' : 
                              task.priority === 'medium' ? 'yellow' : 'blue'
                            }
                          >
                            {task.priority}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {task.status === 'pending' && (
                            <Group gap="xs">
                              <Tooltip label="Approve">
                                <ActionIcon 
                                  color="green" 
                                  variant="light" 
                                  onClick={() => handleApproval('task', task.id)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon 
                                  color="red" 
                                  variant="light" 
                                  onClick={() => handleApproval('task', task.id)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="documents" pt="md">
          <Card withBorder radius="md" p="md">
            <Title order={4} mb="md">Employee Documents</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Document Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Uploaded Date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {employee.documents && employee.documents.map((doc) => (
                  <Table.Tr key={doc.id}>
                    <Table.Td>{doc.name}</Table.Td>
                    <Table.Td>{doc.type.toUpperCase()}</Table.Td>
                    <Table.Td>{doc.uploaded_at}</Table.Td>
                    <Table.Td>
                      <ActionIcon variant="light" color="blue">
                        <FileText size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="performance" pt="md">
          <Card withBorder radius="md" p="md">
            <Title order={4} mb="md">Performance Reviews</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Year</Table.Th>
                  <Table.Th>Rating</Table.Th>
                  <Table.Th>Review Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {employee.performance && employee.performance.map((perf, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{perf.year}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Award size={16} color="gold" />
                        <Text>{perf.rating}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{perf.review_date}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Approval Modal */}
      <Modal 
        opened={approvalModalOpened} 
        onClose={approvalModalHandlers.close}
        title="Review Request"
        size="md"
      >
        <Stack>
          <Text>Are you sure you want to {approvalStatus} this request?</Text>
          
          <Textarea
            label="Comments"
            placeholder="Add your comments here..."
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.currentTarget.value)}
            minRows={3}
          />
          
          <Group justify="flex-end" mt="md">
            <Button 
              variant="light" 
              color="red" 
              onClick={() => setApprovalStatus('rejected')}
              leftSection={<X size={16} />}
            >
              Reject
            </Button>
            <Button 
              color="green" 
              onClick={submitApproval}
              leftSection={<Check size={16} />}
            >
              Approve
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 