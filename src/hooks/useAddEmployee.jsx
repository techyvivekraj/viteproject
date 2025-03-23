import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectDepartments } from '../store/slices/employeeSlice';
import { addEmployee, fetchDepartments } from '../store/actions/employee';
import { fetchDesignations } from '../store/actions/organisation/designation';
import { fetchShifts } from '../store/actions/organisation/shift';
import { selectDesignations } from '../store/slices/organisation/designationSlice';
import { selectShifts } from '../store/slices/organisation/shiftSlice';
import { countries, indianStates } from '../utils/locationData';

const initialFormState = {
    // Required fields
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    joiningDate: null,
    departmentId: '',
    designationId: '',
    shiftId: '',
    salaryType: '',
    salaryAmount: '',

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
    const departments = useSelector(selectDepartments);
    const designations = useSelector(selectDesignations);
    const shifts = useSelector(selectShifts);
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');

    const [managers, setManagers] = useState([]);

    useEffect(() => {
        if (organizationId) {

            dispatch(fetchDepartments(organizationId));
            dispatch(fetchDesignations(organizationId));
            dispatch(fetchShifts(organizationId));
            setManagers([]);
        }
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
        if (!formValues.departmentId) newErrors.departmentId = 'Department is required';
        if (!formValues.designationId) newErrors.designationId = 'Designation is required';
        if (!formValues.shiftId) newErrors.shiftId = 'Shift is required';
        if (!formValues.salaryType) newErrors.salaryType = 'Salary type is required';
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

    const fetchCityFromPincode = useCallback(async (pincode) => {
        if (!pincode || pincode.length !== 6) return;
        
        setIsLoadingCity(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            
            if (data[0]?.Status === 'Success') {
                const postOffice = data[0].PostOffice[0];
                // Update city
                handleChange('city', postOffice.District);
                // Find matching state from indianStates
                const matchingState = indianStates.find(
                    state => state.label.toLowerCase() === postOffice.State.toLowerCase()
                );
                // Update state with the matching state value
                handleChange('state', matchingState?.value || '');
                // Set country to India
                handleChange('country', 'IN');
            } else {
                setErrors(prev => ({ ...prev, postalCode: 'Invalid pincode' }));
            }
        } catch (error) {
            console.error('Error fetching city:', error);
            setErrors(prev => ({ ...prev, postalCode: 'Failed to fetch city details' }));
        } finally {
            setIsLoadingCity(false);
        }
    }, [indianStates]);

    const handleChange = useCallback((field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));

        // Auto-fetch city when postal code changes
        if (field === 'postalCode') {
            fetchCityFromPincode(value);
        }

        // Reset state when country changes
        if (field === 'country') {
            setFormValues(prev => ({ ...prev, state: '' }));
        }
    }, [fetchCityFromPincode]);

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