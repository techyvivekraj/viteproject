import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '../../store/slices/organisation/holidaySlice';
import { addHoliday } from '../../store/actions/organisation/holidays';
import { format } from 'date-fns';

const initialFormState = {
  holidayName: '',
  holidayDate: null,
  description: '',
  isOptional: false
};

export const useAddHoliday = (closeModal) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.holidayName) newErrors.holidayName = 'Holiday name is required';
    if (!formValues.holidayDate) newErrors.holidayDate = 'Date is required';
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

    const holidayDetails = {
      orgId: organizationId,
      holidayName: formValues.holidayName,
      holidayDate: format(formValues.holidayDate, 'yyyy-MM-dd'),
      description: formValues.description,
      isOptional: formValues.isOptional,
    };

    try {
      await dispatch(addHoliday(holidayDetails)).unwrap();
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      setErrors({ general: 'Failed to add holiday. Please try again.' });
    }
  }, [formValues, validate, organizationId, dispatch, closeModal]);

  const handleReset = useCallback(() => {
    setFormValues(initialFormState);
    setErrors({});
  }, []);

  return {
    formValues,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleReset
  };
}; 