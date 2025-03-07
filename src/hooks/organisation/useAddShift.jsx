import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '../../store/slices/organisation/shiftSlice';
import { addShifts } from '../../store/actions/organisation/shift';

const initialWorkingDays = {
  mon: true,
  tues: true,
  wed: true,
  thurs: true,
  fri: true,
  sat: true,
  sun: true,
};

export const daysOfWeek = [
  { value: 'mon', label: 'Mon' },
  { value: 'tues', label: 'Tues' },
  { value: 'wed', label: 'Wed' },
  { value: 'thurs', label: 'Thurs' },
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

export const useAddShift = (closeModal) => {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const organizationId = localStorage.getItem('orgId');

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formValues.shiftName) newErrors.shiftName = 'Shift name is required';
    if (!formValues.startTime) newErrors.startTime = 'Start time is required';
    if (!formValues.endTime) newErrors.endTime = 'End time is required';
    if (!Object.values(formValues.workingDays).some(day => day)) {
      newErrors.workingDays = 'At least one working day is required';
    }
    return newErrors;
  }, [formValues]);

  const handleChange = useCallback((field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleWorkingDayChange = useCallback((day) => {
    setFormValues(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day]
      }
    }));
    setErrors(prev => ({ ...prev, workingDays: '' }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const shiftDetails = {
        orgId: organizationId,
        shiftName: formValues.shiftName,
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        workingDays: Object.keys(formValues.workingDays).filter(day => formValues.workingDays[day]),
      };
      await dispatch(addShifts(shiftDetails)).unwrap();
      setFormValues(initialFormState);
      closeModal();
    } catch (error) {
      console.log(error);
      setErrors({ general: 'Failed to add shift. Please try again.' });
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
    daysOfWeek,
    handleChange,
    handleWorkingDayChange,
    handleSubmit
  };
}; 