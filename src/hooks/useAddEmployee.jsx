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
import { selectAddEmployeeStatus, selectAddEmployeeError, resetAddEmployeeStatus } from '../store/slices/employeesSlice';
import { axiosInstance } from '../components/api';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_FILES_PER_CATEGORY = 5;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' }
];

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' }
];

const indianStates = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OR', label: 'Odisha' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UT', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' }
];

const salaryTypeOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
];

// File handling utilities
const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > 1920) {
            height *= 1920 / width;
            width = 1920;
          }
        } else {
          if (height > 1920) {
            width *= 1920 / height;
            height = 1920;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with reduced quality
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        }, 'image/jpeg', 0.7); // Adjust quality here (0.7 = 70% quality)
      };
    };
  });
};

const processFile = async (file) => {
  if (file.size <= MAX_FILE_SIZE) return file;
  
  if (file.type.startsWith('image/')) {
    return await compressImage(file);
  }
  
  throw new Error(`File ${file.name} is too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
};

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
  salaryType: '', // Required
  salary: '', // Required
  employeeCode: '', // Required
  
  // Optional fields
  middleName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  address: '',
  country: '',
  state: '',
  postalCode: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  reportingManagerId: '', // Added reporting manager field
  
  // Document fields
  documents: {
    educational: [],
    professional: [],
    identity: [],
    address: [],
    others: []
  }
};

export const useAddEmployee = (onSuccess) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [managers, setManagers] = useState([]);
  
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  // Selectors
  const departments = useSelector(selectDepartments);
  const designations = useSelector(selectDesignations);
  const shifts = useSelector(selectShifts);
  const addStatus = useSelector(selectAddEmployeeStatus);
  const addError = useSelector(selectAddEmployeeError);

  // Generate employee code on mount
  useEffect(() => {
    // Generate a unique employee code if not already set
    if (!formValues.employeeCode) {
      const randomCode = `EMP${Math.floor(100000 + Math.random() * 900000)}`;
      setFormValues(prev => ({ ...prev, employeeCode: randomCode }));
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchDepartments(organizationId));
    dispatch(fetchDesignations(organizationId));
    dispatch(fetchShifts(organizationId));
    
    // Fetch managers for reporting manager dropdown
    const fetchManagers = async () => {
      try {
        const response = await axiosInstance.get('/employees/managers', {
          params: { organizationId }
        });
        if (response.data && Array.isArray(response.data.data)) {
          const managerOptions = response.data.data.map(manager => ({
            value: String(manager.id),
            label: `${manager.first_name} ${manager.last_name} (${manager.employee_code || 'No Code'})`
          }));
          setManagers(managerOptions);
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };
    
    fetchManagers();
    
    // Reset add employee status when component mounts
    return () => {
      dispatch(resetAddEmployeeStatus());
    };
  }, [dispatch, organizationId]);

  // Transform data for dropdowns
  const departmentList = departments?.data?.map(dept => ({
    value: String(dept.id),
    label: dept.name
  })) || [];
  
  // Add default option to department list
  const departmentListWithDefault = [
    { value: 'default', label: 'Default Department' },
    ...departmentList
  ];

  const designationList = designations?.data?.map(desig => ({
    value: String(desig.id),
    label: desig.name
  })) || [];
  
  // Add default option to designation list
  const designationListWithDefault = [
    { value: 'default', label: 'Default Designation' },
    ...designationList
  ];

  const shiftList = shifts?.data?.map(shift => ({
    value: String(shift.id),
    label: shift.name
  })) || [];
  
  // Add default option to shift list
  const shiftListWithDefault = [
    { value: 'default', label: 'Default Shift' },
    ...shiftList
  ];

  const validate = useCallback(() => {
    const newErrors = {};
    
    // Required fields validation - only validate fields that are truly required by the API
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
    if (!formValues.salaryType) newErrors.salaryType = 'Salary type is required';
    if (!formValues.salary) newErrors.salary = 'Salary amount is required';
    else if (isNaN(formValues.salary) || Number(formValues.salary) <= 0) {
      newErrors.salary = 'Please enter a valid salary amount';
    }
    if (!formValues.employeeCode?.trim()) newErrors.employeeCode = 'Employee code is required';

    // Optional fields validation - only validate format if a value is provided
    // Don't make these fields required
    if (formValues.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Relaxed phone validation - many formats are valid
    if (formValues.phone && formValues.phone.trim().length < 6) {
      newErrors.phone = 'Phone number is too short';
    }
    
    // Relaxed postal code validation
    if (formValues.postalCode && formValues.postalCode.trim().length < 4) {
      newErrors.postalCode = 'Postal code is too short';
    }
    
    // Relaxed bank account validation
    if (formValues.bankAccountNumber && formValues.bankAccountNumber.trim().length < 8) {
      newErrors.bankAccountNumber = 'Bank account number is too short';
    }
    
    // Relaxed IFSC code validation
    if (formValues.bankIfscCode && formValues.bankIfscCode.trim().length < 8) {
      newErrors.bankIfscCode = 'IFSC code is too short';
    }

    // Document validation
    Object.entries(formValues.documents).forEach(([category, files]) => {
      if (files.length > MAX_FILES_PER_CATEGORY) {
        newErrors[`documents.${category}`] = `Maximum ${MAX_FILES_PER_CATEGORY} files allowed`;
      }
      
      // Check file sizes
      files.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
          newErrors[`documents.${category}`] = `File ${file.name} exceeds maximum size of 5MB`;
        }
      });
    });

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
      
      // Show the first error as a toast for better visibility
      const firstError = Object.values(validationErrors)[0];
      showError(firstError);
      return;
    }

    try {
      // Format dates for API
      const formattedData = {
        ...formValues,
        organizationId,
        joiningDate: formValues.joiningDate instanceof Date 
          ? formValues.joiningDate.toISOString().split('T')[0] 
          : formValues.joiningDate,
        dateOfBirth: formValues.dateOfBirth instanceof Date 
          ? formValues.dateOfBirth.toISOString().split('T')[0] 
          : formValues.dateOfBirth
      };

      // Clean up empty fields to avoid API validation errors
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === '' || formattedData[key] === null || formattedData[key] === undefined) {
          delete formattedData[key];
        }
      });

      // Clean up empty document categories
      if (formattedData.documents) {
        Object.keys(formattedData.documents).forEach(category => {
          if (!formattedData.documents[category] || formattedData.documents[category].length === 0) {
            delete formattedData.documents[category];
          }
        });
        
        // If no documents left, delete the documents object
        if (Object.keys(formattedData.documents).length === 0) {
          delete formattedData.documents;
        }
      }

      console.log('Submitting employee data:', formattedData);
      await dispatch(addEmployee(formattedData)).unwrap();
      showToast('Employee added successfully');
      setFormValues(initialFormState);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding employee:', error);
      
      if (error.errors && Array.isArray(error.errors)) {
        // Handle structured validation errors from the backend
        const backendErrors = {};
        error.errors.forEach(err => {
          // Convert backend field names to frontend field names if needed
          const fieldName = err.field === 'employee_code' ? 'employeeCode' : err.field;
          backendErrors[fieldName] = err.message;
        });
        setErrors(prev => ({ ...prev, ...backendErrors }));
        
        // Show the first error as a toast
        if (error.errors.length > 0) {
          showError(error.errors[0].message);
        } else {
          showError(error.message || 'Failed to add employee');
        }
      } else {
        // Handle general error
        showError(error.message || 'Failed to add employee');
        setErrors({ general: 'Failed to add employee. Please try again.' });
      }
    }
  }, [formValues, validate, organizationId, dispatch, onSuccess]);

  const handleDocumentChange = useCallback(async (category, files) => {
    try {
      const currentFiles = formValues.documents[category] || [];
      const remainingSlots = MAX_FILES_PER_CATEGORY - currentFiles.length;
      
      if (files.length > remainingSlots) {
        showError(`You can only add ${remainingSlots} more file(s) to ${category} documents`);
        return;
      }

      const processedFiles = [];
      for (const file of files) {
        try {
          const processedFile = await processFile(file);
          processedFiles.push(processedFile);
        } catch (error) {
          showError(error.message);
        }
      }

      if (processedFiles.length > 0) {
        setFormValues(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [category]: [...currentFiles, ...processedFiles]
          }
        }));
      }
    } catch (error) {
      showError('Error processing files');
    }
  }, [formValues.documents]);

  const removeDocument = useCallback((category, index) => {
    setFormValues(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [category]: prev.documents[category].filter((_, i) => i !== index)
      }
    }));
  }, []);

  // Reset form when successfully added
  useEffect(() => {
    if (addStatus === 'succeeded') {
      setFormValues(initialFormState);
      setErrors({});
    } else if (addStatus === 'failed' && addError) {
      // Display specific error messages from the backend
      if (typeof addError === 'object') {
        if (addError.errors && Array.isArray(addError.errors)) {
          const backendErrors = {};
          addError.errors.forEach(err => {
            // Convert backend field names to frontend field names if needed
            const fieldName = err.field === 'employee_code' ? 'employeeCode' : err.field;
            backendErrors[fieldName] = err.message;
          });
          setErrors(prev => ({ ...prev, ...backendErrors }));
          
          // Show the first error as a toast
          if (addError.errors.length > 0) {
            showError(addError.errors[0].message);
          }
        } else if (addError.message) {
          setErrors(prev => ({ ...prev, general: addError.message }));
          showError(addError.message);
        }
      } else if (typeof addError === 'string') {
        setErrors(prev => ({ ...prev, general: addError }));
        showError(addError);
      }
    }
  }, [addStatus, addError]);

  return {
    formValues,
    errors,
    setErrors, // Export setErrors to allow the component to set errors directly
    loading: addStatus === 'loading',
    departmentList: departmentListWithDefault,
    designationList: designationListWithDefault,
    shiftList: shiftListWithDefault,
    managerList: managers,
    handleChange,
    handleSubmit,
    handleDocumentChange,
    removeDocument,
    addError,
    // Export options for the component to use
    genderOptions,
    bloodGroupOptions,
    countryOptions,
    indianStates,
    salaryTypeOptions
  };
};
