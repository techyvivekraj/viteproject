import { Paper, Title, Group, Text, RingProgress, Stack, Badge } from '@mantine/core';
// import classes from './RecruitmentPipeline.module.css';

const pipelineData = {
  stages: [
    { name: 'Applied', count: 125, color: 'blue' },
    { name: 'Screening', count: 45, color: 'cyan' },
    { name: 'Interview', count: 20, color: 'indigo' },
    { name: 'Offer', count: 8, color: 'violet' },
    { name: 'Hired', count: 5, color: 'green' },
  ],
  openPositions: [
    { title: 'Senior Developer', department: 'IT', applications: 45 },
    { title: 'HR Manager', department: 'HR', applications: 32 },
    { title: 'Sales Executive', department: 'Sales', applications: 28 },
  ]
};

export default function RecruitmentPipeline() {
  const total = pipelineData.stages.reduce((acc, stage) => acc + stage.count, 0);
  const sections = pipelineData.stages.map(stage => ({
    value: (stage.count / total) * 100,
    color: stage.color
  }));

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={2} size="h3" mb="md">Recruitment Pipeline</Title>

      <Group align="flex-start">
        <RingProgress
          size={140}
          thickness={14}
          sections={sections}
          label={
            <Stack align="center" spacing={0}>
              <Text ta="center" fz="lg" fw={700}>{total}</Text>
              <Text ta="center" fz="xs" c="dimmed">Total</Text>
            </Stack>
          }
        />

        <Stack spacing="xs" style={{ flex: 1 }}>
          {pipelineData.stages.map((stage) => (
            <Group key={stage.name} position="apart">
              <Text size="sm">{stage.name}</Text>
              <Badge color={stage.color}>{stage.count}</Badge>
            </Group>
          ))}
        </Stack>
      </Group>

      <Title order={3} size="h4" mt="xl" mb="md">Open Positions</Title>
      <Stack spacing="xs">
        {pipelineData.openPositions.map((position) => (
          <Paper withBorder p="xs" radius="md" key={position.title}>
            <Group position="apart">
              <div>
                <Text size="sm" fw={500}>{position.title}</Text>
                <Text size="xs" c="dimmed">{position.department}</Text>
              </div>
              <Badge>{position.applications} applications</Badge>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
} 