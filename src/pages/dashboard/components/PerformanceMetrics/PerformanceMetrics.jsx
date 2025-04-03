import { Grid, Paper, Text, Group, Stack, Divider, Button, Badge, Progress, RingProgress, Card, ActionIcon } from '@mantine/core';
import { IconTrophy, IconTargetArrow, IconStar, IconChartBar, IconAward, IconEdit } from '@tabler/icons-react';

const PerformanceMetrics = () => {
  // Mock data - replace with actual data from your backend
  const performanceData = {
    overallRating: 4.5,
    lastReview: '2023-12-15',
    nextReview: '2024-06-15',
    kpis: [
      { name: 'Project Completion', target: 90, current: 85, unit: '%' },
      { name: 'Code Quality', target: 95, current: 92, unit: '%' },
      { name: 'Team Collaboration', target: 85, current: 88, unit: '%' },
      { name: 'Client Satisfaction', target: 90, current: 95, unit: '%' }
    ],
    goals: [
      { title: 'Complete Advanced React Course', deadline: '2024-04-30', progress: 60 },
      { title: 'Lead 2 Major Projects', deadline: '2024-06-30', progress: 30 },
      { title: 'Mentor Junior Developers', deadline: '2024-12-31', progress: 20 }
    ],
    achievements: [
      { title: 'Employee of the Month', date: '2024-02-15', description: 'Outstanding performance in Q1' },
      { title: 'Best Team Player', date: '2024-01-20', description: 'Recognized for exceptional collaboration' },
      { title: 'Innovation Award', date: '2023-12-10', description: 'Introduced new development practices' }
    ],
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'AWS', level: 75 }
    ]
  };

  return (
    <Grid gutter="md">
      {/* Overall Performance */}
      <Grid.Col span={12} md={4}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md" align="center">
            <Group position="apart" w="100%">
              <Text size="lg" fw={600}>Overall Performance</Text>
              <IconStar size={20} color="var(--mantine-color-yellow-6)" />
            </Group>
            <Divider w="100%" />
            <RingProgress
              size={160}
              thickness={16}
              roundCaps
              sections={[{ value: performanceData.overallRating * 20, color: 'blue' }]}
            />
            <Text size="xl" fw={600}>{performanceData.overallRating}/5</Text>
            <Stack spacing="xs" align="center">
              <Text size="sm" c="dimmed">Last Review</Text>
              <Text size="sm">{performanceData.lastReview}</Text>
            </Stack>
            <Button variant="light" fullWidth>Schedule Review</Button>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* KPIs */}
      <Grid.Col span={12} md={8}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Key Performance Indicators</Text>
              <IconTargetArrow size={20} color="var(--mantine-color-blue-6)" />
            </Group>
            <Divider />
            <Grid>
              {performanceData.kpis.map((kpi, index) => (
                <Grid.Col key={index} span={6}>
                  <Stack spacing="xs">
                    <Text size="sm" fw={500}>{kpi.name}</Text>
                    <Progress 
                      value={(kpi.current / kpi.target) * 100} 
                      color={kpi.current >= kpi.target ? 'green' : 'blue'} 
                    />
                    <Group position="apart">
                      <Text size="sm">{kpi.current}{kpi.unit}</Text>
                      <Text size="sm" c="dimmed">Target: {kpi.target}{kpi.unit}</Text>
                    </Group>
                  </Stack>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Goals */}
      <Grid.Col span={12} md={6}>
        <Paper p="md" radius="sm" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" fw={600}>Goals</Text>
              <Button variant="light" size="xs" leftIcon={<IconEdit size={14} />}>
                Edit Goals
              </Button>
            </Group>
            <Divider />
            <Stack spacing="md">
              {performanceData.goals.map((goal, index) => (
                <Card key={index} withBorder>
                  <Stack spacing="xs">
                    <Group position="apart">
                      <Text size="sm" fw={500}>{goal.title}</Text>
                      <Badge color="blue">{goal.deadline}</Badge>
                    </Group>
                    <Progress value={goal.progress} color="blue" />
                    <Text size="xs" c="dimmed">{goal.progress}% Complete</Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>

      {/* Achievements and Skills */}
      <Grid.Col span={12} md={6}>
        <Stack spacing="md">
          {/* Achievements */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Achievements</Text>
                <IconTrophy size={20} color="var(--mantine-color-yellow-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {performanceData.achievements.map((achievement, index) => (
                  <Card key={index} withBorder>
                    <Stack spacing="xs">
                      <Text size="sm" fw={500}>{achievement.title}</Text>
                      <Text size="xs" c="dimmed">{achievement.date}</Text>
                      <Text size="xs">{achievement.description}</Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Paper>

          {/* Skills */}
          <Paper p="md" radius="sm" withBorder>
            <Stack spacing="md">
              <Group position="apart">
                <Text size="lg" fw={600}>Skills</Text>
                <IconChartBar size={20} color="var(--mantine-color-violet-6)" />
              </Group>
              <Divider />
              <Stack spacing="md">
                {performanceData.skills.map((skill, index) => (
                  <Stack key={index} spacing="xs">
                    <Group position="apart">
                      <Text size="sm">{skill.name}</Text>
                      <Text size="sm" fw={500}>{skill.level}%</Text>
                    </Group>
                    <Progress value={skill.level} color="violet" />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default PerformanceMetrics; 