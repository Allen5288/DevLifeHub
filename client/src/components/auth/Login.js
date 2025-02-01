import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Divider,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import { 
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(''); // Clear any existing errors

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: values.email.trim().toLowerCase(),
          password: values.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success || !data.user) {
        throw new Error('Invalid response from server');
      }

      // Update auth context
      setUser(data.user);

      // Clear form and navigate
      values.email = '';
      values.password = '';
      navigate('/tools');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = '/api/auth/google';
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      'Google Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        const isAuthenticated = document.cookie.includes('isAuthenticated=true');
        if (isAuthenticated) {
          window.location.reload();
        }
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" component="h1" gutterBottom>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          className="google-button"
        >
          Sign in with Google
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="register-prompt">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Sign Up
            </Link>
          </Typography>
        </div>
      </Paper>
    </div>
  );
}

export default Login; 