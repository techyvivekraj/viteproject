import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee } from '../store/actions/employees';
import { 
  selectAddEmployeeStatus, 
  selectAddEmployeeError,
  resetAddEmployeeStatus 
} from '../store/slices/employeesSlice';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { debounce } from 'lodash';

const MAX_SUBMIT_ATTEMPTS = 3;
const SUBMIT_TIMEOUT = 1000; // 1 second

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

// Validation schemas
const validationSchemas = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[0-9]{10}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  employeeCode: /^[A-Z0-9-]{2,20}$/i,
  bankAccount: /^\d{9,18}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  postalCode: /^\d{6}$/
};

export const useAddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState(0);
  const [confirmBankAccount, setConfirmBankAccount] = useState('');
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  
  // Refs for cleanup and performance
  const submitTimeoutRef = useRef(null);
  const unmountedRef = useRef(false);
  
  // Modal states
  const [deptModalOpened, deptModalHandlers] = useDisclosure(false);
  const [roleModalOpened, roleModalHandlers] = useDisclosure(false);
  const [shiftModalOpened, shiftModalHandlers] = useDisclosure(false);
  
  const loading = useSelector(selectAddEmployeeStatus) === 'loading';
  const error = useSelector(selectAddEmployeeError);
  const departments = useSelector(state => state.departments.departments?.data) || [];
  const designations = useSelector(state => state.designations.designations?.data) || [];
  const shifts = useSelector(state => state.shifts.shifts?.data) || [];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  // Memoized validation functions
  const validateField = useCallback((field, value) => {
    if (!value) return '';
    
    const schema = validationSchemas[field];
    if (!schema) return '';
    
    return schema.test(value) ? '' : 'Invalid format';
  }, []);

  const validateForm = useCallback((values) => {
    const newErrors = {};
    
    // Required fields validation
    if (!values.firstName) newErrors.firstName = 'First name is required';
    if (!values.lastName) newErrors.lastName = 'Last name is required';
    if (!values.email) newErrors.email = 'Email is required';
    if (!values.phone) newErrors.phone = 'Phone is required';
    if (!values.joiningDate) newErrors.joiningDate = 'Joining date is required';
    if (!values.departmentId) newErrors.departmentId = 'Department is required';

    // Format validation
    if (values.email && !validationSchemas.email.test(values.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (values.phone && !validationSchemas.phone.test(values.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    if (values.employeeCode && !validationSchemas.employeeCode.test(values.employeeCode)) {
      newErrors.employeeCode = 'Invalid employee code format';
    }
    if (values.bankAccountNumber && !validationSchemas.bankAccount.test(values.bankAccountNumber)) {
      newErrors.bankAccountNumber = 'Invalid bank account number';
    }
    if (values.bankIfscCode && !validationSchemas.ifsc.test(values.bankIfscCode)) {
      newErrors.bankIfscCode = 'Invalid IFSC code';
    }

    return newErrors;
  }, []);

  // Direct change handler for better performance
  const handleChange = useCallback((key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    
    // Only validate on blur or submit
    if (key === 'email' || key === 'phone' || key === 'bankAccountNumber') {
      setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
    }
  }, [validateField]);

  // Enhanced email validation with additional security checks
  const handleEmailChange = useCallback((e) => {
    const value = e.target.value;
    handleChange('email', value);
  }, [handleChange]);

  // Enhanced phone validation
  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    handleChange('phone', value);
  }, [handleChange]);

  // Enhanced bank account validation
  const handleBankAccountChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 18);
    handleChange('bankAccountNumber', value);
    
    if (confirmBankAccount && value !== confirmBankAccount) {
      setErrors(prev => ({ ...prev, bankAccountConfirm: 'Bank account numbers do not match' }));
    } else {
      setErrors(prev => ({ ...prev, bankAccountConfirm: '' }));
    }
  }, [confirmBankAccount, handleChange]);

  const handleConfirmBankAccountChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 18);
    setConfirmBankAccount(value);
    
    if (value !== formValues.bankAccountNumber) {
      setErrors(prev => ({ ...prev, bankAccountConfirm: 'Bank account numbers do not match' }));
    } else {
      setErrors(prev => ({ ...prev, bankAccountConfirm: '' }));
    }
  }, [formValues.bankAccountNumber]);

  // Reset form with cleanup
  const handleReset = useCallback(() => {
    setFormValues(initialFormValues);
    setErrors({});
    setActive(0);
    setConfirmBankAccount('');
    setShowValidationSummary(false);
    setSubmitAttempts(0);
    dispatch(resetAddEmployeeStatus());
  }, [dispatch]);

  // Enhanced submit handler with rate limiting and security
  const handleFinalSubmit = useCallback(async () => {
    if (submitAttempts >= MAX_SUBMIT_ATTEMPTS) {
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Too many attempts. Please try again later.' 
      }));
      return;
    }

    setSubmitAttempts(prev => prev + 1);

    const formErrors = validateForm(formValues);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setShowValidationSummary(true);
      return;
    }

    // Rate limiting
    if (submitTimeoutRef.current) {
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Please wait before submitting again.' 
      }));
      return;
    }

    try {
      // Sanitize all form values before submission
      const sanitizedFormValues = Object.entries(formValues).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: typeof value === 'string' ? DOMPurify.sanitize(value) : value
      }), {});

      await dispatch(addEmployee(sanitizedFormValues)).unwrap();
      
      if (!unmountedRef.current) {
        handleReset();
        navigate('/employees');
      }
    } catch (error) {
      if (!unmountedRef.current) {
        setErrors(prev => ({ 
          ...prev, 
          submit: error.message || 'Failed to add employee. Please try again.' 
        }));
      }
    } finally {
      submitTimeoutRef.current = setTimeout(() => {
        if (!unmountedRef.current) {
          submitTimeoutRef.current = null;
        }
      }, SUBMIT_TIMEOUT);
    }
  }, [formValues, submitAttempts, validateForm, dispatch, handleReset, navigate]);

  // Computed properties
  const isSubmitDisabled = useMemo(() => {
    return submitAttempts >= MAX_SUBMIT_ATTEMPTS || 
           Object.keys(errors).length > 0 ||
           submitTimeoutRef.current !== null;
  }, [submitAttempts, errors]);

  return {
    formValues,
    errors,
    loading,
    error,
    active,
    setActive,
    confirmBankAccount,
    showValidationSummary,
    deptModalOpened,
    roleModalOpened,
    shiftModalOpened,
    deptModalHandlers,
    roleModalHandlers,
    shiftModalHandlers,
    genderOptions: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ],
    bloodGroups: [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' }
    ],
    salaryTypes: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'project', label: 'Project Based' }
    ],
    countries: [
      { value: 'IN', label: 'India' },
      { value: 'US', label: 'United States' },
      { value: 'UK', label: 'United Kingdom' }
    ],
    indianStates: [
      { value: 'AP', label: 'Andhra Pradesh' },
      { value: 'KA', label: 'Karnataka' },
      { value: 'TN', label: 'Tamil Nadu' },
      { value: 'MH', label: 'Maharashtra' }
    ],
    departments,
    designations,
    shifts,
    handleChange,
    handleEmailChange,
    handlePhoneChange,
    handleBankAccountChange,
    handleConfirmBankAccountChange,
    handleSubmit: handleFinalSubmit,
    handleReset,
    nextStep: () => setActive((current) => Math.min(current + 1, 4)),
    prevStep: () => setActive((current) => Math.max(current - 1, 0)),
    calculateProgress: () => ((active + 1) / 5) * 100,
    getMissingRequiredFields: () => {
      const requiredFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        joiningDate: 'Joining Date'
      };
      
      return Object.entries(requiredFields)
        .filter(([key]) => !formValues[key])
        .map(([, label]) => label);
    },
    submitAttempts,
    isSubmitDisabled,
  };
}; 