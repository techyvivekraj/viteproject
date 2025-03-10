import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee } from '../store/actions/employees';
import { showError, showToast } from '../components/api';
import { fetchDepartments } from '../store/actions/organisation/dept';
import { fetchDesignations } from '../store/actions/organisation/designation';
import { fetchShifts } from '../store/actions/organisation/shift';
import { selectDepartments } from '../store/slices/organisation/deptSlice';
import { selectDesignations } from '../store/slices/organisation/designationSlice';
import { selectShifts } from '../store/slices/organisation/shiftSlice';
import { selectAddEmployeeStatus, selectAddEmployeeError } from '../store/slices/employeesSlice';

const initialFormState = {
  // Required fields
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  joiningDate: '',
  departmentId: '',
  designationId: '',
  shiftId: '',
  
  // Optional fields
  employeeCode: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  address: '',
  country: '',
  state: '',
  postalCode: '',
  reportingManagerId: '',
  bankAccountNumber: '',
  bankIfscCode: ''
};

export const useAddEmployee = (onSuccess) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  // Selectors
  const departments = useSelector(selectDepartments);
  const designations = useSelector(selectDesignations);
  const shifts = useSelector(selectShifts);
  const addStatus = useSelector(selectAddEmployeeStatus);
  const addError = useSelector(selectAddEmployeeError);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchDepartments(organizationId));
    dispatch(fetchDesignations(organizationId));
    dispatch(fetchShifts(organizationId));
  }, [dispatch, organizationId]);

  // Transform data for dropdowns
  const departmentList = departments?.data?.map(dept => ({
    value: String(dept.id),
    label: dept.name
  })) || [];

  const designationList = designations?.data?.map(desig => ({
    value: String(desig.id),
    label: desig.name
  })) || [];

  const shiftList = shifts?.data?.map(shift => ({
    value: String(shift.id),
    label: shift.name
  })) || [];

  const validate = useCallback(() => {
    const newErrors = {};
    
    // Required fields validation
    if (!formValues.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formValues.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formValues.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formValues.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formValues.joiningDate) newErrors.joiningDate = 'Joining date is required';
    if (!formValues.departmentId) newErrors.departmentId = 'Department is required';
    if (!formValues.designationId) newErrors.designationId = 'Designation is required';
    if (!formValues.shiftId) newErrors.shiftId = 'Shift is required';

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
      await dispatch(addEmployee({ ...formValues, organizationId })).unwrap();
      showToast('Employee added successfully');
      setFormValues(initialFormState);
      if (onSuccess) onSuccess();
    } catch (error) {
      showError(error.message || 'Failed to add employee');
      setErrors({ general: 'Failed to add employee. Please try again.' });
    }
  }, [formValues, validate, organizationId, dispatch, onSuccess]);

  // Reset form when successfully added
  useEffect(() => {
    if (addStatus === 'succeeded') {
      setFormValues(initialFormState);
      setErrors({});
    }
  }, [addStatus]);

  return {
    formValues,
    errors,
    loading: addStatus === 'loading',
    departmentList,
    designationList,
    shiftList,
    handleChange,
    handleSubmit,
    addError
  };
};
