import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import InputField from '../utils/InputField';
import { addUser } from '../Services/userApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ToastMessage from '../utils/Toast';
import {
  TOAST_DURATION,
  TOAST_VARIANTS,
  VALIDATION_MESSAGES,
  MESSAGES,
} from '../constants';


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userName) newErrors.userName = VALIDATION_MESSAGES.USERNAME_REQUIRED;
    if (!formData.email) newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    if (!formData.mobile) newErrors.mobile = VALIDATION_MESSAGES.MOBILE_REQUIRED;
    if (!formData.password) newErrors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    if (!formData.confirmPassword) newErrors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
    if (!formData.role) newErrors.role = VALIDATION_MESSAGES.ROLE_REQUIRED;
    if (formData.confirmPassword !== formData.password) {
      newErrors.validateConfirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await addUser(formData);
        setToast({
          show: true,
          message: response.message || MESSAGES.SIGNUP_SUCCESS,
          variant: TOAST_VARIANTS.SUCCESS,
        });
  
        setFormData({
          userName: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          role: '',
        });
        setErrors({});
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        setToast({
          show: true,
          message: error.response?.data?.message || MESSAGES.SIGNUP_ERROR,
          variant: TOAST_VARIANTS.DANGER,
        });
      }
    } else {
      setToast({
        show: true,
        message: MESSAGES.SIGNUP_VALIDATION_ERROR,
        variant: TOAST_VARIANTS.WARNING,
      });
    }
  };
  
  

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Signup</h2>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <InputField
            id="userName"
            name="userName"
            type="text"
            placeholder="User Name"
            value={formData.userName}
            onChange={handleChange}
            error={errors.userName}
            required
            label="User Name"
            showLabel={true}
          />

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

          <InputField
            id="mobile"
            name="mobile"
            type="text"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            error={errors.mobile}
            required
            label="Mobile Number"
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

          <div className="password-wrapper">
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              label="Confirm Password"
              showLabel={true}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.validateConfirmPassword && <span style={{ color: "var(--danger-color)", fontSize: '12px' }}>{errors.validateConfirmPassword}</span>}

          <label htmlFor="role">
            Role <span>*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="Educator">Educator</option>
            <option value="Student">Student</option>
          </select>
          {errors.role && <small className="error">{errors.role}</small>}

          <button type="submit" className="submit-btn">Submit</button>
        </form>
        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
}

export default Signup;