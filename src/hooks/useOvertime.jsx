import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import { 
    selectOvertime,
    selectLoading 
} from '../store/slices/overtime/overtimeSlice';
import { fetchOvertime, deleteOvertime } from '../../store/actions/overtime/overtime';
import { showError } from '../components/api';

export const useOvertime = () => {
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');
    const overtimeData = useSelector(selectOvertime);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(fetchOvertime(organizationId));
    }, [dispatch, organizationId]);

    const columns = useMemo(() => [
        {
            header: 'Employee Name',
            accessor: 'employeeName',
            render: (item) => <Text size="sm">{item.employeeName}</Text>
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (item) => <Text size="sm">{new Date(item.date).toLocaleDateString()}</Text>
        },
        {
            header: 'Hours',
            accessor: 'hours',
            render: (item) => <Text size="sm">{item.hours}</Text>
        },
        {
            header: 'Reason',
            accessor: 'reason',
            render: (item) => <Text size="sm">{item.reason}</Text>
        }
    ], []);

    const handleDelete = useCallback(async (overtimeId) => {
        try {
            await dispatch(deleteOvertime({ id: overtimeId, organizationId })).unwrap();
        } catch (error) {
            showError(error.message || 'Failed to delete overtime record');
        }
    }, [dispatch, organizationId]);

    return {
        overtimeData,
        loading,
        columns,
        handleDelete
    };
}; 