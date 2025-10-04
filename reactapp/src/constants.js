export const EDUCATOR = 'Educator';
export const STUDENT = 'Student';

export const TOAST_DURATION = 3000;

export const TOAST_VARIANTS = {
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
};

export const VALIDATION_MESSAGES = {
    TITLE_REQUIRED: 'Title is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    START_DATE_REQUIRED: 'Course Start Date is required',
    END_DATE_REQUIRED: 'Course End Date is required',
    CATEGORY_REQUIRED: 'Category is required',
    LEVEL_REQUIRED: 'Level is required',
  
    MATERIAL_TITLE_REQUIRED: 'Material title is required',
    MATERIAL_DESCRIPTION_REQUIRED: 'Material description is required',
    MATERIAL_URL_REQUIRED: 'URL is required',
    MATERIAL_URL_INVALID: 'Please enter a valid PDF URL',
    MATERIAL_CONTENT_TYPE_REQUIRED: 'Content Type is required',
    MATERIAL_FILE_REQUIRED: 'File is required',
  
    USERNAME_REQUIRED: 'User Name is required',
    EMAIL_REQUIRED: 'Email is required',
    MOBILE_REQUIRED: 'Mobile Number is required',
    PASSWORD_REQUIRED: 'Password is required',
    CONFIRM_PASSWORD_REQUIRED: 'Confirm Password is required',
    ROLE_REQUIRED: 'Role is required',
    PASSWORD_MISMATCH: 'Passwords do not match',
  };
  

  

export const PLACEHOLDERS = {
  TITLE: 'Enter course title',
  DESCRIPTION: 'Enter course description',
  CATEGORY: 'Enter course category',
  LEVEL: 'Enter course level',

  MATERIAL_TITLE: 'Enter title',
  MATERIAL_DESCRIPTION: 'Enter description',
  MATERIAL_URL: 'Enter PDF URL',
  MATERIAL_CONTENT_TYPE: 'Enter content type',
};

export const LABELS = {
  TITLE: 'Title',
  DESCRIPTION: 'Description',
  CATEGORY: 'Category',
  LEVEL: 'Level',
  START_DATE: 'Course Start Date:',
  END_DATE: 'Course End Date:',

  MATERIAL_TITLE: 'Title',
  MATERIAL_DESCRIPTION: 'Description',
  MATERIAL_URL: 'PDF URL',
  MATERIAL_CONTENT_TYPE: 'Content Type',
};
export const MESSAGES = {
    COURSE_ADDED: 'Course added successfully!',
    COURSE_UPDATED: 'Course updated successfully!',
    COURSE_DELETED: 'Course deleted successfully!',
    VALIDATION_ERROR: 'Please fix the validation errors.',
    GENERIC_ERROR: 'Something went wrong',
  
    MATERIAL_ADDED: 'Material added successfully!',
    MATERIAL_UPDATED: 'Material updated successfully!',
    MATERIAL_SAVE_ERROR: 'Failed to save material. Please try again.',
    MATERIAL_DELETE_ERROR: 'Failed to delete material',
    MATERIAL_ERROR:"Failed to load materials",


    ENROLLMENT_SUCCESS:'Course enrolled successfully',
    ENROLLMENT_DELETE_SUCCESS: 'Successfully unenrolled from the course.',
    ENROLLMENT_DELETE_ERROR: 'Error deleting enrollment',
    ENROLLMENT_ERROR:'Failed to Enroll, check your connection!',
  
    SIGNUP_SUCCESS: 'Signup successful!',
    SIGNUP_ERROR: 'Connection error! Check your connection',
    SIGNUP_VALIDATION_ERROR: 'Please fill all required fields',

    LOGIN_SUCCESS: 'Login successful!',
  };
  
   

export const ENROLLMENT_STATUSES = {
  ALL: 'All',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};
