import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { Text, Badge } from '@mantine/core';
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

  const fetchAssetsData = useCallback(() => {
    if (organizationId) {
      dispatch(fetchAssets(organizationId));
    }
  }, [dispatch, organizationId]);

  useEffect(() => {
    if (organizationId) {
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
      default:
        return 'gray';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'new':
        return 'green';
      case 'used':
        return 'yellow';
      case 'damaged':
        return 'red';
      default:
        return 'gray';
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Asset Name',
      accessor: 'asset_name',
      render: (item) => (
        <Text fw={500}>
          {item.asset_name || 'N/A'}
        </Text>
      ),
    },
    {
      header: 'Purchase Date',
      accessor: 'purchase_date',
      render: (item) => (
        <Text>
          {item.purchase_date || 'N/A'}
        </Text>
      ),
    },
    {
      header: 'Condition',
      accessor: 'conditionn',
      render: (item) => (
        <Badge 
          color={getConditionColor(item.conditionn)}
          variant="light"
        >
          {item.conditionn || 'N/A'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge 
          color={getStatusColor(item.status)}
          variant="filled"
        >
          {item.status || 'N/A'}
        </Badge>
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
    handleDelete,
    fetchAssets: fetchAssetsData
  };
}; 