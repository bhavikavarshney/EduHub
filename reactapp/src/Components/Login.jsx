import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../utils/InputField';
import { loginUser } from '../Services/userApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ToastMessage from '../utils/Toast';
import {
  TOAST_DURATION,
  TOAST_VARIANTS,
  VALIDATION_MESSAGES,
  MESSAGES,
} from '../constants';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    if (!formData.password) newErrors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await loginUser(formData);
        localStorage.setItem('currentUser', JSON.stringify(response));

        setToast({
          show: true,
          message: MESSAGES.LOGIN_SUCCESS,
          variant: TOAST_VARIANTS.SUCCESS,
        });

        setTimeout(() => navigate('/home'), 1000);
      } catch (error) {
        setToast({
          show: true,
          message: error.response?.data?.message ||  MESSAGES.SIGNUP_ERROR,
          variant: TOAST_VARIANTS.DANGER,
        });
      }

      setFormData({ email: '', password: '' });
      setErrors({});
    } else {
      setToast({
        show: true,
        message: MESSAGES.SIGNUP_VALIDATION_ERROR,
        variant: TOAST_VARIANTS.WARNING,
      });
    }
  };

  return (
    <div>
      <div className="login-container">
        <ToastMessage
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          message={toast.message}
          variant={toast.variant}
        />

        <div className="login-left">
          <h1>Edu-Hub</h1>
          <p>
            Your journey to knowledge begins with us. <br />
            Take the first step by enrolling in a course.
          </p>
        </div>

        <div className="login-right-background" style={{ height: '100vh' }}>
          <div className="login-right">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                label="Email"
                showLabel={true}
              />
              <div className="password-wrapper">
                <InputField
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  label="Password"
                  showLabel={true}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="login-btn">Login</button>
            </form>

            <p className="signup-text">
              Don't have an account? <Link to='/signup'>Signup</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;