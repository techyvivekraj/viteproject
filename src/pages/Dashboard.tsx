import { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Text, 
  Title, 
  Group, 
  RingProgress, 
  Stack, 
  Button, 
  Badge, 
  Tabs, 
  ActionIcon, 
  Avatar, 
  Progress,
  useMantineTheme,
} from '@mantine/core';
import { 
  Users, 
  Building2, 
  UserCircle, 
  Clock, 
  Calendar, 
  Bell, 
  Download, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

type StatItem = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
};

type ActivityItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: string;
  avatar: string;
};

type QuickStatItem = {
  title: string;
  value: string;
  status: 'normal' | 'warning' | 'danger';
};

type DepartmentStatItem = {
  name: string;
  employees: number;
  growth: number;
  color: string;
};

const stats: StatItem[] = [
  {
    title: 'Total Employees',
    value: '234',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'blue',
    progress: 75,
  },
  {
    title: 'Departments',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: Building2,
    color: 'teal',
    progress: 84,
  },
  {
    title: 'Active Roles',
    value: '15',
    change: '-3',
    trend: 'down',
    icon: UserCircle,
    color: 'violet',
    progress: 62,
  },
  {
    title: 'Attendance Rate',
    value: '95%',
    change: '+5%',
    trend: 'up',
    icon: Clock,
    color: 'green',
    progress: 95,
  },
];

const recentActivities: ActivityItem[] = [
  {
    id: 1,
    title: 'New employee onboarded',
    description: 'John Doe joined the Marketing team',
    time: '2 hours ago',
    type: 'onboarding',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    title: 'Leave request approved',
    description: 'Sarah Smith\'s vacation request was approved',
    time: '5 hours ago',
    type: 'leave',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    title: 'Performance review completed',
    description: 'Quarterly review for the Development team',
    time: '1 day ago',
    type: 'review',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    title: 'New department created',
    description: 'Customer Success team established',
    time: '2 days ago',
    type: 'department',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    title: 'Training session scheduled',
    description: 'Leadership training for managers',
    time: '3 days ago',
    type: 'training',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

const quickStats: QuickStatItem[] = [
  { title: 'Total Leave Requests', value: '12', status: 'normal' },
  { title: 'Pending Approvals', value: '5', status: 'warning' },
  { title: 'Upcoming Reviews', value: '8', status: 'normal' },
  { title: 'Open Positions', value: '3', status: 'normal' },
  { title: 'Training Programs', value: '4', status: 'normal' },
];

const departmentStats: DepartmentStatItem[] = [
  { name: 'Engineering', employees: 85, growth: 12, color: 'blue' },
  { name: 'Marketing', employees: 42, growth: 8, color: 'teal' },
  { name: 'Sales', employees: 65, growth: 15, color: 'violet' },
  { name: 'HR', employees: 18, growth: 5, color: 'green' },
  { name: 'Finance', employees: 24, growth: 3, color: 'orange' },
];

export default function Dashboard() {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const getStatusIcon = (status: QuickStatItem['status']) => {
    switch (status) {
      case 'warning': return <AlertCircle size={16} color={theme.colors.orange[6]} />;
      case 'danger': return <XCircle size={16} color={theme.colors.red[6]} />;
      default: return <CheckCircle size={16} color={theme.colors.green[6]} />;
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={2}>Dashboard Overview</Title>
        <Group>
          <Button 
            variant="light" 
            leftSection={<Filter size={16} />}
            size="sm"
          >
            Filter
          </Button>
          <Button 
            variant="light" 
            leftSection={<Download size={16} />}
            size="sm"
          >
            Export
          </Button>
        </Group>
      </Group>

      <Grid>
        {stats.map((stat) => (
          <Grid.Col key={stat.title} span={{ base: 12, sm: 6, md: 3 }}>
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="xs" c="dimmed">
                    {stat.title}
                  </Text>
                  <Group gap={4} align="center">
                    <Text size="xl" fw={700}>
                      {stat.value}
                    </Text>
                    <Badge 
                      size="sm" 
                      color={stat.trend === 'up' ? 'green' : 'red'}
                      variant="light"
                    >
                      {stat.change}
                    </Badge>
                  </Group>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: stat.progress, color: stat.color }]}
                  label={
                    <stat.icon
                      size={20}
                      style={{ color: `var(--mantine-color-${stat.color}-filled)` }}
                    />
                  }
                />
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<Users size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="employees" leftSection={<UserCircle size={16} />}>
            Employees
          </Tabs.Tab>
          <Tabs.Tab value="departments" leftSection={<Building2 size={16} />}>
            Departments
          </Tabs.Tab>
          <Tabs.Tab value="calendar" leftSection={<Calendar size={16} />}>
            Calendar
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md">
                  <Title order={3}>Recent Activities</Title>
                  <ActionIcon variant="light" size="sm">
                    <MoreVertical size={16} />
                  </ActionIcon>
                </Group>
                <Stack gap="xs">
                  {recentActivities.map((activity) => (
                    <Paper key={activity.id} withBorder p="sm" radius="sm">
                      <Group>
                        <Avatar src={activity.avatar} radius="xl" size="sm" />
                        <div style={{ flex: 1 }}>
                          <Group justify="space-between" wrap="nowrap">
                            <Text size="sm" fw={500}>{activity.title}</Text>
                            <Text size="xs" c="dimmed">{activity.time}</Text>
                          </Group>
                          <Text size="xs" c="dimmed">{activity.description}</Text>
                        </div>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
                <Button 
                  variant="subtle" 
                  fullWidth 
                  mt="md"
                  rightSection={<ArrowUpRight size={16} />}
                >
                  View all activities
                </Button>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Paper withBorder p="md" radius="md">
                  <Group justify="space-between" mb="md">
                    <Title order={3}>Quick Stats</Title>
                    <ActionIcon variant="light" size="sm">
                      <Bell size={16} />
                    </ActionIcon>
                  </Group>
                  <Stack gap="md">
                    {quickStats.map((stat) => (
                      <Group key={stat.title} justify="space-between">
                        <Group gap="xs">
                          {getStatusIcon(stat.status)}
                          <Text size="sm">{stat.title}</Text>
                        </Group>
                        <Text fw={500}>{stat.value}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Paper>

                <Paper withBorder p="md" radius="md">
                  <Title order={3} mb="md">Department Growth</Title>
                  <Stack gap="md">
                    {departmentStats.map((dept) => (
                      <div key={dept.name}>
                        <Group justify="space-between" mb={4}>
                          <Text size="sm">{dept.name}</Text>
                          <Group gap={4}>
                            <Text size="sm" fw={500}>{dept.employees}</Text>
                            <Badge 
                              size="xs" 
                              color={dept.growth > 10 ? 'green' : 'blue'}
                              variant="light"
                            >
                              +{dept.growth}%
                            </Badge>
                          </Group>
                        </Group>
                        <Progress 
                          value={(dept.employees / 100) * 100} 
                          color={dept.color} 
                          size="sm" 
                          radius="xl"
                        />
                      </div>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="employees" pt="md">
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="md">Employee Overview</Title>
            <Text c="dimmed">Employee management content will go here</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="departments" pt="md">
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="md">Department Overview</Title>
            <Text c="dimmed">Department management content will go here</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="calendar" pt="md">
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="md">Calendar Overview</Title>
            <Text c="dimmed">Calendar and scheduling content will go here</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}