import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  MenuItem
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  securityQuestion: Yup.string()
    .required('Please select a security question'),
  securityAnswer: Yup.string()
    .required('Please provide an answer')
    .min(2, 'Answer must be at least 2 characters')
});

function Register() {
  const navigate = useNavigate();
  const { login, performLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const securityQuestions = [
    'What was the name of your first pet?',
    'In which city were you born?',
    'What was your mother\'s maiden name?',
    'What was the name of your primary school?',
    'What was the make of your first car?',
    'What is your favorite book?',
    'What is the name of the street you grew up on?',
    'What was your childhood nickname?',
    'What is your favorite movie?',
    'Who was your childhood best friend?'
  ];

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...registrationData } = values;
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok) {
        try {
        await performLogin(values.email, values.password, navigate);
        await login(data.user);
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to login');
      }
        navigate('/tools');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <Paper elevation={3} className="register-paper">
        <Typography variant="h5" component="h1" gutterBottom>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            securityQuestion: '',
            securityAnswer: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                fullWidth
                id="securityQuestion"
                name="securityQuestion"
                label="Security Question"
                value={values.securityQuestion}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.securityQuestion && Boolean(errors.securityQuestion)}
                helperText={touched.securityQuestion && errors.securityQuestion}
                margin="normal"
              >
                {securityQuestions.map((question, index) => (
                  <MenuItem key={index} value={question}>
                    {question}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                id="securityAnswer"
                name="securityAnswer"
                label="Security Answer"
                value={values.securityAnswer}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.securityAnswer && Boolean(errors.securityAnswer)}
                helperText={touched.securityAnswer && errors.securityAnswer}
                margin="normal"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="login-prompt">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          </Typography>
        </div>
      </Paper>
    </div>
  );
}

export default Register; 