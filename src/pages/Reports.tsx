import React, { useState } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Card,
  Text,
  Grid,
  Select,
  Button,
  Table,
  RingProgress,
  Center,
  SegmentedControl,
  Tabs,
  LoadingOverlay,
  Progress,
  Avatar,
  Badge,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Download, FileSpreadsheet, File as FilePdf, Users, Clock, DollarSign, AlertTriangle, CheckCircle2, XCircle, Calendar, Filter, Building2, UserCircle, Gavel, Receipt, Wallet } from 'lucide-react';

// Mock data for reports
const mockEmployeeData = {
  totalEmployees: 120,
  activeEmployees: 110,
  onLeave: 5,
  inactive: 5,
  byDepartment: [
    { department: 'Engineering', count: 45, active: 42 },
    { department: 'Design', count: 30, active: 28 },
    { department: 'Marketing', count: 25, active: 23 },
    { department: 'HR', count: 20, active: 17 },
  ],
  recentHires: [
    { name: 'John Doe', department: 'Engineering', date: '2024-03-15' },
    { name: 'Jane Smith', department: 'Design', date: '2024-03-10' },
    { name: 'Mike Johnson', department: 'Marketing', date: '2024-03-05' },
  ],
};

const mockDepartmentData = {
  totalDepartments: 8,
  activeProjects: 15,
  totalRoles: 25,
  departments: [
    { name: 'Engineering', employees: 45, managers: 5, roles: 8 },
    { name: 'Design', employees: 30, managers: 3, roles: 6 },
    { name: 'Marketing', employees: 25, managers: 3, roles: 5 },
    { name: 'HR', employees: 20, managers: 2, roles: 6 },
  ],
};

const mockRolesData = {
  totalRoles: 25,
  byDepartment: [
    { department: 'Engineering', roles: ['Developer', 'Team Lead', 'Architect'] },
    { department: 'Design', roles: ['UI Designer', 'UX Designer', 'Art Director'] },
    { department: 'Marketing', roles: ['Marketing Manager', 'Content Writer', 'SEO Specialist'] },
  ],
  distribution: {
    management: 15,
    technical: 45,
    support: 25,
    operations: 15,
  },
};

const mockAttendanceData = {
  present: 85,
  absent: 10,
  late: 5,
  onLeave: 8,
  totalEmployees: 120,
  averageWorkHours: 7.8,
  departmentWise: [
    { department: 'Engineering', present: 90, absent: 5, late: 5 },
    { department: 'Design', present: 85, absent: 10, late: 5 },
    { department: 'Marketing', present: 80, absent: 15, late: 5 },
  ],
};

const mockLeaveData = {
  totalRequests: 45,
  approved: 35,
  rejected: 5,
  pending: 5,
  byType: {
    annual: 20,
    sick: 15,
    unpaid: 5,
    other: 5,
  },
  departmentWise: [
    { department: 'Engineering', total: 20, approved: 15, rejected: 2, pending: 3 },
    { department: 'Design', total: 15, approved: 12, rejected: 2, pending: 1 },
    { department: 'Marketing', total: 10, approved: 8, rejected: 1, pending: 1 },
  ],
};

const mockOvertimeData = {
  totalHours: 450,
  totalEmployees: 35,
  averageHours: 12.8,
  byDepartment: [
    { department: 'Engineering', hours: 200, employees: 15 },
    { department: 'Design', hours: 150, employees: 12 },
    { department: 'Marketing', hours: 100, employees: 8 },
  ],
  status: {
    approved: 85,
    pending: 10,
    rejected: 5,
  },
};

const mockFinesData = {
  totalAmount: 2500,
  totalFines: 45,
  byType: {
    attendance: 1200,
    misconduct: 800,
    damage: 500,
  },
  byDepartment: [
    { department: 'Engineering', amount: 1000, count: 20 },
    { department: 'Design', amount: 800, count: 15 },
    { department: 'Marketing', amount: 700, count: 10 },
  ],
};

