import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../utils/Modal';
const AppNavbar = ({ userName, role }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)

  const handleLogout = () => {
    setShowModal(true)
  };

  const handleConfirmLogout = () => {
    navigate('/');
    localStorage.clear();
  }
  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        style={{ background: 'linear-gradient(to right, #6A1B9A, #E1BEE7, #7B1FA2)' }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/home">Edu-Hub</Navbar.Brand>  <p style={{ display: 'none' }}>Course</p>

          <Navbar.Toggle aria-controls="app-navbar-nav" />
          <Navbar.Collapse id="app-navbar-nav" className="justify-content-end">
            <Nav className="align-items-lg-center">
              <Nav.Item className="me-3 nav-user-pill">
                <span className="border border-dark rounded px-2 py-1 text-dark">
                  {userName} / {role}
                </span>
              </Nav.Item>

              <Nav.Link as={Link} to="/home" className="text-white nav-hover">Home</Nav.Link>

              {role === 'Educator' && (
                <>
                  <NavDropdown title={<span className="text-white">Course</span>} id="educator-courses-dropdown">
                    <NavDropdown.Item as={Link} to="/educator/course-form">Add Course</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/educator/view-course">View Course</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/educator/enroll-requests" className="text-white nav-hover">Enrollment Requested</Nav.Link>
                </>
              )}

              {role === 'Student' && (
                <>
                  <Nav.Link as={Link} to="/student/view-course" className="text-white nav-hover">Courses</Nav.Link>
                  <Nav.Link as={Link} to="/student/enrolled-course" className="text-white nav-hover">Enrolled Courses</Nav.Link>
                </>
              )}

              <Button variant="danger" className="ms-3" onClick={handleLogout} >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        isOpen={showModal}
        heading='Are you sure want to logout?'
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowModal(false)}
        confirmText='Yes, Logout!'
        cancelText='Cancel'
      />
    </>
  );
};

export default AppNavbar;