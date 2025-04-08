import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Avatar,
  Timeline,
  Card,
  Alert,
} from '@mantine/core';
import {
  ArrowLeft,
  AlertCircle,
  Calendar,
  Receipt,
} from 'lucide-react';
import { useFinesStore } from '../store/fines';

export default function FineHistory() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { getEmployeeFineHistory, getEmployeeFinesSummaries } = useFinesStore();

  if (!employeeId) {
    navigate('/fines');
    return null;
  }

  const history = getEmployeeFineHistory(employeeId);
  const summary = getEmployeeFinesSummaries().find(s => s.employeeId === employeeId);

  if (!summary) {
    navigate('/fines');
    return null;
  }

  return (
    <Stack gap="lg">
      <Group>
        <Button
          variant="light"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate('/fines')}
        >
          Back to Fines List
        </Button>
      </Group>

      <Group align="flex-start">
        <Avatar
          size={80}
          radius={80}
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${summary.employeeName}`}
        />
        <div>
          <Title order={2}>{summary.employeeName}</Title>
          <Text size="lg" c="dimmed">{summary.department}</Text>
        </div>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Fines Summary</Title>
        <Group grow>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Fines</Text>
            <Text size="xl" fw={700}>${summary.totalFines.toLocaleString()}</Text>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Deducted</Text>
            <Text size="xl" fw={700}>${summary.totalDeducted.toLocaleString()}</Text>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Pending Amount</Text>
            <Text size="xl" fw={700}>${summary.pendingAmount.toLocaleString()}</Text>
          </Card>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Fines History</Title>
        <Timeline active={history.length - 1} bulletSize={24}>
          {history.map((fine) => (
            <Timeline.Item
              key={fine.id}
              bullet={<Receipt size={16} />}
              title={
                <Group justify="space-between">
                  <Text fw={500}>
                    Fine Amount: ${fine.amount.toLocaleString()}
                  </Text>
                  <Badge color={getStatusColor(fine.status)}>
                    {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                  </Badge>
                </Group>
              }
            >
              <Text size="sm" mt={4}>Reason: {fine.reason}</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Date: {new Date(fine.date).toLocaleDateString()}
              </Text>

              {fine.status === 'approved' && (
                <Alert
                  icon={<Calendar size={16} />}
                  color="blue"
                  mt="sm"
                >
                  Scheduled for deduction on {new Date(fine.deductionDate).toLocaleDateString()}
                </Alert>
              )}

              {fine.managerComments && (
                <Alert
                  icon={<AlertCircle size={16} />}
                  color={fine.status === 'approved' ? 'green' : 'red'}
                  mt="sm"
                >
                  {fine.managerComments}
                </Alert>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>
    </Stack>
  );
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    deducted: 'blue',
  };
  return colors[status] || 'gray';
};