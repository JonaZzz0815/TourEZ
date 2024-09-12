import { React, useState } from 'react';
import './Signup.css';
import { useNavigate, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function Signup() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    alias: '',
  });

  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      const requirements = [];
      if (value.length < 3 || value.length > 20) {
        requirements.push('Username must be between 3 and 10 characters');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        requirements.push('Username must not contain special characters (except _)');
      }

      setUsernameErrorMessage(requirements.join(','));
    }

    if (name === 'password') {
      const requirements = [];

      if (value.length < 8) {
        requirements.push('Must be at least 8 characters long');
      }

      if (!/[A-Z]/.test(value)) {
        requirements.push('At least one uppercase letter');
      }

      if (!/[a-z]/.test(value)) {
        requirements.push('At least one lowercase letter');
      }

      if (!/\d/.test(value)) {
        requirements.push('At least one number');
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        requirements.push('At least one special character');
      }

      setPasswordErrorMessage(requirements.join(','));
    }

    if (name === 'confirmPassword') {
      setConfirmPasswordMatch(value === formData.password);
    }

    setFormData({ ...formData, [name]: value });
    if (name === 'username' && value.length >= 3 && value.length <= 20 && /^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameErrorMessage('');
    }

    if (name === 'password' && value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordErrorMessage('');
    }
  };
  async function registerUser(formData,USER_URL) {
  try {
    // Sending a POST request using fetch API
    const response = await fetch(USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        alias: formData.alias,
      })
    });

    if (!response.ok) {
      // Handle specific status code errors or general failure
      if (response.status === 409) {
        const error = new Error('Username already exists');
        error.code = 409;
        throw error;
      }
      throw new Error('Registration failed');
    }

    return response.status;  // Return the status code for a successful registration
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw error;
  }
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username === '' || formData.password === '') {
      setErrorMessage('Please fill out both username and password!');
    } else if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Two passwords do not match!');
    } else if (usernameErrorMessage !== '' || passwordErrorMessage !== '') {
      setErrorMessage('Please follow the requirements for username and password!');
    } else {
      try {
        const newFormData = { ...formData };

        setFormData(newFormData);
        const status = await registerUser(newFormData,"http://localhost:8050/register");
        if (status === 201) {
          navigate('/');
        } else {
          setErrorMessage('Sign up failed!');
        }
      } catch (err) {
        if (err.code === 409) {
          setErrorMessage('Username already exists');
          return;
        }
        setErrorMessage('Async Operation Failed');
      }
    }
  };

  return (
    <div className="container">
      <div id="right-panel" className="signup-form">
        <h1> Sign Up</h1>

        <TextField
          margin="normal"
          fullWidth
          id="signup-username"
          label="Username"
          name="username"
          autoFocus
          onChange={handleChange}
          className="custom-textfield"
          error={usernameErrorMessage !== ''}
          helperText={usernameErrorMessage !== '' && usernameErrorMessage.split(',').map((item, i) => <span key={i}>{item}<br /></span>)}
        />

        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="signup-password"
          onChange={handleChange}
          className="custom-textfield"
          error={passwordErrorMessage !== ''}
          helperText={passwordErrorMessage !== '' && passwordErrorMessage.split(',').map((item, i) => <span key={i}>{item}<br /></span>)}
          InputProps={{
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
          margin="normal"
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          onChange={handleChange}
          className="custom-textfield"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {formData.confirmPassword && ( // Show icon only if confirmPassword is not empty
                  <>
                    {confirmPasswordMatch && <CheckCircleIcon style={{ color: 'green' }} />}
                    {!confirmPasswordMatch && <CancelIcon style={{ color: 'red' }} />}
                  </>
                )}
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>

        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

        <div style={{ marginRight: 'auto' }}>
          <Link to="/" style={{
            marginTop: '10px', color: 'white', float: 'left',
          }}>
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
