
import React, { useEffect, useState } from 'react';
import './CourseForm.css';
import Button from '../utils/Button';
import InputField from '../utils/InputField';
import DatePicker from '../utils/DatePicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addCourse, updateCourse } from '../Services/courseApi';
import ToastMessage from '../utils/Toast';
import BreadCrumbs from '../utils/BreadCrumbs';
import {
  TOAST_DURATION,
  TOAST_VARIANTS,
  VALIDATION_MESSAGES,
  PLACEHOLDERS,
  LABELS,
  MESSAGES
} from '../constants';

const CourseForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const course = location.state?.courseData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseStartDate: '',
    courseEndDate: '',
    category: '',
    level: '',
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: TOAST_VARIANTS.SUCCESS,
  });

  const showToast = (message, variant = TOAST_VARIANTS.SUCCESS) => {
    setToast({ show: true, message, variant });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, TOAST_DURATION);
  };

  useEffect(() => {
    const loadCourse = async () => {
      if (id && course) {
        setFormData({
          title: course.title || '',
          description: course.description || '',
          courseStartDate: course.courseStartDate?.slice(0, 10) || '',
          courseEndDate: course.courseEndDate?.slice(0, 10) || '',
          category: course.category || '',
          level: course.level || '',
        });
      }
    };
    loadCourse();
  }, [id, course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = VALIDATION_MESSAGES.TITLE_REQUIRED; 
    if (!formData.description) newErrors.description = VALIDATION_MESSAGES.DESCRIPTION_REQUIRED;
    if (!formData.courseStartDate) newErrors.courseStartDate = VALIDATION_MESSAGES.START_DATE_REQUIRED;
    if (!formData.courseEndDate) newErrors.courseEndDate = VALIDATION_MESSAGES.END_DATE_REQUIRED;
    if (!formData.category) newErrors.category = VALIDATION_MESSAGES.CATEGORY_REQUIRED;
    if (!formData.level) newErrors.level = VALIDATION_MESSAGES.LEVEL_REQUIRED;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (!id) {
          const response = await addCourse(formData);
          showToast(response.message || MESSAGES.COURSE_ADDED, TOAST_VARIANTS.SUCCESS);
          setTimeout(() => {
            navigate('/educator/view-course');
          }, 1000);
        } else {
          const response = await updateCourse(id, formData);
          showToast(response.message || MESSAGES.COURSE_UPDATED, TOAST_VARIANTS.SUCCESS);
          setTimeout(() => {
            navigate('/educator/view-course');
          }, 1000);
        }
      } catch (err) {
        showToast(err.response?.message || MESSAGES.GENERIC_ERROR, TOAST_VARIANTS.DANGER);
      }
    } else {
      showToast(MESSAGES.VALIDATION_ERROR, TOAST_VARIANTS.WARNING);
    }
  };

  const crumbs = [
    { label: 'Home', path: '/home' },
    { label: 'View Courses', path: '/educator/view-course' },
    { label: id ? 'Update Course' : 'Create Course' }
  ];

  return (
    <div className="CourseForm">
      <header>
        <nav>
          <button className="logout-button">Logout</button>
        </nav>
      </header>

      <main>
        <BreadCrumbs crumbs={crumbs} />
        <h1>{id ? "Update Course" : "Create New Course"}</h1>
        <form onSubmit={handleSubmit} noValidate>
          <InputField
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.TITLE}
            error={errors.title}
            required
            label={LABELS.TITLE}
            showLabel={true}
          />

          <div className="input-wrapper">
            <label htmlFor="description">{LABELS.DESCRIPTION} <span>*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={PLACEHOLDERS.DESCRIPTION}
              className={`input-field ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <small className="error">{errors.description}</small>}
          </div>

          <DatePicker
            label={LABELS.START_DATE}
            name="courseStartDate"
            value={formData.courseStartDate}
            onChange={handleChange}
            clearOnClick={() => setFormData(prev => ({ ...prev, courseEndDate: '' }))}
          />
          {errors.courseStartDate && <p className="error-message">{errors.courseStartDate}</p>}

          <DatePicker
            label={LABELS.END_DATE}
            name="courseEndDate"
            value={formData.courseEndDate}
            onChange={handleChange}
            minDate={formData.courseStartDate}
          />
          {errors.courseEndDate && <p className="error-message">{errors.courseEndDate}</p>}

          <InputField
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.CATEGORY}
            error={errors.category}
            required
            label={LABELS.CATEGORY}
            showLabel={true}
          />

          <InputField
            name="level"
            value={formData.level}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.LEVEL}
            error={errors.level}
            required
            label={LABELS.LEVEL}
            showLabel={true}
          />

          <div className="button-group">
            <Button
              btnName={id ? "Update Course" : "Add Course"}
              className="add-btn"
              type="submit"
            />
            {id && (
              <Button
                btnName="Cancel"
                className="cancel-button"
                type="button"
                onClick={() => navigate('/educator/view-course')}
              />
            )}
          </div>
        </form>
      </main>

      <ToastMessage
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
};

export default CourseForm;
