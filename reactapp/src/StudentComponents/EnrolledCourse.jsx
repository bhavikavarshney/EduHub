import React, { useEffect, useState } from 'react';
import './EnrolledCourse.css';
import Button from '../utils/Button.jsx';
import InputField from '../utils/InputField';
import { deleteEnrollment, getEnrollmentsByUserId } from '../Services/enrollmentApi.js'
import Preloader from '../utils/Preloader.jsx';
import Modal from '../utils/Modal.jsx'
import ToastMessage from '../utils/Toast';
import {
  TOAST_VARIANTS,
  MESSAGES,
  ENROLLMENT_STATUSES
} from '../constants';


const EnrolledCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);

  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: TOAST_VARIANTS.SUCCESS,
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;


  const showToast = (message, variant = TOAST_VARIANTS.SUCCESS) => {
    setToast({ show: true, message, variant });
  };


  const fetchEnrollments = async (page = 1) => {
    setLoading(true)
    try {
      const response = await getEnrollmentsByUserId(userId, page, itemsPerPage, searchTerm);
      const formattedCourses = response.data.map(enrollment => ({
        id: enrollment._id,
        name: enrollment.courseId.title,
        startDate: enrollment.courseId.courseStartDate,
        endDate: enrollment.courseId.courseEndDate,
        category: enrollment.courseId.category,
        level: enrollment.courseId.level,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
      }));
      setCourses(formattedCourses);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err) {
    
      showToast(err.response?.data?.message || MESSAGES.ENROLLMENT_ERROR, TOAST_VARIANTS.DANGER);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEnrollments(currentPage)
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);


  const handleUnenrollClick = (id) => {
    setSelectedEnrollmentId(id);
    setShowModal(true);
  };



  const confirmDelete = async () => {
    try {
      await deleteEnrollment(selectedEnrollmentId);
      setCourses(prev => prev.filter(course => course.id !== selectedEnrollmentId));
      setShowModal(false);
      showToast(MESSAGES.ENROLLMENT_DELETE_SUCCESS, TOAST_VARIANTS.SUCCESS);
    } catch (err) {
      showToast(err.response?.data?.message || MESSAGES.ENROLLMENT_DELETE_ERROR, TOAST_VARIANTS.DANGER);
    }
  };
  


  return (
    <>
      {loading ? (<Preloader />) : (
        <div className="enrolled-container">
          <ToastMessage
            show={toast.show}
            onClose={() => setToast(prev => ({ ...prev, show: false }))}
            message={toast.message}
            variant={toast.variant}
          />
          <button className='logout'>Logout</button>
          <h2>Enrolled Courses</h2>
          <div className='table-section'>
            <div className='search-bar-container'>
              <InputField
                id="searchTerm"
                name="searchTerm"
                type="text"
                placeholder="&#128269;Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                showLabel={false}
                className="search-bar"
              />
            </div>
            <table className="enrolled-course-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No enrolled courses.</td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id}>
                      <td data-label="Course Name">{course.name}</td>
                      <td data-label="Start Date">{new Date(course.startDate).toLocaleDateString()}</td>
                      <td data-label="End Date">{new Date(course.endDate).toLocaleDateString()}</td>
                      <td data-label="Category">{course.category}</td>
                      <td data-label="Level">{course.level}</td>
                      <td data-label="Enrollment Date">{new Date(course.enrollmentDate).toLocaleDateString()}</td>
                      <td data-label="Status">{course.status}</td>
                      <td>
                        {(course.status === ENROLLMENT_STATUSES.APPROVED || course.status === ENROLLMENT_STATUSES.PENDING) && (
                          <Button
                            btnName='Unenroll'
                            className='unenroll-btn'
                            type='button'
                            onClick={() => handleUnenrollClick(course.id)}
                          />
                        )}

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {courses.length > 0 &&
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >Prev
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            }
          </div>


          {showModal && (
            <Modal
              isOpen={showModal}
              heading="Are you sure you want to un-enroll from the course?"
              onConfirm={confirmDelete}
              onCancel={() => setShowModal(false)}
              confirmText="Yes, Unenroll"
              cancelText="Cancel"
            />
          )}
        </div>
      )}
    </>
  );
};

export default EnrolledCourse;
