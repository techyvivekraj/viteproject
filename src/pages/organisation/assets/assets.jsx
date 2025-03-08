import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useAsset } from '../../../hooks/organisation/useAsset';
import DataTable from '../../../components/DataTable/datatable';
import AddAsset from './add_assets';

export default function Assets() {
  const [opened, { open, close }] = useDisclosure(false);
  const { assets, loading, columns, handleDelete, fetchAssets } = useAsset();

  // Handle initial fetch and errors
  // useEffect(() => {
  //   fetchAssets();
  // }, [fetchAssets]);

  // useEffect(() => {
  //   if (error) {
  //     notifications.show({
  //       title: 'Error',
  //       message: error,
  //       color: 'red'
  //     });
  //   }
  // }, [error]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const processedData = useMemo(() => 
    Array.isArray(assets) 
      ? assets.map(asset => ({
          id: asset.id,
          asset_name: capitalizeWords(asset.asset_name),
          purchase_date: formatDate(asset.purchase_date),
          conditionn: capitalizeWords(asset.conditionn),
          status: capitalizeWords(asset.status),
          assigned_to: asset.assigned_to,
          first_name: asset.first_name,
          last_name: asset.last_name
        }))
      : [], 
    [assets]);

  const openDeleteModal = useCallback((assetId) => {
    modals.openConfirmModal({
      title: 'Confirm Deletion',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this asset? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete Asset', cancel: 'Cancel' },
      withOverlay: true,
      draggable: true,
      radius: 'md',
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        try {
          await handleDelete(assetId);
          notifications.show({
            title: 'Success',
            message: 'Asset deleted successfully',
            color: 'green'
          });
          // Refresh the assets list immediately after deletion
          fetchAssets();
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: error.message || 'Failed to delete asset',
            color: 'red'
          });
        }
      },
    });
  }, [handleDelete, fetchAssets]);

  const handleEditClick = useCallback((item) => {
    console.log('Edit clicked', item);
    // Implement edit functionality
  }, []);

  const handleAddSuccess = useCallback(() => {
    close();
    // Refresh the assets list immediately after adding
    fetchAssets();
    notifications.show({
      title: 'Success',
      message: 'Asset added successfully',
      color: 'green'
    });
  }, [close, fetchAssets]);

  return (
    <div>
      <DataTable
        title="Asset List"
        data={processedData}
        columns={columns}
        searchPlaceholder="Search assets..."
        pagination={true}
        onAddClick={open}
        onDeleteClick={(item) => openDeleteModal(item.id)}
        onEditClick={handleEditClick}
        isLoading={loading}
        hideMonthPicker={true}
      />
      <AddAsset opened={opened} closeModal={close} onSuccess={handleAddSuccess} />
    </div>
  );
}
