import React, { useEffect, useState } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Add as AddIcon
} from '@mui/icons-material';

const Attendance = () => {
    const {
        attendanceList,
        loading,
        error,
        pagination,
        filters,
        fetchAttendanceList,
        handleMarkAttendance,
        handleEditAttendance,
        handleUpdateApproval,
        updateFilters
    } = useAttendance();

    const { user } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        checkInTime: '',
        checkOutTime: '',
        status: 'present',
        remarks: ''
    });

    useEffect(() => {
        if (user?.organizationId) {
            fetchAttendanceList(user.organizationId);
        }
    }, [user?.organizationId, filters]);

    const handleOpenDialog = (attendance = null) => {
        if (attendance) {
            setFormData({
                employeeId: attendance.employee_id,
                date: format(new Date(attendance.date), 'yyyy-MM-dd'),
                checkInTime: attendance.check_in ? format(new Date(attendance.check_in), "HH:mm") : '',
                checkOutTime: attendance.check_out ? format(new Date(attendance.check_out), "HH:mm") : '',
                status: attendance.status,
                remarks: attendance.remarks || ''
            });
            setSelectedAttendance(attendance);
        } else {
            setFormData({
                employeeId: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                checkInTime: '',
                checkOutTime: '',
                status: 'present',
                remarks: ''
            });
            setSelectedAttendance(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAttendance(null);
        setFormData({
            employeeId: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            checkInTime: '',
            checkOutTime: '',
            status: 'present',
            remarks: ''
        });
    };

    const handleSubmit = async () => {
        const data = {
            ...formData,
            date: new Date(formData.date).toISOString(),
            checkInTime: formData.checkInTime ? new Date(`${formData.date}T${formData.checkInTime}`).toISOString() : null,
            checkOutTime: formData.checkOutTime ? new Date(`${formData.date}T${formData.checkOutTime}`).toISOString() : null
        };

        if (selectedAttendance) {
            await handleEditAttendance({
                id: selectedAttendance.attendance_id,
                ...data
            });
        } else {
            await handleMarkAttendance(data);
        }

        handleCloseDialog();
    };

    const handleApproval = async (id, status, rejectionReason = '') => {
        await handleUpdateApproval({ id, status, rejectionReason });
    };

    const handlePageChange = (event, value) => {
        updateFilters({ page: value });
    };

    const handleFilterChange = (event) => {
        updateFilters({ [event.target.name]: event.target.value });
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Attendance Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Mark Attendance
                </Button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        label="Status"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="not_set">Not Set</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="present">Present</MenuItem>
                        <MenuItem value="absent">Absent</MenuItem>
                        <MenuItem value="late">Late</MenuItem>
                        <MenuItem value="half_day">Half Day</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Work Hours</TableCell>
                            <TableCell>Approval Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceList.map((attendance) => (
                            <TableRow key={attendance.attendance_id}>
                                <TableCell>
                                    {`${attendance.first_name} ${attendance.last_name}`}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(attendance.date), 'yyyy-MM-dd')}
                                </TableCell>
                                <TableCell>
                                    {attendance.check_in ? format(new Date(attendance.check_in), 'HH:mm') : '-'}
                                </TableCell>
                                <TableCell>
                                    {attendance.check_out ? format(new Date(attendance.check_out), 'HH:mm') : '-'}
                                </TableCell>
                                <TableCell>{attendance.status}</TableCell>
                                <TableCell>{attendance.work_hours || '-'}</TableCell>
                                <TableCell>{attendance.approval_status}</TableCell>
                                <TableCell>
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenDialog(attendance)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {attendance.approval_status === 'pending' && (
                                        <>
                                            <Tooltip title="Approve">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleApproval(attendance.attendance_id, 'approved')}
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleApproval(attendance.attendance_id, 'rejected')}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedAttendance ? 'Edit Attendance' : 'Mark Attendance'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Employee ID"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="Date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            type="time"
                            label="Check In Time"
                            value={formData.checkInTime}
                            onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            type="time"
                            label="Check Out Time"
                            value={formData.checkOutTime}
                            onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                label="Status"
                            >
                                <MenuItem value="present">Present</MenuItem>
                                <MenuItem value="absent">Absent</MenuItem>
                                <MenuItem value="late">Late</MenuItem>
                                <MenuItem value="half_day">Half Day</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Remarks"
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedAttendance ? 'Update' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Attendance; 