import React, { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Tabs,
  Group,
  Button,
  Text,
  Stack,
  Badge,
  ActionIcon,
  Menu,
  LoadingOverlay,
  Card,
  Grid,
  Avatar,
  Tooltip,
  TextInput,
  Modal,
  Textarea,
  Select,
  Progress,
  RingProgress,
  Table,
  Divider,
  Box,
  Flex,
  SegmentedControl,
} from '@mantine/core';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck,
  BarChart,
  LineChart,
  PieChart,
  Edit,
  Trash,
  Filter,
  ChevronDown,
  Star,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';

// Mock data for performance reviews
const mockPerformanceReviews = [
  {
    id: '1',
    employee_id: '101',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    review_period: 'Q1 2024',
    review_date: '2024-03-31',
    overall_rating: 4.5,
    goals_achievement: 85,
    skills_rating: 4.2,
    attendance_rating: 4.8,
    teamwork_rating: 4.3,
    leadership_rating: 4.0,
    status: 'completed',
    reviewer_id: '201',
    reviewer_name: 'Sarah Manager',
    strengths: 'Strong technical skills, good problem-solving abilities, and excellent communication.',
    areas_for_improvement: 'Could improve time management and delegation skills.',
    goals_for_next_period: 'Complete advanced React certification, lead 2 team projects, improve documentation skills.',
    comments: 'John has shown significant improvement in his technical skills and is a valuable member of the team.',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    employee_id: '102',
    employee_name: 'Jane Smith',
    department: 'Marketing',
    position: 'Marketing Specialist',
    review_period: 'Q1 2024',
    review_date: '2024-03-31',
    overall_rating: 3.8,
    goals_achievement: 75,
    skills_rating: 3.9,
    attendance_rating: 4.5,
    teamwork_rating: 4.2,
    leadership_rating: 3.5,
    status: 'completed',
    reviewer_id: '202',
    reviewer_name: 'Michael Director',
    strengths: 'Creative thinking, strong analytical skills, and good project management.',
    areas_for_improvement: 'Needs to improve presentation skills and strategic thinking.',
    goals_for_next_period: 'Complete digital marketing certification, lead 1 major campaign, improve data analysis skills.',
    comments: 'Jane has made good progress but needs to focus on strategic aspects of marketing.',
    created_at: '2024-03-16T11:00:00Z',
    updated_at: '2024-03-16T11:00:00Z',
  },
  {
    id: '3',
    employee_id: '103',
    employee_name: 'Robert Johnson',
    department: 'Sales',
    position: 'Sales Representative',
    review_period: 'Q1 2024',
    review_date: '2024-03-31',
    overall_rating: 4.2,
    goals_achievement: 90,
    skills_rating: 4.3,
    attendance_rating: 4.7,
    teamwork_rating: 4.0,
    leadership_rating: 3.8,
    status: 'completed',
    reviewer_id: '203',
    reviewer_name: 'Lisa Sales Manager',
    strengths: 'Excellent communication skills, strong negotiation abilities, and customer focus.',
    areas_for_improvement: 'Could improve product knowledge and follow-up skills.',
    goals_for_next_period: 'Increase sales by 15%, complete product training, improve CRM usage.',
    comments: 'Robert has exceeded his sales targets and shows great potential for growth.',
    created_at: '2024-03-17T12:00:00Z',
    updated_at: '2024-03-17T12:00:00Z',
  },
  {
    id: '4',
    employee_id: '104',
    employee_name: 'Emily Davis',
    department: 'HR',
    position: 'HR Coordinator',
    review_period: 'Q1 2024',
    review_date: '2024-03-31',
    overall_rating: 4.0,
    goals_achievement: 80,
    skills_rating: 4.1,
    attendance_rating: 4.6,
    teamwork_rating: 4.4,
    leadership_rating: 3.7,
    status: 'completed',
    reviewer_id: '204',
    reviewer_name: 'David HR Manager',
    strengths: 'Strong organizational skills, attention to detail, and good interpersonal skills.',
    areas_for_improvement: 'Could improve conflict resolution and strategic HR planning.',
    goals_for_next_period: 'Complete HR certification, improve recruitment process, develop employee engagement program.',
    comments: 'Emily has shown good progress in her role and is a reliable team member.',
    created_at: '2024-03-18T13:00:00Z',
    updated_at: '2024-03-18T13:00:00Z',
  },
  {
    id: '5',
    employee_id: '105',
    employee_name: 'Michael Wilson',
    department: 'Engineering',
    position: 'Junior Developer',
    review_period: 'Q1 2024',
    review_date: '2024-03-31',
    overall_rating: 3.5,
    goals_achievement: 70,
    skills_rating: 3.6,
    attendance_rating: 4.2,
    teamwork_rating: 3.8,
    leadership_rating: 3.2,
    status: 'completed',
    reviewer_id: '201',
    reviewer_name: 'Sarah Manager',
    strengths: 'Good coding skills, willingness to learn, and team collaboration.',
    areas_for_improvement: 'Needs to improve code quality, documentation, and time management.',
    goals_for_next_period: 'Complete React fundamentals course, improve code reviews, complete 2 side projects.',
    comments: 'Michael is making progress but needs more guidance and mentoring to reach his potential.',
    created_at: '2024-03-19T14:00:00Z',
    updated_at: '2024-03-19T14:00:00Z',
  },
];

