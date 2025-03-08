import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { addAsset } from '../../store/actions/organisation/assets';
import { fetchDepartments } from '../../store/actions/organisation/dept';
import { selectDepartments } from '../../store/slices/organisation/deptSlice';
import { 
  selectAddAssetStatus, 
  selectAddAssetError,
  resetAddAssetStatus 
} from '../../store/slices/organisation/assetsSlice';
import { fetchAssets } from '../../store/actions/organisation/assets';

const initialFormValues = {
  assetName: '',
  assignedTo: '',
  purchaseDate: null,
  condition: '',
  status: 'active'
};

export const useAddAsset = (closeModal) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  
  const loading = useSelector(selectAddAssetStatus) === 'loading';
  const error = useSelector(selectAddAssetError);
  const departments = useSelector(selectDepartments);
  const organizationId = localStorage.getItem('orgId');

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, organizationId]);

  const departmentList = [
    ...(departments?.data?.map(dept => ({
      value: String(dept.id),
      label: dept.name
    })) || []),
    { value: 'add_new', label: '+ Add New Department' }
  ];

  const handleChange = useCallback((field, value) => {
    if (field === 'departmentId' && value === 'add_new') {
      setShowDepartmentModal(true);
      return;
    }
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.assetName?.trim()) newErrors.assetName = 'Asset name is required';
    if (!formValues.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formValues.condition) newErrors.condition = 'Asset condition is required';
    
    // Validate assignedTo if provided
    if (formValues.assignedTo && !Number.isInteger(Number(formValues.assignedTo))) {
      newErrors.assignedTo = 'Employee ID must be a number';
    }
    
    return newErrors;
  }, [formValues]);

  const handleReset = useCallback(() => {
    setFormValues(initialFormValues);
    setErrors({});
    dispatch(resetAddAssetStatus());
  }, [dispatch]);

  const handleDepartmentAdded = useCallback((newDepartment) => {
    if (newDepartment?.id) {
      setFormValues(prev => ({ ...prev, departmentId: String(newDepartment.id) }));
    }
    setShowDepartmentModal(false);
    dispatch(fetchDepartments(organizationId));
  }, [dispatch, organizationId]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const assetData = {
      assetName: formValues.assetName,
      assignedTo: formValues.assignedTo ? Number(formValues.assignedTo) : null,
      purchaseDate: formValues.purchaseDate ? formValues.purchaseDate.toISOString().split('T')[0] : null,
      condition: formValues.condition,
      status: formValues.status,
      organizationId
    };

    try {
      await dispatch(addAsset(assetData)).unwrap();
      await dispatch(fetchAssets(organizationId));
      notifications.show({
        title: 'Success',
        message: 'Asset added successfully',
        color: 'green'
      });
      handleReset();
      closeModal();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to add asset',
        color: 'red'
      });
      setErrors({ general: 'Failed to add asset. Please try again.' });
    }
  }, [formValues, validate, organizationId, dispatch, handleReset, closeModal]);

  return {
    formValues,
    errors,
    loading,
    error,
    departmentList,
    showDepartmentModal,
    handleChange,
    handleSubmit,
    handleReset,
    handleDepartmentAdded,
    handleDepartmentModalClose: () => setShowDepartmentModal(false)
  };
}; 