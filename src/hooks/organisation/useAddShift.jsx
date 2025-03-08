import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectAddShiftError } from '../../store/slices/organisation/shiftSlice';
import { addShifts } from '../../store/actions/organisation/shift';

const initialWorkingDays = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
};

export const daysOfWeek = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

const initialFormState = {
  shiftName: '',
  startTime: '',
  endTime: '',
  workingDays: initialWorkingDays
};

export const useAddShift = (onSuccess) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const loading = useSelector(selectLoading);
  const addError = useSelector(selectAddShiftError);
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  useEffect(() => {
    if (addError) {
      setErrors({ general: addError });
    }
  }, [addError]);

  const validate = useCallback(() => {
    const newErrors = {};

    // Validate shift name
    if (!formValues.shiftName.trim()) {
      newErrors.shiftName = 'Shift name is required';
    } else if (formValues.shiftName.length < 3) {
      newErrors.shiftName = 'Shift name must be at least 3 characters';
    }

    // Validate start time
    if (!formValues.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    // Validate end time
    if (!formValues.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formValues.startTime && formValues.endTime <= formValues.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Validate working days
    const selectedDays = Object.values(formValues.workingDays).filter(Boolean);
    if (selectedDays.length === 0) {
      newErrors.workingDays = 'At least one working day must be selected';
    }

    return newErrors;
  }, [formValues]);

  const handleChange = useCallback((field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  }, []);

  const handleWorkingDayChange = useCallback((day) => {
    setFormValues(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day]
      }
    }));
    setErrors(prev => ({ ...prev, workingDays: '', general: '' }));
  }, []);

  const formatWorkingDaysForSubmit = useCallback((workingDays) => {
    return Object.entries(workingDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(',');
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    try {
      const shiftData = {
        name: formValues.shiftName.trim(),
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        workingDays: formatWorkingDaysForSubmit(formValues.workingDays),
        organizationId
      };

      await dispatch(addShifts(shiftData)).unwrap();
      setFormValues(initialFormState);
      onSuccess?.();
      return true;
    } catch (error) {
      setErrors({ 
        general: error.message || 'Failed to add shift. Please try again.' 
      });
      return false;
    }
  }, [formValues, validate, organizationId, dispatch, onSuccess, formatWorkingDaysForSubmit]);

  // Reset form when modal is closed
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
    daysOfWeek,
    handleChange,
    handleWorkingDayChange,
    handleSubmit
  };
}; 