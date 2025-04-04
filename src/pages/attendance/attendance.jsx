import { useCallback, useMemo, useState } from 'react';
import {
    Text,
    Paper,
    Group,
    Select,
    TextInput,
    ActionIcon,
    Menu,
    Stack,
    Modal,
    Button,
    Textarea,
    Box,
    Chip,
    Grid,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconDotsVertical, IconSearch, IconClock, IconEdit, IconUserCheck, IconAlertCircle, IconCalendarTime } from '@tabler/icons-react';
import DataTable from '../../components/DataTable/datatable';
import { useAttendance } from '../../hooks/useAttendance.jsx';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import PropTypes from 'prop-types';

const statusColors = {
    'not set': '#228BE6',     // Blue
    pending: '#FCC419',       // Yellow
    approved: '#40C057',      // Green
    rejected: '#FA5252',      // Red
    present: '#40C057',       // Green
    absent: '#FA5252',        // Red
    'half-day': '#FD7E14',    // Orange
    late: '#FCC419'          // Yellow
};

const MenuButton = ({ icon: Icon, label, color = 'blue', onClick }) => (
    <Menu.Item
        onClick={onClick}
        leftSection={<Icon size={16} stroke={1.5} color={`var(--mantine-color-${color}-filled)`} />}
        sx={(theme) => ({
            '&:hover': {
                backgroundColor: theme.fn.rgba(theme.colors[color][1], 0.1),
            }
        })}
    >
        {label}
    </Menu.Item>
);

MenuButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

MenuButton.defaultProps = {
    color: 'blue'
};

const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

const formatShiftTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const EmployeeCell = ({ item }) => (
    <Text size="sm" fw={500}>{item.employee?.name}</Text>
);

EmployeeCell.propTypes = {
    item: PropTypes.shape({
        employee: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    }).isRequired
};

const DepartmentCell = ({ item }) => (
    <Text size="sm">{item.department || 'Not Assigned'}</Text>
);

DepartmentCell.propTypes = {
    item: PropTypes.shape({
        department: PropTypes.string
    }).isRequired
};

const TimeCell = ({ item }) => (
    <Stack spacing={2}>
        <Group spacing={8}>
            <Group spacing={4} w={95}>
                <IconClock size={14} stroke={1.5} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                    {item.checkIn ? new Date(item.checkIn).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                    }) : '-'}
                </Text>
            </Group>
            <Text size="sm" c="dimmed">→</Text>
            <Text size="sm" fw={500}>
                {item.checkOut ? new Date(item.checkOut).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }) : '-'}
            </Text>
        </Group>
        {item.workHours > 0 && (
            <Text size="xs" c="dimmed">{item.workHours.toFixed(1)} hrs</Text>
        )}
    </Stack>
);

TimeCell.propTypes = {
    item: PropTypes.shape({
        checkIn: PropTypes.string,
        checkOut: PropTypes.string,
        workHours: PropTypes.number
    }).isRequired
};

const StatusCell = ({ item }) => {
    const status = item.status || 'not set';
    const color = statusColors[status];
    
    return (
        <Text 
            size="sm"
            fw={600}
            sx={{
                color: color,
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
            }}
            tt={'capitalize'}
        >
            {status}
        </Text>
    );
};

StatusCell.propTypes = {
    item: PropTypes.shape({
        status: PropTypes.oneOf(['not set', 'pending', 'approved', 'rejected', 'present', 'absent', 'half-day', 'late'])
    }).isRequired
};

