import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAsset } from '../../store/actions/organisation/assets';
import { 
  selectAddAssetStatus, 
  selectAddAssetError,
  resetAddAssetStatus 
} from '../../store/slices/organisation/assetsSlice';

const initialFormValues = {
  assetName: '',
  assetType: '',
  customAssetType: '',
  purchaseDate: null,
  conditionn: '',
  assignedTo: '',
  departmentId: '',
};

export const useAddAsset = (closeModal) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  
  const loading = useSelector(selectAddAssetStatus) === 'loading';
  const error = useSelector(selectAddAssetError);

  const handleChange = useCallback((field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.assetName) newErrors.assetName = 'Asset name is required';
    if (!formValues.assetType && !formValues.customAssetType) newErrors.assetType = 'Asset type is required';
    if (!formValues.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formValues.conditionn) newErrors.condition = 'Asset condition is required';
    if (!formValues.departmentId) newErrors.departmentId = 'Department is required';
    return newErrors;
  }, [formValues]);

  const handleReset = useCallback(() => {
    setFormValues(initialFormValues);
    setErrors({});
    dispatch(resetAddAssetStatus());
  }, [dispatch]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const organizationId = localStorage.getItem('orgId');
    const assetDetails = {
      ...formValues,
      assetType: formValues.customAssetType || formValues.assetType,
      purchaseDate: formValues.purchaseDate ? formValues.purchaseDate.toISOString().split('T')[0] : null,
      assignedTo: formValues.assignedTo || null,
      orgId: organizationId,
    };

    try {
      await dispatch(addAsset(assetDetails)).unwrap();
      handleReset();
      closeModal();
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Failed to add asset. Please try again.' 
      }));
    }
  }, [formValues, validate, dispatch, handleReset, closeModal]);

  return {
    formValues,
    errors,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleReset
  };
}; 