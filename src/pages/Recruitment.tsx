import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Table,
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
  UserPlus,
  Building,
  Briefcase,
  Mail,
  Phone,
  LogOut,
} from 'lucide-react';
import { useOrganizationStore } from '../store/organization';
import type { Candidate, Interview, recruitmentProcess, ResignationRequest } from '../types';

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    first_name: 'Alice',
    last_name: 'Johnson',
    email: 'alice@example.com',
    phone: '+1234567890',
    position: 'Frontend Developer',
    department: 'Engineering',
    experience_years: 3,
    resume_url: 'https://example.com/resume1.pdf',
    status: 'interview_scheduled',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    first_name: 'Bob',
    last_name: 'Williams',
    email: 'bob@example.com',
    phone: '+1234567891',
    position: 'UI Designer',
    department: 'Design',
    experience_years: 2,
    resume_url: 'https://example.com/resume2.pdf',
    status: 'interviewed',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-12T14:30:00Z',
  },
  {
    id: '3',
    first_name: 'Carol',
    last_name: 'Davis',
    email: 'carol@example.com',
    phone: '+1234567892',
    position: 'Backend Developer',
    department: 'Engineering',
    experience_years: 5,
    resume_url: 'https://example.com/resume3.pdf',
    status: 'selected',
    created_at: '2024-03-05T11:00:00Z',
    updated_at: '2024-03-08T16:45:00Z',
  },
];

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidate_id: '1',
    candidate_name: 'Alice Johnson',
    position: 'Frontend Developer',
    department: 'Engineering',
    interviewer_id: '101',
    interviewer_name: 'John Doe',
    date: '2024-03-20',
    time: '10:00',
    duration: 60,
    type: 'online',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    created_at: '2024-03-15T10:30:00Z',
    updated_at: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    candidate_id: '2',
    candidate_name: 'Bob Williams',
    position: 'UI Designer',
    department: 'Design',
    interviewer_id: '102',
    interviewer_name: 'Jane Smith',
    date: '2024-03-12',
    time: '14:00',
    duration: 45,
    type: 'in_person',
    location: 'Conference Room A',
    status: 'completed',
    created_at: '2024-03-10T09:30:00Z',
    updated_at: '2024-03-12T15:30:00Z',
  },
];

const mockrecruitmentProcesses: recruitmentProcess[] = [
  {
    id: '1',
    candidate_id: '3',
    candidate_name: 'Carol Davis',
    position: 'Backend Developer',
    department: 'Engineering',
    status: 'documents_requested',
    required_documents: [],
    background_verification: {
      id: '101',
      recruitment_id: '1',
      status: 'pending',
      education_verified: false,
      employment_verified: false,
      criminal_record_verified: false,
      reference_checks: [],
    },
    offer_letter: {
      id: '201',
      recruitment_id: '1',
      position: 'Backend Developer',
      department: 'Engineering',
      salary: 85000,
      joining_date: '2024-04-15',
      status: 'draft',
    },
    created_at: '2024-03-08T16:45:00Z',
    updated_at: '2024-03-09T10:15:00Z',
  },
];

// Mock data for resignation requests
const mockResignationRequests: ResignationRequest[] = [
  {
    id: '1',
    employee_id: '101',
    employee_name: 'John Smith',
    department: 'Engineering',
    position: 'Senior Developer',
    resignation_date: '2024-04-15',
    last_working_day: '2024-05-15',
    reason: 'Career change and better opportunities elsewhere',
    status: 'pending',
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
  },
  {
    id: '2',
    employee_id: '102',
    employee_name: 'Sarah Johnson',
    department: 'Marketing',
    position: 'Marketing Manager',
    resignation_date: '2024-04-01',
    last_working_day: '2024-04-30',
    reason: 'Relocating to another city',
    status: 'approved',
    manager_comments: 'Approved with standard notice period',
    approved_by: 'Manager Name',
    approved_at: '2024-03-15T10:00:00Z',
    created_at: '2024-03-05T14:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '3',
    employee_id: '103',
    employee_name: 'Michael Brown',
    department: 'Sales',
    position: 'Sales Representative',
    resignation_date: '2024-03-25',
    last_working_day: '2024-04-25',
    reason: 'Personal reasons',
    status: 'rejected',
    manager_comments: 'Rejected due to critical project timeline',
    rejected_by: 'Manager Name',
    rejected_at: '2024-03-18T11:30:00Z',
    created_at: '2024-03-12T09:30:00Z',
    updated_at: '2024-03-18T11:30:00Z',
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'yellow',
    interview_scheduled: 'blue',
    interviewed: 'indigo',
    selected: 'green',
    rejected: 'red',
    hired: 'teal',
    documents_requested: 'orange',
    documents_submitted: 'cyan',
    background_verified: 'lime',
    offer_sent: 'violet',
    offer_accepted: 'green',
    offer_rejected: 'red',
    completed: 'teal',
  };
  return colors[status] || 'gray';
};

