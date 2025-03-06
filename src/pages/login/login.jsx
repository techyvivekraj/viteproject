import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
} from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useCallback, useEffect, useMemo, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsLoading, selectIsRegistered, selectUser, selectError, clearError, resetRegistered } from '../../store/slices/authSlice';
import '../../styles/index.css'
import { loginUser, registerUser } from '../../store/actions/auth';

export default function Login(props) {
  const [type, toggle] = useToggle(['login', 'register']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const isRegistered = useSelector(selectIsRegistered);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const form = useForm({
    initialValues: {
      ownerName: '',
      email: '',
      mobile: '',
      password: '',
      terms: true,
      confirmPassword: '',
      organizationName: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 8 ? 'Password should include at least 8 characters' : null),
      mobile: (value, values) => 
        type === 'register' && !/^\d{10}$/.test(value) ? 'Mobile number must be exactly 10 digits' : null,
      confirmPassword: (value, values) =>
        type === 'register' && value !== values.password ? 'Passwords do not match' : null,
      terms: (value, values) =>
        type === 'register' && !value ? 'You must agree to the terms and conditions' : null,
    },
  });

  const handleSubmit = useCallback(async (values) => {
    dispatch(clearError());
    if (type === 'register') {
      dispatch(registerUser(values));
    } else {
      dispatch(loginUser({ email: values.email, password: values.password }));
    }
  }, [dispatch, type]);

  const toggleType = useCallback(() => {
    dispatch(clearError());
    dispatch(resetRegistered());
    form.reset();
    toggle();
  }, [dispatch, toggle, form]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isRegistered) {
      toggleType();
    }
  }, [isRegistered, toggleType]);
  const formFields = useMemo(() => (
    <Stack>
      {type === 'register' && (
        <>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('ownerName')}
            radius="md"
          />
          <TextInput
            required
            label="Organization Name"
            placeholder="Organization name"
            {...form.getInputProps('organizationName')}
            radius="md"
          />

          <TextInput
            required
            label="Mobile No"
            placeholder="Mobile No"
            maxLength={10}
            inputMode='numeric'
            {...form.getInputProps('mobile')}
            error={form.errors.mobile && 'Invalid mobile'}
            radius="md"
          />
        </>
      )}
      <TextInput
        required
        label="Email"
        placeholder="hello@microplesk.com"
        {...form.getInputProps('email')}
        error={form.errors.email && 'Invalid email'}
        radius="md"
      />
      <PasswordInput
        required
        label="Password"
        placeholder="Your password"
        {...form.getInputProps('password')}
        error={form.errors.password && 'Password should include at least 8 characters'}
        radius="md"
      />
      {type === 'register' && (
        <>
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm password"
            {...form.getInputProps('confirmPassword')}
            error={form.errors.confirmPassword && 'Password should match'}
            radius="md"
          />
          <Checkbox
            label="I accept terms and conditions"
            {...form.getInputProps('terms', { type: 'checkbox' })}
          />
        </>
      )}
    </Stack>
  ), [type, form]);

  return (
    <div className="full-background">
      <Container size={420} py={40}>
        <Paper radius="md" p="xl" {...props}>
          <MantineLogo size={30} />
          {/* {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              {error.message}
            </div>
          )} */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {formFields}
            <Group justify="space-between" mt="xl">
              <Anchor component="button" type="button" c="dimmed" onClick={toggleType} size="xs">
                {type === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type="submit" loading={isLoading} loaderProps={{ type: 'dots' }}>
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
          {/* <Divider label="Or continue with email" labelPosition="center" my="lg" />
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group> */}
        </Paper>
      </Container>
    </div>
  );
}