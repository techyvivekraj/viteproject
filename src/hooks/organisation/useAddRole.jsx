import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectAddRoleStatus } from '../../store/slices/organisation/rolesSlice';
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
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  
  const loading = useSelector(selectLoading);
  const addRoleStatus = useSelector(selectAddRoleStatus);
  const departments = useSelector(selectDepartments);
  
  // Enhanced department list with "Add Department" option
  const departmentList = [
    ...(Array.isArray(departments?.data) 
      ? departments.data.map(dept => ({
          deptId: dept.id,
          departmentName: dept.name
        })) 
      : []),
    { deptId: 'add_new', departmentName: '+ Add New Department' }
  ];

  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchDepartments(organizationId));
    }
  }, [dispatch, organizationId]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.roleName?.trim()) newErrors.roleName = 'Role name is required';
    if (!formValues.deptId) newErrors.deptId = 'Please select a department';
    return newErrors;
  }, [formValues]);

  const handleChange = useCallback((field, value) => {
    if (field === 'deptId' && value === 'add_new') {
      setShowDepartmentModal(true);
      return;
    }
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

  // Reset form when successfully added
  useEffect(() => {
    if (addRoleStatus === 'succeeded') {
      setFormValues(initialFormState);
      setErrors({});
    }
  }, [addRoleStatus]);

  const handleDepartmentModalClose = useCallback(() => {
    setShowDepartmentModal(false);
  }, []);

  const handleDepartmentAdded = useCallback((newDepartment) => {
    dispatch(fetchDepartments(organizationId));
    setFormValues(prev => ({ ...prev, deptId: String(newDepartment.id) }));
    setShowDepartmentModal(false);
  }, [dispatch, organizationId]);

  return {
    formValues,
    errors,
    loading,
    departmentList,
    levels,
    showDepartmentModal,
    handleChange,
    handleSubmit,
    handleDepartmentModalClose,
    handleDepartmentAdded
  };
}; 