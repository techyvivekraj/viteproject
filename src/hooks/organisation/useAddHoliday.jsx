import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddStatus, selectAddError } from '../../store/slices/organisation/holidaySlice';
import { addHoliday } from '../../store/actions/organisation/holidays';
import { showError, showToast } from '../../components/api';

const initialFormState = {
  name: '',
  description: '',
  date: null,
  type: 'full',
  status: 'active'
};

export const useAddHoliday = (closeModal) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const loading = useSelector(state => state.holidays.loading);
  const addStatus = useSelector(selectAddStatus);
  const addError = useSelector(selectAddError);
  const organizationId = localStorage.getItem('orgId');

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.name?.trim()) {
      newErrors.name = 'Holiday name is required';
    }
    if (!formValues.date) {
      newErrors.date = 'Date is required';
    }
    if (!formValues.type) {
      newErrors.type = 'Type is required';
    }
    return newErrors;
  }, [formValues]);

  const handleChange = useCallback((field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const holidayData = {
        name: formValues.name,
        description: formValues.description,
        date: formValues.date.toISOString().split('T')[0],
        type: formValues.type,
        status: formValues.status,
        organizationId
      };

      await dispatch(addHoliday(holidayData)).unwrap();
      showToast('Holiday added successfully');
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      showError(error || 'Failed to add holiday');
      setErrors({ general: error || 'Failed to add holiday' });
    }
  }, [formValues, validate, dispatch, organizationId, closeModal]);

  const handleReset = useCallback(() => {
    setFormValues(initialFormState);
    setErrors({});
  }, []);

  return {
    formValues,
    errors,
    loading,
    addStatus,
    addError,
    handleChange,
    handleSubmit,
    handleReset
  };
}; 