import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [error, setError] = useState('');

  const steps = ['Enter Email', 'Answer Security Question', 'Reset Password'];

  const handleEmailSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email })
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(values.email);
        setSecurityQuestion(data.securityQuestion);
        setActiveStep(1);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecurityAnswerSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify-security-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answer: values.securityAnswer
        })
      });

      if (response.ok) {
        setActiveStep(2);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: values.password
        })
      });

      if (response.ok) {
        // Redirect to login with success message
        navigate('/login', { 
          state: { message: 'Password reset successful. Please login with your new password.' }
        });
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Paper elevation={3} className="forgot-password-paper">
        <Typography variant="h5" component="h1" gutterBottom>
          Reset Password
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('Invalid email address')
                .required('Email is required')
            })}
            onSubmit={handleEmailSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
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
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Continue'}
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {activeStep === 1 && (
          <Formik
            initialValues={{ securityAnswer: '' }}
            validationSchema={Yup.object({
              securityAnswer: Yup.string().required('Answer is required')
            })}
            onSubmit={handleSecurityAnswerSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <Typography className="security-question">
                  {securityQuestion}
                </Typography>
                <TextField
                  fullWidth
                  id="securityAnswer"
                  name="securityAnswer"
                  label="Your Answer"
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
                  {isSubmitting ? 'Verifying...' : 'Verify Answer'}
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {activeStep === 2 && (
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={Yup.object({
              password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
            })}
            onSubmit={handlePasswordReset}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <TextField
                  fullWidth
                  type="password"
                  id="password"
                  name="password"
                  label="New Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </div>
  );
}

export default ForgotPassword; 