import { Paper, Title, Group, Text, Progress, SimpleGrid } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import classes from './BudgetOverview.module.css';

const budgetData = {
  departments: [
    { name: 'HR', allocated: 100000, spent: 65000, trend: 'up' },
    { name: 'IT', allocated: 150000, spent: 120000, trend: 'down' },
    { name: 'Operations', allocated: 200000, spent: 160000, trend: 'up' },
  ],
  totalBudget: 450000,
  totalSpent: 345000
};

export default function BudgetOverview() {
  const totalProgress = (budgetData.totalSpent / budgetData.totalBudget) * 100;

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={2} size="h3" mb="md">Budget Overview</Title>

      <Group mb="md">
        <div style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Total Budget</Text>
          <Text fw={700} size="lg">${budgetData.totalBudget.toLocaleString()}</Text>
        </div>
        <div style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Spent</Text>
          <Text fw={700} size="lg">${budgetData.totalSpent.toLocaleString()}</Text>
        </div>
        <div style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">Remaining</Text>
          <Text fw={700} size="lg" c={totalProgress > 80 ? 'red' : 'teal'}>
            ${(budgetData.totalBudget - budgetData.totalSpent).toLocaleString()}
          </Text>
        </div>
      </Group>

      <Progress 
        value={totalProgress} 
        size="lg" 
        color={totalProgress > 80 ? 'red' : 'blue'} 
        mb="md"
      />

      <SimpleGrid cols={3}>
        {budgetData.departments.map((dept) => (
          <Paper withBorder p="xs" radius="md" key={dept.name}>
            <Group position="apart" mb="xs">
              <Text size="sm" fw={500}>{dept.name}</Text>
              {dept.trend === 'up' ? 
                <IconTrendingUp size="1rem" color="red" /> : 
                <IconTrendingDown size="1rem" color="teal" />
              }
            </Group>
            <Text size="xs" c="dimmed">Spent: ${dept.spent.toLocaleString()}</Text>
            <Progress 
              value={(dept.spent / dept.allocated) * 100} 
              size="sm" 
              mt="xs"
              color={(dept.spent / dept.allocated) > 0.8 ? 'red' : 'blue'}
            />
          </Paper>
        ))}
      </SimpleGrid>
    </Paper>
  );
} 