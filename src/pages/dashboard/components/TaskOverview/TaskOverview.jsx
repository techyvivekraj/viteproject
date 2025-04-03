import { Grid, Paper, Text, Group, Stack, Divider, Button, Badge, Progress, Card, ActionIcon, Table } from '@mantine/core';
import { IconClipboardList, IconPlus, IconCheck, IconClock, IconAlertCircle, IconEdit } from '@tabler/icons-react';

const TaskOverview = () => {
  // Mock data - replace with actual data from your backend
  const taskData = {
    summary: {
      total: 25,
      completed: 18,
      inProgress: 5,
      pending: 2,
      overdue: 1
    },
    projects: [
      {
        name: 'HRMS Dashboard',
        progress: 85,
        tasks: 12,
        completed: 10,
        deadline: '2024-04-15'
      },
      {
        name: 'Employee Portal',
        progress: 60,
        tasks: 8,
        completed: 5,
        deadline: '2024-05-01'
      },
      {
        name: 'Payroll System',
        progress: 30,
        tasks: 5,
        completed: 2,
        deadline: '2024-06-15'
      }
    ],
    recentTasks: [
      {
        title: 'Implement Leave Management',
        project: 'HRMS Dashboard',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2024-03-25'
      },
      {
        title: 'Design User Interface',
        project: 'Employee Portal',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '2024-03-28'
      },
      {
        title: 'Database Schema Update',
        project: 'Payroll System',
        priority: 'High',
        status: 'Completed',
        dueDate: '2024-03-20'
      }
    ],
    upcomingDeadlines: [
      {
        title: 'HRMS Dashboard Completion',
        date: '2024-04-15',
        type: 'Project'
      },
      {
        title: 'Employee Portal Beta',
        date: '2024-05-01',
        type: 'Project'
      },
      {
        title: 'Leave Management Module',
        date: '2024-03-25',
        type: 'Task'
      }
    ]
  };

  return (
    <Grid gutter="md">
      {/* Task Summary */}
      <Grid.Col span={12}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Task Summary</Text>
              <Button variant="light" size="sm" leftIcon={<IconPlus size={14} />}>
                New Task
              </Button>
            </Group>
            <Divider />
            <Grid>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600}>{taskData.summary.total}</Text>
                  <Text size="sm" c="dimmed">Total Tasks</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600} color="green">{taskData.summary.completed}</Text>
                  <Text size="sm" c="dimmed">Completed</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600} color="yellow">{taskData.summary.inProgress}</Text>
                  <Text size="sm" c="dimmed">In Progress</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6} md={3}>
                <Stack spacing="xs" align="center">
                  <Text size="xl" fw={600} color="red">{taskData.summary.overdue}</Text>
                  <Text size="sm" c="dimmed">Overdue</Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Projects */}
      <Grid.Col span={12} md={8}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Active Projects</Text>
              <Button variant="light" size="xs" leftIcon={<IconPlus size={14} />}>
                New Project
              </Button>
            </Group>
            <Divider />
            <Stack spacing="md">
              {taskData.projects.map((project, index) => (
                <Card key={index} withBorder>
                  <Stack spacing="xs">
                    <Group position="apart">
                      <Text size="sm" fw={500}>{project.name}</Text>
                      <Badge color="blue">{project.deadline}</Badge>
                    </Group>
                    <Progress value={project.progress} color="blue" />
                    <Group position="apart">
                      <Text size="xs" c="dimmed">
                        {project.completed}/{project.tasks} tasks completed
                      </Text>
                      <Text size="xs" fw={500}>{project.progress}%</Text>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Recent Tasks and Deadlines */}
      <Grid.Col span={12} md={4}>
        <Stack spacing="md">
          {/* Recent Tasks */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Recent Tasks</Text>
                <IconClipboardList size={20} color="var(--mantine-color-blue-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {taskData.recentTasks.map((task, index) => (
                  <Card key={index} withBorder>
                    <Stack spacing="xs">
                      <Group position="apart">
                        <Text size="sm" fw={500}>{task.title}</Text>
                        <Badge 
                          color={
                            task.status === 'Completed' ? 'green' : 
                            task.status === 'In Progress' ? 'blue' : 'yellow'
                          }
                        >
                          {task.status}
                        </Badge>
                      </Group>
                      <Text size="xs" c="dimmed">{task.project}</Text>
                      <Group position="apart">
                        <Text size="xs" c="dimmed">Due: {task.dueDate}</Text>
                        <Badge color="red" variant="light">{task.priority}</Badge>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Upcoming Deadlines */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Upcoming Deadlines</Text>
                <IconClock size={20} color="var(--mantine-color-orange-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {taskData.upcomingDeadlines.map((deadline, index) => (
                  <Card key={index} withBorder>
                    <Stack spacing="xs">
                      <Text size="sm" fw={500}>{deadline.title}</Text>
                      <Group position="apart">
                        <Text size="xs" c="dimmed">{deadline.type}</Text>
                        <Text size="xs" fw={500}>{deadline.date}</Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default TaskOverview; 