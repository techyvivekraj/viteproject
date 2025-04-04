import React, { useEffect, useRef } from 'react';
import {
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Table,
  Avatar,
  Title,
  ThemeIcon,
  Badge,
  ActionIcon,
  Tabs,
  Button,
  Progress,
  Divider,
  Paper,
  Container,
  ScrollArea,
} from '@mantine/core';
import {
  IconUsers,
  IconUserCheck,
  IconCalendarEvent,
  IconCurrencyDollar,
  IconDotsVertical,
  IconClock,
  IconBell,
  IconFileReport,
  IconUserPlus,
  IconCalendar,
  IconReceipt,
  IconMessage,
  IconChecklist,
  IconFilter,
} from '@tabler/icons-react';

const Dashboard = () => {
  // Mock data for demonstration
  const quickStats = [
    { title: 'Total Employees', value: '150', icon: IconUsers, color: 'blue', trend: '+12%' },
    { title: 'Active Today', value: '142', icon: IconUserCheck, color: 'green', trend: '+5%' },
    { title: 'Absent Today', value: '8', icon: IconUserCheck, color: 'red', trend: '-2%' },
    { title: 'Leaves Pending', value: '15', icon: IconCalendarEvent, color: 'yellow', trend: 'New' },
    { title: 'Overtime Requests', value: '8', icon: IconClock, color: 'grape', trend: 'Pending' },
    { title: 'Advance Requests', value: '5', icon: IconCurrencyDollar, color: 'cyan', trend: 'New' },
    { title: 'Timesheets Pending', value: '12', icon: IconFileReport, color: 'orange', trend: 'Urgent' },
  ];

  const attendanceData = {
    present: 142,
    late: 5,
    onLeave: 8,
    departments: [
      { name: 'Engineering', present: 45, late: 2, onLeave: 3 },
      { name: 'Marketing', present: 25, late: 1, onLeave: 2 },
      { name: 'HR', present: 15, late: 1, onLeave: 1 },
      { name: 'Finance', present: 15, late: 1, onLeave: 2 },
    ],
    punctualityLeaders: [
      { name: 'John Doe', department: 'Engineering', time: '9:00 AM', status: 'On Time' },
      { name: 'Jane Smith', department: 'HR', time: '9:05 AM', status: 'On Time' },
      { name: 'Mike Johnson', department: 'Marketing', time: '9:15 AM', status: 'Late' },
    ],
  };

  const approvalRequests = {
    leaves: [
      { id: 1, name: 'John Doe', type: 'Annual Leave', duration: '3 days', status: 'Pending' },
      { id: 2, name: 'Jane Smith', type: 'Sick Leave', duration: '1 day', status: 'Pending' },
    ],
    overtime: [
      { id: 1, name: 'Mike Johnson', hours: '2', date: '2024-03-20', status: 'Pending' },
    ],
    timesheets: [
      { id: 1, name: 'Sarah Wilson', department: 'Engineering', status: 'Pending' },
    ],
    advances: [
      { id: 1, name: 'Tom Brown', amount: '$500', reason: 'Emergency', status: 'Pending' },
    ],
  };

  const employeeManagement = {
    newJoinees: [
      { name: 'Alice Cooper', department: 'Engineering', joinDate: '2024-03-15' },
      { name: 'Bob Wilson', department: 'Marketing', joinDate: '2024-03-18' },
    ],
    upcomingExits: [
      { name: 'Charlie Davis', department: 'HR', lastDate: '2024-04-15' },
    ],
    inactiveAccounts: [
      { name: 'David Miller', department: 'Finance', status: 'Suspended' },
    ],
  };

  const financeOverview = {
    monthlyPayroll: {
      total: '$150,000',
      processed: '$120,000',
      pending: '$30,000',
    },
    advances: {
      total: '$5,000',
      pending: '$2,000',
    },
    fines: {
      total: '$1,000',
      collected: '$800',
    },
  };

  // Add new data for birthdays and work anniversaries
  const employeeEvents = {
    birthdays: [
      { name: 'John Doe', department: 'Engineering', date: 'Today', avatar: 'JD' },
      { name: 'Sarah Wilson', department: 'Marketing', date: 'Tomorrow', avatar: 'SW' },
      { name: 'Mike Johnson', department: 'HR', date: 'Mar 25', avatar: 'MJ' },
      { name: 'Emily Brown', department: 'Finance', date: 'Mar 26', avatar: 'EB' },
    ],
    workAnniversaries: [
      { name: 'Alice Cooper', department: 'Engineering', years: 3, date: 'Today', avatar: 'AC' },
      { name: 'Bob Wilson', department: 'Marketing', years: 1, date: 'Tomorrow', avatar: 'BW' },
      { name: 'Charlie Davis', department: 'HR', years: 5, date: 'Mar 25', avatar: 'CD' },
    ],
    holidays: [
      { name: 'Good Friday', date: 'Mar 29', type: 'Public Holiday' },
      { name: 'Easter Monday', date: 'Apr 1', type: 'Public Holiday' },
      { name: 'Spring Festival', date: 'Apr 5', type: 'Company Holiday' },
    ],
  };

  // Auto-scroll animation styles
  const AutoScrollList = ({ items, renderItem, height = 200 }) => {
    const scrollRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
      const scrollContainer = scrollRef.current;
      const content = contentRef.current;
      if (!scrollContainer || !content) return;

      const scrollHeight = content.scrollHeight;
      const duration = scrollHeight * 20; // Adjust speed as needed

      const animation = scrollContainer.animate(
        [
          { transform: 'translateY(0)' },
          { transform: `translateY(-${scrollHeight / 2}px)` },
        ],
        {
          duration,
          iterations: Infinity,
          easing: 'linear',
        }
      );

      return () => animation.cancel();
    }, []);

    return (
      <ScrollArea h={height} viewportRef={scrollRef}>
        <div ref={contentRef}>
          <Stack spacing="xs">
            {items.map((item, index) => renderItem(item, index))}
            {/* Duplicate items for seamless scrolling */}
            {items.map((item, index) => renderItem(item, index + items.length))}
          </Stack>
        </div>
      </ScrollArea>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card
      withBorder
      padding="lg"
      radius="md"
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderColor: `${color}30`,
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{title}</Text>
          <Group gap={5} align="center" mt="xs">
            <Text fw={700} size="xl">{value}</Text>
            <Badge
              size="sm"
              variant="light"
              color={trend === 'New' || trend === 'Pending' || trend === 'Urgent' ? 'yellow' : trend.startsWith('+') ? 'green' : 'red'}
            >
              {trend}
            </Badge>
          </Group>
        </div>
        <ThemeIcon
          size={38}
          radius="md"
          variant="light"
          color={color}
          style={{ background: `${color}15` }}
        >
          <Icon size={20} />
        </ThemeIcon>
      </Group>
    </Card>
  );

  return (
    <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
      <Stack spacing="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>HR Dashboard</Title>
          <Group>
            <ActionIcon variant="light" size="lg" radius="md">
              <IconBell size={20} />
            </ActionIcon>
            <ActionIcon variant="light" size="lg" radius="md">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Quick Stats */}
        <Grid>
          {quickStats.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
              <StatCard {...stat} />
            </Grid.Col>
          ))}
        </Grid>
