import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectLoading, selectDepartments, selectAddEmployeeStatus, selectAddEmployeeError, selectLastFetch } from '../store/slices/employeeSlice';
import { addEmployee, fetchDepartments } from '../store/actions/employee';
import { fetchDesignations } from '../store/actions/organisation/designation';
import { fetchShifts } from '../store/actions/organisation/shift';
import { selectDesignations } from '../store/slices/organisation/designationSlice';
import { selectShifts } from '../store/slices/organisation/shiftSlice';
import { countries, indianStates } from '../utils/locationData';
import { showError, showToast } from '../components/api';

const initialFormState = {
    // Required fields
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    joining_date: null,
    department_id: '',
    designation_id: '',
    shift_id: '',
    salary_type: '',
    salary: '',

    // Optional fields
    middle_name: '',
    employee_code: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postal_code: '',
    date_of_birth: null,
    gender: '',
    blood_group: '',
    emergency_contact: '',
    emergency_name: '',
    reporting_manager_id: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_name: '',

    // Document fields
    educationalDocs: [],
    professionalDocs: [],
    identityDocs: [],
    addressDocs: [],
    otherDocs: []
};

export const useAddEmployee = () => {
    const [formValues, setFormValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isLoadingCity, setIsLoadingCity] = useState(false);
    const loading = useSelector(selectLoading);
    const addStatus = useSelector(selectAddEmployeeStatus);
    const addError = useSelector(selectAddEmployeeError);
    const departments = useSelector(selectDepartments);
    const designations = useSelector(selectDesignations);
    const shifts = useSelector(selectShifts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const organizationId = localStorage.getItem('orgId');
    const lastFetch = useSelector(selectLastFetch);

    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!organizationId) return;

            const shouldFetch = !lastFetch || Date.now() - lastFetch > 300000;
            if (shouldFetch) {
                try {
                    await Promise.all([
                        dispatch(fetchDepartments(organizationId)),
                        dispatch(fetchDesignations(organizationId)),
                        dispatch(fetchShifts(organizationId))
                    ]);
                } catch (error) {
                    showError('Failed to load initial data');
                }
            }
        };

        loadInitialData();
    }, [dispatch, lastFetch, organizationId]);

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
    
    const handleChange = useCallback((field, value) => {
        setFormValues(prev => {
            // Handle date fields
            if (field === 'joining_date' || field === 'date_of_birth') {
                // Ensure we're working with the local timezone
                if (value) {
                    const date = new Date(value);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                    return { ...prev, [field]: date };
                }
                return { ...prev, [field]: null };
            }
            return { ...prev, [field]: value };
        });
        setErrors(prev => ({ ...prev, [field]: '' }));

        // Auto-fetch city when postal code changes
        if (field === 'postal_code' && value?.length === 6) {
            // Inline the fetch logic
            setIsLoadingCity(true);
            fetch(`https://api.postalpincode.in/pincode/${value}`)
                .then(response => response.json())
                .then(data => {
                    if (data[0]?.Status === 'Success') {
                        const postOffice = data[0].PostOffice[0];
                        // Update form values directly
                        setFormValues(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: indianStates.find(
                                state => state.label.toLowerCase() === postOffice.State.toLowerCase()
                            )?.value || '',
                            country: 'IN'
                        }));
                    } else {
                        setErrors(prev => ({ ...prev, postal_code: 'Invalid pincode' }));
                    }
                })
                .catch(error => {
                    console.error('Error fetching city:', error);
                    setErrors(prev => ({ ...prev, postal_code: 'Failed to fetch city details' }));
                })
                .finally(() => {
                    setIsLoadingCity(false);
                });
        }

        // Reset state when country changes
        if (field === 'country') {
            setFormValues(prev => ({ ...prev, state: '' }));
        }
    }, []);

    const validate = useCallback(() => {
        const newErrors = {};

        // Required field validations
        if (!formValues.first_name?.trim()) newErrors.first_name = 'First name is required';
        if (!formValues.last_name?.trim()) newErrors.last_name = 'Last name is required';
        if (!formValues.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (!formValues.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formValues.joining_date) newErrors.joining_date = 'Joining date is required';
        if (!formValues.department_id || formValues.department_id === 'default') {
            newErrors.department_id = 'Department is required';
        }
        if (!formValues.designation_id || formValues.designation_id === 'default') {
            newErrors.designation_id = 'Designation is required';
        }
        if (!formValues.shift_id || formValues.shift_id === 'default') {
            newErrors.shift_id = 'Shift is required';
        }
        if (!formValues.salary_type) newErrors.salary_type = 'Salary type is required';
        if (!formValues.salary && formValues.salary !== 0) {
            newErrors.salary = 'Salary amount is required';
        }

        // Phone number validation (only if provided)
        if (formValues.phone && !/^\d{10}$/.test(formValues.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        // Emergency contact validation (only if provided)
        if (formValues.emergency_contact && !/^\d{10}$/.test(formValues.emergency_contact)) {
            newErrors.emergency_contact = 'Emergency contact must be 10 digits';
        }

        return newErrors;
    }, [formValues]);

    const handleFileChange = useCallback((field, files) => {
        setFormValues(prev => ({ ...prev, [field]: files }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formData = new FormData();

            // Append all form values to FormData
            Object.keys(formValues).forEach(key => {
                if (key.endsWith('Docs')) {
                    // Handle file uploads
                    if (formValues[key]?.length > 0) {
                        formValues[key].forEach(file => {
                            formData.append(key, file);
                        });
                    }
                } else if (formValues[key] !== null && formValues[key] !== '') {
                    // Handle date objects
                    if (formValues[key] instanceof Date) {
                        // Format date in ISO string but keep local timezone
                        const date = new Date(formValues[key]);
                        formData.append(key, date.toISOString());
                    } else if (key === 'salary') {
                        formData.append(key, Number(formValues[key]));
                    } else {
                        formData.append(key, formValues[key]);
                    }
                }
            });

            // Add organization ID
            formData.append('organization_id', organizationId);

            // Dispatch addEmployee action
            await dispatch(addEmployee(formData)).unwrap();
            
            // Show success message and navigate
            showToast('Employee added successfully', 'success');
            navigate('/employees');
        } catch (error) {
            console.error('Error adding employee:', error);
            showError(error.errors?.[0]?.msg || 'Failed to add employee', 'error');
            setErrors(prev => ({
                ...prev,
                general: error.errors?.[0]?.msg || 'Failed to add employee. Please try again.'
            }));
        }
    }, [formValues, validate, organizationId, dispatch, navigate]);

    // Effect to handle API response status
    useEffect(() => {
        if (addStatus === 'failed' && addError) {
            setErrors(prev => ({
                ...prev,
                general: addError.errors?.[0]?.msg || 'Failed to add employee'
            }));
        }
    }, [addStatus, addError]);

    return {
        formValues,
        errors,
        loading: loading || addStatus === 'loading',
        isLoadingCity,
        departmentList: departmentListWithDefault,
        designationList: designationListWithDefault,
        shiftList: shiftListWithDefault,
        managerList: managers,
        countries,
        indianStates,
        handleChange,
        handleFileChange,
        handleSubmit
    };
}; 