import { React, useState } from 'react';
import './LoginPage.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function LoginPage( ) {
  const [passwdValidation, setPasswdValidation] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  async function loginUser(userData,LOGIN_URL) {
    const result = {
      loginSuccess: false, message: '', ID: -1
    };

    try {
      // Sending a POST request using fetch API
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      });

      if (!response.ok) {
        // If the HTTP status code is not successful, throw an error
        const errorData = await response.json(); // Assuming the server responds with JSON
        throw new Error(errorData.message);
      }

      const user = await response.json(); // Parse JSON data from the response

      // Updating the result based on the successful response
      result.loginSuccess = true;
      result.ID = user._id;
      result.message = 'Login Success';
      window.location.href = '/landing';
      return result;
    } catch (error) {
      // Throw the error to be handled by the caller
      throw Error(error.message);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData,"http://localhost:8050/login");
      if (response.loginSuccess) {
        setPasswdValidation(true);
        localStorage.setItem('userID', response.ID);
      } else {
        setErrorMessage(response.message);
        setPasswdValidation(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setPasswdValidation(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="container">
        <div id="two" className="item">
          <h1 color='white' className='app-name'>TourEZ</h1>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={handleChange}
            className="custom-textfield"
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange}
            onKeyDown={handleEnter}
            className="custom-textfield"
          />
          <Link
            style={{
              marginTop: '10px', color: 'white', float: 'left',
            }}
            className="forget-password-prompt">
              Forgot your password?
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              color: 'white',
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#4558c4',
                color: 'white',
              },
            }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          {!passwdValidation && <div style={{ color: 'red', paddingBottom: '8px' }}> {errorMessage} </div> }
          <div style={{ marginRight: 'auto' }}>
            <div>
               Don&apos;t have an account? <Link style={{ color: 'white' }} to="/signup"> Sign Up! </Link>
            </div>
          </div>
        </div>
      </div>
  );
}

export default LoginPage;
