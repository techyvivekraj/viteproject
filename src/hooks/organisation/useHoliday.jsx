import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Badge, Group } from '@mantine/core';
import {
  selectHolidays,
  selectLoading,
  selectError,
  selectLastFetch
} from '../../store/slices/organisation/holidaySlice';
import { fetchHolidays, deleteHoliday } from '../../store/actions/organisation/holidays';
import { showError, showToast } from '../../components/api';
import dayjs from 'dayjs';
import { capitalizeFirstLetter } from '../../utils/utils';

export const useHoliday = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const holidays = useSelector(selectHolidays);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const lastFetch = useSelector(selectLastFetch);

  const fetchHolidaysData = useCallback(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchHolidays({ organizationId }));
    }
  }, [dispatch, lastFetch, organizationId]);

  useEffect(() => {
    fetchHolidaysData();
  }, [fetchHolidaysData]);

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full':
        return 'blue';
      case 'half':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'gray';
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Holiday Details',
      accessor: 'name',
      width: '40%',
      render: (item) => (
        <div>
          <Text size="sm" fw={500} lineClamp={1}>
            {capitalizeFirstLetter(item.name)}
          </Text>
          <Text size="xs" color="dimmed" lineClamp={1}>
            {item.description || 'No description'}
          </Text>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      width: '20%',
      render: (item) => (
        <Text size="sm">
          {dayjs(item.date).format('DD MMMM YYYY')}
        </Text>
      ),
    },
    {
      header: 'Type & Status',
      accessor: 'type',
      width: '40%',
      render: (item) => (
        <Group spacing={8}>
          <Badge
            color={getTypeColor(item.type)}
            variant="light"
            size="sm"
          >
            {item.type || 'N/A'}
          </Badge>
          <Badge
            color={getStatusColor(item.status)}
            variant="filled"
            size="sm"
          >
            {item.status || 'N/A'}
          </Badge>
        </Group>
      ),
    }
  ], []);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteHoliday({ id, organizationId })).unwrap();
      showToast('Holiday deleted successfully');
    } catch (error) {
      showError(error.message || 'Failed to delete holiday');
    }
  }, [dispatch, organizationId]);

  return {
    holidays,
    loading,
    error,
    columns,
    handleDelete,
    refetch: fetchHolidaysData
  };
}; 