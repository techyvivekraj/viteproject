import { useMemo } from 'react';
import { 
    Text, 
    Paper, 
    Group, 
    Select, 
    TextInput, 
    Badge,
    ActionIcon,
    Menu,
    Stack,
    Tooltip
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { 
    IconCheck, 
    IconX, 
    IconDotsVertical, 
    IconCamera,
    IconClock,
    IconCalendar 
} from '@tabler/icons-react';
import DataTable from '../../components/DataTable/datatable';
import { useAttendance } from '../../hooks/useAttendance';
import { capitalizeFirstLetter } from '../../utils/utils';

const statusColors = {
    present: 'green',
    absent: 'red',
    'half-day': 'yellow',
    late: 'orange',
    leave: 'blue',
    'not_set': 'gray'
};

const approvalStatusColors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red'
};

export default function Attendance() {
    const { 
        attendance,
        loading, 
        filters, 
        handleFilterChange,
        handleCheckIn,
        handleCheckOut,
        handleUpdateApproval,
        handlePageChange
    } = useAttendance();

    const columns = useMemo(() => [
        {
            header: 'Employee',
            accessor: 'employee',
            render: (item) => (
                <Group spacing="xs">
                    <div>
                        <Text size="sm" fw={500}>
                            {item.employee?.name || 'N/A'}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {item.employee?.code || 'No Code'}
                        </Text>
                    </div>
                </Group>
            )
        },
        {
            header: 'Department',
            accessor: 'department',
            render: (item) => (
                <Text size="sm">
                    {capitalizeFirstLetter(item.department || 'Not Assigned')}
                </Text>
            )
        },
        {
            header: 'Shift',
            accessor: 'shift',
            render: (item) => (
                <Tooltip label={`${item.shift?.startTime || '09:00'} - ${item.shift?.endTime || '18:00'}`}>
                    <Text size="sm">
                        {item.shift?.name || 'Default'}
                    </Text>
                </Tooltip>
            )
        },
        {
            header: 'Check In/Out',
            accessor: 'checkIn',
            render: (item) => (
                <Group spacing={4}>
                    <IconClock size={16} />
                    <Group spacing="xs">
                        <Text size="sm">
                            {item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : '-'}
                            {' / '}
                            {item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : '-'}
                        </Text>
                    </Group>
                </Group>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <Group spacing="xs">
                    <Badge color={statusColors[item.status || 'not_set']} variant="light">
                        {capitalizeFirstLetter((item.status || 'not_set').replace('_', ' '))}
                    </Badge>
                    {item.approvalStatus && (
                        <Badge 
                            color={approvalStatusColors[item.approvalStatus]} 
                            variant="dot"
                            size="sm"
                        >
                            {capitalizeFirstLetter(item.approvalStatus)}
                        </Badge>
                    )}
                </Group>
            )
        },
        {
            header: 'Work Hours',
            accessor: 'workHours',
            render: (item) => (
                <Text size="sm">
                    {item.workHours ? `${Number(item.workHours).toFixed(2)} hrs` : '-'}
                </Text>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (item) => (
                <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                        <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {!item.checkIn && (
                            <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleCheckIn(item.employee.id)}
                            >
                                Mark Check In
                            </Menu.Item>
                        )}
                        {item.checkIn && !item.checkOut && (
                            <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleCheckOut(item.id)}
                            >
                                Mark Check Out
                            </Menu.Item>
                        )}
                        {item.approvalStatus === 'pending' && (
                            <>
                                <Menu.Item
                                    leftSection={<IconCheck size={14} />}
                                    onClick={() => handleUpdateApproval({ 
                                        id: item.id, 
                                        status: 'approved' 
                                    })}
                                    color="green"
                                >
                                    Approve
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconX size={14} />}
                                    onClick={() => handleUpdateApproval({ 
                                        id: item.id, 
                                        status: 'rejected',
                                        rejectionReason: 'Invalid attendance'
                                    })}
                                    color="red"
                                >
                                    Reject
                                </Menu.Item>
                            </>
                        )}
                    </Menu.Dropdown>
                </Menu>
            )
        }
    ], [handleCheckIn, handleCheckOut, handleUpdateApproval]);

    return (
        <Paper radius="md" p="lg" bg="var(--mantine-color-body)">
            <Stack spacing="md">
                <Group grow>
                    <DatePickerInput
                        label="Date Range"
                        type="range"
                        value={[filters.startDate, filters.endDate]}
                        onChange={([start, end]) => {
                            handleFilterChange('startDate', start);
                            handleFilterChange('endDate', end);
                        }}
                        placeholder="Pick dates range"
                        clearable={false}
                        defaultValue={[new Date(), new Date()]}
                    />
                    <TextInput
                        label="Search Employee"
                        value={filters.employeeName}
                        onChange={(e) => handleFilterChange('employeeName', e.target.value)}
                        placeholder="Search by name..."
                    />
                    <Select
                        label="Department"
                        value={filters.departmentId}
                        onChange={(value) => handleFilterChange('departmentId', value)}
                        placeholder="All Departments"
                        data={[]} // Add department data here
                        clearable
                    />
                    <Select
                        label="Status"
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value)}
                        data={[
                            { value: 'present', label: 'Present' },
                            { value: 'absent', label: 'Absent' },
                            { value: 'half-day', label: 'Half Day' },
                            { value: 'late', label: 'Late' },
                            { value: 'leave', label: 'Leave' }
                        ]}
                        placeholder="All Status"
                        clearable
                    />
                </Group>

                <DataTable
                    title="Attendance List"
                    data={attendance?.data || []}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        total: attendance?.pagination?.total || 0,
                        page: filters.page,
                        onChange: handlePageChange,
                        limit: filters.limit
                    }}
                    noDataText="No attendance records found"
                />
            </Stack>
        </Paper>
    );
} 