<Divider/>
        {/* Main Content Tabs */}
        <Tabs
          defaultValue="attendance"
          
        >
          <Tabs.List grow>
            <Tabs.Tab
              value="attendance"
              leftSection={<IconClock size={18} />}
              rightSection={
                <Badge size="sm" variant="light" color="blue">
                  Live
                </Badge>
              }
            >
              Attendance & Punctuality
            </Tabs.Tab>
            <Tabs.Tab
              value="approvals"
              leftSection={<IconChecklist size={18} />}
              rightSection={
                <Badge size="sm" variant="light" color="yellow">
                  {approvalRequests.leaves.length + approvalRequests.overtime.length + approvalRequests.advances.length}
                </Badge>
              }
            >
              Approvals
            </Tabs.Tab>
            <Tabs.Tab
              value="employees"
              leftSection={<IconUsers size={18} />}
              rightSection={
                <Badge size="sm" variant="light" color="green">
                  {employeeManagement.newJoinees.length}
                </Badge>
              }
            >
              Employee Management
            </Tabs.Tab>
            <Tabs.Tab
              value="finance"
              leftSection={<IconCurrencyDollar size={18} />}
              rightSection={
                <Badge size="sm" variant="light" color="grape">
                  {financeOverview.monthlyPayroll.pending}
                </Badge>
              }
            >
              Finance Overview
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="attendance" pt="xl">
            <Grid>
              {/* Live Attendance Snapshot */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Live Attendance Snapshot</Text>
                    <ActionIcon variant="light" size="lg" radius="md">
                      <IconDotsVertical size={20} />
                    </ActionIcon>
                  </Group>
                  <Stack spacing="md">
                    <Group grow>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Present</Text>
                        <Text fw={700} size="xl" c="green">{attendanceData.present}</Text>
                      </Paper>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Late</Text>
                        <Text fw={700} size="xl" c="yellow">{attendanceData.late}</Text>
                      </Paper>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">On Leave</Text>
                        <Text fw={700} size="xl" c="blue">{attendanceData.onLeave}</Text>
                      </Paper>
                    </Group>
                    <Divider />
                    <Text fw={500} size="sm">Department-wise Breakdown</Text>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Department</Table.Th>
                          <Table.Th>Present</Table.Th>
                          <Table.Th>Late</Table.Th>
                          <Table.Th>On Leave</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {attendanceData.departments.map((dept, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>{dept.name}</Table.Td>
                            <Table.Td>{dept.present}</Table.Td>
                            <Table.Td>{dept.late}</Table.Td>
                            <Table.Td>{dept.onLeave}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Stack>
                </Card>
              </Grid.Col>

              {/* Punctuality Leaderboard */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Punctuality Leaderboard</Text>
                    <ActionIcon variant="light" size="lg" radius="md">
                      <IconDotsVertical size={20} />
                    </ActionIcon>
                  </Group>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Employee</Table.Th>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Time</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {attendanceData.punctualityLeaders.map((leader, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>{leader.name}</Table.Td>
                          <Table.Td>{leader.department}</Table.Td>
                          <Table.Td>{leader.time}</Table.Td>
                          <Table.Td>
                            <Badge
                              color={leader.status === 'On Time' ? 'green' : 'yellow'}
                              variant="light"
                            >
                              {leader.status}
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

          <Tabs.Panel value="approvals" pt="xl">
            <Grid>
              {/* Leave Requests */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Leave Requests</Text>
                    <Group>
                      <ActionIcon variant="light" size="lg" radius="md">
                        <IconFilter size={20} />
                      </ActionIcon>
                      <ActionIcon variant="light" size="lg" radius="md">
                        <IconDotsVertical size={20} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Employee</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Duration</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Action</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {approvalRequests.leaves.map((leave) => (
                        <Table.Tr key={leave.id}>
                          <Table.Td>{leave.name}</Table.Td>
                          <Table.Td>{leave.type}</Table.Td>
                          <Table.Td>{leave.duration}</Table.Td>
                          <Table.Td>
                            <Badge color="yellow" variant="light">Pending</Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap={4}>
                              <Button size="xs" color="green">Approve</Button>
                              <Button size="xs" color="red">Reject</Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Card>
              </Grid.Col>

              {/* Other Approval Sections */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack spacing="md">
                  {/* Overtime Requests */}
                  <Card withBorder padding="lg" radius="md">
                    <Group justify="space-between" mb="md">
                      <Text fw={700} size="lg">Overtime Requests</Text>
                      <ActionIcon variant="light" size="lg" radius="md">
                        <IconDotsVertical size={20} />
                      </ActionIcon>
                    </Group>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Employee</Table.Th>
                          <Table.Th>Hours</Table.Th>
                          <Table.Th>Date</Table.Th>
                          <Table.Th>Action</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {approvalRequests.overtime.map((request) => (
                          <Table.Tr key={request.id}>
                            <Table.Td>{request.name}</Table.Td>
                            <Table.Td>{request.hours}</Table.Td>
                            <Table.Td>{request.date}</Table.Td>
                            <Table.Td>
                              <Group gap={4}>
                                <Button size="xs" color="green">Approve</Button>
                                <Button size="xs" color="red">Reject</Button>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Card>

                  {/* Advance Requests */}
                  <Card withBorder padding="lg" radius="md">
                    <Group justify="space-between" mb="md">
                      <Text fw={700} size="lg">Advance Requests</Text>
                      <ActionIcon variant="light" size="lg" radius="md">
                        <IconDotsVertical size={20} />
                      </ActionIcon>
                    </Group>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Employee</Table.Th>
                          <Table.Th>Amount</Table.Th>
                          <Table.Th>Reason</Table.Th>
                          <Table.Th>Action</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {approvalRequests.advances.map((advance) => (
                          <Table.Tr key={advance.id}>
                            <Table.Td>{advance.name}</Table.Td>
                            <Table.Td>{advance.amount}</Table.Td>
                            <Table.Td>{advance.reason}</Table.Td>
                            <Table.Td>
                              <Group gap={4}>
                                <Button size="xs" color="green">Approve</Button>
                                <Button size="xs" color="red">Reject</Button>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="employees" pt="xl">
            <Grid>
              {/* First Row: New Joinees and Upcoming Exits */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">New Joinees</Text>
                    <Badge variant="light" color="blue">
                      {employeeManagement.newJoinees.length} New
                    </Badge>
                  </Group>
                  <AutoScrollList
                    items={employeeManagement.newJoinees}
                    height={120}
                    renderItem={(employee, index) => (
                      <Paper key={index} p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <Avatar radius="xl" size="sm" color="blue">
                            {employee.avatar}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{employee.name}</Text>
                            <Text size="xs" c="dimmed">{employee.department}</Text>
                          </div>
                          <Text size="xs" c="dimmed">{employee.joinDate}</Text>
                        </Group>
                      </Paper>
                    )}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Upcoming Exits</Text>
                    <Badge variant="light" color="red">
                      {employeeManagement.upcomingExits.length} Notices
                    </Badge>
                  </Group>
                  <AutoScrollList
                    items={employeeManagement.upcomingExits}
                    height={120}
                    renderItem={(employee, index) => (
                      <Paper key={index} p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <Avatar radius="xl" size="sm" color="red">
                            {employee.avatar}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{employee.name}</Text>
                            <Text size="xs" c="dimmed">{employee.department}</Text>
                          </div>
                          <Text size="xs" c="dimmed">{employee.lastDate}</Text>
                        </Group>
                      </Paper>
                    )}
                  />
                </Card>
              </Grid.Col>

              {/* Second Row: Birthdays and Work Anniversaries */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Upcoming Birthdays</Text>
                    <Badge variant="light" color="pink">
                      {employeeEvents.birthdays.length} This Week
                    </Badge>
                  </Group>
                  <AutoScrollList
                    items={employeeEvents.birthdays}
                    height={120}
                    renderItem={(employee, index) => (
                      <Paper key={index} p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <Avatar radius="xl" size="sm" color="pink">
                            {employee.avatar}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{employee.name}</Text>
                            <Text size="xs" c="dimmed">{employee.department}</Text>
                          </div>
                          <Badge size="xs" variant="light" color="pink">
                            {employee.date}
                          </Badge>
                        </Group>
                      </Paper>
                    )}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Work Anniversaries</Text>
                    <Badge variant="light" color="grape">
                      {employeeEvents.workAnniversaries.length} This Week
                    </Badge>
                  </Group>
                  <AutoScrollList
                    items={employeeEvents.workAnniversaries}
                    height={120}
                    renderItem={(employee, index) => (
                      <Paper key={index} p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <Avatar radius="xl" size="sm" color="grape">
                            {employee.avatar}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{employee.name}</Text>
                            <Text size="xs" c="dimmed">{employee.department}</Text>
                          </div>
                          <Group gap={4}>
                            <Badge size="xs" variant="light" color="grape">
                              {employee.years}Y
                            </Badge>
                            <Text size="xs" c="dimmed">{employee.date}</Text>
                          </Group>
                        </Group>
                      </Paper>
                    )}
                  />
                </Card>
              </Grid.Col>

              {/* Third Row: Holidays and Inactive Accounts */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Upcoming Holidays</Text>
                    <Badge variant="light" color="yellow">
                      {employeeEvents.holidays.length} This Month
                    </Badge>
                  </Group>
                  <AutoScrollList
                    items={employeeEvents.holidays}
                    height={120}
                    renderItem={(holiday, index) => (
                      <Paper key={index} p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <ThemeIcon size="sm" radius="md" color="yellow">
                            <IconCalendar size={14} />
                          </ThemeIcon>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{holiday.name}</Text>
                            <Text size="xs" c="dimmed">{holiday.type}</Text>
                          </div>
                          <Badge size="xs" variant="light" color="yellow">
                            {holiday.date}
                          </Badge>
                        </Group>
                      </Paper>
                    )}
                  />
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Inactive Accounts</Text>
                    <Badge variant="light" color="gray">
                      {employeeManagement.inactiveAccounts.length} Accounts
                    </Badge>
                  </Group>
                  <AutoScrollList
                    items={employeeManagement.inactiveAccounts}
                    height={120}
                    renderItem={(employee, index) => (
                      <Paper key={index} p="xs" radius="md" withBorder>
                        <Group gap="xs">
                          <Avatar radius="xl" size="sm" color="gray">
                            {employee.avatar}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>{employee.name}</Text>
                            <Text size="xs" c="dimmed">{employee.department}</Text>
                          </div>
                          <Badge size="xs" color="red" variant="light">
                            {employee.status}
                          </Badge>
                        </Group>
                      </Paper>
                    )}
                  />
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="finance" pt="xl">
            <Grid>
              {/* Monthly Payroll Overview */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Card withBorder padding="lg" radius="md">
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Monthly Payroll Overview</Text>
                    <ActionIcon variant="light" size="lg" radius="md">
                      <IconDotsVertical size={20} />
                    </ActionIcon>
                  </Group>
                  <Stack spacing="md">
                    <Group grow>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Total</Text>
                        <Text fw={700} size="xl">{financeOverview.monthlyPayroll.total}</Text>
                      </Paper>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Processed</Text>
                        <Text fw={700} size="xl" c="green">{financeOverview.monthlyPayroll.processed}</Text>
                      </Paper>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Pending</Text>
                        <Text fw={700} size="xl" c="yellow">{financeOverview.monthlyPayroll.pending}</Text>
                      </Paper>
                    </Group>
                    <Progress
                      value={80}
                      size="xl"
                      radius="xl"
                      label="80%"
                      color="green"
                    />
                  </Stack>
                </Card>
              </Grid.Col>

              {/* Advances & Fines */}
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack spacing="md">
                  <Card withBorder padding="lg" radius="md">
                    <Group justify="space-between" mb="md">
                      <Text fw={700} size="lg">Advance Summary</Text>
                      <ActionIcon variant="light" size="lg" radius="md">
                        <IconDotsVertical size={20} />
                      </ActionIcon>
                    </Group>
                    <Group grow>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Total</Text>
                        <Text fw={700} size="xl">{financeOverview.advances.total}</Text>
                      </Paper>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Pending</Text>
                        <Text fw={700} size="xl" c="yellow">{financeOverview.advances.pending}</Text>
                      </Paper>
                    </Group>
                  </Card>

                  <Card withBorder padding="lg" radius="md">
                    <Group justify="space-between" mb="md">
                      <Text fw={700} size="lg">Fine Collection</Text>
                      <ActionIcon variant="light" size="lg" radius="md">
                        <IconDotsVertical size={20} />
                      </ActionIcon>
                    </Group>
                    <Group grow>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Total</Text>
                        <Text fw={700} size="xl">{financeOverview.fines.total}</Text>
                      </Paper>
                      <Paper p="md" radius="md" withBorder>
                        <Text size="xs" c="dimmed">Collected</Text>
                        <Text fw={700} size="xl" c="green">{financeOverview.fines.collected}</Text>
                      </Paper>
                    </Group>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>

        {/* Quick Actions */}
        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">Quick Actions</Text>
          </Group>
          <Group>
            <Button
              leftSection={<IconUserPlus size={16} />}
              variant="light"
              color="blue"
              radius="md"
            >
              Add New Employee
            </Button>
            <Button
              leftSection={<IconCalendar size={16} />}
              variant="light"
              color="green"
              radius="md"
            >
              Set Holidays
            </Button>
            <Button
              leftSection={<IconReceipt size={16} />}
              variant="light"
              color="grape"
              radius="md"
            >
              Generate Payslips
            </Button>
            <Button
              leftSection={<IconMessage size={16} />}
              variant="light"
              color="orange"
              radius="md"
            >
              Send Notifications
            </Button>
          </Group>
        </Card>
      </Stack>
    </Paper>
  );
};

export default Dashboard;