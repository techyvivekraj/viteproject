import { Grid, Paper, Text, Group, Stack, Divider, Button, Badge, Progress, ActionIcon, Table } from '@mantine/core';
import { IconCalendar, IconClock, IconCalendarTime, IconPlus, IconCheck, IconX, IconClockHour4 } from '@tabler/icons-react';

const AttendanceLeave = () => {
  // Mock data - replace with actual data from your backend
  const attendanceData = {
    currentMonth: 'March 2024',
    attendance: {
      present: 18,
      late: 2,
      absent: 1,
      total: 21,
      overtime: 15
    },
    leaveBalance: {
      total: 20,
      used: 8,
      remaining: 12,
      types: {
        annual: { total: 10, used: 4, remaining: 6 },
        sick: { total: 5, used: 2, remaining: 3 },
        personal: { total: 5, used: 2, remaining: 3 }
      }
    },
    recentLeaveRequests: [
      { type: 'Annual', startDate: '2024-03-25', endDate: '2024-03-28', status: 'Pending' },
      { type: 'Sick', startDate: '2024-03-15', endDate: '2024-03-16', status: 'Approved' },
      { type: 'Personal', startDate: '2024-03-10', endDate: '2024-03-10', status: 'Rejected' }
    ],
    upcomingHolidays: [
      { date: '2024-04-01', name: 'April Fools Day' },
      { date: '2024-04-15', name: 'Tax Day' },
      { date: '2024-05-27', name: 'Memorial Day' }
    ]
  };

  return (
    <Grid gutter="md">
      {/* Attendance Overview */}
      <Grid.Col span={12} md={8}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Attendance Overview</Text>
              <Badge color="blue">{attendanceData.currentMonth}</Badge>
            </Group>
            <Divider />
            
            {/* Attendance Stats */}
            <Grid>
              <Grid.Col span={6}>
                <Stack spacing="xs">
                  <Text size="sm" c="dimmed">Present Days</Text>
                  <Text fw={600} color="green">{attendanceData.attendance.present}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack spacing="xs">
                  <Text size="sm" c="dimmed">Late Days</Text>
                  <Text fw={600} color="yellow">{attendanceData.attendance.late}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack spacing="xs">
                  <Text size="sm" c="dimmed">Absent Days</Text>
                  <Text fw={600} color="red">{attendanceData.attendance.absent}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack spacing="xs">
                  <Text size="sm" c="dimmed">Overtime Hours</Text>
                  <Text fw={600} color="blue">{attendanceData.attendance.overtime}</Text>
                </Stack>
              </Grid.Col>
            </Grid>

            {/* Leave Balance */}
            <Stack spacing="md">
              <Group position="apart">
                <Text size="sm" fw={500}>Leave Balance</Text>
                <Button variant="light" size="xs" leftIcon={<IconPlus size={14} />}>
                  Apply Leave
                </Button>
              </Group>
              <Progress 
                value={(attendanceData.leaveBalance.used / attendanceData.leaveBalance.total) * 100} 
                color="blue" 
              />
              <Group position="apart">
                <Text size="sm">Used: {attendanceData.leaveBalance.used} days</Text>
                <Text size="sm">Remaining: {attendanceData.leaveBalance.remaining} days</Text>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Leave Requests and Holidays */}
      <Grid.Col span={12} md={4}>
        <Stack spacing="md">
          {/* Recent Leave Requests */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Leave Requests</Text>
                <IconCalendar size={20} color="var(--mantine-color-blue-6)" />
              </Group>
              <Divider />
              <Table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.recentLeaveRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.type}</td>
                      <td>{request.startDate}</td>
                      <td>
                        <Badge 
                          color={
                            request.status === 'Approved' ? 'green' : 
                            request.status === 'Rejected' ? 'red' : 'yellow'
                          }
                        >
                          {request.status}
                        </Badge>
                      </td>
                      <td>
                        <Group spacing="xs">
                          <ActionIcon color="green" variant="light">
                            <IconCheck size={16} />
                          </ActionIcon>
                          <ActionIcon color="red" variant="light">
                            <IconX size={16} />
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Paper>

          {/* Upcoming Holidays */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Upcoming Holidays</Text>
                <IconCalendarTime size={20} color="var(--mantine-color-violet-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {attendanceData.upcomingHolidays.map((holiday, index) => (
                  <Group key={index} position="apart">
                    <Stack spacing={0}>
                      <Text size="sm" fw={500}>{holiday.name}</Text>
                      <Text size="xs" c="dimmed">{holiday.date}</Text>
                    </Stack>
                    <IconClockHour4 size={16} color="var(--mantine-color-violet-6)" />
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default AttendanceLeave; 