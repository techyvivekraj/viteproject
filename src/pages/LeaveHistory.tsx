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
  Progress,
} from '@mantine/core';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  Download,
} from 'lucide-react';
import { useLeaveStore } from '../store/leave';

export default function LeaveHistory() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { getEmployeeLeaveHistory, getEmployeeLeaveBalance } = useLeaveStore();

  if (!employeeId) {
    navigate('/leave');
    return null;
  }

  const history = getEmployeeLeaveHistory(employeeId);
  const balance = getEmployeeLeaveBalance(employeeId);

  if (!balance || history.length === 0) {
    navigate('/leave');
    return null;
  }

  const employee = history[0]; // Get employee details from first leave request

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={16} />;
      case 'pending':
        return <Calendar size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="flex-start">
        <Button
          variant="light"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate('/leave')}
        >
          Back to Leave List
        </Button>
      </Group>

      <Group align="flex-start">
        <Avatar
          size={80}
          radius={80}
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.employeeName}`}
        />
        <div>
          <Title order={2}>{employee.employeeName}</Title>
          <Text size="lg" c="dimmed">{employee.department}</Text>
        </div>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Leave Balance</Title>
        <Stack gap="md">
          <Card withBorder>
            <Text fw={500} mb="xs">Annual Leave</Text>
            <Group justify="space-between" mb="xs">
              <Text>Used: {balance.annual.used} days</Text>
              <Text>Remaining: {balance.annual.remaining} days</Text>
            </Group>
            <Progress
              value={(balance.annual.used / balance.annual.total) * 100}
              size="md"
              color="green"
            />
          </Card>

          <Card withBorder>
            <Text fw={500} mb="xs">Sick Leave</Text>
            <Group justify="space-between" mb="xs">
              <Text>Used: {balance.sick.used} days</Text>
              <Text>Remaining: {balance.sick.remaining} days</Text>
            </Group>
            <Progress
              value={(balance.sick.used / balance.sick.total) * 100}
              size="md"
              color="blue"
            />
          </Card>

          <Group grow>
            <Card withBorder>
              <Text fw={500} mb="xs">Maternity/Paternity Leave</Text>
              <Text>
                {balance.maternity.remaining + balance.paternity.remaining} days remaining
              </Text>
            </Card>
            <Card withBorder>
              <Text fw={500} mb="xs">Bereavement Leave</Text>
              <Text>{balance.bereavement.remaining} days remaining</Text>
            </Card>
            <Card withBorder>
              <Text fw={500} mb="xs">Unpaid Leave</Text>
              <Text>{balance.unpaid.used} days taken</Text>
            </Card>
          </Group>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Leave History</Title>
        <Timeline active={history.length - 1} bulletSize={24}>
          {history.map((leave) => (
            <Timeline.Item
              key={leave.id}
              bullet={getStatusIcon(leave.status)}
              title={
                <Group justify="space-between">
                  <Text fw={500} tt="capitalize">{leave.type} Leave</Text>
                  <Badge color={getStatusColor(leave.status)}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </Badge>
                </Group>
              }
            >
              <Text size="sm" mt={4}>{leave.reason}</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Duration: {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} ({leave.days} days)
              </Text>

              {leave.attachments && leave.attachments.length > 0 && (
                <Card withBorder mt="sm">
                  <Text fw={500} mb="sm">Attachments</Text>
                  <Stack>
                    {leave.attachments.map((url, index) => (
                      <Group key={index} justify="space-between" wrap="nowrap">
                        <Group gap="sm">
                          <FileText size={20} />
                          <div>
                            <Text size="sm" fw={500}>Document {index + 1}</Text>
                            <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                              {url.split('/').pop()}
                            </Text>
                          </div>
                        </Group>
                        <Group gap="xs">
                          <Button
                            variant="light"
                            size="xs"
                            component="a"
                            href={url}
                            target="_blank"
                            leftSection={<Eye size={14} />}
                          >
                            View
                          </Button>
                          <Button
                            variant="light"
                            size="xs"
                            component="a"
                            href={url}
                            download
                            leftSection={<Download size={14} />}
                          >
                            Download
                          </Button>
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              )}

              {leave.managerComments && (
                <Alert
                  icon={<AlertCircle size={16} />}
                  color={leave.status === 'approved' ? 'green' : 'red'}
                  mt="sm"
                >
                  {leave.managerComments}
                </Alert>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>
    </Stack>
  );
}