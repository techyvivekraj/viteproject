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
    markAttendance,
    editAttendance,
    updateAttendanceApproval
} from '../store/actions/attendance';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import { selectDepartments } from '../store/slices/employeeSlice';
import { fetchDepartments } from '../store/actions/employee';

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

    // Replace the departments state with selector
    const departments = useSelector(selectDepartments);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

    // Remove the old fetchDepartments function and update the useEffect
    useEffect(() => {
        const loadDepartments = async () => {
            if (!organizationId) return;

            try {
                setIsLoadingDepartments(true);
                dispatch(fetchDepartments(organizationId));
            } catch (error) {
                console.error('Error loading departments:', error);
                showNotification({
                    title: 'Error',
                    message: 'Failed to load departments',
                    color: 'red'
                });
            } finally {
                setIsLoadingDepartments(false);
            }
        };

        loadDepartments();
    }, [dispatch, organizationId]);

    // Transform departments data for dropdowns (modify this)
    const departmentList = useMemo(() => {
        const deptList = departments?.data?.map(dept => ({
            value: String(dept.id),
            label: dept.name
        })) || [];

        return [
            { value: '', label: 'All Departments' },
            ...deptList
        ];
    }, [departments?.data]);

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
    }, [dispatch, organizationId, debouncedFilters, filters.startDate, filters.endDate, filters.employeeName, filters.page]);

    // Filter data locally for department and status
    const filteredData = useMemo(() => {
        if (!attendance?.data?.length) return [];
        
        if (!localFilters.departmentId && !localFilters.status) {
            return attendance.data;
        }
        
        return attendance.data.filter(item => {
            const matchesDepartment = !localFilters.departmentId || 
                String(item.department?.id) === localFilters.departmentId;
            const matchesStatus = !localFilters.status || 
                item.status === localFilters.status;
            
            return matchesDepartment && matchesStatus;
        });
    }, [attendance?.data, localFilters.departmentId, localFilters.status]);

    // Calculate stats whenever attendance data changes
    useEffect(() => {
        if (!attendance?.data?.length) {
            setStats({
                presentCount: 0,
                lateCount: 0,
                absentCount: 0,
                pendingCount: 0,
                notSetCount: 0
            });
            return;
        }

        try {
            const startDate = filters.startDate?.toISOString().split('T')[0];
            const endDate = filters.endDate?.toISOString().split('T')[0];
            
            const dateRangeRecords = attendance.data.filter(record => {
                const recordDate = new Date(record.date).toISOString().split('T')[0];
                return recordDate >= startDate && recordDate <= endDate;
            });

            const present = dateRangeRecords.filter(r => r.status === 'present').length;
            const late = dateRangeRecords.filter(r => r.status === 'late').length;
            const absent = dateRangeRecords.filter(r => r.status === 'absent').length;
            const pending = dateRangeRecords.filter(r => r.approvalStatus === 'pending').length;
            
            const totalEmployees = attendance.pagination?.total || 0;
            const notSet = Math.max(0, totalEmployees - (present + late + absent));

            setStats({
                presentCount: present,
                lateCount: late,
                absentCount: absent,
                pendingCount: pending,
                notSetCount: notSet
            });
        } catch (error) {
            console.error('Error calculating attendance stats:', error);
            setStats({
                presentCount: 0,
                lateCount: 0,
                absentCount: 0,
                pendingCount: 0,
                notSetCount: 0
            });
        }
    }, [attendance?.data, filters.startDate, filters.endDate, attendance.pagination?.total]);

    // Handle mark attendance
    const handleMarkAttendance = useCallback(async (data) => {
        try {
            await dispatch(markAttendance(data)).unwrap();
            showNotification({
                title: 'Success',
                message: 'Attendance marked successfully',
                color: 'green'
            });
            // Refresh attendance list
            dispatch(fetchAttendance({ 
                ...filters, 
                ...localFilters 
            }));
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message || 'Failed to mark attendance',
                color: 'red'
            });
        }
    }, [dispatch, filters, localFilters]);

    // Handle edit attendance
    const handleEditAttendance = useCallback(async (data) => {
        try {
            await dispatch(editAttendance(data)).unwrap();
            showNotification({
                title: 'Success',
                message: 'Attendance updated successfully',
                color: 'green'
            });
            dispatch(fetchAttendance({ 
                ...filters, 
                ...localFilters 
            }));
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message || 'Failed to update attendance',
                color: 'red'
            });
        }
    }, [dispatch, filters, localFilters]);

    // Handle update approval
    const handleUpdateApproval = useCallback(async (data) => {
        try {
            await dispatch(updateAttendanceApproval(data)).unwrap();
            showNotification({
                title: 'Success',
                message: `Attendance ${data.status} successfully`,
                color: 'green'
            });
            dispatch(fetchAttendance({ 
                ...filters, 
                ...localFilters 
            }));
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message || 'Failed to update approval status',
                color: 'red'
            });
        }
    }, [dispatch, filters, localFilters]);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // Handle page changes
    const handlePageChange = useCallback((page) => {
        setFilters(prev => ({ ...prev, page }));
    }, []);

    // Load attendance data when filters change
    useEffect(() => {
        dispatch(fetchAttendance({ 
            ...filters, 
            ...localFilters 
        }));
    }, [dispatch, filters, localFilters]);

    // Add this temporarily to debug
    useEffect(() => {
        console.log('Attendance data:', attendance?.data);
        console.log('Local filters:', localFilters);
    }, [attendance?.data, localFilters]);

    return {
        attendance: { ...attendance, data: filteredData },
        loading,
        checkInStatus,
        checkOutStatus,
        approvalStatus,
        filters,
        localFilters,
        setLocalFilters,
        handleFilterChange,
        handleMarkAttendance,
        handleEditAttendance,
        handleUpdateApproval,
        handlePageChange,
        stats,
        departments: departmentList,
        isLoadingDepartments
    };
}; 