const ActionsCell = ({ item, onMarkAttendance, onEdit, onApprove, onReject }) => {
    const isManager = true; // TODO: Replace with actual manager check
    const status = item.status || 'not set';
    
    return (
        <Menu position="bottom-end" withArrow>
            <Menu.Target>
                <ActionIcon 
                    variant="light" 
                    color="blue" 
                    size="md"
                    radius="md"
                    sx={(theme) => ({
                        '&:hover': {
                            backgroundColor: theme.fn.rgba(theme.colors.blue[1], 0.1),
                        }
                    })}
                >
                    <IconDotsVertical size={16} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {status === 'not set' && (
                    <MenuButton
                        icon={IconCalendarTime}
                        label="Mark Attendance"
                        color="blue"
                        onClick={() => onMarkAttendance(item)}
                    />
                )}

                {isManager && status !== 'not set' && (
                    <MenuButton
                        icon={IconEdit}
                        label="Edit Attendance"
                        color="violet"
                        onClick={() => onEdit(item)}
                    />
                )}

                {isManager && status === 'pending' && (
                    <>
                        <MenuButton
                            icon={IconUserCheck}
                            label="Approve"
                            color="teal"
                            onClick={() => onApprove(item)}
                        />
                        <MenuButton
                            icon={IconAlertCircle}
                            label="Reject"
                            color="red"
                            onClick={() => onReject(item)}
                        />
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

ActionsCell.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['not set', 'pending', 'approved', 'rejected', 'present', 'absent', 'half-day', 'late']),
        employee: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    onMarkAttendance: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onApprove: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
};

// Move ActionModal outside the main component to prevent recreation on every render
const ActionModal = ({ 
    opened, 
    onClose, 
    actionType, 
    selectedAttendance, 
    checkInTime,
    checkOutTime,
    remarks,
    onCheckInTimeChange,
    onCheckOutTimeChange,
    onRemarksChange,
    onStatusChange,
    onSubmit 
}) => (
    <Modal
        opened={opened}
        onClose={onClose}
        title={
            <Text size="lg" weight={600}>
                {actionType === 'mark-attendance' ? 'Mark Attendance' :
                 actionType === 'edit' ? 'Edit Attendance' :
                 actionType === 'approve' ? 'Approve Attendance' : 
                 'Reject Attendance'}
            </Text>
        }
        radius="md"
        padding="lg"
        size="md"
    >
        <Stack>
            {/* Show shift timing info */}
            {(actionType === 'mark-attendance' || actionType === 'edit') && selectedAttendance?.shift && (
                <Paper withBorder p="xs" radius="md" bg="var(--mantine-color-blue-0)">
                    <Group spacing="xs">
                        <IconClock size={16} stroke={1.5} />
                        <Text size="sm" fw={500}>Shift Time:</Text>
                        <Text size="sm">
                            {formatShiftTime(selectedAttendance.shift.startTime)} - {formatShiftTime(selectedAttendance.shift.endTime)}
                        </Text>
                    </Group>
                </Paper>
            )}

            {/* Show time inputs for mark-attendance and edit */}
            {(actionType === 'mark-attendance' || actionType === 'edit') && (
                <>
                    <TimeInput
                        label="Check In Time"
                        value={checkInTime}
                        onChange={(e) => onCheckInTimeChange(e.target.value)}
                        format="24"
                        required
                        clearable
                        icon={<IconClock size={16} />}
                    />
                    <TimeInput
                        label="Check Out Time"
                        value={checkOutTime}
                        onChange={(e) => onCheckOutTimeChange(e.target.value)}
                        format="24"
                        clearable
                        icon={<IconClock size={16} />}
                        error={checkOutTime && checkInTime && checkOutTime < checkInTime ? 
                            'Check-out time must be after check-in time' : null}
                    />
                    <Select
                        label="Status"
                        data={[
                            { value: 'present', label: 'Present' },
                            { value: 'absent', label: 'Absent' },
                            { value: 'half-day', label: 'Half Day' },
                            { value: 'late', label: 'Late' }
                        ]}
                        value={selectedAttendance?.status || 'present'}
                        onChange={onStatusChange}
                    />
                </>
            )}

            <Textarea
                label={actionType === 'reject' ? 'Rejection Reason' : 'Remarks'}
                placeholder={actionType === 'reject' ? 'Enter reason for rejection...' : 'Enter remarks...'}
                value={remarks}
                onChange={(e) => onRemarksChange(e.currentTarget.value)}
                minRows={3}
                required={actionType === 'reject'}
            />

            <Group position="right" mt="md">
                <Button variant="light" onClick={onClose}>Cancel</Button>
                <Button
                    color={actionType === 'reject' ? 'red' : 'blue'}
                    onClick={onSubmit}
                    disabled={
                        (actionType === 'reject' && !remarks) ||
                        ((actionType === 'mark-attendance' || actionType === 'edit') && checkOutTime < checkInTime)
                    }
                >
                    {actionType === 'mark-attendance' ? 'Submit' :
                     actionType === 'edit' ? 'Save Changes' :
                     actionType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
            </Group>
        </Stack>
    </Modal>
);

ActionModal.propTypes = {
    opened: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    actionType: PropTypes.oneOf(['mark-attendance', 'edit', 'approve', 'reject']),
    selectedAttendance: PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        checkIn: PropTypes.string,
        checkOut: PropTypes.string,
        remarks: PropTypes.string,
        shift: PropTypes.shape({
            startTime: PropTypes.string,
            endTime: PropTypes.string
        }),
        employee: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })
    }),
    checkInTime: PropTypes.string,
    checkOutTime: PropTypes.string,
    remarks: PropTypes.string,
    onCheckInTimeChange: PropTypes.func.isRequired,
    onCheckOutTimeChange: PropTypes.func.isRequired,
    onRemarksChange: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

