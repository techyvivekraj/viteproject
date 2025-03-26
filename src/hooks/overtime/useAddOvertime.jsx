import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '../../store/slices/overtime/overtimeSlice';
import { addOvertime } from '../../store/actions/overtime';
import { showError } from '../../components/api';

const initialFormState = {
    employeeId: '',
    date: '',
    hours: '',
    reason: ''
};

export const useAddOvertime = (closeModal) => {
    const [formValues, setFormValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [employees, setEmployees] = useState([]); // This should be populated from your API
    const loading = useSelector(selectLoading);
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');

    // Fetch employees when the component mounts
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Replace this with your actual API call to fetch employees
                const response = await fetch(`/api/employees?organizationId=${organizationId}`);
                const data = await response.json();
                const formattedEmployees = data.map(emp => ({
                    value: emp.id,
                    label: `${emp.firstName} ${emp.lastName}`
                }));
                setEmployees(formattedEmployees);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
                showError('Failed to fetch employees');
            }
        };

        fetchEmployees();
    }, [organizationId]);

    const validate = useCallback(() => {
        const newErrors = {};
        if (!formValues.employeeId) newErrors.employeeId = 'Employee is required';
        if (!formValues.date) newErrors.date = 'Date is required';
        if (!formValues.hours) {
            newErrors.hours = 'Hours are required';
        } else if (formValues.hours < 0 || formValues.hours > 24) {
            newErrors.hours = 'Hours must be between 0 and 24';
        }
        if (!formValues.reason) newErrors.reason = 'Reason is required';
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
            const overtimeData = {
                employeeId: formValues.employeeId,
                organizationId,
                date: formValues.date,
                hours: Number(formValues.hours),
                reason: formValues.reason
            };

            await dispatch(addOvertime(overtimeData)).unwrap();
            setFormValues(initialFormState);
            closeModal();
        } catch (error) {
            console.error('Failed to add overtime:', error);
            setErrors({ general: error.message || 'Failed to add overtime. Please try again.' });
        }
    }, [formValues, validate, organizationId, dispatch, closeModal]);

    useEffect(() => {
        if (!loading) {
            setFormValues(initialFormState);
            setErrors({});
        }
    }, [loading]);

    return {
        formValues,
        errors,
        loading,
        employees,
        handleChange,
        handleSubmit
    };
}; 