import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { selectLoading, selectAddStatus } from '../../store/slices/organisation/designationSlice';
import { selectDepartments } from '../../store/slices/organisation/deptSlice';
import { addDesignation } from '../../store/actions/organisation/designation';
import { fetchDepartments } from '../../store/actions/organisation/dept';

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
  
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, organizationId]);

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
      notifications.show({
        title: 'Success',
        message: 'Role added successfully',
        color: 'green'
      });
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to add role',
        color: 'red'
      });
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