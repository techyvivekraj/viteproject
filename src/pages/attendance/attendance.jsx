import {  useMemo } from 'react';
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
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCheck, IconX, IconDotsVertical, IconCamera } from '@tabler/icons-react';
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
            accessor: 'employee_name',
            render: (item) => (
                <Group spacing="xs">
                    <div>
                        <Text size="sm" fw={500}>
                            {`${capitalizeFirstLetter(item.first_name)} ${capitalizeFirstLetter(item.last_name)}`}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {item.employee_code}
                        </Text>
                    </div>
                </Group>
            )
        },
        {
            header: 'Department',
            accessor: 'department_name',
            render: (item) => (
                <Text size="sm">
                    {capitalizeFirstLetter(item.department_name)}
                </Text>
            )
        },
        {
            header: 'Shift',
            accessor: 'shift_name',
            render: (item) => (
                <Text size="sm">
                    {item.shift_name}
                    <Text size="xs" color="dimmed">
                        {`${item.shift_start_time} - ${item.shift_end_time}`}
                    </Text>
                </Text>
            )
        },
        {
            header: 'Check In/Out',
            accessor: 'check_in',
            render: (item) => (
                <Group spacing="xs">
                    {item.check_in ? (
                        <Text size="sm">
                            {new Date(item.check_in).toLocaleTimeString()}
                            {item.check_in_photo && (
                                <ActionIcon 
                                    variant="subtle" 
                                    size="xs"
                                    onClick={() => window.open(item.check_in_photo)}
                                >
                                    <IconCamera size={14} />
                                </ActionIcon>
                            )}
                        </Text>
                    ) : '-'}
                    {' / '}
                    {item.check_out ? (
                        <Text size="sm">
                            {new Date(item.check_out).toLocaleTimeString()}
                            {item.check_out_photo && (
                                <ActionIcon 
                                    variant="subtle" 
                                    size="xs"
                                    onClick={() => window.open(item.check_out_photo)}
                                >
                                    <IconCamera size={14} />
                                </ActionIcon>
                            )}
                        </Text>
                    ) : '-'}
                </Group>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <Group spacing="xs">
                    <Badge color={statusColors[item.status]} variant="light">
                        {capitalizeFirstLetter(item.status.replace('_', ' '))}
                    </Badge>
                    {item.approval_status && (
                        <Badge 
                            color={item.approval_status === 'approved' ? 'green' : 'orange'} 
                            variant="dot"
                        >
                            {capitalizeFirstLetter(item.approval_status)}
                        </Badge>
                    )}
                </Group>
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
                        {!item.check_in && (
                            <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleCheckIn({ 
                                    employeeId: item.employee_id,
                                    shiftId: item.shift_id,
                                    date: new Date(),
                                    checkInTime: new Date(),
                                    checkInLocation: { latitude: 0, longitude: 0 }, // Replace with actual location
                                    checkInPhoto: '' // Replace with actual photo
                                })}
                            >
                                Mark Check In
                            </Menu.Item>
                        )}
                        {item.check_in && !item.check_out && (
                            <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                onClick={() => handleCheckOut({ 
                                    id: item.id,
                                    checkOutTime: new Date(),
                                    checkOutLocation: { latitude: 0, longitude: 0 }, // Replace with actual location
                                    checkOutPhoto: '' // Replace with actual photo
                                })}
                            >
                                Mark Check Out
                            </Menu.Item>
                        )}
                        {item.approval_status === 'pending' && (
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
                                        rejectionReason: 'Invalid attendance' // Add proper reason handling
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
                        allowDeselect
                    />
                    <Select
                        label="Status"
                        value={filters.status || 'not_set'}
                        onChange={(value) => handleFilterChange('status', value)}
                        data={[
                            { value: 'not_set', label: 'Not Set' },
                            { value: 'present', label: 'Present' },
                            { value: 'absent', label: 'Absent' },
                            { value: 'half-day', label: 'Half Day' },
                            { value: 'late', label: 'Late' },
                            { value: 'leave', label: 'Leave' }
                        ]}
                        defaultValue="not_set"
                        clearable={false}
                    />
                </Group>

                <DataTable
                    title="Attendance List"
                    data={attendance.data}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        total: attendance.pagination.total,
                        page: filters.page,
                        onChange: handlePageChange
                    }}
                />
            </Stack>
        </Paper>
    );
} 