import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '../../store/slices/organisation/rolesSlice';
import { selectDepartments } from '../../store/slices/organisation/deptSlice';
import { addRoles } from '../../store/actions/organisation/roles';
import { fetchDepartments } from '../../store/actions/organisation/dept';

const initialFormState = {
  roleName: '',
  deptId: '',
  levelId: ''
};

const levels = [
  { id: 1, value: 'Level 1' },
  { id: 2, value: 'Level 2' },
  { id: 3, value: 'Level 3' },
  { id: 4, value: 'Level 4' },
  { id: 5, value: 'Level 5' },
];

export const useAddRole = (closeModal) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  const loading = useSelector(selectLoading);
  const departments = useSelector(selectDepartments);
  
  // Ensure departmentList is always an array with the correct structure
  const departmentList = Array.isArray(departments) ? departments.map(dept => ({
    deptId: dept.id || dept.deptId,
    departmentName: dept.name || dept.departmentName
  })) : [];

  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  // Fetch departments when component mounts
  useEffect(() => {
    if (organizationId) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, organizationId]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.roleName) newErrors.roleName = 'Role name is required';
    if (!formValues.deptId) newErrors.deptId = 'Please select a department';
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
      const roleDetails = {
        orgId: organizationId,
        ...formValues
      };
      await dispatch(addRoles(roleDetails)).unwrap();
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      console.error('Error adding role:', error);
      setErrors({ general: 'Failed to add role. Please try again.' });
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
    departmentList,
    levels,
    handleChange,
    handleSubmit
  };
}; 