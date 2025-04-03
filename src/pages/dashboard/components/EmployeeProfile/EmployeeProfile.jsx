import { Grid, Paper, Text, Group, Avatar, Stack, Badge, Divider, Button, Progress } from '@mantine/core';
import { IconCalendar, IconTrophy, IconStar, IconClock, IconUserCheck } from '@tabler/icons-react';

const EmployeeProfile = () => {
  // Mock data - replace with actual data from your backend
  const employeeData = {
    name: 'John Doe',
    id: 'EMP001',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    email: 'john.doe@company.com',
    phone: '+1 234 567 8900',
    joinDate: '2020-03-15',
    performance: {
      rating: 4.5,
      lastReview: '2023-12-15',
      nextReview: '2024-06-15',
    },
    attendance: {
      present: 95,
      late: 3,
      absent: 2,
    },
    upcomingEvents: [
      { type: 'birthday', date: '2024-04-15', title: 'Birthday' },
      { type: 'anniversary', date: '2024-03-15', title: 'Work Anniversary' },
      { type: 'review', date: '2024-06-15', title: 'Performance Review' },
    ],
  };

  return (
    <Grid gutter="md">
      {/* Employee Basic Information */}
      <Grid.Col span={12} md={4}>
        <Paper p="md" radius="sm" withBorder>
          <Stack align="center" spacing="md">
            <Avatar size={120} radius="xl" color="blue" />
            <Stack spacing={0} align="center">
              <Text size="xl" fw={600}>{employeeData.name}</Text>
              <Text size="sm" c="dimmed">{employeeData.position}</Text>
            </Stack>
            <Group spacing="xs">
              <Badge color="blue">{employeeData.department}</Badge>
              <Badge color="gray">{employeeData.id}</Badge>
            </Group>
            <Stack spacing="xs" w="100%">
              <Text size="sm" c="dimmed">Contact Information</Text>
              <Text size="sm">{employeeData.email}</Text>
              <Text size="sm">{employeeData.phone}</Text>
            </Stack>
            <Button variant="light" fullWidth>Edit Profile</Button>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Performance Metrics */}
      <Grid.Col span={12} md={8}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Performance Overview</Text>
              <Group spacing="xs">
                <IconStar size={16} color="var(--mantine-color-yellow-6)" />
                <Text fw={600}>{employeeData.performance.rating}/5</Text>
              </Group>
            </Group>
            <Divider />
            <Grid>
              <Grid.Col span={6}>
                <Stack spacing="xs">
                  <Text size="sm" c="dimmed">Last Review</Text>
                  <Text>{employeeData.performance.lastReview}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack spacing="xs">
                  <Text size="sm" c="dimmed">Next Review</Text>
                  <Text>{employeeData.performance.nextReview}</Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Attendance Summary */}
      <Grid.Col span={12} md={6}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Attendance Summary</Text>
              <IconUserCheck size={20} color="var(--mantine-color-green-6)" />
            </Group>
            <Divider />
            <Stack spacing="xs">
              <Group position="apart">
                <Text size="sm">Present</Text>
                <Text fw={600}>{employeeData.attendance.present}%</Text>
              </Group>
              <Progress value={employeeData.attendance.present} color="green" />
              <Group position="apart">
                <Text size="sm">Late</Text>
                <Text fw={600}>{employeeData.attendance.late}%</Text>
              </Group>
              <Progress value={employeeData.attendance.late} color="yellow" />
              <Group position="apart">
                <Text size="sm">Absent</Text>
                <Text fw={600}>{employeeData.attendance.absent}%</Text>
              </Group>
              <Progress value={employeeData.attendance.absent} color="red" />
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Upcoming Events */}
      <Grid.Col span={12} md={6}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Upcoming Events</Text>
              <IconCalendar size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Divider />
            <Stack spacing="md">
              {employeeData.upcomingEvents.map((event, index) => (
                <Group key={index} position="apart">
                  <Stack spacing={0}>
                    <Text size="sm" fw={500}>{event.title}</Text>
                    <Text size="xs" c="dimmed">{event.date}</Text>
                  </Stack>
                  <IconTrophy size={16} color="var(--mantine-color-blue-6)" />
                </Group>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default EmployeeProfile; 