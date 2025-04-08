import React, { useState } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  Button,
  Modal,
  TextInput,
  ActionIcon,
  Menu,
  Textarea,
  Select,
  LoadingOverlay,
  Alert,
  Avatar,
  Card,
  Grid,
  Timeline,
  FileInput,
} from '@mantine/core';
import {
  Plus,
  Search,
  Filter,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  UserPlus,
  Eye,
  Upload,
  MoreVertical,
  FileText,
  Download,
} from 'lucide-react';
import { useTicketStore } from '../store/ticket';
import { useOrganizationStore } from '../store/organization';
import type { Ticket } from '../types';

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [createTicketModal, setCreateTicketModal] = useState(false);
  const [viewTicketModal, setViewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');

  const userRole = useOrganizationStore((state) => state.userRole);
  const {
    tickets,
    loading,
    createTicket,
    addComment,
    assignTicket,
    resolveTicket,
    closeTicket,
    reopenTicket,
    getTicketSummary,
  } = useTicketStore();

  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    attachments: [] as File[],
  });

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');
  const summary = getTicketSummary();

  const handleCreateTicket = async () => {
    await createTicket({
      employeeId: '101', // This would come from the logged-in user
      employeeName: 'John Doe', // This would come from the logged-in user
      department: 'Engineering', // This would come from the logged-in user
      title: ticketForm.title,
      description: ticketForm.description,
      category: ticketForm.category as Ticket['category'],
      priority: ticketForm.priority as Ticket['priority'],
      attachments: ticketForm.attachments.map(file => URL.createObjectURL(file)), // In a real app, these would be uploaded to storage
    });

    setCreateTicketModal(false);
    setTicketForm({
      title: '',
      description: '',
      category: '',
      priority: '',
      attachments: [],
    });
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return;

    await addComment(selectedTicket.id, {
      ticketId: selectedTicket.id,
      userId: '101', // This would come from the logged-in user
      userName: 'John Doe', // This would come from the logged-in user
      content: newComment,
    });

    setNewComment('');
  };

  const getStatusColor = (status: Ticket['status']) => {
    const colors: Record<string, string> = {
      open: 'yellow',
      in_progress: 'blue',
      resolved: 'green',
      closed: 'gray',
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} />;
      case 'in_progress':
        return <Clock size={16} />;
      case 'resolved':
        return <CheckCircle2 size={16} />;
      case 'closed':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    const colors: Record<string, string> = {
      low: 'green',
      medium: 'yellow',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority] || 'gray';
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Support Tickets</Title>
        <Button
          leftSection={<Plus size={20} />}
          onClick={() => setCreateTicketModal(true)}
        >
          Create Ticket
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Total Tickets</Text>
            <Text size="xl" fw={700}>{summary.totalTickets}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Open Tickets</Text>
            <Text size="xl" fw={700} c="yellow">{summary.openTickets}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Resolved</Text>
            <Text size="xl" fw={700} c="green">{summary.resolvedTickets}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">Closed</Text>
            <Text size="xl" fw={700} c="gray">{summary.closedTickets}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder p="md" radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Group mb="md" grow>
          <TextInput
            placeholder="Search tickets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
          />
          <Group>
            <Select
              placeholder="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              data={[
                { value: 'it_support', label: 'IT Support' },
                { value: 'hr', label: 'HR' },
                { value: 'facilities', label: 'Facilities' },
                { value: 'finance', label: 'Finance' },
                { value: 'general', label: 'General' },
              ]}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              data={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
              ]}
              leftSection={<Filter size={16} />}
              clearable
              style={{ flex: 1 }}
            />
          </Group>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Priority</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Assigned To</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tickets
              .filter(ticket => {
                const matchesSearch = 
                  ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = !categoryFilter || ticket.category === categoryFilter;
                const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
                const matchesStatus = !statusFilter || ticket.status === statusFilter;
                return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
              })
              .map((ticket) => (
                <Table.Tr key={ticket.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {ticket.title}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {ticket.description}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text transform="capitalize">
                      {ticket.category.replace('_', ' ')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getPriorityColor(ticket.priority)}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(ticket.status)}
                      leftSection={getStatusIcon(ticket.status)}
                    >
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {ticket.assignedTo ? (
                      <Group gap="sm">
                        <Avatar
                          size={24}
                          radius={24}
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.assignedTo}`}
                        />
                        <Text size="sm">{ticket.assignedTo}</Text>
                      </Group>
                    ) : (
                      <Text size="sm" c="dimmed">Unassigned</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setViewTicketModal(true);
                        }}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      {isManager && ticket.status !== 'closed' && (
                        <Menu>
                          <Menu.Target>
                            <ActionIcon variant="subtle">
                              <MoreVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            {!ticket.assignedTo && (
                              <Menu.Item
                                leftSection={<UserPlus size={16} />}
                                onClick={() => assignTicket(ticket.id, 'Support Team')}
                              >
                                Assign Ticket
                              </Menu.Item>
                            )}
                            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                              <Menu.Item
                                leftSection={<CheckCircle2 size={16} />}
                                onClick={() => resolveTicket(ticket.id)}
                              >
                                Mark as Resolved
                              </Menu.Item>
                            )}
                            {ticket.status === 'resolved' && (
                              <Menu.Item
                                leftSection={<XCircle size={16} />}
                                onClick={() => closeTicket(ticket.id)}
                              >
                                Close Ticket
                              </Menu.Item>
                            )}
                            {ticket.status === 'closed' && (
                              <Menu.Item
                                leftSection={<AlertCircle size={16} />}
                                onClick={() => reopenTicket(ticket.id)}
                              >
                                Reopen Ticket
                              </Menu.Item>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Create Ticket Modal */}
      <Modal
        opened={createTicketModal}
        onClose={() => setCreateTicketModal(false)}
        title="Create New Ticket"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Title"
            placeholder="Enter ticket title"
            value={ticketForm.title}
            onChange={(e) => setTicketForm({ ...ticketForm, title: e.currentTarget.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe your issue"
            value={ticketForm.description}
            onChange={(e) => setTicketForm({ ...ticketForm, description: e.currentTarget.value })}
            minRows={3}
            required
          />

          <Select
            label="Category"
            placeholder="Select category"
            data={[
              { value: 'it_support', label: 'IT Support' },
              { value: 'hr', label: 'HR' },
              { value: 'facilities', label: 'Facilities' },
              { value: 'finance', label: 'Finance' },
              { value: 'general', label: 'General' },
            ]}
            value={ticketForm.category}
            onChange={(value) => setTicketForm({ ...ticketForm, category: value || '' })}
            required
          />

          <Select
            label="Priority"
            placeholder="Select priority"
            data={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            value={ticketForm.priority}
            onChange={(value) => setTicketForm({ ...ticketForm, priority: value || '' })}
            required
          />

          <FileInput
            label="Attachments"
            placeholder="Upload files"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            value={ticketForm.attachments}
            onChange={(files) => setTicketForm({ ...ticketForm, attachments: Array.from(files || []) })}
            leftSection={<Upload size={16} />}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setCreateTicketModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} loading={loading}>
              Create Ticket
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Ticket Modal */}
      <Modal
        opened={viewTicketModal}
        onClose={() => {
          setViewTicketModal(false);
          setSelectedTicket(null);
          setNewComment('');
        }}
        title={
          <Text size="lg" fw={500}>
            Ticket Details
          </Text>
        }
        size="lg"
      >
        {selectedTicket && (
          <Stack>
            <Group position="apart">
              <div>
                <Text fw={500}>{selectedTicket.title}</Text>
                <Text size="sm" c="dimmed">
                  Created by {selectedTicket.employeeName} on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <Badge
                color={getStatusColor(selectedTicket.status)}
                leftSection={getStatusIcon(selectedTicket.status)}
                size="lg"
              >
                {selectedTicket.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </Group>

            <Card withBorder>
              <Text fw={500} mb="xs">Description</Text>
              <Text>{selectedTicket.description}</Text>
            </Card>

            <Grid>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Category</Text>
                  <Text transform="capitalize">
                    {selectedTicket.category.replace('_', ' ')}
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Priority</Text>
                  <Badge color={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority.toUpperCase()}
                  </Badge>
                </Card>
              </Grid.Col>
            </Grid>

            {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
              <Card withBorder>
                <Text fw={500} mb="sm">Attachments</Text>
                <Stack>
                  {selectedTicket.attachments.map((url, index) => (
                    <Group key={index} justify="space-between" wrap="nowrap">
                      <Group gap="sm">
                        <FileText size={20} />
                        <div>
                          <Text size="sm" fw={500}>File {index + 1}</Text>
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

            <Card withBorder>
              <Text fw={500} mb="md">Comments</Text>
              <Timeline active={selectedTicket.comments.length - 1}>
                {selectedTicket.comments.map((comment, index) => (
                  <Timeline.Item
                    key={comment.id}
                    bullet={<MessageCircle size={16} />}
                    title={
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>{comment.userName}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Text>
                      </Group>
                    }
                  >
                    <Text size="sm" mt={4}>{comment.content}</Text>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <Group mt="xs">
                        {comment.attachments.map((url, i) => (
                          <Button
                            key={i}
                            variant="light"
                            size="xs"
                            component="a"
                            href={url}
                            target="_blank"
                            leftSection={<Eye size={14} />}
                          >
                            Attachment {i + 1}
                          </Button>
                        ))}
                      </Group>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>

              {selectedTicket.status !== 'closed' && (
                <Group mt="md">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    onClick={handleAddComment}
                    loading={loading}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </Group>
              )}
            </Card>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}