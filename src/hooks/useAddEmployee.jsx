import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee } from '../store/actions/employees';
import { 
  selectAddEmployeeStatus, 
  selectAddEmployeeError,
  resetAddEmployeeStatus 
} from '../store/slices/employeesSlice';
import { useNavigate } from 'react-router-dom';

const initialFormValues = {
  // Basic Information
  employeeCode: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',

  // Address Information
  addresss: '',
  city: '',
  statee: '',
  country: 'IN',
  postalCode: '',

  // Emergency Contact
  emergencyContactName: '',
  emergencyContactPhone: '',

  // Work Information
  departmentId: '',
  designationId: '',
  shiftId: '',
  joiningDate: '',
  salaryType: '',
  reportingManagerId: '',
  projectManagerId: '',

  // Bank Details
  bankAccountNumber: '',
  bankIfscCode: '',
};

export const useAddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  
  const loading = useSelector(selectAddEmployeeStatus) === 'loading';
  const error = useSelector(selectAddEmployeeError);

  const handleChange = useCallback((key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    // Required fields validation
    if (!formValues.firstName) newErrors.firstName = 'First name is required';
    if (!formValues.lastName) newErrors.lastName = 'Last name is required';
    if (!formValues.phone || !/^\d{10}$/.test(formValues.phone)) newErrors.phone = 'Valid phone number is required';
    if (!formValues.country) newErrors.country = 'Country is required';
    if (!formValues.joiningDate) newErrors.joiningDate = 'Joining date is required';
    if (!formValues.departmentId) newErrors.departmentId = 'Department is required';

    return newErrors;
  }, [formValues]);

  const handleReset = useCallback(() => {
    setFormValues(initialFormValues);
    setErrors({});
    dispatch(resetAddEmployeeStatus());
  }, [dispatch]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(addEmployee(formValues)).unwrap();
      handleReset();
      navigate('/employees'); // Redirect to employees list after successful addition
    } catch (error) {
      console.error('Error adding employee:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message || 'Failed to add employee. Please try again.' 
      }));
    }
  }, [formValues, validate, dispatch, handleReset, navigate]);

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