const mockPayrollData = {
  totalSalary: 250000,
  totalDeductions: 25000,
  totalAllowances: 50000,
  netPayable: 275000,
  departmentWise: [
    { department: 'Engineering', salary: 150000, employees: 45 },
    { department: 'Design', salary: 60000, employees: 20 },
    { department: 'Marketing', salary: 40000, employees: 15 },
  ],
  components: {
    basic: 60,
    hra: 15,
    medical: 5,
    transport: 5,
    special: 15,
  },
};

const mockExpenseData = {
  totalExpenses: 75000,
  byCategory: {
    travel: 25000,
    office: 20000,
    equipment: 15000,
    others: 15000,
  },
  byDepartment: [
    { department: 'Engineering', amount: 30000, claims: 25 },
    { department: 'Design', amount: 25000, claims: 20 },
    { department: 'Marketing', amount: 20000, claims: 15 },
  ],
  status: {
    approved: 80,
    pending: 15,
    rejected: 5,
  },
};

export default function Reports() {
  const [reportType, setReportType] = useState('employees');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, this would trigger the actual export
      console.log('Exporting report:', {
        type: reportType,
        dateRange,
        department,
        format: exportFormat,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEmployeeReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Employees</Text>
              <Users size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockEmployeeData.totalEmployees}</Text>
            <Progress
              value={(mockEmployeeData.activeEmployees / mockEmployeeData.totalEmployees) * 100}
              mt="md"
              size="sm"
              color="blue"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Active</Text>
              <CheckCircle2 size={20} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockEmployeeData.activeEmployees}</Text>
            <Progress
              value={(mockEmployeeData.activeEmployees / mockEmployeeData.totalEmployees) * 100}
              mt="md"
              size="sm"
              color="green"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">On Leave</Text>
              <Calendar size={20} color="var(--mantine-color-yellow-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockEmployeeData.onLeave}</Text>
            <Progress
              value={(mockEmployeeData.onLeave / mockEmployeeData.totalEmployees) * 100}
              mt="md"
              size="sm"
              color="yellow"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Inactive</Text>
              <XCircle size={20} color="var(--mantine-color-red-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockEmployeeData.inactive}</Text>
            <Progress
              value={(mockEmployeeData.inactive / mockEmployeeData.totalEmployees) * 100}
              mt="md"
              size="sm"
              color="red"
            />
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Department Distribution</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Total Employees</Table.Th>
                  <Table.Th>Active</Table.Th>
                  <Table.Th>Utilization</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockEmployeeData.byDepartment.map((dept) => (
                  <Table.Tr key={dept.department}>
                    <Table.Td>{dept.department}</Table.Td>
                    <Table.Td>{dept.count}</Table.Td>
                    <Table.Td>{dept.active}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text>{Math.round((dept.active / dept.count) * 100)}%</Text>
                        <Progress
                          value={(dept.active / dept.count) * 100}
                          size="sm"
                          color="blue"
                          w={100}
                        />
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Recent Hires</Title>
            <Stack>
              {mockEmployeeData.recentHires.map((hire, index) => (
                <Group key={index} position="apart">
                  <Group gap="sm">
                    <Avatar
                      size={40}
                      radius={40}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hire.name}`}
                    />
                    <div>
                      <Text size="sm" fw={500}>{hire.name}</Text>
                      <Text size="xs" c="dimmed">{hire.department}</Text>
                    </div>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {new Date(hire.date).toLocaleDateString()}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderDepartmentReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Departments</Text>
              <Building2 size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockDepartmentData.totalDepartments}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Active Projects</Text>
              <CheckCircle2 size={20} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockDepartmentData.activeProjects}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Roles</Text>
              <UserCircle size={20} color="var(--mantine-color-violet-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockDepartmentData.totalRoles}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Department Overview</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Department</Table.Th>
              <Table.Th>Employees</Table.Th>
              <Table.Th>Managers</Table.Th>
              <Table.Th>Roles</Table.Th>
              <Table.Th>Ratio</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockDepartmentData.departments.map((dept) => (
              <Table.Tr key={dept.name}>
                <Table.Td>{dept.name}</Table.Td>
                <Table.Td>{dept.employees}</Table.Td>
                <Table.Td>{dept.managers}</Table.Td>
                <Table.Td>{dept.roles}</Table.Td>
                <Table.Td>
                  <Text size="sm">
                    1:{Math.round(dept.employees / dept.managers)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );

  const renderRolesReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Role Distribution</Title>
            <RingProgress
              sections={Object.entries(mockRolesData.distribution).map(([key, value]) => ({
                value,
                color: key === 'management' ? 'blue' : key === 'technical' ? 'green' : key === 'support' ? 'yellow' : 'violet',
              }))}
              label={
                <Center>
                  <UserCircle size={28} />
                </Center>
              }
            />
            <Stack mt="md">
              {Object.entries(mockRolesData.distribution).map(([key, value]) => (
                <Group key={key} position="apart">
                  <Text transform="capitalize">{key}</Text>
                  <Text>{value}%</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Roles by Department</Title>
            <Stack>
              {mockRolesData.byDepartment.map((dept) => (
                <Card key={dept.department} withBorder>
                  <Text fw={500}>{dept.department}</Text>
                  <Group mt="xs" gap="xs">
                    {dept.roles.map((role, index) => (
                      <Badge key={index} color="blue">
                        {role}
                      </Badge>
                    ))}
                  </Group>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderAttendanceReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Present</Text>
              <Users size={20} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockAttendanceData.present}%</Text>
            <Progress
              value={mockAttendanceData.present}
              mt="md"
              size="sm"
              color="green"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Absent</Text>
              <XCircle size={20} color="var(--mantine-color-red-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockAttendanceData.absent}%</Text>
            <Progress
              value={mockAttendanceData.absent}
              mt="md"
              size="sm"
              color="red"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Late</Text>
              <Clock size={20} color="var(--mantine-color-yellow-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockAttendanceData.late}%</Text>
            <Progress
              value={mockAttendanceData.late}
              mt="md"
              size="sm"
              color="yellow"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">On Leave</Text>
              <Calendar size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockAttendanceData.onLeave}</Text>
            <Progress
              value={(mockAttendanceData.onLeave / mockAttendanceData.totalEmployees) * 100}
              mt="md"
              size="sm"
              color="blue"
            />
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Department-wise Attendance</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Department</Table.Th>
              <Table.Th>Present %</Table.Th>
              <Table.Th>Absent %</Table.Th>
              <Table.Th>Late %</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockAttendanceData.departmentWise.map((dept) => (
              <Table.Tr key={dept.department}>
                <Table.Td>{dept.department}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text>{dept.present}%</Text>
                    <Progress
                      value={dept.present}
                      size="sm"
                      color="green"
                      w={100}
                    />
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text>{dept.absent}%</Text>
                    <Progress
                      value={dept.absent}
                      size="sm"
                      color="red"
                      w={100}
                    />
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Text>{dept.late}%</Text>
                    <Progress
                      value={dept.late}
                      size="sm"
                      color="yellow"
                      w={100}
                    />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );

  const renderLeaveReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <RingProgress
              sections={[
                { value: (mockLeaveData.approved / mockLeaveData.totalRequests) * 100, color: 'green' },
                { value: (mockLeaveData.rejected / mockLeaveData.totalRequests) * 100, color: 'red' },
                { value: (mockLeaveData.pending / mockLeaveData.totalRequests) * 100, color: 'yellow' },
              ]}
              label={
                <Center>
                  <Text fw={700} ta="center" size="xl">
                    {mockLeaveData.totalRequests}
                  </Text>
                </Center>
              }
            />
            <Text ta="center" mt="sm">Total Requests</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Card withBorder>
            <Title order={4} mb="md">Leave Types Distribution</Title>
            <Grid>
              {Object.entries(mockLeaveData.byType).map(([type, count]) => (
                <Grid.Col key={type} span={3}>
                  <Stack gap="xs" align="center">
                    <RingProgress
                      sections={[
                        { value: (count / mockLeaveData.totalRequests) * 100, color: 'blue' },
                      ]}
                      label={
                        <Center>
                          <Text fw={700}>{count}</Text>
                        </Center>
                      }
                    />
                    <Text transform="capitalize">{type}</Text>
                  </Stack>
                </Grid.Col>
              ))}
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Department-wise Leave Analysis</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Department</Table.Th>
              <Table.Th>Total Requests</Table.Th>
              <Table.Th>Approved</Table.Th>
              <Table.Th>Rejected</Table.Th>
              <Table.Th>Pending</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockLeaveData.departmentWise.map((dept) => (
              <Table.Tr key={dept.department}>
                <Table.Td>{dept.department}</Table.Td>
                <Table.Td>{dept.total}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <CheckCircle2 size={16} color="var(--mantine-color-green-6)" />
                    <Text>{dept.approved}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <XCircle size={16} color="var(--mantine-color-red-6)" />
                    <Text>{dept.rejected}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <AlertTriangle size={16} color="var(--mantine-color-yellow-6)" />
                    <Text>{dept.pending}</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );

  const renderOvertimeReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Hours</Text>
              <Clock size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockOvertimeData.totalHours}h</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Employees</Text>
              <Users size={20} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockOvertimeData.totalEmployees}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Average Hours</Text>
              <Clock size={20} color="var(--mantine-color-violet-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockOvertimeData.averageHours}h</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Department-wise Overtime</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Total Hours</Table.Th>
                  <Table.Th>Employees</Table.Th>
                  <Table.Th>Avg. Hours</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockOvertimeData.byDepartment.map((dept) => (
                  <Table.Tr key={dept.department}>
                    <Table.Td>{dept.department}</Table.Td>
                    <Table.Td>{dept.hours}h</Table.Td>
                    <Table.Td>{dept.employees}</Table.Td>
                    <Table.Td>{(dept.hours / dept.employees).toFixed(1)}h</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Status Distribution</Title>
            <RingProgress
              sections={[
                { value: mockOvertimeData.status.approved, color: 'green' },
                { value: mockOvertimeData.status.pending, color: 'yellow' },
                { value: mockOvertimeData.status.rejected, color: 'red' },
              ]}
              label={
                <Center>
                  <Clock size={28} />
                </Center>
              }
            />
            <Stack mt="md">
              <Group position="apart">
                <Text>Approved</Text>
                <Text>{mockOvertimeData.status.approved}%</Text>
              </Group>
              <Group position="apart">
                <Text>Pending</Text>
                <Text>{mockOvertimeData.status.pending}%</Text>
              </Group>
              <Group position="apart">
                <Text>Rejected</Text>
                <Text>{mockOvertimeData.status.rejected}%</Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderFinesReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Amount</Text>
              <Gavel size={20} color="var(--mantine-color-red-6)" />
            </Group>
            <Text size="xl" fw={700}>${mockFinesData.totalAmount}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Fines</Text>
              <AlertTriangle size={20} color="var(--mantine-color-yellow-6)" />
            </Group>
            <Text size="xl" fw={700}>{mockFinesData.totalFines}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Average Amount</Text>
              <DollarSign size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>
              ${Math.round(mockFinesData.totalAmount / mockFinesData.totalFines)}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Fines by Type</Title>
            <RingProgress
              sections={Object.entries(mockFinesData.byType).map(([key, value]) => ({
                value: (value / mockFinesData.totalAmount) * 100,
                color: key === 'attendance' ? 'red' : key === 'misconduct' ? 'orange' : 'yellow',
              }))}
              label={
                <Center>
                  <Gavel size={28} />
                </Center>
              }
            />
            <Stack mt="md">
              {Object.entries(mockFinesData.byType).map(([key, value]) => (
                <Group key={key} position="apart">
                  <Text transform="capitalize">{key}</Text>
                  <Text>${value}</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Department-wise Fines</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Count</Table.Th>
                  <Table.Th>Avg. Amount</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockFinesData.byDepartment.map((dept) => (
                  <Table.Tr key={dept.department}>
                    <Table.Td>{dept.department}</Table.Td>
                    <Table.Td>${dept.amount}</Table.Td>
                    <Table.Td>{dept.count}</Table.Td>
                    <Table.Td>${Math.round(dept.amount / dept.count)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderPayrollReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Salary</Text>
              <DollarSign size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>${mockPayrollData.totalSalary.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Allowances</Text>
              <DollarSign size={20} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>${mockPayrollData.totalAllowances.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Deductions</Text>
              <DollarSign size={20} color="var(--mantine-color-red-6)" />
            </Group>
            <Text size="xl" fw={700}>${mockPayrollData.totalDeductions.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Net Payable</Text>
              <DollarSign size={20} color="var(--mantine-color-teal-6)" />
            </Group>
            <Text size="xl" fw={700}>${mockPayrollData.netPayable.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Salary Components</Title>
            <RingProgress
              sections={Object.entries(mockPayrollData.components).map(([key, value]) => ({
                value,
                color: key === 'basic' ? 'blue' : key === 'hra' ? 'green' : key === 'medical' ? 'teal' : key === 'transport' ? 'cyan' : 'grape',
              }))}
              label={
                <Center>
                  <DollarSign size={28} />
                </Center>
              }
            />
            <Stack mt="md">
              {Object.entries(mockPayrollData.components).map(([key, value]) => (
                <Group key={key} position="apart">
                  <Text transform="capitalize">{key}</Text>
                  <Text>{value}%</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Department-wise Distribution</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Employees</Table.Th>
                  <Table.Th>Total Salary</Table.Th>
                  <Table.Th>Avg. per Employee</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockPayrollData.departmentWise.map((dept) => (
                  <Table.Tr key={dept.department}>
                    <Table.Td>{dept.department}</Table.Td>
                    <Table.Td>{dept.employees}</Table.Td>
                    <Table.Td>${dept.salary.toLocaleString()}</Table.Td>
                    <Table.Td>
                      ${Math.round(dept.salary / dept.employees).toLocaleString()}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  const renderExpenseReport = () => (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Group position="apart" mb="xs">
              <Text size="sm" c="dimmed">Total Expenses</Text>
              <Receipt size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>${mockExpenseData.totalExpenses.toLocaleString()}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Card withBorder>
            <Title order={4} mb="md">Status Distribution</Title>
            <Group position="apart">
              <RingProgress
                sections={[
                  { value: mockExpenseData.status.approved, color: 'green' },
                  { value: mockExpenseData.status.pending, color: 'yellow' },
                  { value: mockExpenseData.status.rejected, color: 'red' },
                ]}
                label={
                  <Center>
                    <Receipt size={28} />
                  </Center>
                }
              />
              <Stack>
                <Group position="apart">
                  <Badge color="green">Approved</Badge>
                  <Text>{mockExpenseData.status.approved}%</Text>
                </Group>
                <Group position="apart">
                  <Badge color="yellow">Pending</Badge>
                  <Text>{mockExpenseData.status.pending}%</Text>
                </Group>
                <Group position="apart">
                  <Badge color="red">Rejected</Badge>
                  <Text>{mockExpenseData.status.rejected}%</Text>
                </Group>
              </Stack>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Expenses by Category</Title>
            <RingProgress
              sections={Object.entries(mockExpenseData.byCategory).map(([key, value]) => ({
                value: (value / mockExpenseData.totalExpenses) * 100,
                color: key === 'travel' ? 'blue' : key === 'office' ? 'green' : key === 'equipment' ? 'yellow' : 'grape',
              }))}
              label={
                <Center>
                  <Wallet size={28} />
                </Center>
              }
            />
            <Stack mt="md">
              {Object.entries(mockExpenseData.byCategory).map(([key, value]) => (
                <Group key={key} position="apart">
                  <Text transform="capitalize">{key}</Text>
                  <Text>${value.toLocaleString()}</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="lg">Department-wise Expenses</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Claims</Table.Th>
                  <Table.Th>Avg. per Claim</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {mockExpenseData.byDepartment.map((dept) => (
                  <Table.Tr key={dept.department}>
                    <Table.Td>{dept.department}</Table.Td>
                    <Table.Td>${dept.amount.toLocaleString()}</Table.Td>
                    <Table.Td>{dept.claims}</Table.Td>
                    <Table.Td>
                      ${Math.round(dept.amount / dept.claims).toLocaleString()}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Reports & Analytics</Title>
        <Group>
          <SegmentedControl
            value={exportFormat}
            onChange={setExportFormat}
            data={[
              { label: 'Excel', value: 'excel' },
              { label: 'PDF', value: 'pdf' },
            ]}
          />
          <Button
            leftSection={exportFormat === 'excel' ? <FileSpreadsheet size={20} /> : <FilePdf size={20} />}
            rightSection={<Download size={20} />}
            onClick={handleExport}
            loading={loading}
          >
            Export Report
          </Button>
        </Group>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Group mb="lg">
          <DatePickerInput
            type="range"
            label="Date Range"
            placeholder="Pick dates range"
            value={dateRange}
            onChange={setDateRange}
            leftSection={<Calendar size={16} />}
            w={400}
          />
          <Select
            label="Department"
            placeholder="All Departments"
            value={department}
            onChange={setDepartment}
            data={['Engineering', 'Design', 'Marketing', 'HR']}
            leftSection={<Filter size={16} />}
            clearable
            w={250}
          />
        </Group>

        <Tabs value={reportType} onChange={setReportType}>
          <Tabs.List>
            <Tabs.Tab value="employees" leftSection={<Users size={16} />}>
              Employees
            </Tabs.Tab>
            <Tabs.Tab value="departments" leftSection={<Building2 size={16} />}>
              Departments
            </Tabs.Tab>
            <Tabs.Tab value="roles" leftSection={<UserCircle size={16} />}>
              Roles
            </Tabs.Tab>
            <Tabs.Tab value="attendance" leftSection={<Clock size={16} />}>
              Attendance
            </Tabs.Tab>
            <Tabs.Tab value="leave" leftSection={<Calendar size={16} />}>
              Leave
            </Tabs.Tab>
            <Tabs.Tab value="overtime" leftSection={<Clock size={16} />}>
              Overtime
            </Tabs.Tab>
            <Tabs.Tab value="fines" leftSection={<Gavel size={16} />}>
              Fines
            </Tabs.Tab>
            <Tabs.Tab value="payroll" leftSection={<DollarSign size={16} />}>
              Payroll
            </Tabs.Tab>
            <Tabs.Tab value="expenses" leftSection={<Receipt size={16} />}>
              Expenses
            </Tabs.Tab>
          </Tabs.List>

          <LoadingOverlay visible={loading} />

          <Tabs.Panel value="employees" pt="xl">
            {renderEmployeeReport()}
          </Tabs.Panel>

          <Tabs.Panel value="departments" pt="xl">
            {renderDepartmentReport()}
          </Tabs.Panel>

          <Tabs.Panel value="roles" pt="xl">
            {renderRolesReport()}
          </Tabs.Panel>

          <Tabs.Panel value="attendance" pt="xl">
            {renderAttendanceReport()}
          </Tabs.Panel>

          <Tabs.Panel value="leave" pt="xl">
            {renderLeaveReport()}
          </Tabs.Panel>

          <Tabs.Panel value="overtime" pt="xl">
            {renderOvertimeReport()}
          </Tabs.Panel>

          <Tabs.Panel value="fines" pt="xl">
            {renderFinesReport()}
          </Tabs.Panel>

          <Tabs.Panel value="payroll" pt="xl">
            {renderPayrollReport()}
          </Tabs.Panel>

          <Tabs.Panel value="expenses" pt="xl">
            {renderExpenseReport()}
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
}