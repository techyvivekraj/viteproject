import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@mantine/core';
import { selectShifts, selectLoading } from '../../store/slices/organisation/shiftSlice';
import { fetchShifts, deleteShift } from '../../store/actions/organisation/shift';

export const useShift = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const shifts = useSelector(selectShifts);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchShifts(organizationId));
    }
  }, [dispatch, organizationId]);

  const columns = useMemo(() => [
    {
      header: 'Shift Name',
      accessor: 'shiftName',
      render: (item) => <Text>{item.shiftName || 'N/A'}</Text>,
    },
    {
      header: 'Start Time',
      accessor: 'startTime',
      render: (item) => <Text>{item.startTime || 'N/A'}</Text>,
    },
    {
      header: 'End Time',
      accessor: 'endTime',
      render: (item) => <Text>{item.endTime || 'N/A'}</Text>,
    },
    {
      header: 'Working Days',
      accessor: 'workingDays',
      render: (item) => {
        if (Array.isArray(item.workingDays) && item.workingDays.length > 0) {
          const workingDaysString = item.workingDays
            .map(day => day.charAt(0).toUpperCase() + day.slice(1))
            .join(', ');
          return <Text>{workingDaysString}</Text>;
        }
        return <Text>N/A</Text>;
      },
    },
  ], []);

  const handleDelete = useCallback((shiftId) => {
    dispatch(deleteShift(shiftId, organizationId));
  }, [dispatch, organizationId]);

  return {
    shifts,
    loading,
    columns,
    handleDelete
  };
}; 