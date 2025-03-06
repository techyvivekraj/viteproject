import { Paper, Title, Text, Group, Button, Progress, SimpleGrid } from '@mantine/core';
import { IconDownload, IconReportMoney, IconChartBar, IconUsers } from '@tabler/icons-react';
import classes from './PayrollSummary.module.css';

const summaryData = [
  { 
    title: 'Total Payroll', 
    value: '$145,678', 
    icon: IconReportMoney,
    color: 'blue' 
  },
  { 
    title: 'Processed', 
    value: '$98,432', 
    icon: IconChartBar,
    color: 'teal' 
  },
  { 
    title: 'Pending', 
    value: '$47,246', 
    icon: IconUsers,
    color: 'orange' 
  },
];

export default function PayrollSummary() {
  const stats = summaryData.map((stat) => {
    const Icon = stat.icon;
    
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} color={stat.color} />
        </Group>
        <Text className={classes.value} mt={25}>
          {stat.value}
        </Text>
      </Paper>
    );
  });

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <Title order={2} size="h3">Payroll Summary</Title>
        <Button 
          leftSection={<IconDownload size="1rem" />} 
          variant="light"
          color="blue"
        >
          Generate Payroll
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
        {stats}
      </SimpleGrid>

      <Text size="sm" fw={500} mb="xs">Processing Status</Text>
      <Progress 
        value={67} 
        size="lg" 
        radius="xl" 
        color="blue"
        striped
        animated
      />
      <Text size="xs" c="dimmed" mt="sm">
        67% of payroll has been processed for this month
      </Text>
    </Paper>
  );
} 