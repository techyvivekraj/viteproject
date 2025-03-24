import { useEffect, useCallback, useState } from 'react';
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

    useEffect(() => {
        if (organizationId) {
            console.log('Fetching attendance with filters:', filters); // Debug log
            dispatch(fetchAttendance({ 
                organizationId, 
                filters: {
                    ...filters,
                    startDate: filters.startDate,
                    endDate: filters.endDate
                }
            }));
        }
    }, [dispatch, organizationId, filters]);

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

    return {
        attendance,
        loading,
        checkInStatus,
        checkOutStatus,
        approvalStatus,
        filters,
        setFilters,
        handleCheckIn,
        handleCheckOut,
        handleUpdateApproval,
        handlePageChange,
        handleFilterChange
    };
}; 