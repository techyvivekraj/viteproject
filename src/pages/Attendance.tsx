import React, { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Group,
  Stack,
  Table,
  Text,
  Badge,
  ActionIcon,
  Button,
  Menu,
  Select,
  TextInput,
  Grid,
  Card,
  RingProgress,
  Center,
  Tabs,
  Image,
  Box,
  Modal,
  Textarea,
  Avatar,
  Loader,
  Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  FileEdit,
  Clock4,
  UserCheck,
  UserX,
  CalendarRange,
  MapPin,
  Calendar,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CheckCircle,
  XOctagon,
} from 'lucide-react';
import type { AttendanceRecord, TimesheetEntry } from '../types';
import { useOrganizationStore } from '../store/organization';

// Mock data for attendance records
const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    date: '2024-03-20',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'present',
    workHours: '9h',
    department: 'Engineering',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    date: '2024-03-20',
    checkIn: '09:15 AM',
    checkOut: '05:45 PM',
    status: 'late',
    workHours: '8.5h',
    department: 'Design',
  },
  {
    id: '3',
    employeeName: 'Mike Johnson',
    date: '2024-03-20',
    checkIn: '-',
    checkOut: '-',
    status: 'absent',
    workHours: '0h',
    department: 'Marketing',
  },
];

// Mock timesheet data
const mockTimesheets: TimesheetEntry[] = [
  {
    id: '1',
    employeeId: '101',
    employeeName: 'John Doe',
    department: 'Engineering',
    date: '2024-03-18',
    day: 'Monday',
    hours: 8,
    tasks: 'Project planning, Team meeting',
    status: 'pending',
  },
  {
    id: '2',
    employeeId: '102',
    employeeName: 'Jane Smith',
    department: 'Design',
    date: '2024-03-18',
    day: 'Monday',
    hours: 7.5,
    tasks: 'UI design, Client presentation',
    status: 'approved',
    comments: 'Good work on the client presentation',
  },
  {
    id: '3',
    employeeId: '103',
    employeeName: 'Mike Johnson',
    department: 'Marketing',
    date: '2024-03-18',
    day: 'Monday',
    hours: 8,
    tasks: 'Campaign planning, Content review',
    status: 'rejected',
    comments: 'Please provide more details on campaign metrics',
  },
];

