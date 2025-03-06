import { Paper, Title, Group, Text } from '@mantine/core';
import { IconUsers, IconUserPlus, IconChartPie } from '@tabler/icons-react';
import { PieChart } from '@mantine/charts';
import classes from './EmployeeStats.module.css';

const departmentData = [
  { name: 'IT', value: 45, color: 'blue' },
  { name: 'HR', value: 15, color: 'teal' },
  { name: 'Finance', value: 20, color: 'violet' },
  { name: 'Marketing', value: 25, color: 'orange' },
  { name: 'Operations', value: 35, color: 'cyan' },
];

const genderData = [
  { name: 'Male', value: 65, color: 'blue' },
  { name: 'Female', value: 35, color: 'pink' },
];

const tenureData = [
  { name: '<1 year', value: 30, color: 'yellow' },
  { name: '1-3 years', value: 45, color: 'orange' },
  { name: '>3 years', value: 25, color: 'red' },
];

export default function EmployeeStats() {
  return (
    <Paper withBorder p="md" radius="md">
      <Title order={2} size="h3" mb="md">Employee Statistics</Title>

      <Group grow align="stretch" mb="md">
        {/* Department Distribution */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Department Distribution</Text>
            <IconChartPie size="1.2rem" className={classes.icon} />
          </Group>
          <PieChart
            data={departmentData}
            size={200}
            tooltipDataSource="segment"
          />
        </Paper>

        {/* Gender Ratio */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Gender Ratio</Text>
            <IconUsers size="1.2rem" className={classes.icon} />
          </Group>
          <PieChart
            data={genderData}
            size={200}
            tooltipDataSource="segment"
          />
        </Paper>

        {/* Tenure Distribution */}
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Tenure Distribution</Text>
            <IconUserPlus size="1.2rem" className={classes.icon} />
          </Group>
          <PieChart
            data={tenureData}
            size={200}
            tooltipDataSource="segment"
          />
        </Paper>
      </Group>

      {/* Summary Stats */}
      <Group grow>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" className={classes.title}>Total Employees</Text>
          <Text className={classes.value} mt={25}>140</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" className={classes.title}>New This Month</Text>
          <Text className={classes.value} mt={25}>12</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" className={classes.title}>Turnover Rate</Text>
          <Text className={classes.value} mt={25}>2.4%</Text>
        </Paper>
      </Group>
    </Paper>
  );
} 