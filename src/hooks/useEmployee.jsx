import { useEffect, useCallback } from 'react';
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
    const employees = useSelector(selectEmployees);
    const loading = useSelector(selectLoading);
    const lastFetch = useSelector(selectLastFetch);

    // Fetch employees only if needed (5 minutes cache)
    useEffect(() => {
        const shouldFetch = !lastFetch || Date.now() - lastFetch > 300000;
        const hasNoData = !employees?.data;
        
        if (organizationId && (shouldFetch || hasNoData)) {
            dispatch(fetchEmployees(organizationId));
        }
    }, [dispatch, lastFetch, organizationId, employees?.data]);

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
        handleDelete
    };
}; 