

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './MaterialForm.css';
import Button from '../utils/Button';
import InputField from '../utils/InputField';
import { addMaterial, editMaterial } from '../Services/materialsApi';
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

const MaterialForm = () => {
  const { id, courseId, course } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const material = location.state?.materialData;
  const courseInfo = location.state?.courseInfo;
  const courseDetails = location.state?.courseEdit;

  const decodedCourseTitle = decodeURIComponent(course);

  const courseTitle =
    courseInfo?.title ||
    courseDetails?.title ||
    decodedCourseTitle ||
    material?.courseTitle ||
    'Course Title';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    contentType: '',
    file: null,
    imagePreviewUrl: '',
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          file: file,
          imagePreviewUrl: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (id && material) {
      setFormData({
        title: material.title || '',
        description: material.description || '',
        url: material.url || '',
        contentType: material.contentType || '',
        file: material.file,
        imagePreviewUrl: `${process.env.REACT_APP_BASE_URL}/uploads/${material.file}`,
      });
    }
  }, [id, material]);

  const validate = () => {
    const newErrors = {};
    const pdfUrlPattern = /\b(?:https?|ftp):\/\/[^\s]+\.pdf\b/;

    if (!formData.title) newErrors.title = VALIDATION_MESSAGES.MATERIAL_TITLE_REQUIRED;
    if (!formData.description) newErrors.description = VALIDATION_MESSAGES.MATERIAL_DESCRIPTION_REQUIRED;
    if (!formData.url) {
      newErrors.url = VALIDATION_MESSAGES.MATERIAL_URL_REQUIRED;
    } else if (!pdfUrlPattern.test(formData.url)) {
      newErrors.url = VALIDATION_MESSAGES.MATERIAL_URL_INVALID;
    }
    if (!formData.contentType) newErrors.contentType = VALIDATION_MESSAGES.MATERIAL_CONTENT_TYPE_REQUIRED;
    if (!formData.file && !id) newErrors.file = VALIDATION_MESSAGES.MATERIAL_FILE_REQUIRED;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('url', formData.url);
        data.append('contentType', formData.contentType);
        if (formData.file) data.append('file', formData.file);
        data.append('courseId', courseId);

        let response;
        if (id) {
          response = await editMaterial(id, data);
          showToast(response.message || MESSAGES.MATERIAL_UPDATED, TOAST_VARIANTS.SUCCESS);
        } else {
          response = await addMaterial(data);
          showToast(response.message || MESSAGES.MATERIAL_ADDED, TOAST_VARIANTS.SUCCESS);
        }

        setTimeout(() => {
          navigate(`/educator/view-material/${courseId}`, {
            state: { courseTitle },
          });
        }, 1000);
      } catch (error) {
        console.error('Error saving material:', error);
        showToast(MESSAGES.MATERIAL_SAVE_ERROR, TOAST_VARIANTS.DANGER);
      }
    } else {
      showToast(MESSAGES.VALIDATION_ERROR, TOAST_VARIANTS.WARNING);
    }
  };

  const crumbs = [
    { label: 'Home', path: '/home' },
    { label: courseTitle, path: `/educator/view-material/${courseId}` },
    { label: id ? 'Edit Material' : 'Add Material' }
  ];

  return (
    <div className="form-container">
      <BreadCrumbs crumbs={crumbs} />
      <button style={{ display: "none" }}>Logout</button>
      <h2 className="form-title">{id ? 'Edit Material' : 'Create New Material'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={PLACEHOLDERS.MATERIAL_TITLE}
          error={errors.title}
          required
          label={LABELS.MATERIAL_TITLE}
          showLabel={true}
        />

        <InputField
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={PLACEHOLDERS.MATERIAL_DESCRIPTION}
          error={errors.description}
          required
          label={LABELS.MATERIAL_DESCRIPTION}
          showLabel={true}
        />

        <InputField
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder={PLACEHOLDERS.MATERIAL_URL}
          error={errors.url}
          required
          label={LABELS.MATERIAL_URL}
          showLabel={true}
        />

        <InputField
          id="contentType"
          name="contentType"
          value={formData.contentType}
          onChange={handleChange}
          placeholder={PLACEHOLDERS.MATERIAL_CONTENT_TYPE}
          error={errors.contentType}
          required
          label={LABELS.MATERIAL_CONTENT_TYPE}
          showLabel={true}
        />

        <div>
          <label htmlFor="file" className="input-label" style={{ width: '100%' }}>
            Upload Image <span>*</span>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              className={`input-field ${errors.file ? 'input-error' : ''}`}
            />
          </label>
          {errors.file && <small className="error">{errors.file}</small>}
        </div>

        {formData.imagePreviewUrl && (
          <div style={{ marginTop: '10px' }}>
            <strong>Image Preview:</strong>
            <img
              src={formData.imagePreviewUrl}
              alt="Preview"
              style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginTop: '10px' }}
            />
          </div>
        )}

        <div className="button-group">
          <Button
            btnName={id ? 'Update Material' : 'Add Material'}
            className="addMaterial-btn"
            type="submit"
          />
          {id && (
            <Button
              btnName="Cancel"
              className="cancel-button"
              type="button"
              onClick={() => navigate(`/educator/view-material/${courseId}`, {
                state: { courseTitle }
              })}
            />
          )}
        </div>
      </form>

      <ToastMessage
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
};

export default MaterialForm;
