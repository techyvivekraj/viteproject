import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectLoading, selectDepartments, selectAddEmployeeStatus, selectAddEmployeeError } from '../store/slices/employeeSlice';
import { addEmployee, fetchDepartments } from '../store/actions/employee';
import { fetchDesignations } from '../store/actions/organisation/designation';
import { fetchShifts } from '../store/actions/organisation/shift';
import { selectDesignations } from '../store/slices/organisation/designationSlice';
import { selectShifts } from '../store/slices/organisation/shiftSlice';
import { countries, indianStates } from '../utils/locationData';
import { showError, showToast } from '../components/api';

const initialFormState = {
    // Required fields
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    joiningDate: new Date(),
    departmentId: '',
    designationId: '',
    shiftId: '',
    salaryType: '',
    salary: '',

    // Optional fields
    middleName: '',
    employeeCode: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    dateOfBirth: null,
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyName: '',
    reportingManagerId: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: '',

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

    const [managers, setManagers] = useState([]);

    // Add new loading states
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
    const [isLoadingDesignations, setIsLoadingDesignations] = useState(true);
    const [isLoadingShifts, setIsLoadingShifts] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!organizationId) return;

            try {
                setIsLoadingDepartments(true);
                setIsLoadingDesignations(true);
                setIsLoadingShifts(true);

                await Promise.all([
                    dispatch(fetchDepartments(organizationId)),
                    dispatch(fetchDesignations(organizationId)),
                    dispatch(fetchShifts(organizationId)),
                    setManagers([])
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
                showError('Failed to load initial data');
            } finally {
                // Add a small delay before setting loading to false to ensure data is processed
                setTimeout(() => {
                    setIsLoadingDepartments(false);
                    setIsLoadingDesignations(false);
                    setIsLoadingShifts(false);
                }, 500);
            }
        };

        loadInitialData();
    }, [dispatch, organizationId]);

    // Transform data for dropdowns
    const departmentList = useMemo(() => {
        const deptList = departments?.data?.map(dept => ({
            value: String(dept.id),
            label: dept.name
        })) || [];

        return [
            { value: 'default', label: 'Select Department', disabled: true },
            ...deptList
        ];
    }, [departments?.data]);

    const designationList = useMemo(() => {
        const desigList = designations?.data?.map(desig => ({
            value: String(desig.id),
            label: desig.name
        })) || [];

        return [
            { value: 'default', label: 'Select Designation', disabled: true },
            ...desigList
        ];
    }, [designations?.data]);

    const shiftList = useMemo(() => {
        const shiftsList = shifts?.data?.map(shift => ({
            value: String(shift.id),
            label: shift.name
        })) || [];

        return [
            { value: 'default', label: 'Select Shift', disabled: true },
            ...shiftsList
        ];
    }, [shifts?.data]);

    const handleChange = useCallback((field, value) => {
        setFormValues(prev => {
            // Handle date fields
            if (field === 'joiningDate' || field === 'dateOfBirth') {
                // If value is null or undefined, keep the previous value for joiningDate
                if (!value) {
                    return { 
                        ...prev, 
                        [field]: field === 'joiningDate' ? prev[field] : null 
                    };
                }
                // If it's already a Date object, use it directly
                if (value instanceof Date) {
                    return { ...prev, [field]: value };
                }
                // Otherwise create a new Date object
                const date = new Date(value);
                return { ...prev, [field]: date };
            }
            return { ...prev, [field]: value };
        });
        setErrors(prev => ({ ...prev, [field]: '' }));

        // Auto-fetch city when postal code changes
        if (field === 'postalCode' && value?.length === 6) {
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
                        setErrors(prev => ({ ...prev, postalCode: 'Invalid pincode' }));
                    }
                })
                .catch(error => {
                    console.error('Error fetching city:', error);
                    setErrors(prev => ({ ...prev, postalCode: 'Failed to fetch city details' }));
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
        if (!formValues.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formValues.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formValues.phone?.trim()) newErrors.phone = 'Phone number is required';
        if (!formValues.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        // Enhanced joining date validation
        if (!formValues.joiningDate) {
            newErrors.joiningDate = 'Joining date is required';
        } else if (!(formValues.joiningDate instanceof Date) || isNaN(formValues.joiningDate)) {
            newErrors.joiningDate = 'Invalid joining date';
        } else {
            const minDate = new Date(2025, 0, 1);
            if (formValues.joiningDate < minDate) {
                newErrors.joiningDate = 'Joining date cannot be before year 2000';
            }
        }

        if (!formValues.departmentId || formValues.departmentId === 'default') {
            newErrors.departmentId = 'Department is required';
        }
        if (!formValues.designationId || formValues.designationId === 'default') {
            newErrors.designationId = 'Designation is required';
        }
        if (!formValues.shiftId || formValues.shiftId === 'default') {
            newErrors.shiftId = 'Shift is required';
        }
        if (!formValues.salaryType) newErrors.salaryType = 'Salary type is required';
        if (!formValues.salary && formValues.salary !== 0) {
            newErrors.salary = 'Salary amount is required';
        }

        // Phone number validation (only if provided)
        if (formValues.phone && !/^\d{10}$/.test(formValues.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        // Emergency contact validation (only if provided)
        if (formValues.emergencyContact && !/^\d{10}$/.test(formValues.emergencyContact)) {
            newErrors.emergencyContact = 'Emergency contact must be 10 digits';
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
                        // Format date in YYYY-MM-DD format
                        const date = formValues[key];
                        const formattedDate = date.toISOString().split('T')[0];
                        formData.append(key, formattedDate);
                    } else if (key === 'salary') {
                        formData.append(key, Number(formValues[key]));
                    } else {
                        formData.append(key, formValues[key]);
                    }
                }
            });

            // Add organization ID
            formData.append('organizationId', organizationId);

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

    // Update handleChange to set initial values
    useEffect(() => {
        if (!isLoadingDepartments && !isLoadingDesignations && !isLoadingShifts) {
            setFormValues(prev => ({
                ...prev,
                departmentId: prev.departmentId || 'default',
                designationId: prev.designationId || 'default',
                shiftId: prev.shiftId || 'default'
            }));
        }
    }, [isLoadingDepartments, isLoadingDesignations, isLoadingShifts]);

    return {
        formValues,
        errors,
        loading: loading || addStatus === 'loading',
        isLoadingCity,
        isLoadingDepartments,
        isLoadingDesignations,
        isLoadingShifts,
        departmentList,
        designationList,
        shiftList,
        managerList: managers,
        countries,
        indianStates,
        handleChange,
        handleFileChange,
        handleSubmit
    };
};
