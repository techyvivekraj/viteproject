import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Badge, Group } from '@mantine/core';
import { selectShifts, selectLoading, selectError, selectLastFetch } from '../../store/slices/organisation/shiftSlice';
import { fetchShifts, deleteShift } from '../../store/actions/organisation/shift';
import { showError, showToast } from '../../components/api';
import { capitalizeFirstLetter } from '../../utils/utils';

export const useShift = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const shifts = useSelector(selectShifts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const lastFetch = useSelector(selectLastFetch);

  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchShifts(organizationId));
    }
  }, [dispatch, lastFetch, organizationId]);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteShift({ id, organizationId })).unwrap();
      showToast('Shift deleted successfully');
    } catch (error) {
      showError(error.message || 'Failed to delete shift');
    }
  }, [dispatch, organizationId]);

  const formatWorkingDays = (days) => {
    if (!days) return [];
    return days.split(',').map(day => day.trim());
  };

  const columns = useMemo(() => [
    {
      header: 'Shift Name',
      accessor: 'name',
      render: (item) => (
        <Text size="sm" fw={500} lineClamp={1}>
          {capitalizeFirstLetter(item.name || 'N/A')}
        </Text>
      ),
    },
    {
      header: 'Start Time',
      accessor: 'start_time',
      render: (item) => (
        <Text>
          {item.start_time || 'N/A'}
        </Text>
      ),
    },
    {
      header: 'End Time',
      accessor: 'end_time',
      render: (item) => (
        <Text>
          {item.end_time || 'N/A'}
        </Text>
      ),
    },
    {
      header: 'Working Days',
      accessor: 'working_days',
      render: (item) => (
        <Group spacing={4}>
          {formatWorkingDays(item.working_days).map((day, index) => (
            <Badge
              key={index}
              variant="light"
              color="blue"
              size="sm"
            >
              {day}
            </Badge>
          ))}
        </Group>
      ),
    }
  ], []);

  return {
    shifts: shifts?.data || [],
    loading,
    error,
    columns,
    handleDelete
  };
}; 