import React, { useEffect, useState } from 'react';
import './ViewMaterial.css';
import InputField from '../utils/InputField';
import Button from '../utils/Button';
import Modal from '../utils/Modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteMaterial, getAllMaterials } from '../Services/materialsApi';
import MaterialModal from '../utils/MaterialModel';
import Preloader from '../utils/Preloader';
import ToastMessage from '../utils/Toast';
import {
    TOAST_DURATION,
    TOAST_VARIANTS,
    MESSAGES,
  } from '../constants';
  

const ViewMaterial = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalMaterials, setTotalMaterials] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastVariant, setToastVariant] = useState('success');

    const courseTitle =
        location.state?.courseTitle ||
        location.state?.courseDetails?.title ||
        'Course';

        const fetchMaterials = async (courseId) => {
            setLoading(true);
            try {
              const res = await getAllMaterials({ search: searchTerm, page, limit, courseId });
              setMaterials(res.materials);
              setTotalMaterials(res.totalMaterials);
            } catch (err) {
              setToastMessage(err.response?.data?.message || MESSAGES.GENERIC_ERROR);
              setToastVariant(TOAST_VARIANTS.DANGER);
              setShowToast(true);
            } finally {
              setLoading(false);
            }
          };
          

    // useEffect(() => {
    //     fetchMaterials(courseId);
    // }, [searchTerm, page, courseId]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchMaterials(courseId);
        }, 1000);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, page, courseId]);

    const totalPages = Math.ceil(totalMaterials / limit);

    const handleEdit = (id, material) => {
        navigate(`/educator/material-form/edit/${id}/${courseId}/${courseTitle}`, {
            state: {
                materialData: material,
                courseTitle: courseTitle
            }
        });
    };

    const handleDeleteClick = (id) => {
        setSelectedMaterialId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
          await deleteMaterial(selectedMaterialId);
          setShowModal(false);
          setSelectedMaterialId(null);
          setToastMessage(MESSAGES.MATERIAL_DELETED)
          setToastVariant(TOAST_VARIANTS.SUCCESS)
          setShowToast(true);
          fetchMaterials(courseId);
        } catch (err) {
          setToastMessage(err.response?.data?.message || MESSAGES.MATERIAL_DELETE_ERROR);
          setToastVariant(TOAST_VARIANTS.DANGER);
          setShowToast(true);
        }
      };
      

    return (
        <>
            {loading ? (<Preloader />) : (
                <div className="view-material-container">

                    <h2 style={{ display: 'none' }}>Materials</h2>
                    <h1 className="page-title">Materials for {courseTitle}</h1>
                    <button style={{ display: "none" }}>Logout</button>

                    <Button
                        btnName="Back"
                        className="back-btn"
                        type="button"
                        onClick={() => navigate('/educator/view-course')}
                        title="Go Back"
                    />

                    <InputField
                        type="text"
                        className="search-box"
                        placeholder="&#128269;Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />

                    <table className="material-table">
                        <thead>
                            <tr>
                                <th>SNo</th>
                                <th>Material Title</th>
                                <th>Description</th>
                                <th>Content Type</th>
                                <th>Upload Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.length === 0 ? (
                                <tr>
                                    <td className='view-material-td' colSpan={6} style={{ textAlign: 'center' }}>
                                        No materials found
                                    </td>
                                </tr>
                            ) : (
                                materials.map((material, index) => (
                                    <tr key={material._id}>
                                        <td data-label="SNo">{(page - 1) * limit + index + 1}</td>
                                        <td data-label="Material Title">{material.title}</td>
                                        <td data-label="Description">{material.description}</td>
                                        <td data-label="Content Type">{material.contentType}</td>
                                        <td data-label="Upload Date">{new Date(material.uploadDate).toLocaleDateString()}</td>
                                        <td className='button-td'>
                                            <div className='button-data'>
                                                <Button
                                                    btnName={<span className="icon" style={{ color: '#6c757d' }}>&#128065;</span>}
                                                    className="action-btn"
                                                    title="Show More"
                                                    onClick={() => setSelectedMaterial(material)}
                                                />
                                                <Button
                                                    btnName={<span className="icon" style={{ color: 'purple' }}>&#9998;</span>}
                                                    className="action-btn"
                                                    title="Edit"
                                                    onClick={() => handleEdit(material._id, material)}
                                                />
                                                <Button
                                                    btnName={<span className="icon">&#128465;&#65039;</span>}
                                                    className="action-btn"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(material._id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {materials.length > 0 && (
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

                    {selectedMaterial && (
                        <MaterialModal
                            title={selectedMaterial.title}
                            description={selectedMaterial.description}
                            url={selectedMaterial.url}
                            src={selectedMaterial.file}
                            onClose={() => setSelectedMaterial(null)}
                        />
                    )}

                    <Modal
                        isOpen={showModal}
                        heading="Are you sure you want to delete this material?"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowModal(false)}
                        confirmText="Yes, delete it!"
                        cancelText="Cancel"
                    />

                    {showToast && (
                        <ToastMessage
                            message={toastMessage}
                            variant={toastVariant}
                            onClose={() => setShowToast(false)}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default ViewMaterial;