import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    selectEmployees, 
    selectLoading, 
    selectLastFetch
} from '../store/slices/employeeSlice';
import { 
    fetchEmployees, 
    deleteEmployee 
} from '../store/actions/employee';
import { showError, showToast } from '../components/api';

export const useEmployee = () => {
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');
    const { data: employees = [], pagination = { limit: 10, page: 1 } } = useSelector(selectEmployees);
    const loading = useSelector(selectLoading);
    const lastFetch = useSelector(selectLastFetch);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch employees only if needed (5 minutes cache)
    useEffect(() => {
        const shouldFetch = !lastFetch || Date.now() - lastFetch > 300000;
        const hasNoData = !employees?.length;
        
        if (organizationId && (shouldFetch || hasNoData)) {
            dispatch(fetchEmployees({ 
                organizationId, 
                page: currentPage, 
                limit: pagination.limit || 10
            }));
        }
    }, [dispatch, lastFetch, organizationId, employees?.length, currentPage, pagination.limit]);

    const handlePageChange = useCallback((newPage) => {
        if (newPage === currentPage) return;
        setCurrentPage(newPage);
    }, [currentPage]);

    const handleDelete = useCallback(async (employeeId) => {
        try {
            if (!organizationId) {
                throw new Error('Organization ID is required');
            }

            await dispatch(deleteEmployee({ 
                id: employeeId, 
                organizationId 
            })).unwrap();
            
            showToast('Employee deleted successfully', 'success');
        } catch (error) {
            showError(error.message || 'Failed to delete employee');
        }
    }, [dispatch, organizationId]);

    return {
        employees,
        loading,
        handleDelete,
        pagination: {
            ...pagination,
            limit: pagination.limit || 10,
            page: currentPage,
            totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10))
        },
        currentPage,
        handlePageChange
    };
}; 