import React, { useState } from 'react';
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
  Modal,
  Textarea,
} from '@mantine/core';
import {
  ArrowLeft,
  Star,
  AlertTriangle,
  ArrowUp,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react';
import { useRemarkStore } from '../store/remark';

export default function RemarkHistory() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { getEmployeeRemarks, getEmployeeRemarkSummaries, acknowledgeRemark } = useRemarkStore();
  const [acknowledgeModal, setAcknowledgeModal] = useState(false);
  const [selectedRemarkId, setSelectedRemarkId] = useState<string | null>(null);
  const [acknowledgementComment, setAcknowledgementComment] = useState('');

  if (!employeeId) {
    navigate('/remarks');
    return null;
  }

  const remarks = getEmployeeRemarks(employeeId);
  const summary = getEmployeeRemarkSummaries().find(s => s.employeeId === employeeId);

  if (!summary) {
    navigate('/remarks');
    return null;
  }

  const handleAcknowledge = async () => {
    if (!selectedRemarkId) return;
    await acknowledgeRemark(selectedRemarkId, acknowledgementComment);
    setAcknowledgeModal(false);
    setSelectedRemarkId(null);
    setAcknowledgementComment('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appreciation':
        return <Star size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'improvement':
        return <ArrowUp size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      appreciation: 'green',
      warning: 'red',
      improvement: 'blue',
      general: 'gray',
    };
    return colors[type] || 'gray';
  };

  return (
    <Stack gap="lg">
      <Group>
        <Button
          variant="light"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate('/remarks')}
        >
          Back to Remarks List
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
        <Title order={3} mb="lg">Remarks Summary</Title>
        <Group grow>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Remarks</Text>
            <Text size="xl" fw={700}>{summary.totalRemarks}</Text>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Appreciations</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>{summary.appreciations}</Text>
              <Star size={20} color="var(--mantine-color-green-6)" />
            </Group>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Warnings</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>{summary.warnings}</Text>
              <AlertTriangle size={20} color="var(--mantine-color-red-6)" />
            </Group>
          </Card>
          <Card withBorder>
            <Text size="sm" c="dimmed">Improvements</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={700}>{summary.improvements}</Text>
              <ArrowUp size={20} color="var(--mantine-color-blue-6)" />
            </Group>
          </Card>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Title order={3} mb="lg">Remarks History</Title>
        <Timeline active={remarks.length - 1} bulletSize={24}>
          {remarks.map((remark) => (
            <Timeline.Item
              key={remark.id}
              bullet={getTypeIcon(remark.type)}
              title={
                <Group justify="space-between">
                  <Text fw={500}>{remark.title}</Text>
                  <Badge color={getTypeColor(remark.type)}>
                    {remark.type.charAt(0).toUpperCase() + remark.type.slice(1)}
                  </Badge>
                </Group>
              }
            >
              <Text size="sm" mt={4}>{remark.description}</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Date: {new Date(remark.date).toLocaleDateString()}
              </Text>
              <Text size="sm" c="dimmed">
                Created by: {remark.createdBy}
              </Text>

              {remark.acknowledgement ? (
                <Alert
                  icon={<ThumbsUp size={16} />}
                  color="green"
                  mt="sm"
                >
                  <Text size="sm" fw={500}>Acknowledged on {new Date(remark.acknowledgement.acknowledgedAt!).toLocaleDateString()}</Text>
                  {remark.acknowledgement.comments && (
                    <Text size="sm" mt={4}>{remark.acknowledgement.comments}</Text>
                  )}
                </Alert>
              ) : (
                <Group mt="sm">
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<MessageCircle size={14} />}
                    onClick={() => {
                      setSelectedRemarkId(remark.id);
                      setAcknowledgeModal(true);
                    }}
                  >
                    Acknowledge
                  </Button>
                </Group>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Paper>

      {/* Acknowledge Modal */}
      <Modal
        opened={acknowledgeModal}
        onClose={() => {
          setAcknowledgeModal(false);
          setSelectedRemarkId(null);
          setAcknowledgementComment('');
        }}
        title="Acknowledge Remark"
      >
        <Stack>
          <Textarea
            label="Comments"
            placeholder="Add your comments (optional)"
            value={acknowledgementComment}
            onChange={(e) => setAcknowledgementComment(e.currentTarget.value)}
            minRows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setAcknowledgeModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcknowledge} color="green">
              Acknowledge
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}