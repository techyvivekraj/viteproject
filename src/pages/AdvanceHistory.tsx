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
  CreditCard,
  Receipt,
  Calendar,
} from 'lucide-react';
import { useAdvanceStore } from '../store/advance';
import { PaymentHistory } from '../types';

export default function AdvanceHistory() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { getEmployeeAdvanceHistory, getEmployeeLoanSummaries } = useAdvanceStore();

  if (!employeeId) {
    navigate('/advance');
    return null;
  }

  const history = getEmployeeAdvanceHistory(employeeId);
  const summary = getEmployeeLoanSummaries().find(s => s.employeeId === employeeId);

  if (!summary) {
    navigate('/advance');
    return null;
  }

  return (
    <Stack gap="lg">
      <Group>
        <Button
          variant="light"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate('/advance')}
        >
          Back to Advance List
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
        <Title order={3} mb="lg">Loan Summary</Title>
        <Group grow>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Loan Amount</Text>
            <Text size="xl" fw={700}>${summary.totalLoanAmount.toLocaleString()}</Text>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Paid</Text>
            <Text size="xl" fw={700}>${summary.totalPaidAmount.toLocaleString()}</Text>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Remaining Amount</Text>
            <Text size="xl" fw={700}>${summary.remainingAmount.toLocaleString()}</Text>
          </Card>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Loan History</Title>
        <Timeline active={history.length - 1} bulletSize={24}>
          {history.map((loan) => (
            <Timeline.Item
              key={loan.id}
              bullet={<CreditCard size={16} />}
              title={
                <Group justify="space-between">
                  <Text fw={500}>
                    Loan Amount: ${loan.amount.toLocaleString()}
                  </Text>
                  <Badge color={loan.repaymentStatus.remainingAmount > 0 ? 'blue' : 'green'}>
                    {loan.repaymentStatus.remainingAmount > 0 ? 'Active' : 'Completed'}
                  </Badge>
                </Group>
              }
            >
              <Text size="sm" mt={4}>Reason: {loan.reason}</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Approved on {new Date(loan.approvedAt!).toLocaleDateString()}
              </Text>

              <Card withBorder mt="sm">
                <Text fw={500} mb="xs">Payment History</Text>
                {loan.repaymentStatus.paymentHistory.map((payment: PaymentHistory, index: number) => (
                  <Group key={index} justify="space-between" mb="xs">
                    <Group gap="xs">
                      <Receipt size={16} />
                      <div>
                        <Text size="sm">{payment.reference}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(payment.date).toLocaleDateString()}
                        </Text>
                      </div>
                    </Group>
                    <Text fw={500}>${payment.amount.toLocaleString()}</Text>
                  </Group>
                ))}
                {loan.repaymentStatus.remainingAmount > 0 && (
                  <Alert icon={<Calendar size={16} />} color="blue" mt="sm">
                    Next payment of ${loan.monthlyDeduction.toLocaleString()} due on {loan.repaymentStatus.nextPaymentDate}
                  </Alert>
                )}
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>
    </Stack>
  );
}