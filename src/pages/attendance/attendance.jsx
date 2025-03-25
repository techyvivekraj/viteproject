import { useMemo, useState } from 'react';
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
    Modal,
    Button,
    Textarea,
    Box,
    Chip,
    Grid,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconDotsVertical, IconSearch, } from '@tabler/icons-react';
import DataTable from '../../components/DataTable/datatable';
import { useAttendance } from '../../hooks/useAttendance';
import { capitalizeFirstLetter } from '../../utils/utils';
import StatsGrid from '../../components/StatsGrid/StatsGrid';

const statusColors = {
    present: 'green',
    absent: 'red',
    'half-day': 'yellow',
    late: 'orange',
    leave: 'blue',
    pending: 'gray',
    rejected: 'red'
};

export default function Attendance() {
    const {
        attendance,
        loading,
        filters,
        localFilters,
        setLocalFilters,
        handleFilterChange,
        handleCheckIn,
        handleCheckOut,
        handleUpdateApproval,
        handlePageChange,
        stats,
        departments
    } = useAttendance();

    const [opened, setOpened] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [checkTime, setCheckTime] = useState(new Date());

    // Enhanced ActionModal with better styling
    const ActionModal = () => (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={
                <Text size="lg" weight={600}>
                    {actionType === 'check-in' ? 'Mark Check In' :
                        actionType === 'check-out' ? 'Mark Check Out' :
                            actionType === 'approve' ? 'Approve Attendance' : 'Reject Attendance'}
                </Text>
            }
            radius="md"
            padding="lg"
            size="md"
        >
            <Stack>
                {(actionType === 'check-in' || actionType === 'check-out') && (
                    <>
                        <TimeInput
                            label="Time"
                            value={checkTime}
                            onChange={setCheckTime}
                        />
                        <Text size="sm" c="dimmed">
                            Shift: {selectedAttendance?.shift?.startTime} - {selectedAttendance?.shift?.endTime}
                        </Text>
                    </>
                )}

                <Textarea
                    label="Remarks"
                    placeholder="Enter remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.currentTarget.value)}
                    minRows={3}
                />

                <Group position="right" mt="md">
                    <Button variant="light" onClick={() => setOpened(false)}>Cancel</Button>
                    <Button
                        color={actionType === 'reject' ? 'red' : 'blue'}
                        onClick={() => {
                            if (actionType === 'check-in') {
                                handleCheckIn({
                                    employeeId: selectedAttendance.employee.id,
                                    checkInTime: checkTime,
                                    remarks
                                });
                            } else if (actionType === 'check-out') {
                                handleCheckOut({
                                    id: selectedAttendance.id,
                                    checkOutTime: checkTime,
                                    remarks
                                });
                            } else {
                                handleUpdateApproval({
                                    id: selectedAttendance.id,
                                    status: actionType === 'approve' ? 'approved' : 'rejected',
                                    rejectionReason: remarks
                                });
                            }
                            setOpened(false);
                        }}
                    >
                        Confirm
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );

    const columns = useMemo(() => [
        {
            header: 'Employee',
            accessor: 'employee',
            render: (item) => (
                <Text size="sm" fw={500}>{item.employee?.name}</Text>
            )
        },
        {
            header: 'Department',
            accessor: 'department',
            render: (item) => (
                <Text size="sm">{item.department || 'Not Assigned'}</Text>
            )
        },
        {
            header: 'Time',
            accessor: 'checkIn',
            render: (item) => (
                <Stack spacing={4}>
                    <Text size="sm">
                        In: {item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : '-'}
                    </Text>
                    <Text size="sm">
                        Out: {item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : '-'}
                    </Text>
                    {item.workHours > 0 && (
                        <Text size="xs" c="dimmed">{item.workHours.toFixed(1)} hrs</Text>
                    )}
                </Stack>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => {
                // Simplified status logic
                let status = item.status || 'pending';
                let color = statusColors[status];
                let label = status;

                // Only show approval status for marked attendance
                if (status !== 'pending' && item.approvalStatus === 'rejected') {
                    color = 'red';
                    label = 'Rejected';
                }

                return (
                    <Badge color={color} variant="light">
                        {capitalizeFirstLetter(label)}
                    </Badge>
                );
            }
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (item) => {
                // Only show relevant actions based on status
                const canCheckIn = !item.checkIn;
                const canCheckOut = item.checkIn && !item.checkOut;
                const canApprove = item.checkIn && item.status !== 'pending' && item.approvalStatus === 'pending';

                if (!canCheckIn && !canCheckOut && !canApprove) return null;

                return (
                    <Menu position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {canCheckIn && (
                                <Menu.Item
                                    onClick={() => {
                                        setSelectedAttendance(item);
                                        setActionType('check-in');
                                        setCheckTime(new Date());
                                        setRemarks('');
                                        setOpened(true);
                                    }}
                                >
                                    Mark Check In
                                </Menu.Item>
                            )}
                            {canCheckOut && (
                                <Menu.Item
                                    onClick={() => {
                                        setSelectedAttendance(item);
                                        setActionType('check-out');
                                        setCheckTime(new Date());
                                        setRemarks('');
                                        setOpened(true);
                                    }}
                                >
                                    Mark Check Out
                                </Menu.Item>
                            )}
                            {canApprove && (
                                <>
                                    <Menu.Item
                                        onClick={() => {
                                            setSelectedAttendance(item);
                                            setActionType('approve');
                                            setRemarks('');
                                            setOpened(true);
                                        }}
                                        color="green"
                                    >
                                        Approve
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => {
                                            setSelectedAttendance(item);
                                            setActionType('reject');
                                            setRemarks('');
                                            setOpened(true);
                                        }}
                                        color="red"
                                    >
                                        Reject
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                );
            }
        }
    ], []);

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
        <Stack spacing="xl">
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
                        color: 'orange'
                    },
                    {
                        title: 'Absent Today',
                        icon: 'userOff',
                        value: stats?.absentCount || '0',
                        color: 'red'
                    },
                    {
                        title: 'Pending Approvals',
                        icon: 'clockPause',
                        value: stats?.pendingCount || '0',
                        color: 'blue'
                    }
                ]}
            />

            {/* Enhanced Main Content Paper */}
            <Paper radius="md"
                p={{ base: 'xs', sm: 'lg' }} sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
                })}>
                <Stack spacing="lg">
                    {/* Enhanced Search and Filter Header */}
                    <Paper
                        p={{ base: 'xs', sm: 'md' }}
                        radius="md"
                        withBorder
                    >
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
                                        data={departments?.map(dept => ({
                                            value: dept.value,
                                            label: `${dept.label} (CL:${dept.casualLeave || 0}, SL:${dept.sickLeave || 0}, EL:${dept.earnedLeave || 0})`,
                                        })) || []}
                                        clearable
                                        searchable
                                        nothingFound="No departments found"
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
                                            { value: 'present', label: 'Present' },
                                            { value: 'absent', label: 'Absent' },
                                            { value: 'late', label: 'Late' },
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
                                        clearable={false}

                                        radius="md"
                                    />
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Paper>

                    <ActiveFilters />

                    {/* Enhanced DataTable */}
                    <Box sx={{ overflow: 'hidden' }}>
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
                        />
                    </Box>
                </Stack>
            </Paper>

            <ActionModal />
        </Stack>
    );
} 