// Mock data for performance goals
const mockPerformanceGoals = [
  {
    id: '1',
    employee_id: '101',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    goal: 'Complete advanced React certification',
    description: 'Obtain certification in advanced React development techniques',
    target_date: '2024-06-30',
    status: 'in_progress',
    progress: 60,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    employee_id: '101',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    goal: 'Lead 2 team projects',
    description: 'Take leadership role in two major development projects',
    target_date: '2024-06-30',
    status: 'in_progress',
    progress: 30,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '3',
    employee_id: '102',
    employee_name: 'Jane Smith',
    department: 'Marketing',
    position: 'Marketing Specialist',
    goal: 'Complete digital marketing certification',
    description: 'Obtain certification in digital marketing strategies',
    target_date: '2024-06-30',
    status: 'in_progress',
    progress: 40,
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-16T11:00:00Z',
  },
  {
    id: '4',
    employee_id: '103',
    employee_name: 'Robert Johnson',
    department: 'Sales',
    position: 'Sales Representative',
    goal: 'Increase sales by 15%',
    description: 'Achieve 15% increase in sales compared to previous quarter',
    target_date: '2024-06-30',
    status: 'in_progress',
    progress: 75,
    created_at: '2024-03-01T12:00:00Z',
    updated_at: '2024-03-17T12:00:00Z',
  },
  {
    id: '5',
    employee_id: '104',
    employee_name: 'Emily Davis',
    department: 'HR',
    position: 'HR Coordinator',
    goal: 'Complete HR certification',
    description: 'Obtain certification in human resources management',
    target_date: '2024-06-30',
    status: 'in_progress',
    progress: 25,
    created_at: '2024-03-01T13:00:00Z',
    updated_at: '2024-03-18T13:00:00Z',
  },
];

// Mock data for performance metrics
const mockPerformanceMetrics = [
  {
    id: '1',
    employee_id: '101',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    metric: 'Code Quality',
    value: 92,
    target: 90,
    unit: '%',
    trend: 'up',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    employee_id: '101',
    employee_name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    metric: 'Project Completion',
    value: 88,
    target: 85,
    unit: '%',
    trend: 'up',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '3',
    employee_id: '102',
    employee_name: 'Jane Smith',
    department: 'Marketing',
    position: 'Marketing Specialist',
    metric: 'Campaign ROI',
    value: 125,
    target: 120,
    unit: '%',
    trend: 'up',
    created_at: '2024-03-16T11:00:00Z',
    updated_at: '2024-03-16T11:00:00Z',
  },
  {
    id: '4',
    employee_id: '103',
    employee_name: 'Robert Johnson',
    department: 'Sales',
    position: 'Sales Representative',
    metric: 'Sales Target',
    value: 110,
    target: 100,
    unit: '%',
    trend: 'up',
    created_at: '2024-03-17T12:00:00Z',
    updated_at: '2024-03-17T12:00:00Z',
  },
  {
    id: '5',
    employee_id: '104',
    employee_name: 'Emily Davis',
    department: 'HR',
    position: 'HR Coordinator',
    metric: 'Recruitment Efficiency',
    value: 85,
    target: 90,
    unit: '%',
    trend: 'down',
    created_at: '2024-03-18T13:00:00Z',
    updated_at: '2024-03-18T13:00:00Z',
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'green',
    in_progress: 'blue',
    pending: 'yellow',
    overdue: 'red',
  };
  return colors[status] || 'gray';
};

