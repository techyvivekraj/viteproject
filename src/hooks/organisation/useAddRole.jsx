import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectAddStatus } from '../../store/slices/organisation/designationSlice';
import { selectDepartments, selectLastFetch } from '../../store/slices/organisation/deptSlice';
import { addDesignation } from '../../store/actions/organisation/designation';
import { fetchDepartments } from '../../store/actions/organisation/dept';
import { showError, showToast } from '../../components/api';

const initialFormState = {
  name: '',
  departmentId: ''
};

export const useAddRole = (closeModal) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  const loading = useSelector(selectLoading);
  const addStatus = useSelector(selectAddStatus);
  const departments = useSelector(selectDepartments);
  const lastFetch = useSelector(selectLastFetch);
  
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  useEffect(() => {
    if (!lastFetch || Date.now() - lastFetch > 300000) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, lastFetch, organizationId]);

  const departmentList = departments?.data?.map(dept => ({
    value: String(dept.id),
    label: dept.name
  })) || [];

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.name?.trim()) newErrors.name = 'Role name is required';
    if (!formValues.departmentId) newErrors.departmentId = 'Please select a department';
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
      const roleData = {
        name: formValues.name,
        departmentId: formValues.departmentId,
        organizationId
      };

      await dispatch(addDesignation(roleData)).unwrap();
      showToast('Role added successfully');
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      showError(error.message || 'Failed to add asset');
      setErrors({ general: 'Failed to add role. Please try again.' });
    }
  }, [formValues, validate, organizationId, dispatch, closeModal]);

  useEffect(() => {
    if (addStatus === 'succeeded') {
      setFormValues(initialFormState);
      setErrors({});
    }
  }, [addStatus]);

  return {
    formValues,
    errors,
    loading,
    departmentList,
    handleChange,
    handleSubmit
  };
}; 