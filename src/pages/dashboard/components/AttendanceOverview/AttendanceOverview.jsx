import { Paper, Title, Text, Group, SimpleGrid } from '@mantine/core';
import { IconUserCheck, IconUserExclamation, IconUserOff } from '@tabler/icons-react';
import { LineChart } from '@mantine/charts';
import classes from './AttendanceOverview.module.css';

const summaryData = [
  { title: 'Present Today', value: '188', icon: IconUserCheck, color: 'teal' },
  { title: 'Late Entries', value: '10', icon: IconUserExclamation, color: 'yellow' },
  { title: 'Absent', value: '12', icon: IconUserOff, color: 'red' },
];

const chartData = [
  { date: '2024-01-01', present: 180, absent: 20, late: 15 },
  { date: '2024-01-02', present: 190, absent: 15, late: 10 },
  { date: '2024-01-03', present: 185, absent: 18, late: 12 },
  { date: '2024-01-04', present: 182, absent: 22, late: 11 },
  { date: '2024-01-05', present: 188, absent: 17, late: 10 },
];

export default function AttendanceOverview() {
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
      <Title order={2} size="h3" mb="md">Attendance Overview</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
        {stats}
      </SimpleGrid>

      <Paper withBorder p="md" radius="md">
        <Title order={3} size="h4" mb="md">Weekly Trend</Title>
        <LineChart
          h={300}
          data={chartData}
          dataKey="date"
          series={[
            { name: 'present', color: 'teal' },
            { name: 'absent', color: 'red' },
            { name: 'late', color: 'yellow' },
          ]}
          tickLine="y"
        />
      </Paper>
    </Paper>
  );
} 