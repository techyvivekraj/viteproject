import { Paper, Title, Tabs, Text, Group, Badge, ActionIcon, Progress, Avatar } from '@mantine/core';
import { IconPlus, IconDotsVertical, IconFlag } from '@tabler/icons-react';
import classes from './TaskManagement.module.css';

const tasks = [
  {
    id: 1,
    title: 'Monthly Performance Review',
    priority: 'high',
    progress: 75,
    dueDate: '2024-01-25',
    department: 'HR',
    assignee: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: 2,
    title: 'Payroll Processing',
    priority: 'urgent',
    progress: 30,
    dueDate: '2024-01-23',
    department: 'Finance',
    assignee: {
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  },
  {
    id: 3,
    title: 'New Employee Onboarding',
    priority: 'medium',
    progress: 50,
    dueDate: '2024-01-28',
    department: 'HR',
    assignee: {
      name: 'Mike Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  }
];

const priorityColors = {
  low: 'blue',
  medium: 'yellow',
  high: 'orange',
  urgent: 'red'
};

export default function TaskManagement() {
  const taskItems = tasks.map((task) => (
    <Paper withBorder p="md" radius="md" key={task.id} className={classes.task}>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>{task.title}</Text>
        <ActionIcon variant="subtle" color="gray">
          <IconDotsVertical size="1rem" />
        </ActionIcon>
      </Group>

      <Group justify="space-between" mb="md">
        <Badge 
          color={priorityColors[task.priority]} 
          variant="light"
          leftSection={<IconFlag size="0.8rem" />}
        >
          {task.priority}
        </Badge>
        <Text size="xs" c="dimmed">Due: {task.dueDate}</Text>
      </Group>

      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed">Progress</Text>
        <Text size="xs" c="dimmed">{task.progress}%</Text>
      </Group>
      <Progress 
        value={task.progress} 
        size="sm" 
        color={task.progress > 80 ? 'teal' : task.progress > 40 ? 'blue' : 'orange'} 
      />

      <Group justify="space-between" mt="md">
        <Text size="xs" c="dimmed">{task.department}</Text>
        <Avatar
          src={task.assignee.avatar}
          size="sm"
          radius="xl"
          title={task.assignee.name}
        />
      </Group>
    </Paper>
  ));

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="md">
        <Title order={2} size="h3">Task Management</Title>
        <ActionIcon variant="light" color="blue">
          <IconPlus size="1.1rem" />
        </ActionIcon>
      </Group>

      <Tabs defaultValue="active">
        <Tabs.List>
          <Tabs.Tab value="active">Active Tasks</Tabs.Tab>
          <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="active" pt="md">
          <div className={classes.taskGrid}>
            {taskItems}
          </div>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
} 