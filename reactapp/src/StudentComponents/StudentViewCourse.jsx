import React, { useEffect, useState } from 'react';
import './StudentViewCourse.css';
import Button from '../utils/Button';
import InputField from '../utils/InputField';
import { getAllCourses } from '../Services/courseApi';
import { addEnrollment, getEnrollmentsByUserId } from '../Services/enrollmentApi';
import { getMaterialsByCourseId } from '../Services/materialsApi';
import MaterialModal from '../utils/StudentMaterialModal';
import Preloader from '../utils/Preloader';
import ToastMessage from '../utils/Toast'
import Modal from '../utils/Modal'
import {
  TOAST_VARIANTS,
  MESSAGES,
  ENROLLMENT_STATUSES
} from '../constants';

const StudentViewCourse = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [materialPage, setMaterialPage] = useState(1);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [loading, setLoading] = useState(true);


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

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const cleanSearch = searchTerm.trim();

      const [courseResponse, enrollmentResponse] = await Promise.all([
        getAllCourses({ search: cleanSearch, page, limit }),
        getEnrollmentsByUserId(userId)
      ]);

      const enrollments = enrollmentResponse.data;
      const updatedCourses = courseResponse.courses.map(course => {
        const enrollment = enrollments.find(enroll => enroll.courseId._id === course._id);
        return {
          ...course,
          enrollmentStatus: enrollment?.status || null
        };
      });

      setCourses(updatedCourses);
      setTotalCourses(courseResponse.totalCourses);
    } catch (err) {
      setCourses([]);
      setTotalCourses(0)
      showToast(err.response?.data?.message || MESSAGES.COURSE_ERROR, TOAST_VARIANTS.DANGER);

    }
    finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page]);

  const handleEnrollClick = (id) => {
    setSelectedCourseId(id);
    setShowModal(true);
  };

  const confirmEnroll = async () => {
    try {
      await addEnrollment({
        userId,
        courseId: selectedCourseId,
        enrollmentDate: new Date(),
        status: 'Pending',
      });

      setCourses(prevCourses =>
        prevCourses.map(course =>
          course._id === selectedCourseId
            ? { ...course, enrollmentStatus: ENROLLMENT_STATUSES.PENDING }
            : course
        )
      );

      setShowModal(false);
      showToast(MESSAGES.ENROLLMENT_SUCCESS, TOAST_VARIANTS.SUCCESS);
    } catch (err) {
      // alert(err.response?.data?.message || 'Error enrolling');
      showToast(err.response?.data?.message || MESSAGES.ENROLLMENT_ERROR, TOAST_VARIANTS.DANGER);
    }
  };

  const handleViewMaterialClick = async (courseId) => {
    try {

      const response = await getMaterialsByCourseId(courseId, 1, 1);
      setMaterials(response.materials);
      setTotalMaterials(response.totalMaterials);
      setSelectedCourseId(courseId);
      setMaterialPage(1);
      setMaterialModalVisible(true);
    } catch (err) {
      showToast(err.response?.data?.message || MESSAGES.MATERIAL_ERROR, TOAST_VARIANTS.DANGER);

    }
  };

  const handleNextMaterial = async () => {
    const nextPage = materialPage + 1;
    if (nextPage > totalMaterials) return;

    const response = await getMaterialsByCourseId(selectedCourseId, nextPage, 1);
    setMaterials(response.materials);
    setMaterialPage(nextPage);
  };

  const handlePrevMaterial = async () => {
    const prevPage = materialPage - 1;
    if (prevPage < 1) return;

    const response = await getMaterialsByCourseId(selectedCourseId, prevPage, 1);
    setMaterials(response.materials);
    setMaterialPage(prevPage);
  };

  const totalPages = Math.ceil(totalCourses / limit);

  const filteredCourses = courses;

  return (
    <>


      <ToastMessage
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.message}
        variant={toast.variant}
      />
      {loading ? (<Preloader />) : (
        <div className="available-container">

          <button style={{ display: "none" }}>Logout</button>
          <Button
            btnName="Logout"
            className="logout"
            type="button"
            onClick={() => console.log('Logout clicked')}
          />

          <h2>Available Courses</h2>

          <div className='student-view-table-section'>
            <div className="search-bar-container">
              <InputField
                id="searchTerm"
                name="searchTerm"
                type="text"
                placeholder="&#128269;Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                showLabel={false}
                className="search-bar"
              />
            </div>

            <div className='student-view-table-container'>
              <table className="student-view-course-table" >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Course Name</th>
                    <th>Course Description</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td className='student-view-td' colSpan={6} style={{ textAlign: 'center' }}>No courses available.</td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, index) => (
                      <tr key={course._id}>
                        <td data-label="S.No">{(page - 1) * limit + index + 1}</td>
                        <td data-label="Course Name">{course.title}</td>
                        <td data-label="Course Description">{course.description}</td>
                        <td data-label="Start Date">{new Date(course.courseStartDate).toLocaleDateString()}</td>
                        <td data-label="End Date">{new Date(course.courseEndDate).toLocaleDateString()}</td>
                        <td>
                          <div className='action-buttons'>
                            <Button
                              btnName={
                                course.enrollmentStatus === 'Approved'
                                  ? 'Enrolled'
                                  : course.enrollmentStatus === 'Pending'
                                    ? 'Pending Approval'
                                    : 'Enroll'
                              }
                              className="enroll-btn"
                              type="button"
                              onClick={() => handleEnrollClick(course._id)}
                              disabled={course.enrollmentStatus === 'Approved' || course.enrollmentStatus === 'Pending'}
                            />
                            <Button
                              btnName={<span className="icon" style={{ color: '#6c757d' }}>&#128065;</span>}
                              className="view-btn"
                              type="button"
                              title="View Materials"
                              onClick={() => handleViewMaterialClick(course._id)}
                              disabled={course.enrollmentStatus !== 'Approved'}
                            />
                          </div>
                        </td>
                      </tr>
                    )

                    ))}
                </tbody>
              </table>
            </div>

            {courses.length > 0 && (
              <div className="pagination-bar">
                <Button
                  btnName="Prev"
                  className="pagination-btn"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                />
                <span className="page-info">Page {page} of {totalPages}</span>
                <Button
                  btnName="Next"
                  className="pagination-btn"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                />
              </div>
            )}
          </div>

          <Modal
            isOpen={showModal}
            heading="Are you sure you want to enroll in this course?"
            onConfirm={confirmEnroll}
            onCancel={() => setShowModal(false)}
            confirmText="Yes, Enroll"
            cancelText="Cancel"
          />

          {materialModalVisible && (
            <MaterialModal
              materials={materials}
              onNext={handleNextMaterial}
              onPrev={handlePrevMaterial}
              currentPage={materialPage}
              total={totalMaterials}
              onClose={() => setMaterialModalVisible(false)}
              showPagination={totalMaterials > 1}

            />
          )}
        </div>
      )}
    </>
  );
};

export default StudentViewCourse;