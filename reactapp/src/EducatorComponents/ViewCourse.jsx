import React, { useEffect, useState } from 'react';
import './ViewCourse.css';
import Button from '../utils/Button';
import InputField from '../utils/InputField';
import Modal from '../utils/Modal';
import { getAllCourses, deleteCourse } from '../Services/courseApi';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../utils/Toast';
import Preloader from '../utils/Preloader';
import {
    TOAST_DURATION,
    TOAST_VARIANTS,
    MESSAGES,
  } from '../constants';
  

const ViewCourse = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalCourses, setTotalCourses] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastVariant, setToastVariant] = useState('success');
    const [loading, setLoading] = useState(true)
    const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await getAllCourses({ search: searchTerm, page, limit });
          setCourses(response.courses);
          setTotalCourses(response.totalCourses);
        } catch (err) {
          setToastMessage(err.response?.data?.message || MESSAGES.GENERIC_ERROR);
          setToastVariant(TOAST_VARIANTS.DANGER);
          setShowToast(true);
        } finally {
          setLoading(false);
        }
      };
      
      const handleConfirmDelete = async () => {
        try {
          const response = await deleteCourse(selectedCourseId);
          console.log(response);
          setToastMessage(MESSAGES.COURSE_DELETED);
          setToastVariant(TOAST_VARIANTS.SUCCESS);
          setShowToast(true);
          setShowModal(false);
          setSelectedCourseId(null);
          fetchCourses();
        } catch (err) {
          const errorMsg = err.response?.data?.message || MESSAGES.GENERIC_ERROR;
          setToastMessage(errorMsg);
          setToastVariant(TOAST_VARIANTS.DANGER);
          setShowToast(true);
        }
      };
      

    const handleEdit = (course, id) => {
        navigate(`/educator/course-form/${id}`, {
            state: { courseData: course }
        });
    };

    const handleViewMaterial = (courseId, course) => {
        navigate(`/educator/view-material/${courseId}`, {
            state: { courseDetails: course }
        });
    };

    const handleAddMaterial = (courseId, course) => {
        navigate(`/educator/material-form/${courseId}`, {
            state: { courseInfo: course }
        });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchCourses();
        }, 1000);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page]);

    const totalPages = Math.ceil(totalCourses / limit);

    const handleDeleteClick = (courseId) => {
        setSelectedCourseId(courseId);
        setShowModal(true);
    };

    // const handleConfirmDelete = async () => {
    //     try {
    //         const response = await deleteCourse(selectedCourseId);
    //         console.log(response);
    //         setToastMessage('Course deleted successfully');
    //         setToastVariant('success');
    //         setShowToast(true);
    //         setShowModal(false);
    //         setSelectedCourseId(null);
    //         fetchCourses();
    //     } catch (err) {
    //         const errorMsg = err.response?.data?.message || 'Failed to delete course';
    //         setToastMessage(errorMsg);
    //         setToastVariant('danger');
    //         setShowToast(true);
    //     }
    // };

    return (
        <div>
            {loading ? (<Preloader />) : (
                <main className="main">
                    <button style={{ display: "none" }}>Logout</button>
                    <h2>Courses</h2>

                    <div className="search-container">
                        <InputField
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            placeholder="&#128269;Search..."
                            className="search-bar"
                            data-testid="search-input"
                        />
                    </div>

                    <table className="view-course-table" role="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Category</th>
                                <th>Level</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td className='view-course-td' colSpan={7} style={{ textAlign: 'center' }}>
                                        No courses yet
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id}>
                                        <td data-label="Title">{course.title}</td>
                                        <td data-label="Description">{course.description}</td>
                                        <td data-label="Start Date">{new Date(course.courseStartDate).toLocaleDateString()}</td>
                                        <td data-label="End Date">{new Date(course.courseEndDate).toLocaleDateString()}</td>
                                        <td data-label="Category">{course.category}</td>
                                        <td data-label="Level">{course.level}</td>
                                        <td className='icon-buttons-td'>
                                            <div id='icon-buttons' className="icon-buttons">
                                                <Button
                                                    btnName={<span className="icon" style={{ color: 'purple' }}>&#9998;</span>}
                                                    className="action-btn"
                                                    title="Edit"
                                                    onClick={() => handleEdit(course, course._id)}
                                                />
                                                <Button
                                                    btnName={<span className="icon">&#128465;&#65039;</span>}
                                                    className="action-btn"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(course._id)}
                                                />
                                                <Button
                                                    btnName={<span className="icon">&#10133;</span>}
                                                    className="action-btn"
                                                    title="Add Material"
                                                    onClick={() => handleAddMaterial(course._id, course)}
                                                />
                                                <Button
                                                    btnName={<span className="icon" style={{ color: '#6c757d' }}>&#128065;</span>}
                                                    className="action-btn"
                                                    title="View Materials"
                                                    onClick={() => handleViewMaterial(course._id, course)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {courses.length > 0 && (
                        <div className="pagination-bar">
                            <Button
                                btnName="Prev"
                                className="pagination-btn"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            />
                            <span className="page-info">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                btnName="Next"
                                className="pagination-btn"
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                            />
                        </div>
                    )}

                    <Modal
                        isOpen={showModal}
                        heading="Are you sure you want to delete this course?"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowModal(false)}
                        confirmText="Yes, delete it!"
                        cancelText="Cancel"
                    />

                    <ToastMessage
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        message={toastMessage}
                        variant={toastVariant}
                    />
                </main>
            )}
        </div>
    );
};

export default ViewCourse;