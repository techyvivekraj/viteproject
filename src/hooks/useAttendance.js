import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchAttendance, 
    markAttendance, 
    editAttendance, 
    updateAttendanceApproval 
} from '../store/actions/attendance';
import { showNotification } from '@mantine/notifications';

export const useAttendance = () => {
    const dispatch = useDispatch();
    const { attendance, loading, error } = useSelector((state) => state.attendance);
    
    // Local state for filters
    const [filters, setFilters] = useState({
        startDate: new Date(),
        endDate: new Date(),
        employeeName: '',
        page: 1,
        limit: 10
    });

    const [localFilters, setLocalFilters] = useState({
        departmentId: '',
        status: ''
    });

    // Stats (you should replace these with actual API data)
    const [stats, setStats] = useState({
        presentCount: 0,
        lateCount: 0,
        absentCount: 0,
        pendingCount: 0
    });

    // Mock departments data (replace with actual API data)
    const departments = [
        { value: '1', label: 'IT Department' },
        { value: '2', label: 'HR Department' },
        { value: '3', label: 'Finance Department' }
    ];

    // Fetch attendance when filters change
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchAttendance({
                    ...filters,
                    ...localFilters
                })).unwrap();
            } catch (error) {
                showNotification({
                    title: 'Error',
                    message: error.message || 'Failed to fetch attendance',
                    color: 'red'
                });
            }
        };

        fetchData();
    }, [dispatch, filters, localFilters]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle page changes
    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    // Handle marking attendance
    const handleMarkAttendance = async (data) => {
        try {
            await dispatch(markAttendance(data)).unwrap();
            showNotification({
                title: 'Success',
                message: 'Attendance marked successfully',
                color: 'green'
            });
            // Refresh attendance list
            dispatch(fetchAttendance({ ...filters, ...localFilters }));
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message || 'Failed to mark attendance',
                color: 'red'
            });
        }
    };

    // Handle editing attendance
    const handleEditAttendance = async (data) => {
        try {
            await dispatch(editAttendance(data)).unwrap();
            showNotification({
                title: 'Success',
                message: 'Attendance updated successfully',
                color: 'green'
            });
            // Refresh attendance list
            dispatch(fetchAttendance({ ...filters, ...localFilters }));
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message || 'Failed to update attendance',
                color: 'red'
            });
        }
    };

    // Handle approval/rejection
    const handleUpdateApproval = async (data) => {
        try {
            await dispatch(updateAttendanceApproval(data)).unwrap();
            showNotification({
                title: 'Success',
                message: `Attendance ${data.status === 'approved' ? 'approved' : 'rejected'} successfully`,
                color: 'green'
            });
            // Refresh attendance list
            dispatch(fetchAttendance({ ...filters, ...localFilters }));
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message || 'Failed to update approval status',
                color: 'red'
            });
        }
    };

    return {
        attendance,
        loading,
        error,
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
    };
}; 