export default function Recruitment() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('candidates');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [recruitmentProcesses, setrecruitmentProcesses] = useState<recruitmentProcess[]>([]);
  const [resignationRequests, setResignationRequests] = useState<ResignationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ResignationRequest | null>(null);
  const [managerComments, setManagerComments] = useState('');
  const userRole = useOrganizationStore((state) => state.userRole);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCandidates(mockCandidates);
      setInterviews(mockInterviews);
      setrecruitmentProcesses(mockrecruitmentProcesses);
      setResignationRequests(mockResignationRequests);
      setLoading(false);
    };

    fetchData();
  }, []);

  const canManagerecruitment = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  const handleAddCandidate = () => {
    navigate('/recruitment/candidates/add');
  };

  const handleScheduleInterview = (candidateId: string) => {
    navigate(`/recruitment/interviews/schedule/${candidateId}`);
  };

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/recruitment/candidates/${candidateId}`);
  };

  const handleViewInterview = (interviewId: string) => {
    navigate(`/recruitment/interviews/${interviewId}`);
  };

  const handleViewrecruitment = (recruitmentId: string) => {
    navigate(`/recruitment/process/${recruitmentId}`);
  };

  const handleStartrecruitment = (candidateId: string) => {
    navigate(`/recruitment/process/start/${candidateId}`);
  };

  const handleOpenApproveModal = (request: ResignationRequest) => {
    setSelectedRequest(request);
    setManagerComments('');
    setApproveModalOpen(true);
  };

  const handleOpenRejectModal = (request: ResignationRequest) => {
    setSelectedRequest(request);
    setManagerComments('');
    setRejectModalOpen(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the state
      setResignationRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'approved', 
                manager_comments: managerComments,
                approved_by: 'Current Manager',
                approved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : req
        )
      );
      
      setApproveModalOpen(false);
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the state
      setResignationRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'rejected', 
                manager_comments: managerComments,
                rejected_by: 'Current Manager',
                rejected_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : req
        )
      );
      
      setRejectModalOpen(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
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
          <Title order={2}>Recruitment</Title>
          {canManagerecruitment && (
            <Button leftSection={<Plus size={20} />} onClick={handleAddCandidate}>
              Add Candidate
            </Button>
          )}
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="candidates" leftSection={<UserPlus size={16} />}>
              Candidates
            </Tabs.Tab>
            <Tabs.Tab value="interviews" leftSection={<Calendar size={16} />}>
              Interviews
            </Tabs.Tab>
            <Tabs.Tab value="recruitment" leftSection={<FileText size={16} />}>
              Recruitment Process
            </Tabs.Tab>
            <Tabs.Tab value="resignations" leftSection={<LogOut size={16} />}>
              Resignation Requests
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="candidates" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search candidates..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Grid>
                {candidates.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No candidates found
                    </Text>
                  </Grid.Col>
                ) : (
                  candidates.map((candidate) => (
                    <Grid.Col key={candidate.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.first_name}${candidate.last_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {candidate.first_name} {candidate.last_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {candidate.position}
                                </Text>
                              </div>
                            </Group>
                            <Menu withinPortal position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <MoreVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<Calendar size={16} />}
                                  onClick={() => handleScheduleInterview(candidate.id)}
                                >
                                  Schedule Interview
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<FileText size={16} />}
                                  onClick={() => handleViewCandidate(candidate.id)}
                                >
                                  View Details
                                </Menu.Item>
                                {candidate.status === 'selected' && (
                                  <Menu.Item
                                    leftSection={<UserPlus size={16} />}
                                    onClick={() => handleStartrecruitment(candidate.id)}
                                  >
                                    Start recruitment
                                  </Menu.Item>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Group gap="xs">
                            <Building size={16} />
                            <Text size="sm">{candidate.department}</Text>
                          </Group>
                          <Group gap="xs">
                            <Briefcase size={16} />
                            <Text size="sm">{candidate.experience_years} years experience</Text>
                          </Group>
                          <Group gap="xs">
                            <Mail size={16} />
                            <Text size="sm">{candidate.email}</Text>
                          </Group>
                          <Group gap="xs">
                            <Phone size={16} />
                            <Text size="sm">{candidate.phone}</Text>
                          </Group>
                        </Stack>

                        <Group mt="md" justify="space-between">
                          <Badge color={getStatusColor(candidate.status)}>
                            {candidate.status.replace('_', ' ')}
                          </Badge>
                          <Button
                            variant="light"
                            size="xs"
                            onClick={() => handleViewCandidate(candidate.id)}
                          >
                            View Details
                          </Button>
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="interviews" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search interviews..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Grid>
                {interviews.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No interviews scheduled
                    </Text>
                  </Grid.Col>
                ) : (
                  interviews.map((interview) => (
                    <Grid.Col key={interview.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidate_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {interview.candidate_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {interview.position}
                                </Text>
                              </div>
                            </Group>
                            <Menu withinPortal position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <MoreVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<FileText size={16} />}
                                  onClick={() => handleViewInterview(interview.id)}
                                >
                                  View Details
                                </Menu.Item>
                                {interview.status === 'scheduled' && (
                                  <Menu.Item
                                    leftSection={<Calendar size={16} />}
                                    onClick={() => handleViewInterview(interview.id)}
                                  >
                                    Join Meeting
                                  </Menu.Item>
                                )}
                                {interview.status === 'completed' && !interview.feedback && (
                                  <Menu.Item
                                    leftSection={<FileText size={16} />}
                                    onClick={() => navigate(`/recruitment/interviews/${interview.id}/feedback`)}
                                  >
                                    Add Feedback
                                  </Menu.Item>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Group gap="xs">
                            <Building size={16} />
                            <Text size="sm">{interview.department}</Text>
                          </Group>
                          <Group gap="xs">
                            <Calendar size={16} />
                            <Text size="sm">{interview.date} at {interview.time}</Text>
                          </Group>
                          <Group gap="xs">
                            <Clock size={16} />
                            <Text size="sm">{interview.duration} minutes</Text>
                          </Group>
                          <Group gap="xs">
                            <UserPlus size={16} />
                            <Text size="sm">Interviewer: {interview.interviewer_name}</Text>
                          </Group>
                        </Stack>

                        <Group mt="md" justify="space-between">
                          <Badge color={getStatusColor(interview.status)}>
                            {interview.status.replace('_', ' ')}
                          </Badge>
                          <Button
                            variant="light"
                            size="xs"
                            onClick={() => handleViewInterview(interview.id)}
                          >
                            View Details
                          </Button>
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="recruitment" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search recruitment processes..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Grid>
                {recruitmentProcesses.length === 0 ? (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed" py="xl">
                      No recruitment processes found
                    </Text>
                  </Grid.Col>
                ) : (
                  recruitmentProcesses.map((process) => (
                    <Grid.Col key={process.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card withBorder padding="lg" radius="md">
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="sm">
                              <Avatar
                                size={40}
                                radius={40}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${process.candidate_name}`}
                              />
                              <div>
                                <Text fw={500} size="sm">
                                  {process.candidate_name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {process.position}
                                </Text>
                              </div>
                            </Group>
                            <Menu withinPortal position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <MoreVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<FileText size={16} />}
                                  onClick={() => handleViewrecruitment(process.id)}
                                >
                                  View Details
                                </Menu.Item>
                                {process.status === 'documents_requested' && (
                                  <Menu.Item
                                    leftSection={<FileText size={16} />}
                                    onClick={() => navigate(`/recruitment/process/${process.id}/documents`)}
                                  >
                                    Request Documents
                                  </Menu.Item>
                                )}
                                {process.status === 'documents_submitted' && (
                                  <Menu.Item
                                    leftSection={<CheckCircle size={16} />}
                                    onClick={() => navigate(`/recruitment/process/${process.id}/background-verification`)}
                                  >
                                    Background Verification
                                  </Menu.Item>
                                )}
                                {process.status === 'background_verified' && (
                                  <Menu.Item
                                    leftSection={<FileText size={16} />}
                                    onClick={() => navigate(`/recruitment/process/${process.id}/offer-letter`)}
                                  >
                                    Generate Offer Letter
                                  </Menu.Item>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                          <Group gap="xs">
                            <Building size={16} />
                            <Text size="sm">{process.department}</Text>
                          </Group>
                          <Group gap="xs">
                            <Calendar size={16} />
                            <Text size="sm">Started: {new Date(process.created_at).toLocaleDateString()}</Text>
                          </Group>
                          <Group gap="xs">
                            <Clock size={16} />
                            <Text size="sm">Last Updated: {new Date(process.updated_at).toLocaleDateString()}</Text>
                          </Group>
                        </Stack>

                        <Group mt="md" justify="space-between">
                          <Badge color={getStatusColor(process.status)}>
                            {process.status.replace('_', ' ')}
                          </Badge>
                          <Button
                            variant="light"
                            size="xs"
                            onClick={() => handleViewrecruitment(process.id)}
                          >
                            View Details
                          </Button>
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))
                )}
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="resignations" pt="md">
            <Paper withBorder radius="md" p="md">
              <Group mb="md" grow>
                <TextInput
                  placeholder="Search resignation requests..."
                  leftSection={<Search size={20} />}
                />
              </Group>

              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee</Table.Th>
                    <Table.Th>Department</Table.Th>
                    <Table.Th>Position</Table.Th>
                    <Table.Th>Resignation Date</Table.Th>
                    <Table.Th>Last Working Day</Table.Th>
                    <Table.Th>Reason</Table.Th>
                    <Table.Th>Status</Table.Th>
                    {canManagerecruitment && <Table.Th>Actions</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {resignationRequests.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={canManagerecruitment ? 9 : 8}>
                        <Text ta="center" c="dimmed" py="xl">
                          No resignation requests found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    resignationRequests.map((request) => (
                      <Table.Tr key={request.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              size={32}
                              radius={32}
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.employee_name}`}
                            />
                            <Text size="sm" fw={500}>
                              {request.employee_name}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>{request.department}</Table.Td>
                        <Table.Td>{request.position}</Table.Td>
                        <Table.Td>{new Date(request.resignation_date).toLocaleDateString()}</Table.Td>
                        <Table.Td>{new Date(request.last_working_day).toLocaleDateString()}</Table.Td>
                        <Table.Td>
                          <Tooltip label={request.reason} multiline w={220}>
                            <Text size="sm" truncate="end" maw={150}>
                              {request.reason}
                            </Text>
                          </Tooltip>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          {request.status === 'approved' && (
                            <Text size="xs" c="dimmed" mt={4}>
                              By {request.approved_by} on {new Date(request.approved_at!).toLocaleDateString()}
                            </Text>
                          )}
                          {request.status === 'rejected' && (
                            <Text size="xs" c="dimmed" mt={4}>
                              By {request.rejected_by} on {new Date(request.rejected_at!).toLocaleDateString()}
                            </Text>
                          )}
                        </Table.Td>
                        {canManagerecruitment && (
                          <Table.Td>
                            {request.status === 'pending' ? (
                              <Group gap="xs">
                                <ActionIcon
                                  variant="light"
                                  color="green"
                                  onClick={() => handleOpenApproveModal(request)}
                                >
                                  <CheckCircle size={16} />
                                </ActionIcon>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() => handleOpenRejectModal(request)}
                                >
                                  <XCircle size={16} />
                                </ActionIcon>
                              </Group>
                            ) : (
                              <Text size="sm" c="dimmed">
                                {request.manager_comments && (
                                  <Tooltip label={request.manager_comments} multiline w={220}>
                                    <Text size="sm" truncate="end" maw={150}>
                                      {request.manager_comments}
                                    </Text>
                                  </Tooltip>
                                )}
                              </Text>
                            )}
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Approve Resignation Modal */}
      <Modal
        opened={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Resignation Request"
        size="md"
      >
        {selectedRequest && (
          <Stack>
            <Text>
              Are you sure you want to approve the resignation request from {selectedRequest.employee_name}?
            </Text>
            <Text size="sm" c="dimmed">
              This will initiate the offboarding process for this employee.
            </Text>
            <Textarea
              label="Manager Comments"
              placeholder="Enter any comments about this approval"
              value={managerComments}
              onChange={(e) => setManagerComments(e.currentTarget.value)}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setApproveModalOpen(false)}>
                Cancel
              </Button>
              <Button color="green" onClick={handleApproveRequest}>
                Approve
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Reject Resignation Modal */}
      <Modal
        opened={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Resignation Request"
        size="md"
      >
        {selectedRequest && (
          <Stack>
            <Text>
              Are you sure you want to reject the resignation request from {selectedRequest.employee_name}?
            </Text>
            <Text size="sm" c="dimmed">
              This will require the employee to continue working or submit a new request.
            </Text>
            <Textarea
              label="Manager Comments"
              placeholder="Enter reason for rejection"
              value={managerComments}
              onChange={(e) => setManagerComments(e.currentTarget.value)}
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={handleRejectRequest}>
                Reject
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
} 