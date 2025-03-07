import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Badge } from '@mantine/core';
import { 
  selectHolidays, 
  selectLoading 
} from '../../store/slices/organisation/holidaySlice';
import { fetchHolidays, deleteHoliday } from '../../store/actions/organisation/holidays';

export const useHoliday = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const holidays = useSelector(selectHolidays);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (organizationId) {
      const currentYear = new Date().getFullYear();
      dispatch(fetchHolidays(organizationId, currentYear));
    }
  }, [dispatch, organizationId]);

  const columns = useMemo(() => [
    {
      header: 'Holiday Name',
      accessor: 'holidayName',
    },
    {
      header: 'Date',
      accessor: 'holidayDate',
      render: (item) => <Text>{new Date(item.holidayDate).toLocaleDateString()}</Text>,
    },
    {
      header: 'Type',
      accessor: 'isOptional',
      render: (item) => (
        <Badge color={item.isOptional ? 'yellow' : 'blue'}>
          {item.isOptional ? 'Optional' : 'Mandatory'}
        </Badge>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
    },
  ], []);

  const handleDelete = useCallback((holidayId) => {
    dispatch(deleteHoliday(holidayId, organizationId));
  }, [dispatch, organizationId]);

  return {
    holidays,
    loading,
    columns,
    handleDelete
  };
}; 