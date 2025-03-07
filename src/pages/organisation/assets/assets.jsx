import { useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useDispatch } from 'react-redux';
import { deleteAsset } from '../../../store/actions/organisation/assets';
import { useAsset } from '../../../hooks/organisation/useAsset';
import DataTable from '../../../components/DataTable/datatable';
import AddAsset from './add_assets';

function AssetTable() {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  const { assets, loading, columns } = useAsset();

  const processedData = useMemo(() => 
    Array.isArray(assets) 
      ? assets.map(emp => ({ ...emp }))
      : [], 
    [assets]);

  const openDeleteModal = useCallback((assetId) => {
    modals.openConfirmModal({
      title: 'Confirm Deletion',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure to delete this Asset?
        </Text>
      ),
      labels: { confirm: 'Delete Asset', cancel: 'Cancel' },
      withOverlay: true,
      draggable: true,
      radius: 'md',
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => dispatch(deleteAsset(assetId)),
    });
  }, [dispatch]);

  const handleAddClick = useCallback(() => {
    open();
  }, [open]);

  const handleEditClick = useCallback((item) => {
    console.log('Edit clicked', item);
    // Navigate to edit page or open edit modal
  }, []);

  const handleDeleteClick = useCallback((item) => {
    openDeleteModal(item.assetId);
  }, [openDeleteModal]);

  return (
    <div>
      <DataTable
        title="Asset List"
        data={processedData}
        columns={columns}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        searchPlaceholder="Search assets..."
        isLoading={loading}
        hideMonthPicker={true}
      />
      <AddAsset opened={opened} closeModal={close} />
    </div>
  );
}

export default AssetTable;
