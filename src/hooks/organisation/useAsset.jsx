import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Badge, Group, Avatar } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import {
  selectAssets,
  selectLoading,
  selectError,
  selectLastFetch,
} from '../../store/slices/organisation/assetsSlice';
import { fetchAssets, deleteAsset } from '../../store/actions/organisation/assets';
import dayjs from 'dayjs';

export const useAsset = () => {
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');
  const assets = useSelector(selectAssets);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const lastFetch = useSelector(selectLastFetch);

  const fetchAssetsData = useCallback(() => {
    if (organizationId) {
      dispatch(fetchAssets(organizationId));
    }
  }, [dispatch, organizationId]);

  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      fetchAssetsData();
    }
  }, [fetchAssetsData, lastFetch, organizationId]);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteAsset({ id, organizationId })).unwrap();
      return true;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete asset');
    }
  }, [dispatch, organizationId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'lost':
        return 'red';
      case 'returned':
        return 'blue';
      case 'maintenance':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'new':
        return 'teal';
      case 'good':
        return 'green';
      case 'fair':
        return 'yellow';
      case 'poor':
        return 'orange';
      case 'damaged':
        return 'red';
      default:
        return 'gray';
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Asset Details',
      accessor: 'asset_name',
      width: '30%',
      render: (item) => (
        <Text size="sm" fw={500} lineClamp={1}>
        {item.asset_name || 'N/A'}
      </Text>
      ),
    },
    {
      header: 'Purchase Date',
      accessor: 'purchase_date',
      width: '15%',
      render: (item) => (
        <Text size="sm">
         {item.purchase_date ? dayjs(item.purchase_date).format('DD MMMM YYYY') : 'N/A'}
        </Text>
      ),
    },
    {
      header: 'Status & Condition',
      accessor: 'status',
      width: '25%',
      render: (item) => (
        <Group spacing={8}>
          <Badge 
            color={getStatusColor(item.status)}
            variant="filled"
            size="sm"
          >
            {item.status || 'N/A'}
          </Badge>
          <Badge 
            color={getConditionColor(item.conditionn)}
            variant="light"
            size="sm"
          >
            {item.conditionn || 'N/A'}
          </Badge>
        </Group>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assigned_to',
      width: '30%',
      render: (item) => (
        <Group spacing="sm">
          {item.first_name && item.last_name ? (
            <>
              <Avatar
                size={32}
                radius="xl"
                color="cyan"
                variant="filled"
              >
                <IconUser size={20} />
              </Avatar>
              <div>
                <Text size="sm" fw={500}>
                  {`${item.first_name} ${item.last_name}`}
                </Text>
                <Text size="xs" color="dimmed">
                  Employee
                </Text>
              </div>
            </>
          ) : (
            <Text size="sm" color="dimmed">Not Assigned</Text>
          )}
        </Group>
      ),
    }
  ], []);

  return {
    assets: assets?.data || [],
    loading,
    error,
    columns,
    handleDelete,
    fetchAssets: fetchAssetsData
  };
}; 