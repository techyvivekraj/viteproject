import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { Text } from '@mantine/core';
import { fetchAssets, deleteAsset } from '../../store/actions/organisation/assets';
import {
  selectAssets,
  selectLoading,
  selectError,
  selectLastFetch
} from '../../store/slices/organisation/assetsSlice';

export const useAsset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizationId = localStorage.getItem('orgId');
  const assets = useSelector(selectAssets);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const lastFetch = useSelector(selectLastFetch);

  useEffect(() => {
    if ((!lastFetch || Date.now() - lastFetch > 300000) && organizationId) {
      dispatch(fetchAssets(organizationId));
    }
  }, [dispatch, lastFetch, organizationId]);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteAsset({ id, organizationId })).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Asset deleted successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete asset',
        color: 'red'
      });
    }
  }, [dispatch, organizationId]);

  const columns = useMemo(() => [
    {
      header: 'Asset Name',
      accessor: 'asset_name',
      render: (item) => <Text>{item.asset_name || 'N/A'}</Text>,
    },
    {
      header: 'Purchase Date',
      accessor: 'purchase_date',
      render: (item) => <Text>{item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : 'N/A'}</Text>,
    },
    {
      header: 'Condition',
      accessor: 'conditionn',
      render: (item) => <Text>{item.conditionn || 'N/A'}</Text>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Text color={item.status === 'active' ? 'green' : item.status === 'lost' ? 'red' : 'orange'}>
          {item.status || 'N/A'}
        </Text>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assigned_to',
      render: (item) => (
        <Text>
          {item.first_name && item.last_name 
            ? `${item.first_name} ${item.last_name}`
            : 'Not Assigned'}
        </Text>
      ),
    }
  ], []);

  const handleAddClick = useCallback(() => navigate('/asset/add'), [navigate]);
  const handleViewClick = useCallback((asset) => navigate(`/assets/view/${asset.id}`), [navigate]);
  const handleEditClick = useCallback((asset) => navigate(`/assets/edit/${asset.id}`), [navigate]);

  return {
    assets: assets?.data || [],
    loading,
    error,
    columns,
    handleAddClick,
    handleViewClick,
    handleEditClick,
    handleDelete
  };
}; 