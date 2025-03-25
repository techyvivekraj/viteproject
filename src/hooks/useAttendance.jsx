import { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    selectAttendance, 
    selectLoading,
    selectCheckInStatus,
    selectCheckOutStatus,
    selectApprovalStatus
} from '../store/slices/attendanceSlice';
import { 
    fetchAttendance,
    markCheckIn,
    markCheckOut,
    updateAttendanceApproval
} from '../store/actions/attendance';
import { showError, showToast } from '../components/api';
import { useDebouncedValue } from '@mantine/hooks';

export const useAttendance = () => {
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');
    
    // Get attendance data from redux store
    const attendance = useSelector(selectAttendance) || {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
    const loading = useSelector(selectLoading);
    const checkInStatus = useSelector(selectCheckInStatus);
    const checkOutStatus = useSelector(selectCheckOutStatus);
    const approvalStatus = useSelector(selectApprovalStatus);

    // Initialize filters with proper date objects
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [filters, setFilters] = useState({
        startDate: today,
        endDate: today,
        employeeName: '',
        departmentId: '',
        status: '',
        page: 1,
        limit: 10
    });

    const [stats, setStats] = useState({
        presentCount: 0,
        lateCount: 0,
        absentCount: 0,
        pendingCount: 0
    });

    // Add debounced search value
    const [debouncedFilters] = useDebouncedValue(filters, 500);

    // Use local state for client-side filtering
    const [localFilters, setLocalFilters] = useState({
        departmentId: '',
        status: ''
    });

    // Add to existing state
    const [departments, setDepartments] = useState([]);

    // Add fetch function
    const fetchDepartments = useCallback(async () => {
        try {
            const response = await fetch(`/api/departments?organizationId=${organizationId}`);
            const data = await response.json();
            // Transform the data to include both id and name as required
            setDepartments(data.map(dept => ({
                value: dept.id,
                label: dept.name,
                casualLeave: dept.casualLeave,
                sickLeave: dept.sickLeave,
                earnedLeave: dept.earnedLeave,
                maternityLeave: dept.maternityLeave,
                paternityLeave: dept.paternityLeave,
                noticePeriod: dept.noticePeriod
            })));
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    }, [organizationId]);

    // Effect to fetch data when debounced filters change
    useEffect(() => {
        if (organizationId) {
            // Only fetch if search/date filters change
            if (
                debouncedFilters.startDate !== filters.startDate ||
                debouncedFilters.endDate !== filters.endDate ||
                debouncedFilters.employeeName !== filters.employeeName ||
                debouncedFilters.page !== filters.page
            ) {
                dispatch(fetchAttendance({ 
                    organizationId, 
                    filters: debouncedFilters
                }));
            }
        }
    }, [dispatch, organizationId, debouncedFilters]);

    // Add to useEffect
    useEffect(() => {
        if (organizationId) {
            fetchDepartments();
        }
    }, [organizationId, fetchDepartments]);

    // Filter data locally for department and status
    const filteredData = useMemo(() => {
        if (!attendance?.data) return [];
        
        return attendance.data.filter(item => {
            const matchesDepartment = !localFilters.departmentId || 
                item.department === localFilters.departmentId;
            const matchesStatus = !localFilters.status || 
                item.status === localFilters.status;
            
            return matchesDepartment && matchesStatus;
        });
    }, [attendance?.data, localFilters]);

    // Calculate stats whenever attendance data changes
    useEffect(() => {
        if (attendance?.data) {
            // Format dates to compare
            const startDate = filters.startDate?.toISOString().split('T')[0];
            const endDate = filters.endDate?.toISOString().split('T')[0];
            
            // Filter records within selected date range
            const dateRangeRecords = attendance.data.filter(record => {
                const recordDate = new Date(record.date).toISOString().split('T')[0];
                return recordDate >= startDate && recordDate <= endDate;
            });

            setStats({
                presentCount: dateRangeRecords.filter(r => r.status === 'present').length,
                lateCount: dateRangeRecords.filter(r => r.status === 'late').length,
                absentCount: dateRangeRecords.filter(r => r.status === 'absent').length,
                pendingCount: dateRangeRecords.filter(r => r.approvalStatus === 'pending').length
            });
        }
    }, [attendance, filters.startDate, filters.endDate]);

    const handleCheckIn = useCallback(async (data) => {
        try {
            await dispatch(markCheckIn({
                ...data,
                organizationId
            })).unwrap();
            showToast('Check-in marked successfully', 'success');
            // Refresh attendance list
            dispatch(fetchAttendance({ organizationId, filters }));
        } catch (error) {
            showError(error.message || 'Failed to mark check-in');
        }
    }, [dispatch, organizationId, filters]);

    const handleCheckOut = useCallback(async (data) => {
        try {
            await dispatch(markCheckOut({
                ...data,
                organizationId
            })).unwrap();
            showToast('Check-out marked successfully', 'success');
            // Refresh attendance list
            dispatch(fetchAttendance({ organizationId, filters }));
        } catch (error) {
            showError(error.message || 'Failed to mark check-out');
        }
    }, [dispatch, organizationId, filters]);

    const handleUpdateApproval = useCallback(async (data) => {
        try {
            await dispatch(updateAttendanceApproval({
                ...data,
                organizationId
            })).unwrap();
            showToast('Attendance status updated successfully', 'success');
            // Refresh attendance list
            dispatch(fetchAttendance({ organizationId, filters }));
        } catch (error) {
            showError(error.message || 'Failed to update attendance status');
        }
    }, [dispatch, organizationId, filters]);

    const handlePageChange = useCallback((page) => {
        setFilters(prev => ({ ...prev, page }));
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        console.log('Filter changing:', key, value); // Debug log
        setFilters(prev => ({ 
            ...prev, 
            [key]: value,
            page: key !== 'page' ? 1 : value
        }));
    }, []);

    // Update the useEffect for data fetching
    useEffect(() => {
        if (organizationId) {
            dispatch(fetchAttendance({ 
                organizationId, 
                filters: {
                    ...filters,
                    departmentId: localFilters.departmentId,
                    status: localFilters.status
                }
            }));
        }
    }, [dispatch, organizationId, filters, localFilters]);

    return {
        attendance: { ...attendance, data: filteredData },
        loading,
        checkInStatus,
        checkOutStatus,
        approvalStatus,
        filters,
        localFilters,
        setLocalFilters,
        handleCheckIn,
        handleCheckOut,
        handleUpdateApproval,
        handlePageChange,
        handleFilterChange,
        stats,
        departments
    };
}; 