const getTrendIcon = (trend: string) => {
  if (trend === 'up') {
    return <TrendingUp size={16} color="green" />;
  } else if (trend === 'down') {
    return <TrendingDown size={16} color="red" />;
  } else {
    return null;
  }
};

export default function Performance() {
  const [activeTab, setActiveTab] = useState<string | null>('reviews');
  const [performanceReviews, setPerformanceReviews] = useState(mockPerformanceReviews);
  const [performanceGoals, setPerformanceGoals] = useState(mockPerformanceGoals);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);
  const [loading, setLoading] = useState(true);
  const [addReviewModalOpen, setAddReviewModalOpen] = useState(false);
  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const userRole = useOrganizationStore((state) => state.userRole);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, []);

  const canManagePerformance = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleOpenAddReviewModal = () => {
    setAddReviewModalOpen(true);
  };

  const handleOpenAddGoalModal = () => {
    setAddGoalModalOpen(true);
  };

  const handleCloseModals = () => {
    setAddReviewModalOpen(false);
    setAddGoalModalOpen(false);
  };

  const filteredReviews = performanceReviews.filter(review => {
    // Filter by search query
    const matchesSearch = 
      review.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = !filterDepartment || review.department === filterDepartment;
    
    // Filter by status
    const matchesStatus = !filterStatus || review.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const filteredGoals = performanceGoals.filter(goal => {
    // Filter by search query
    const matchesSearch = 
      goal.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.goal.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = !filterDepartment || goal.department === filterDepartment;
    
    // Filter by status
    const matchesStatus = !filterStatus || goal.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const filteredMetrics = performanceMetrics.filter(metric => {
    // Filter by search query
    const matchesSearch = 
      metric.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.metric.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by department
    const matchesDepartment = !filterDepartment || metric.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} fill="gold" color="gold" />);
    }
    
    if (halfStar) {
      stars.push(<Star key="half" size={16} fill="gold" color="gold" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="gray" />);
    }
    
    return (
      <Group gap={2}>
        {stars}
        <Text size="sm" fw={500} ml={4}>{rating.toFixed(1)}</Text>
      </Group>
    );
  };

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Performance Management</Title>
          {canManagePerformance && (
            <Group>
              <Button leftSection={<Plus size={20} />} onClick={handleOpenAddReviewModal}>
                Add Review
              </Button>
              <Button leftSection={<Plus size={20} />} onClick={handleOpenAddGoalModal}>
                Add Goal
              </Button>
            </Group>
          )}
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="reviews" leftSection={<FileText size={16} />}>
              Performance Reviews
            </Tabs.Tab>
            <Tabs.Tab value="goals" leftSection={<Target size={16} />}>
              Performance Goals
            </Tabs.Tab>
            <Tabs.Tab value="metrics" leftSection={<BarChart size={16} />}>
              Performance Metrics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="reviews" pt="md">
            <Paper withBorder radius="md" p="md">
              <Stack mb="md">
                <Group>
                  <TextInput
                    placeholder="Search employees..."
                    leftSection={<Search size={20} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Group>
                    <Select
                      placeholder="Department"
                      data={['All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales']}
                      leftSection={<Filter size={20} />}
                      value={filterDepartment}
                      onChange={setFilterDepartment}
                      clearable
                    />
                    <Select
                      placeholder="Status"
                      data={[
                        { value: 'completed', label: 'Completed' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'pending', label: 'Pending' },
                      ]}
                      leftSection={<Filter size={20} />}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      clearable
                    />
                    <SegmentedControl
                      value={viewMode}
                      onChange={(value) => setViewMode(value as 'list' | 'cards')}
                      data={[
                        { label: 'List', value: 'list' },
                        { label: 'Cards', value: 'cards' },
                      ]}
                    />
                  </Group>
                </Group>
              </Stack>

              {viewMode === 'list' ? (
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Employee</Table.Th>
                      <Table.Th>Department</Table.Th>
                      <Table.Th>Review Period</Table.Th>
                      <Table.Th>Overall Rating</Table.Th>
                      <Table.Th>Goals Achievement</Table.Th>
                      <Table.Th>Status</Table.Th>
                      {canManagePerformance && <Table.Th>Actions</Table.Th>}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredReviews.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={canManagePerformance ? 7 : 6}>
                          <Text ta="center" c="dimmed" py="xl">
                            No performance reviews found
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      filteredReviews.map((review) => (
                        <Table.Tr key={review.id}>
                          <Table.Td>
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.employee_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {review.employee_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {review.position}
                                </Text>
                              </div>
                            </Group>
                          </Table.Td>
                          <Table.Td>{review.department}</Table.Td>
                          <Table.Td>{review.review_period}</Table.Td>
                          <Table.Td>{renderRatingStars(review.overall_rating)}</Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Progress value={review.goals_achievement} size="sm" style={{ width: 100 }} />
                              <Text size="sm">{review.goals_achievement}%</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={getStatusColor(review.status)}>
                              {review.status.replace('_', ' ')}
                            </Badge>
                          </Table.Td>
                          {canManagePerformance && (
                            <Table.Td>
                              <Group gap="xs">
                                <ActionIcon variant="light" color="blue">
                                  <Edit size={16} />
                                </ActionIcon>
                                <ActionIcon variant="light" color="red">
                                  <Trash size={16} />
                                </ActionIcon>
                              </Group>
                            </Table.Td>
                          )}
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              ) : (
                <Grid>
                  {filteredReviews.length === 0 ? (
                    <Grid.Col span={12}>
                      <Text ta="center" c="dimmed" py="xl">
                        No performance reviews found
                      </Text>
                    </Grid.Col>
                  ) : (
                    filteredReviews.map((review) => (
                      <Grid.Col key={review.id} span={{ base: 12, sm: 6, md: 4 }}>
                        <Card withBorder padding="lg" radius="md">
                          <Card.Section withBorder inheritPadding py="xs">
                            <Group justify="space-between">
                              <Group gap="sm">
                                <Avatar
                                  size={40}
                                  radius={40}
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.employee_name}`}
                                />
                                <div>
                                  <Text fw={500} size="sm">
                                    {review.employee_name}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    {review.position}
                                  </Text>
                                </div>
                              </Group>
                              <Badge color={getStatusColor(review.status)}>
                                {review.status.replace('_', ' ')}
                              </Badge>
                            </Group>
                          </Card.Section>

                          <Stack gap="xs" mt="md">
                            <Group justify="space-between">
                              <Text size="sm" fw={500}>Department:</Text>
                              <Text size="sm">{review.department}</Text>
                            </Group>
                            <Group justify="space-between">
                              <Text size="sm" fw={500}>Review Period:</Text>
                              <Text size="sm">{review.review_period}</Text>
                            </Group>
                            <Group justify="space-between">
                              <Text size="sm" fw={500}>Review Date:</Text>
                              <Text size="sm">{new Date(review.review_date).toLocaleDateString()}</Text>
                            </Group>
                            <Group justify="space-between">
                              <Text size="sm" fw={500}>Overall Rating:</Text>
                              {renderRatingStars(review.overall_rating)}
                            </Group>
                            <Group justify="space-between">
                              <Text size="sm" fw={500}>Goals Achievement:</Text>
                              <Group gap="xs">
                                <Progress value={review.goals_achievement} size="sm" style={{ width: 100 }} />
                                <Text size="sm">{review.goals_achievement}%</Text>
                              </Group>
                            </Group>
                          </Stack>

                          <Divider my="md" />

                          <Group justify="space-between">
                            <Text size="sm" fw={500}>Reviewer:</Text>
                            <Text size="sm">{review.reviewer_name}</Text>
                          </Group>

                          {canManagePerformance && (
                            <Group mt="md" justify="flex-end">
                              <ActionIcon variant="light" color="blue">
                                <Edit size={16} />
                              </ActionIcon>
                              <ActionIcon variant="light" color="red">
                                <Trash size={16} />
                              </ActionIcon>
                            </Group>
                          )}
                        </Card>
                      </Grid.Col>
                    ))
                  )}
                </Grid>
              )}
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="goals" pt="md">
            <Paper withBorder radius="md" p="md">
              <Stack mb="md">
                <Group>
                  <TextInput
                    placeholder="Search goals..."
                    leftSection={<Search size={20} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Group>
                    <Select
                      placeholder="Department"
                      data={['All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales']}
                      leftSection={<Filter size={20} />}
                      value={filterDepartment}
                      onChange={setFilterDepartment}
                      clearable
                    />
                    <Select
                      placeholder="Status"
                      data={[
                        { value: 'completed', label: 'Completed' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'overdue', label: 'Overdue' },
                      ]}
                      leftSection={<Filter size={20} />}
                      value={filterStatus}
                      onChange={setFilterStatus}
                      clearable
                    />
                  </Group>
                </Group>
              </Stack>

              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee</Table.Th>
                    <Table.Th>Goal</Table.Th>
                    <Table.Th>Target Date</Table.Th>
                    <Table.Th>Progress</Table.Th>
                    <Table.Th>Status</Table.Th>
                    {canManagePerformance && <Table.Th>Actions</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredGoals.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={canManagePerformance ? 6 : 5}>
                        <Text ta="center" c="dimmed" py="xl">
                          No performance goals found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    filteredGoals.map((goal) => (
                      <Table.Tr key={goal.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              size={40}
                              radius={40}
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${goal.employee_name}`}
                            />
                            <div>
                              <Text fw={500} size="sm">
                                {goal.employee_name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {goal.department} - {goal.position}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>{goal.goal}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {goal.description}
                          </Text>
                        </Table.Td>
                        <Table.Td>{new Date(goal.target_date).toLocaleDateString()}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Progress value={goal.progress} size="sm" style={{ width: 100 }} />
                            <Text size="sm">{goal.progress}%</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(goal.status)}>
                            {goal.status.replace('_', ' ')}
                          </Badge>
                        </Table.Td>
                        {canManagePerformance && (
                          <Table.Td>
                            <Group gap="xs">
                              <ActionIcon variant="light" color="blue">
                                <Edit size={16} />
                              </ActionIcon>
                              <ActionIcon variant="light" color="red">
                                <Trash size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="metrics" pt="md">
            <Paper withBorder radius="md" p="md">
              <Stack mb="md">
                <Group>
                  <TextInput
                    placeholder="Search metrics..."
                    leftSection={<Search size={20} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Select
                    placeholder="Department"
                    data={['All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales']}
                    leftSection={<Filter size={20} />}
                    value={filterDepartment}
                    onChange={setFilterDepartment}
                    clearable
                  />
                </Group>
              </Stack>

              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee</Table.Th>
                    <Table.Th>Metric</Table.Th>
                    <Table.Th>Value</Table.Th>
                    <Table.Th>Target</Table.Th>
                    <Table.Th>Trend</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredMetrics.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text ta="center" c="dimmed" py="xl">
                          No performance metrics found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    filteredMetrics.map((metric) => (
                      <Table.Tr key={metric.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              size={40}
                              radius={40}
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${metric.employee_name}`}
                            />
                            <div>
                              <Text fw={500} size="sm">
                                {metric.employee_name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {metric.department} - {metric.position}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>{metric.metric}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Text size="sm" fw={500}>{metric.value}{metric.unit}</Text>
                            {metric.value >= metric.target ? (
                              <CheckCircle size={16} color="green" />
                            ) : (
                              <XCircle size={16} color="red" />
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>{metric.target}{metric.unit}</Table.Td>
                        <Table.Td>{getTrendIcon(metric.trend)}</Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Add Review Modal */}
      <Modal
        opened={addReviewModalOpen}
        onClose={handleCloseModals}
        title="Add Performance Review"
        size="lg"
      >
        <Stack>
          <Select
            label="Employee"
            placeholder="Select employee"
            data={[
              { value: '101', label: 'John Doe - Engineering' },
              { value: '102', label: 'Jane Smith - Marketing' },
              { value: '103', label: 'Robert Johnson - Sales' },
              { value: '104', label: 'Emily Davis - HR' },
              { value: '105', label: 'Michael Wilson - Engineering' },
            ]}
            required
          />
          <Select
            label="Review Period"
            placeholder="Select review period"
            data={[
              { value: 'Q1 2024', label: 'Q1 2024' },
              { value: 'Q2 2024', label: 'Q2 2024' },
              { value: 'Q3 2024', label: 'Q3 2024' },
              { value: 'Q4 2024', label: 'Q4 2024' },
            ]}
            required
          />
          <TextInput
            label="Review Date"
            placeholder="Select review date"
            type="date"
            required
          />
          <TextInput
            label="Overall Rating"
            placeholder="Enter overall rating (1-5)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            required
          />
          <TextInput
            label="Goals Achievement"
            placeholder="Enter goals achievement percentage"
            type="number"
            min={0}
            max={100}
            required
          />
          <TextInput
            label="Skills Rating"
            placeholder="Enter skills rating (1-5)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            required
          />
          <TextInput
            label="Attendance Rating"
            placeholder="Enter attendance rating (1-5)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            required
          />
          <TextInput
            label="Teamwork Rating"
            placeholder="Enter teamwork rating (1-5)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            required
          />
          <TextInput
            label="Leadership Rating"
            placeholder="Enter leadership rating (1-5)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            required
          />
          <Textarea
            label="Strengths"
            placeholder="Enter employee strengths"
            minRows={3}
            required
          />
          <Textarea
            label="Areas for Improvement"
            placeholder="Enter areas for improvement"
            minRows={3}
            required
          />
          <Textarea
            label="Goals for Next Period"
            placeholder="Enter goals for next period"
            minRows={3}
            required
          />
          <Textarea
            label="Comments"
            placeholder="Enter additional comments"
            minRows={3}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleCloseModals}>
              Cancel
            </Button>
            <Button>
              Add Review
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        opened={addGoalModalOpen}
        onClose={handleCloseModals}
        title="Add Performance Goal"
        size="lg"
      >
        <Stack>
          <Select
            label="Employee"
            placeholder="Select employee"
            data={[
              { value: '101', label: 'John Doe - Engineering' },
              { value: '102', label: 'Jane Smith - Marketing' },
              { value: '103', label: 'Robert Johnson - Sales' },
              { value: '104', label: 'Emily Davis - HR' },
              { value: '105', label: 'Michael Wilson - Engineering' },
            ]}
            required
          />
          <TextInput
            label="Goal"
            placeholder="Enter goal title"
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter goal description"
            minRows={3}
            required
          />
          <TextInput
            label="Target Date"
            placeholder="Select target date"
            type="date"
            required
          />
          <TextInput
            label="Progress"
            placeholder="Enter progress percentage"
            type="number"
            min={0}
            max={100}
            required
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: 'completed', label: 'Completed' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Overdue' },
            ]}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleCloseModals}>
              Cancel
            </Button>
            <Button>
              Add Goal
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
} 