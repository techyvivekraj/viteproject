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
    const attendance = useSelector(selectAttendance) || {
        data: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        }
    };
    const loading = useSelector(selectLoading);
    const checkInStatus = useSelector(selectCheckInStatus);
    const checkOutStatus = useSelector(selectCheckOutStatus);
    const approvalStatus = useSelector(selectApprovalStatus);

    // Initialize with current date only
    const today = new Date();
    const [filters, setFilters] = useState({
        startDate: today,
        endDate: today,
        page: 1,
        limit: 10
    });

    useEffect(() => {
        if (organizationId) {
            dispatch(fetchAttendance({ 
                organizationId, 
                filters: {
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    page: filters.page,
                    limit: filters.limit,
                    ...(filters.departmentId && { departmentId: filters.departmentId }),
                    ...(filters.employeeName && { employeeName: filters.employeeName.trim() }),
                    ...(filters.status && filters.status !== 'not_set' && { status: filters.status })
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
        setFilters(prev => ({ 
            ...prev, 
            [key]: value,
            page: 1 // Reset to first page when filters change
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