// import React, { useEffect, useState } from 'react';
// import './EnrollRequests.css';
// import { Button, Modal } from 'react-bootstrap';
// import InputField from '../utils/InputField';
// import ToastMessage from '../utils/Toast';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { getAllEnrollments, updateEnrollmentStatus } from '../Services/enrollmentApi';
// import Preloader from '../utils/Preloader';

// const EnrollRequests = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEnrollment, setSelectedEnrollment] = useState(null);
//   const [loading, setLoading] = useState(true)
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     variant: 'success',
//   });

//   const showToast = (message, variant = 'success') => {
//     setToast({ show: true, message, variant });
//     setTimeout(() => setToast({ ...toast, show: false }), 3000);
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchEnrollments();
//     }, 1000);
//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   const fetchEnrollments = async () => {
//     setLoading(true)
//     try {
//       const response = await getAllEnrollments();
//       setEnrollments(response);
//     } catch (error) {
//       showToast('Error fetching enrollments', 'danger');
//     }
//     finally {
//       setLoading(false)
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleStatusChange = (e) => {
//     setStatusFilter(e.target.value);
//   };

//   const handleShowMore = (enroll) => {
//     setSelectedEnrollment(enroll);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedEnrollment(null);
//   };

//   const handleStatusUpdate = async (id, newStatus) => {
//     const prevStatus = enrollments.find((e) => e._id === id)?.status;
//     if (prevStatus === newStatus) return;

//     setEnrollments((prev) =>
//       prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
//     );
//     setSelectedEnrollment((prev) =>
//       prev && prev._id === id ? { ...prev, status: newStatus } : prev
//     );

//     try {
//       await updateEnrollmentStatus(id, newStatus);
//       showToast(`Enrollment ${newStatus.toLowerCase()} successfully`, 'success');
//     } catch (err) {
//       setEnrollments((prev) =>
//         prev.map((e) => (e._id === id ? { ...e, status: prevStatus } : e))
//       );
//       setSelectedEnrollment((prev) =>
//         prev && prev._id === id ? { ...prev, status: prevStatus } : prev
//       );
//       showToast(
//         `Failed to ${newStatus.toLowerCase()}. ${err.response?.data?.message || err.message}`,
//         'danger'
//       );
//     }
//   };

//   const filteredEnrollments = enrollments.filter((enroll) => {
//     const courseTitle = enroll.courseId?.title?.toLowerCase() || '';
//     const courseDesc = enroll.courseId?.description?.toLowerCase() || '';
//     const matchesSearch =
//       courseTitle.includes(searchTerm.toLowerCase()) ||
//       courseDesc.includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || enroll.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <>
//       {loading ? (<Preloader />) : (
//         <div className="enroll-container">
//           <header className="enroll-header">
//             <h2 className="enroll-title">Enrollment Requests for Approval</h2>
//             <button style={{ display: "none" }}>Logout</button>

//           </header>
//           <input type="text" placeholder='Search...' style={{ display: 'none' }} />

//           <div className="filter-bar">
//             <InputField
//               name="search"
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="&#128269;Search..."
//               className="search-bar"
//             />

//             <select className="status-filter" value={statusFilter} onChange={handleStatusChange}>
//               <option>All</option>
//               <option>Pending</option>
//               <option>Approved</option>
//               <option>Rejected</option>
//             </select>
//           </div>

//           <table className="enroll-table" role="table">
//             <thead>
//               <tr>
//                 <th>SNo</th>
//                 <th>Course Name</th>
//                 <th>Description</th>
//                 <th>Submission Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEnrollments.length > 0 ? (
//                 filteredEnrollments.map((enroll, index) => (
//                   <tr key={enroll._id}>
//                     <td data-label="SNo">{index + 1}</td>
//                     <td data-label="Course Name">{enroll.courseId?.title || 'N/A'}</td>
//                     <td data-label="Description" className="truncate">{enroll.courseId?.description || 'N/A'}</td>
//                     <td data-label="Submission Date">{new Date(enroll.enrollmentDate).toLocaleDateString()}</td>
//                     <td data-label="Status">{enroll.status}</td>

//                     <td className="actions">
//                       <div className="action-grid">
//                         <Button className='icon-button'
//                           title="Show More"
//                           variant="light"
//                           size="sm"
//                           style={{
//                             border: '1px solid #6c757d',
//                             color: '#6c757d',
//                             backgroundColor: 'white',
//                             padding: '1px 4px',
//                             fontSize: '12px',
//                             minWidth: '50px',
//                             lineHeight: '1',
//                           }}
//                           onClick={() => handleShowMore(enroll)}
//                         >
//                           <span className="icon" style={{ color: '#6c757d' }}>&#128065;</span>
//                         </Button>

//                         {enroll.status !== 'Approved' && (
//                           <Button className='status-button'
//                             variant="success"
//                             size="sm"
//                             onClick={() => handleStatusUpdate(enroll._id, 'Approved')}
//                           >
//                             Approve
//                           </Button>

//                         )}

//                         {enroll.status !== 'Rejected' && (
//                           <Button
//                             variant="danger"
//                             size="sm"
//                             onClick={() => handleStatusUpdate(enroll._id, 'Rejected')}
//                           >
//                             Reject
//                           </Button>
//                         )}
//                       </div>
//                     </td>


//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
//                     No enrollment requests found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>


//           </table>

//           <Modal
//             show={showModal}
//             onHide={handleCloseModal}
//             centered
//             size="lg"
//             dialogClassName="enroll-modal"
//             contentClassName="bg-white enroll-modal-content"
//             backdropClassName="enroll-backdrop-blur"
//             style={{ maxWidth: '600px', margin: 'auto', marginLeft: '550px' }}
//           >
//             <Modal.Body>
//               <Button
//                 variant="danger"
//                 onClick={handleCloseModal}
//                 style={{ display: 'flex', marginBottom: '10px', marginLeft: 'auto' }}
//               >
//                 Close
//               </Button>
//               {selectedEnrollment && (
//                 <>
//                   <p><strong>Enrollment Date:</strong> {new Date(selectedEnrollment.enrollmentDate).toLocaleDateString()}</p>
//                   <p><strong>Status:</strong> {selectedEnrollment.status}</p>
//                   <p><strong>Course Title:</strong> {selectedEnrollment.courseId?.title}</p>
//                   <p><strong>Course Description:</strong> {selectedEnrollment.courseId?.description}</p>
//                   <p><strong>Course Start Date:</strong> {selectedEnrollment.courseId?.courseStartDate ? new Date(selectedEnrollment.courseId.courseStartDate).toLocaleDateString() : 'N/A'}</p>
//                   <p><strong>Course End Date:</strong> {selectedEnrollment.courseId?.courseEndDate ? new Date(selectedEnrollment.courseId.courseEndDate).toLocaleDateString() : 'N/A'}</p>
//                   <p><strong>Course Category:</strong> {selectedEnrollment.courseId?.category}</p>
//                   <p><strong>Course Level:</strong> {selectedEnrollment.courseId?.level}</p>
//                 </>
//               )}
//             </Modal.Body>
//           </Modal>

//           <ToastMessage
//             show={toast.show}
//             onClose={() => setToast({ ...toast, show: false })}
//             message={toast.message}
//             variant={toast.variant}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default EnrollRequests;

import React, { useEffect, useState } from 'react';
import './EnrollRequests.css';
import { Button, Modal } from 'react-bootstrap';
import InputField from '../utils/InputField';
import ToastMessage from '../utils/Toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllEnrollments, updateEnrollmentStatus } from '../Services/enrollmentApi';
import Preloader from '../utils/Preloader';

import {
  TOAST_DURATION,
  TOAST_VARIANTS,
  MESSAGES,
  ENROLLMENT_STATUSES,
} from '../constants';

const EnrollRequests = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(ENROLLMENT_STATUSES.ALL);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: TOAST_VARIANTS.SUCCESS,
  });

  const showToast = (message, variant = TOAST_VARIANTS.SUCCESS) => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ ...toast, show: false }), TOAST_DURATION);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEnrollments();
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await getAllEnrollments();
      setEnrollments(response);
    } catch (error) {
      showToast(MESSAGES.GENERIC_ERROR, TOAST_VARIANTS.DANGER);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleShowMore = (enroll) => {
    setSelectedEnrollment(enroll);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEnrollment(null);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const prevStatus = enrollments.find((e) => e._id === id)?.status;
    if (prevStatus === newStatus) return;

    setEnrollments((prev) =>
      prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
    );
    setSelectedEnrollment((prev) =>
      prev && prev._id === id ? { ...prev, status: newStatus } : prev
    );

    try {
      await updateEnrollmentStatus(id, newStatus);
      showToast(`Enrollment ${newStatus.toLowerCase()} successfully`, TOAST_VARIANTS.SUCCESS);
    } catch (err) {
      setEnrollments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: prevStatus } : e))
      );
      setSelectedEnrollment((prev) =>
        prev && prev._id === id ? { ...prev, status: prevStatus } : prev
      );
      showToast(
        `Failed to ${newStatus.toLowerCase()}. ${err.response?.data?.message || err.message}`,
        TOAST_VARIANTS.DANGER
      );
    }
  };

  const filteredEnrollments = enrollments.filter((enroll) => {
    const courseTitle = enroll.courseId?.title?.toLowerCase() || '';
    const courseDesc = enroll.courseId?.description?.toLowerCase() || '';
    const matchesSearch =
      courseTitle.includes(searchTerm.toLowerCase()) ||
      courseDesc.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === ENROLLMENT_STATUSES.ALL || enroll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <div className="enroll-container">
          <header className="enroll-header">
            <h2 className="enroll-title">Enrollment Requests for Approval</h2>
            <button style={{ display: 'none' }}>Logout</button>
          </header>

          <input type="text" placeholder="Search..." style={{ display: 'none' }} />

          <div className="filter-bar">
            <InputField
              name="search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="&#128269; Search..."
              className="search-bar"
            />

            <select className="status-filter" value={statusFilter} onChange={handleStatusChange}>
              <option>{ENROLLMENT_STATUSES.ALL}</option>
              <option>{ENROLLMENT_STATUSES.PENDING}</option>
              <option>{ENROLLMENT_STATUSES.APPROVED}</option>
              <option>{ENROLLMENT_STATUSES.REJECTED}</option>
            </select>
          </div>

          <table className="enroll-table" role="table">
            <thead>
              <tr>
                <th>SNo</th>
                <th>Course Name</th>
                <th>Description</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enroll, index) => (
                  <tr key={enroll._id}>
                    <td data-label="SNo">{index + 1}</td>
                    <td data-label="Course Name">{enroll.courseId?.title || 'N/A'}</td>
                    <td data-label="Description" className="truncate">
                      {enroll.courseId?.description || 'N/A'}
                    </td>
                    <td data-label="Submission Date">
                      {new Date(enroll.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td data-label="Status">{enroll.status}</td>
                    <td className="actions">
                      <div className="action-grid">
                        <Button
                          className="icon-button"
                          title="Show More"
                          variant="light"
                          size="sm"
                          style={{
                            border: '1px solid #6c757d',
                            color: '#6c757d',
                            backgroundColor: 'white',
                            padding: '1px 4px',
                            fontSize: '12px',
                            minWidth: '50px',
                            lineHeight: '1',
                          }}
                          onClick={() => handleShowMore(enroll)}
                        >
                          <span className="icon" style={{ color: '#6c757d' }}>👁️</span>
                        </Button>

                        {enroll.status !== ENROLLMENT_STATUSES.APPROVED && (
                          <Button
                            className="status-button"
                            variant="success"
                            size="sm"
                            onClick={() => handleStatusUpdate(enroll._id, ENROLLMENT_STATUSES.APPROVED)}
                          >
                            Approve
                          </Button>
                        )}

                        {enroll.status !== ENROLLMENT_STATUSES.REJECTED && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleStatusUpdate(enroll._id, ENROLLMENT_STATUSES.REJECTED)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                    No enrollment requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered
            size="lg"
            dialogClassName="enroll-modal"
            contentClassName="bg-white enroll-modal-content"
            backdropClassName="enroll-backdrop-blur"
            style={{ maxWidth: '600px', margin: 'auto', marginLeft: '550px' }}
          >
            <Modal.Body>
              <Button
                variant="danger"
                onClick={handleCloseModal}
                style={{ display: 'flex', marginBottom: '10px', marginLeft: 'auto' }}
              >
                Close
              </Button>
              {selectedEnrollment && (
                <>
                  <p><strong>Enrollment Date:</strong> {new Date(selectedEnrollment.enrollmentDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedEnrollment.status}</p>
                  <p><strong>Course Title:</strong> {selectedEnrollment.courseId?.title}</p>
                  <p><strong>Course Description:</strong> {selectedEnrollment.courseId?.description}</p>
                  <p><strong>Course Start Date:</strong> {selectedEnrollment.courseId?.courseStartDate ? new Date(selectedEnrollment.courseId.courseStartDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Course End Date:</strong> {selectedEnrollment.courseId?.courseEndDate ? new Date(selectedEnrollment.courseId.courseEndDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Course Category:</strong> {selectedEnrollment.courseId?.category}</p>
                  <p><strong>Course Level:</strong> {selectedEnrollment.courseId?.level}</p>
                </>
              )}
            </Modal.Body>
          </Modal>

          <ToastMessage
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            message={toast.message}
            variant={toast.variant}
          />
        </div>
      )}
    </>
  );
};

export default EnrollRequests;