ActionModal.defaultProps = {
    actionType: null,
    selectedAttendance: null,
    checkInTime: '',
    checkOutTime: '',
    remarks: ''
};

export default function Attendance() {
    const {
        attendance,
        loading,
        filters,
        localFilters,
        setLocalFilters,
        handleFilterChange,
        handleMarkAttendance,
        handleEditAttendance,
        handleUpdateApproval,
        handlePageChange,
        stats,
        departments
    } = useAttendance();

    const [opened, setOpened] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');

    const handleModalClose = useCallback(() => {
        setOpened(false);
        setCheckInTime('');
        setCheckOutTime('');
        setRemarks('');
        setSelectedAttendance(null);
        setActionType(null);
    }, []);

    const handleModalSubmit = useCallback(() => {
        if (actionType === 'mark-attendance') {
            handleMarkAttendance({
                employeeId: selectedAttendance.employee.id,
                date: new Date().toISOString().split('T')[0],
                checkInTime: checkInTime ? `${new Date().toISOString().split('T')[0]}T${checkInTime}` : null,
                checkOutTime: checkOutTime ? `${new Date().toISOString().split('T')[0]}T${checkOutTime}` : null,
                status: selectedAttendance.status || 'present',
                remarks
            });
        } else if (actionType === 'edit') {
            handleEditAttendance({
                id: selectedAttendance.id,
                checkInTime: checkInTime ? `${new Date(selectedAttendance.date).toISOString().split('T')[0]}T${checkInTime}` : null,
                checkOutTime: checkOutTime ? `${new Date(selectedAttendance.date).toISOString().split('T')[0]}T${checkOutTime}` : null,
                status: selectedAttendance.status,
                remarks
            });
        } else {
            handleUpdateApproval({
                id: selectedAttendance.id,
                status: actionType === 'approve' ? 'approved' : 'rejected',
                rejectionReason: remarks
            });
        }
        handleModalClose();
    }, [actionType, selectedAttendance, checkInTime, checkOutTime, remarks, handleMarkAttendance, handleEditAttendance, handleUpdateApproval, handleModalClose]);

    const handleEditClick = useCallback((item) => {
        setSelectedAttendance(item);
        setActionType('edit');
        setCheckInTime(item.checkIn ? formatTime(item.checkIn) : '');
        setCheckOutTime(item.checkOut ? formatTime(item.checkOut) : '');
        setRemarks(item.remarks || '');
        setOpened(true);
    }, []);

    const handleMarkAttendanceClick = useCallback((item) => {
        setSelectedAttendance(item);
        setActionType('mark-attendance');
        setCheckInTime('');
        setCheckOutTime('');
        setRemarks('');
        setOpened(true);
    }, []);

    const columns = useMemo(() => [
        {
            header: 'Employee',
            accessor: 'employee',
            width: '25%',
            render: (item) => <EmployeeCell item={item} />
        },
        {
            header: 'Department',
            accessor: 'department',
            width: '20%',
            render: (item) => <DepartmentCell item={item} />
        },
        {
            header: 'Time',
            accessor: 'checkIn',
            width: '30%',
            render: (item) => <TimeCell item={item} />
        },
        {
            header: 'Status',
            accessor: 'status',
            width: '15%',
            render: (item) => <StatusCell item={item} />
        },
        {
            header: 'Actions',
            accessor: 'actions',
            width: '10%',
            render: (item) => (
                <ActionsCell 
                    item={item}
                    onMarkAttendance={handleMarkAttendanceClick}
                    onEdit={handleEditClick}
                    onApprove={(item) => {
                        setSelectedAttendance(item);
                        setActionType('approve');
                        setRemarks('');
                        setOpened(true);
                    }}
                    onReject={(item) => {
                        setSelectedAttendance(item);
                        setActionType('reject');
                        setRemarks('');
                        setOpened(true);
                    }}
                />
            )
        }
    ], [handleMarkAttendanceClick, handleEditClick]);

    // Enhanced ActiveFilters component
    const ActiveFilters = () => {
        const activeFilters = [];
        if (filters.employeeName) {
            activeFilters.push({
                label: `Search: ${filters.employeeName}`,
                onRemove: () => handleFilterChange('employeeName', '')
            });
        }
        if (localFilters.status) {
            activeFilters.push({
                label: `Status: ${localFilters.status}`,
                onRemove: () => setLocalFilters(prev => ({ ...prev, status: '' }))
            });
        }
        // ... add other active filters

        if (activeFilters.length === 0) return null;

        return (
            <Group spacing="xs" mt="xs">
                {activeFilters.map((filter, index) => (
                    <Chip
                        key={index}
                        variant="light"
                        size="sm"
                        radius="md"
                        onDelete={filter.onRemove}
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark'
                                ? theme.colors.dark[5]
                                : theme.colors.gray[1],
                        })}
                    >
                        {filter.label}
                    </Chip>
                ))}
            </Group>
        );
    };

    return (
        <Paper radius="md" p={{ base: 'md', sm: 'xl' }} bg="var(--mantine-color-body)">
            <Stack spacing={{ base: 'md', sm: 'xl' }}>
                <StatsGrid
                    data={[
                        {
                            title: 'Present Today',
                            icon: 'userCheck',
                            value: stats?.presentCount || '0',
                            color: 'green'
                        },
                        {
                            title: 'Late Today',
                            icon: 'clock',
                            value: stats?.lateCount || '0',
                            color: 'yellow'
                        },
                        {
                            title: 'Absent Today',
                            icon: 'userOff',
                            value: stats?.absentCount || '0',
                            color: 'red'
                        },
                        {
                            title: 'Not Set',
                            icon: 'clockPause',
                            value: (attendance?.pagination?.total - (stats?.presentCount + stats?.lateCount + stats?.absentCount)) || '0',
                            color: 'gray'
                        }
                    ]}
                />

                {/* Main Content Paper */}
                <Paper radius="md">
                    <Stack spacing="md">
                        {/* Filter Section */}
                        <Paper p="md" radius="md" withBorder>
                            <Stack spacing={{ base: 'xs', sm: 'md' }}>
                                <Grid gutter={{ base: 'xs', sm: 'md' }}>
                                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                        <TextInput
                                            icon={<IconSearch size={16} />}
                                            label="Search Employee"
                                            placeholder="Enter name..."
                                            value={filters.employeeName}
                                            onChange={(e) => handleFilterChange('employeeName', e.target.value)}

                                            radius="md"
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                        <Select
                                            label="Department"
                                            placeholder="All departments"
                                            value={localFilters.departmentId}
                                            onChange={(value) => setLocalFilters(prev => ({
                                                ...prev,
                                                departmentId: value
                                            }))}
                                            data={departments || []}
                                            clearable
                                            searchable
                                            radius="md"
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                        <Select
                                            label="Status"
                                            placeholder="All statuses"
                                            value={localFilters.status}
                                            onChange={(value) => setLocalFilters(prev => ({
                                                ...prev,
                                                status: value
                                            }))}
                                            data={[
                                                { value: 'not set', label: 'Not Set' },
                                                { value: 'pending', label: 'Pending' },
                                                { value: 'present', label: 'Present' },
                                                { value: 'absent', label: 'Absent' },
                                                { value: 'late', label: 'Late' },
                                                { value: 'half-day', label: 'Half Day' }
                                            ]}
                                            clearable
                                            radius="md"
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                        <DatePickerInput
                                            type="range"
                                            label="Date Range"
                                            placeholder="Pick dates"
                                            value={[filters.startDate, filters.endDate]}
                                            onChange={([start, end]) => {
                                                handleFilterChange('startDate', start);
                                                handleFilterChange('endDate', end);
                                            }}

                                            radius="md"
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </Paper>

                        <ActiveFilters />

                        {/* DataTable */}
                        <Box>
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
                                hideMonthPicker={true}
                                hideHeader={true}
                                hideActions={true}
                            />
                        </Box>
                    </Stack>
                </Paper>
            </Stack>

            <ActionModal 
                opened={opened}
                onClose={handleModalClose}
                actionType={actionType}
                selectedAttendance={selectedAttendance}
                checkInTime={checkInTime}
                checkOutTime={checkOutTime}
                remarks={remarks}
                onCheckInTimeChange={setCheckInTime}
                onCheckOutTimeChange={setCheckOutTime}
                onRemarksChange={setRemarks}
                onStatusChange={(value) => setSelectedAttendance(prev => ({ ...prev, status: value }))}
                onSubmit={handleModalSubmit}
            />
        </Paper>
    );
}

StatsGrid.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    })).isRequired
};

DataTable.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string.isRequired,
        width: PropTypes.string,
        render: PropTypes.func
    })).isRequired,
    loading: PropTypes.bool,
    pagination: PropTypes.shape({
        total: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        limit: PropTypes.number.isRequired
    }),
    hideMonthPicker: PropTypes.bool,
    hideHeader: PropTypes.bool,
    hideActions: PropTypes.bool
};

DataTable.defaultProps = {
    loading: false,
    hideMonthPicker: false,
    hideHeader: false,
    hideActions: false
}; 