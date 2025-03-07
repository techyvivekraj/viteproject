import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '../../store/slices/organisation/deptSlice';
import { addDepartment } from '../../store/actions/organisation/dept';

const initialFormState = {
  departmentName: '',
  casualLeave: '',
  sickLeave: '',
  earnedLeave: '',
  maternityLeave: '',
  paternityLeave: '',
  noticePeriod: ''
};

export const useAddDepartment = (closeModal) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.departmentName) newErrors.departmentName = 'Department name is required';
    
    const validateLeave = (value, field) => {
      if (value && (isNaN(value) || !/^\d+$/.test(value) || value > 365)) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} must be a number and not more than 365`;
      }
    };

    validateLeave(formValues.casualLeave, 'casualLeave');
    validateLeave(formValues.sickLeave, 'sickLeave');
    validateLeave(formValues.earnedLeave, 'earnedLeave');
    validateLeave(formValues.maternityLeave, 'maternityLeave');
    validateLeave(formValues.paternityLeave, 'paternityLeave');

    if (formValues.noticePeriod && (isNaN(formValues.noticePeriod) || !/^\d+$/.test(formValues.noticePeriod))) {
      newErrors.noticePeriod = 'Notice period must be a number';
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
      const departmentDetails = {
        name: formValues.departmentName,
        organizationId: organizationId,
        noticePeriod: formValues.noticePeriod || '',
        casualLeave: formValues.casualLeave || '',
        sickLeave: formValues.sickLeave || '',
        earnedLeave: formValues.earnedLeave || '',
        maternityLeave: formValues.maternityLeave || '',
        paternityLeave: formValues.paternityLeave || ''
      };
      await dispatch(addDepartment(departmentDetails)).unwrap();
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      console.log(error)
      setErrors({ general: 'Failed to add department. Please try again.' });
    }
  }, [formValues, validate, organizationId, dispatch, closeModal]);

  useEffect(() => {
    if (!loading) {
      setFormValues(initialFormState);
      setErrors({});
    }
  }, [loading]);

  return {
    formValues,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
}; 