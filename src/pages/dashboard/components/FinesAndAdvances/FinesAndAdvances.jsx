import { Paper, Title, Table, Group, Text, Progress } from '@mantine/core';
import { IconCoin, IconReportMoney } from '@tabler/icons-react';
import classes from './FinesAndAdvances.module.css';

const finesData = [
  { employee: 'John Doe', type: 'Late Arrival', amount: 50, date: '2024-01-15' },
  { employee: 'Jane Smith', type: 'Early Exit', amount: 30, date: '2024-01-16' },
];

const loansData = [
  { 
    employee: 'Mike Johnson', 
    amount: 5000, 
    paid: 2000, 
    remaining: 3000,
    progress: 40 
  },
  { 
    employee: 'Sarah Wilson', 
    amount: 3000, 
    paid: 1500, 
    remaining: 1500,
    progress: 50 
  },
];

export default function FinesAndAdvances() {
  return (
    <Paper withBorder p="md" radius="md">
      <Title order={2} size="h3" mb="xl">Fines & Advances</Title>

      <Group mb="xl">
        <Paper withBorder p="md" radius="md" style={{ flex: 1 }}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Recent Fines</Text>
            <IconCoin size="1.2rem" className={classes.icon} />
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {finesData.map((fine, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{fine.employee}</Table.Td>
                  <Table.Td>{fine.type}</Table.Td>
                  <Table.Td>${fine.amount}</Table.Td>
                  <Table.Td>{fine.date}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Paper withBorder p="md" radius="md" style={{ flex: 1 }}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Active Loans</Text>
            <IconReportMoney size="1.2rem" className={classes.icon} />
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Progress</Table.Th>
                <Table.Th>Remaining</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loansData.map((loan, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{loan.employee}</Table.Td>
                  <Table.Td style={{ width: '40%' }}>
                    <Progress 
                      value={loan.progress} 
                      size="sm" 
                      color="blue"
                    />
                  </Table.Td>
                  <Table.Td>${loan.remaining}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Group>
    </Paper>
  );
} 