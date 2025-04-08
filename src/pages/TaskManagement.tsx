import React, { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Table,
  Badge,
  ActionIcon,
  Modal,
  Text,
  Alert,
  Container,
  Avatar,
  Tooltip,
  FileInput,
  rem,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  Plus,
  MoreVertical,
  Edit,
  Trash,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Search,
  Filter,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';
import type { Task, TaskComment } from '../types';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Update employee handbook',
    description: 'Review and update the employee handbook with new policies',
    assigned_to: '101',
    assigned_by: '201',
    due_date: '2024-04-15',
    priority: 'high',
    status: 'in_progress',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
    comments: [
      {
        id: '1',
        task_id: '1',
        user_id: '101',
        user_name: 'John Doe',
        comment: 'Started working on the updates',
        created_at: '2024-03-15T11:00:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Conduct performance reviews',
    description: 'Schedule and conduct quarterly performance reviews for the team',
    assigned_to: '102',
    assigned_by: '201',
    due_date: '2024-04-30',
    priority: 'medium',
    status: 'todo',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
];

const mockEmployees = [
  { value: '101', label: 'John Doe' },
  { value: '102', label: 'Jane Smith' },
  { value: '103', label: 'Bob Johnson' },
];

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    attachments: [] as File[],
  });

  const userRole = useOrganizationStore((state) => state.userRole);
  const isAdmin = userRole === 'owner' || userRole === 'admin';

  useEffect(() => {
    // Simulate API call
    const fetchTasks = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTasks(mockTasks);
      } catch (error) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert File[] to string[] for attachments
      const attachmentUrls: string[] = [];
      
      const newTaskData: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assigned_to,
        assigned_by: '201', // Current user ID
        due_date: newTask.due_date,
        priority: newTask.priority,
        status: 'todo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        attachments: attachmentUrls,
      };
      
      setTasks([...tasks, newTaskData]);
      setSuccess('Task created successfully');
      setIsAddModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        priority: 'medium',
        attachments: [],
      });
    } catch (error) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert File[] to string[] for attachments
      const attachmentUrls: string[] = [];
      
      const updatedTask: Task = {
        ...selectedTask,
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assigned_to,
        due_date: newTask.due_date,
        priority: newTask.priority,
        updated_at: new Date().toISOString(),
        attachments: attachmentUrls,
      };
      
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id ? updatedTask : task
      );
      
      setTasks(updatedTasks);
      setSuccess('Task updated successfully');
      setIsEditModalOpen(false);
      setSelectedTask(null);
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        priority: 'medium',
        attachments: [],
      });
    } catch (error) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedTasks = tasks.filter(task => task.id !== selectedTask.id);
      setTasks(updatedTasks);
      setSuccess('Task deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !newComment.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const comment: TaskComment = {
        id: Date.now().toString(),
        task_id: selectedTask.id,
        user_id: '201', // Current user ID
        user_name: 'Current User',
        comment: newComment,
        created_at: new Date().toISOString(),
      };
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id
          ? {
              ...task,
              comments: [...(task.comments || []), comment],
              updated_at: new Date().toISOString(),
            }
          : task
      );
      setTasks(updatedTasks);
      setSuccess('Comment added successfully');
      setIsCommentModalOpen(false);
      setNewComment('');
    } catch (error) {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'blue',
      medium: 'yellow',
      high: 'red',
    };
    return colors[priority] || 'gray';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      todo: 'gray',
      in_progress: 'blue',
      review: 'yellow',
      completed: 'green',
    };
    return colors[status] || 'gray';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || task.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderTaskModal = (isEdit: boolean) => (
    <Modal
      opened={isEdit ? isEditModalOpen : isAddModalOpen}
      onClose={() => {
        if (isEdit) {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        } else {
          setIsAddModalOpen(false);
        }
        setNewTask({
          title: '',
          description: '',
          assigned_to: '',
          due_date: '',
          priority: 'medium',
          attachments: [],
        });
      }}
      title={isEdit ? 'Edit Task' : 'Add New Task'}
      size="lg"
    >
      <Stack gap="md">
        {error && (
          <Alert
            icon={<AlertCircle style={{ width: rem(16), height: rem(16) }} />}
            title="Error"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            icon={<CheckCircle style={{ width: rem(16), height: rem(16) }} />}
            title="Success"
            color="green"
            variant="light"
          >
            {success}
          </Alert>
        )}

        <TextInput
          label="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.currentTarget.value })}
          required
          placeholder="Enter task title"
        />
        <Textarea
          label="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.currentTarget.value })}
          required
          placeholder="Enter task description"
          minRows={3}
        />
        <Select
          label="Assign To"
          value={newTask.assigned_to}
          onChange={(value) => setNewTask({ ...newTask, assigned_to: value || '' })}
          data={mockEmployees}
          required
          placeholder="Select employee"
        />
        <DateInput
          label="Due Date"
          value={newTask.due_date ? new Date(newTask.due_date) : null}
          onChange={(date: Date | null) => setNewTask({ ...newTask, due_date: date?.toISOString().split('T')[0] || '' })}
          required
          placeholder="Select due date"
        />
        <Select
          label="Priority"
          value={newTask.priority}
          onChange={(value) => setNewTask({ ...newTask, priority: value as 'low' | 'medium' | 'high' })}
          data={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          required
        />
        <FileInput
          label="Attachments"
          placeholder="Upload files"
          multiple
          onChange={(files) => setNewTask({ ...newTask, attachments: files })}
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={() => {
              if (isEdit) {
                setIsEditModalOpen(false);
                setSelectedTask(null);
              } else {
                setIsAddModalOpen(false);
              }
            }}
          >
            Cancel
          </Button>
          <Button onClick={isEdit ? handleEditTask : handleAddTask} loading={loading}>
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const renderCommentModal = () => (
    <Modal
      opened={isCommentModalOpen}
      onClose={() => {
        setIsCommentModalOpen(false);
        setNewComment('');
      }}
      title="Add Comment"
      size="md"
    >
      <Stack gap="md">
        {error && (
          <Alert
            icon={<AlertCircle style={{ width: rem(16), height: rem(16) }} />}
            title="Error"
            color="red"
            variant="light"
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            icon={<CheckCircle style={{ width: rem(16), height: rem(16) }} />}
            title="Success"
            color="green"
            variant="light"
          >
            {success}
          </Alert>
        )}

        <Textarea
          label="Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.currentTarget.value)}
          required
          placeholder="Enter your comment"
          minRows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={() => {
              setIsCommentModalOpen(false);
              setNewComment('');
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddComment} loading={loading}>
            Add Comment
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal
      opened={isDeleteModalOpen}
      onClose={() => {
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
      }}
      title="Delete Task"
      size="md"
    >
      <Stack gap="md">
        <Text>Are you sure you want to delete this task?</Text>
        <Text size="sm" c="dimmed">
          This action cannot be undone.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedTask(null);
            }}
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteTask} loading={loading}>
            Delete Task
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Task Management</Title>
          {isAdmin && (
            <Button
              leftSection={<Plus style={{ width: rem(16), height: rem(16) }} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Task
            </Button>
          )}
        </Group>

        <Paper withBorder radius="md" p="md">
          <Stack gap="xl">
            <Group grow>
              <TextInput
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                leftSection={<Search style={{ width: rem(16), height: rem(16) }} />}
              />
              <Select
                placeholder="Filter by status"
                value={activeTab}
                onChange={setActiveTab}
                data={[
                  { value: 'all', label: 'All Tasks' },
                  { value: 'todo', label: 'To Do' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'review', label: 'Review' },
                  { value: 'completed', label: 'Completed' },
                ]}
                leftSection={<Filter style={{ width: rem(16), height: rem(16) }} />}
              />
            </Group>

            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Task</Table.Th>
                  <Table.Th>Assigned To</Table.Th>
                  <Table.Th>Due Date</Table.Th>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredTasks.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text ta="center" c="dimmed" py="xl">
                        No tasks found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredTasks.map((task) => (
                    <Table.Tr key={task.id}>
                      <Table.Td>
                        <Stack gap={4}>
                          <Text fw={500}>{task.title}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {task.description}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            size={32}
                            radius={32}
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigned_to}`}
                          />
                          <Text size="sm">
                            {mockEmployees.find(emp => emp.value === task.assigned_to)?.label}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Clock style={{ width: rem(16), height: rem(16) }} />
                          <Text size="sm">
                            {new Date(task.due_date).toLocaleDateString()}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(task.status)}>
                          {task.status.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="View Comments">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => {
                                setSelectedTask(task);
                                setIsCommentModalOpen(true);
                              }}
                            >
                              <MessageSquare style={{ width: rem(16), height: rem(16) }} />
                            </ActionIcon>
                          </Tooltip>
                          {isAdmin && (
                            <>
                              <Tooltip label="Edit Task">
                                <ActionIcon
                                  variant="light"
                                  color="blue"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setNewTask({
                                      title: task.title,
                                      description: task.description,
                                      assigned_to: task.assigned_to,
                                      due_date: task.due_date,
                                      priority: task.priority,
                                      attachments: [],
                                    });
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Edit style={{ width: rem(16), height: rem(16) }} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete Task">
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setIsDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash style={{ width: rem(16), height: rem(16) }} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>
      </Stack>

      {renderTaskModal(false)}
      {renderTaskModal(true)}
      {renderCommentModal()}
      {renderDeleteModal()}
    </Container>
  );
} 