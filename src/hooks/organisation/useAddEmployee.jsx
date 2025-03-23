import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectDepartments } from '../../store/slices/organisation/employeeSlice';
import { addEmployee, fetchDepartments } from '../../store/actions/organisation/employee';

const initialFormState = {
    // Required fields
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    joiningDate: null,
    department: '',
    designation: '',
    shift: '',
    salaryType: '',
    salaryAmount: '',

    // Optional fields
    middleName: '',
    employeeCode: '',
    address: '',
    country: '',
    state: '',
    postalCode: '',
    dateOfBirth: null,
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyName: '',
    reportingManager: '',
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
    const loading = useSelector(selectLoading);
    const departmentsData = useSelector(selectDepartments);
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');

    // Transform data for dropdowns
    const departmentList = departmentsData?.data?.map(dept => ({
        value: String(dept.id),
        label: dept.name
    })) || [];
    
    // Add default option to department list
    const departmentListWithDefault = [
        { value: 'default', label: 'Select Department' },
        ...departmentList
    ];

    // Predefined lists for other dropdowns
    const designationListWithDefault = [
        { value: 'default', label: 'Select Designation' },
        { value: 'manager', label: 'Manager' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'employee', label: 'Employee' }
    ];

    const shiftListWithDefault = [
        { value: 'default', label: 'Select Shift' },
        { value: 'morning', label: 'Morning Shift' },
        { value: 'afternoon', label: 'Afternoon Shift' },
        { value: 'night', label: 'Night Shift' }
    ];

    const salaryTypeListWithDefault = [
        { value: 'default', label: 'Select Salary Type' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' }
    ];

    useEffect(() => {
        if (organizationId) {
            dispatch(fetchDepartments(organizationId));
        }
    }, [dispatch, organizationId]);

    const validate = useCallback(() => {
        const newErrors = {};
        
        // Required field validations
        if (!formValues.firstName) newErrors.firstName = 'First name is required';
        if (!formValues.lastName) newErrors.lastName = 'Last name is required';
        if (!formValues.phone) newErrors.phone = 'Phone number is required';
        if (!formValues.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formValues.joiningDate) newErrors.joiningDate = 'Joining date is required';
        if (!formValues.department || formValues.department === 'default') newErrors.department = 'Department is required';
        if (!formValues.designation || formValues.designation === 'default') newErrors.designation = 'Designation is required';
        if (!formValues.shift || formValues.shift === 'default') newErrors.shift = 'Shift is required';
        if (!formValues.salaryType || formValues.salaryType === 'default') newErrors.salaryType = 'Salary type is required';
        if (!formValues.salaryAmount) newErrors.salaryAmount = 'Salary amount is required';

        // Phone number validation
        if (formValues.phone && !/^\d{10}$/.test(formValues.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        // Emergency contact validation
        if (formValues.emergencyContact && !/^\d{10}$/.test(formValues.emergencyContact)) {
            newErrors.emergencyContact = 'Emergency contact must be 10 digits';
        }

        return newErrors;
    }, [formValues]);

    const handleChange = useCallback((field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    }, []);

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
                    formValues[key].forEach(file => {
                        formData.append(key, file);
                    });
                } else if (formValues[key] !== null && formValues[key] !== '') {
                    formData.append(key, formValues[key]);
                }
            });

            // Add organization ID
            formData.append('organizationId', organizationId);

            await dispatch(addEmployee(formData)).unwrap();
            setFormValues(initialFormState);
            // You might want to navigate to the employees list page here
        } catch (error) {
            console.error(error);
            setErrors({ general: 'Failed to add employee. Please try again.' });
        }
    }, [formValues, validate, organizationId, dispatch]);

    return {
        formValues,
        errors,
        loading,
        departmentListWithDefault,
        designationListWithDefault,
        shiftListWithDefault,
        salaryTypeListWithDefault,
        handleChange,
        handleFileChange,
        handleSubmit
    };
}; 