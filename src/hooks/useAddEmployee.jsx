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

// File handling utilities
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_FILES_PER_CATEGORY = 5;

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
  bankIfscCode: '',
  
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
    if (!formValues.salaryType) newErrors.salaryType = 'Salary type is required';
    if (!formValues.salary) newErrors.salary = 'Salary amount is required';
    else if (isNaN(formValues.salary) || Number(formValues.salary) <= 0) {
      newErrors.salary = 'Please enter a valid salary amount';
    }

    // Document validation
    Object.entries(formValues.documents).forEach(([category, files]) => {
      if (files.length > MAX_FILES_PER_CATEGORY) {
        newErrors[`documents.${category}`] = `Maximum ${MAX_FILES_PER_CATEGORY} files allowed`;
      }
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
    handleDocumentChange,
    removeDocument,
    addError
  };
};