// Mock location data
const mockLocation = {
  latitude: '12.9716° N',
  longitude: '77.5946° E',
  address: 'Tech Park, Silicon Valley Road, Bangalore',
  lastUpdated: '2024-03-20 15:30',
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    present: 'green',
    late: 'yellow',
    absent: 'red',
    'half-day': 'blue',
    holiday: 'grape',
    leave: 'orange',
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status] || 'gray';
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactNode> = {
    present: <CheckCircle2 size={16} />,
    late: <Clock size={16} />,
    absent: <XCircle size={16} />,
    'half-day': <AlertCircle size={16} />,
    pending: <Clock size={16} />,
    approved: <ThumbsUp size={16} />,
    rejected: <ThumbsDown size={16} />,
  };
  return icons[status] || <AlertCircle size={16} />;
};

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchValue, setSearchValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('daily');
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetEntry | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'check-in' | 'check-out'>('check-in');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);
  const userRole = useOrganizationStore((state) => state.userRole);

  const isManager = ['owner', 'admin', 'hr_manager'].includes(userRole || '');

  // Mock statistics
  const statistics = [
    {
      title: 'Present',
      value: '85%',
      color: 'green',
      icon: <UserCheck size={20} />,
    },
    {
      title: 'Absent',
      value: '10%',
      color: 'red',
      icon: <UserX size={20} />,
    },
    {
      title: 'Late',
      value: '5%',
      color: 'yellow',
      icon: <Clock4 size={20} />,
    },
    {
      title: 'On Leave',
      value: '3',
      color: 'blue',
      icon: <CalendarRange size={20} />,
    },
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLocation = async () => {
    setGettingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error) {
      setLocationError('Failed to get your location. Please enable location services.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!currentLocation) {
      setLocationError('Location is required to mark attendance');
      return;
    }

    setMarkingAttendance(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      setAttendanceSuccess(true);
      setTimeout(() => {
        setMarkAttendanceOpen(false);
        setAttendanceSuccess(false);
        setCurrentLocation(null);
        setAttendanceType('check-in');
      }, 2000);
    } catch (error) {
      setLocationError('Failed to mark attendance. Please try again.');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const handleApproval = (status: 'approved' | 'rejected') => {
    if (!selectedTimesheet) return;

    // Here you would typically make an API call to update the timesheet status
    console.log('Updating timesheet:', {
      id: selectedTimesheet.id,
      status,
      comments: approvalComment,
    });

    setApprovalModalOpen(false);
    setApprovalComment('');
    setSelectedTimesheet(null);
  };

  // Effect to get location when modal opens
  useEffect(() => {
    if (markAttendanceOpen) {
      getLocation();
    } else {
      setCurrentLocation(null);
      setLocationError(null);
      setAttendanceSuccess(false);
    }
  }, [markAttendanceOpen]);

  const renderDailyAttendance = () => (
    <Stack gap="md">
      <Group grow>
        <DatePickerInput
          label="Select Date"
          placeholder="Pick a date"
          value={selectedDate}
          onChange={setSelectedDate}
          leftSection={<CalendarRange size={16} />}
        />
        <TextInput
          placeholder="Search employees..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          leftSection={<Search size={16} />}
        />
        <Select
          placeholder="Department"
          value={departmentFilter}
          onChange={setDepartmentFilter}
          data={['All', 'Engineering', 'Design', 'Marketing', 'HR']}
          leftSection={<Filter size={16} />}
        />
        <Select
          placeholder="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          data={['All', 'Present', 'Late', 'Absent', 'Half-day']}
          leftSection={<Filter size={16} />}
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Check In</Table.Th>
            <Table.Th>Check Out</Table.Th>
            <Table.Th>Work Hours</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {mockAttendance.map((record) => (
            <Table.Tr key={record.id}>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {record.employeeName}
                </Text>
              </Table.Td>
              <Table.Td>{record.department}</Table.Td>
              <Table.Td>{record.date}</Table.Td>
              <Table.Td>{record.checkIn}</Table.Td>
              <Table.Td>{record.checkOut}</Table.Td>
              <Table.Td>{record.workHours}</Table.Td>
              <Table.Td>
                <Badge
                  color={getStatusColor(record.status)}
                  leftSection={getStatusIcon(record.status)}
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <MoreVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<FileEdit size={16} />}>
                      Edit Record
                    </Menu.Item>
                    <Menu.Item leftSection={<Clock size={16} />}>
                      Update Time
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );

  const renderWeeklyTimesheet = () => (
    <Stack gap="md">
      <Group justify="space-between">
        <Group>
          <DatePickerInput
            label="Select Week"
            placeholder="Pick a date"
            value={selectedDate}
            onChange={setSelectedDate}
            leftSection={<CalendarRange size={16} />}
          />
          {!isManager && (
            <Button
              variant="light"
              leftSection={<FileEdit size={16} />}
              onClick={() => {/* Handle timesheet submission */}}
            >
              Submit Timesheet
            </Button>
          )}
        </Group>
        <Group>
          <Select
            placeholder="Filter by Status"
            data={['All', 'Pending', 'Approved', 'Rejected']}
            leftSection={<Filter size={16} />}
          />
          <Select
            placeholder="Filter by Department"
            data={['All', 'Engineering', 'Design', 'Marketing', 'HR']}
            leftSection={<Filter size={16} />}
          />
        </Group>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Employee</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Hours</Table.Th>
            <Table.Th>Tasks</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {mockTimesheets.map((timesheet) => (
            <Table.Tr key={timesheet.id}>
              <Table.Td>
                <Group gap="sm">
                  <Avatar
                    size={30}
                    radius={30}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${timesheet.employeeName}`}
                  />
                  <Text size="sm" fw={500}>
                    {timesheet.employeeName}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>{timesheet.department}</Table.Td>
              <Table.Td>{timesheet.date}</Table.Td>
              <Table.Td>{timesheet.hours}h</Table.Td>
              <Table.Td>
                <Text size="sm" lineClamp={2}>
                  {timesheet.tasks}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge
                  color={getStatusColor(timesheet.status)}
                  leftSection={getStatusIcon(timesheet.status)}
                >
                  {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {isManager && timesheet.status === 'pending' && (
                    <>
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => {
                          setSelectedTimesheet(timesheet);
                          setApprovalModalOpen(true);
                        }}
                      >
                        <ThumbsUp size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => {
                          setSelectedTimesheet(timesheet);
                          setApprovalModalOpen(true);
                        }}
                      >
                        <ThumbsDown size={16} />
                      </ActionIcon>
                    </>
                  )}
                  {timesheet.comments && (
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setSelectedTimesheet(timesheet);
                        setApprovalComment(timesheet.comments || '');
                        setApprovalModalOpen(true);
                      }}
                    >
                      <MessageCircle size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setApprovalComment('');
          setSelectedTimesheet(null);
        }}
        title={
          <Text size="lg" fw={500}>
            {selectedTimesheet?.status === 'pending'
              ? 'Timesheet Approval'
              : 'Timesheet Comments'}
          </Text>
        }
      >
        <Stack>
          {selectedTimesheet && (
            <>
              <Group>
                <Text fw={500}>Employee:</Text>
                <Text>{selectedTimesheet.employeeName}</Text>
              </Group>
              <Group>
                <Text fw={500}>Date:</Text>
                <Text>{selectedTimesheet.date}</Text>
              </Group>
              <Group>
                <Text fw={500}>Hours:</Text>
                <Text>{selectedTimesheet.hours}h</Text>
              </Group>
              <Text fw={500}>Tasks:</Text>
              <Text>{selectedTimesheet.tasks}</Text>
            </>
          )}

          <Textarea
            label="Comments"
            placeholder="Add your comments here..."
            value={approvalComment}
            onChange={(event) => setApprovalComment(event.currentTarget.value)}
            minRows={3}
          />

          {selectedTimesheet?.status === 'pending' && (
            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                color="red"
                onClick={() => handleApproval('rejected')}
              >
                Reject
              </Button>
              <Button
                color="green"
                onClick={() => handleApproval('approved')}
              >
                Approve
              </Button>
            </Group>
          )}
        </Stack>
      </Modal>
    </Stack>
  );

  const renderLocationViewer = () => (
    <Stack gap="md">
      <Card withBorder>
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={500}>Current Location</Text>
            <Text size="sm" c="dimmed">Last updated: {mockLocation.lastUpdated}</Text>
          </div>
          <Badge leftSection={<MapPin size={14} />} color="blue">
            Office Location
          </Badge>
        </Group>
        <Image
          src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,12,0/600x300@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4bG1ja2oxMnozMnFwOWdqcDhqbGx5In0.example"
          alt="Location Map"
          radius="md"
          mb="md"
        />
        <Group grow>
          <div>
            <Text size="sm" c="dimmed">Latitude</Text>
            <Text>{mockLocation.latitude}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Longitude</Text>
            <Text>{mockLocation.longitude}</Text>
          </div>
        </Group>
        <Text size="sm" mt="md">
          <Text component="span" c="dimmed">Address: </Text>
          {mockLocation.address}
        </Text>
      </Card>
    </Stack>
  );

  const renderMarkAttendanceModal = () => (
    <Modal
      opened={markAttendanceOpen}
      onClose={() => setMarkAttendanceOpen(false)}
      title={<Text size="lg" fw={500}>Mark Attendance</Text>}
      size="md"
    >
      <Stack>
        {attendanceSuccess ? (
          <Alert
            icon={<CheckCircle size={16} />}
            title="Success!"
            color="green"
            variant="light"
          >
            {attendanceType === 'check-in' ? 'Checked in' : 'Checked out'} successfully at {getCurrentTime()}
          </Alert>
        ) : (
          <>
            <Group>
              <Text fw={500}>Date:</Text>
              <Text>{getCurrentDate()}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Time:</Text>
              <Text>{getCurrentTime()}</Text>
            </Group>

            <Select
              label="Attendance Type"
              value={attendanceType}
              onChange={(value) => {
                if (value === 'check-in' || value === 'check-out') {
                  setAttendanceType(value);
                }
              }}
              data={[
                { value: 'check-in', label: 'Check In' },
                { value: 'check-out', label: 'Check Out' },
              ]}
              mb="md"
            />

            <Card withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={500}>Location Status</Text>
                {gettingLocation ? (
                  <Group gap="xs">
                    <Loader size="xs" />
                    <Text size="sm">Getting location...</Text>
                  </Group>
                ) : currentLocation ? (
                  <Badge color="green" leftSection={<CheckCircle2 size={14} />}>
                    Location Acquired
                  </Badge>
                ) : (
                  <Badge color="yellow" leftSection={<AlertCircle size={14} />}>
                    Waiting for location
                  </Badge>
                )}
              </Group>

              {locationError && (
                <Alert
                  icon={<XOctagon size={16} />}
                  title="Location Error"
                  color="red"
                  variant="light"
                  mb="md"
                >
                  {locationError}
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    onClick={getLocation}
                    mt="xs"
                  >
                    Retry
                  </Button>
                </Alert>
              )}

              {currentLocation && (
                <Image
                  src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${currentLocation.lng},${currentLocation.lat},15,0/400x200@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4bG1ja2oxMnozMnFwOWdqcDhqbGx5In0.example`}
                  alt="Current Location"
                  radius="md"
                />
              )}
            </Card>

            <Group justify="flex-end" mt="xl">
              <Button
                variant="light"
                onClick={() => setMarkAttendanceOpen(false)}
                disabled={markingAttendance}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMarkAttendance}
                loading={markingAttendance}
                disabled={!currentLocation || markingAttendance}
                leftSection={attendanceType === 'check-in' ? <Clock size={16} /> : <Clock4 size={16} />}
              >
                {markingAttendance
                  ? 'Processing...'
                  : attendanceType === 'check-in'
                  ? 'Check In'
                  : 'Check Out'}
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Attendance Management</Title>
        <Button
          leftSection={<Clock size={20} />}
          onClick={() => setMarkAttendanceOpen(true)}
        >
          Mark Attendance
        </Button>
      </Group>

      {/* Statistics Cards */}
      <Grid>
        {statistics.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder padding="lg" radius="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="sm" c="dimmed">
                    {stat.title}
                  </Text>
                  <Text size="xl" fw={700}>
                    {stat.value}
                  </Text>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: parseInt(stat.value.replace('%', '')), color: stat.color }]}
                  label={
                    <Center>
                      {stat.icon}
                    </Center>
                  }
                />
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Paper withBorder radius="md" p="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="daily" leftSection={<Calendar size={16} />}>
              Daily Log
            </Tabs.Tab>
            <Tabs.Tab value="weekly" leftSection={<ClipboardList size={16} />}>
              Weekly Timesheet
            </Tabs.Tab>
            <Tabs.Tab value="location" leftSection={<MapPin size={16} />}>
              Location
            </Tabs.Tab>
          </Tabs.List>

          <Box pt="md">
            {activeTab === 'daily' && renderDailyAttendance()}
            {activeTab === 'weekly' && renderWeeklyTimesheet()}
            {activeTab === 'location' && renderLocationViewer()}
          </Box>
        </Tabs>
      </Paper>

      {renderMarkAttendanceModal()}
    </Stack>
  );
}