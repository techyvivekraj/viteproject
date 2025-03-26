import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmployees } from '../store/slices/employeeSlice';
import { addOvertime } from '../store/actions/overtime';
import { showError } from '../components/api';

const initialFormState = {
    employeeId: '',
    date: '',
    hours: '',
    reason: ''
};

export const useAddOvertime = (closeModal) => {
    const [formValues, setFormValues] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const organizationId = localStorage.getItem('orgId');
    
    // Get employees directly from the store
    const employeesData = useSelector(selectEmployees);
    
    // Format employees for dropdown - convert id to string
    const employeeOptions = employeesData?.data?.map(emp => ({
        value: String(emp.id),
        label: `${emp.firstName} ${emp.lastName}`
    })) || [];

    const handleChange = useCallback((field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    }, []);

    const handleSubmit = useCallback(async () => {
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
            showError(error.message || 'Failed to add overtime');
        }
    }, [formValues, organizationId, dispatch, closeModal]);

    return {
        formValues,
        errors,
        employeeOptions,
        handleChange,
        handleSubmit
    };
}; 