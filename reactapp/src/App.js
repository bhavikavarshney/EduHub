import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import EducatorNavbar from './EducatorComponents/EducatorNavbar'
import HomePage from './Components/HomePage'
import StudentNavbar from './StudentComponents/StudentNavbar'
import Login from './Components/Login'
import Signup from './Components/Signup'
import ErrorPage from './Components/ErrorPage'
import CourseForm from './EducatorComponents/CourseForm'
import EnrollRequests from './EducatorComponents/EnrollRequests'
import MaterialForm from './EducatorComponents/MaterialForm'
import ViewCourse from './EducatorComponents/ViewCourse'
import ViewMaterial from './EducatorComponents/ViewMaterial'
import EnrolledCourse from './StudentComponents/EnrolledCourse'
import StudentViewCourse from './StudentComponents/StudentViewCourse'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './Components/PrivateRoute'
import * as Constants from './constants'
import NotFoundPage from './Components/NotFoundPage'

function AppContent() {
  // useEffect(() => {
  //   document.body.style.zoom = "75%"
  // }, []);

  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  // const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);

  }, [location.pathname]);

  const hideNavOnRoutes = ["/login", "/signup", "/"];
  const shouldHideNav = hideNavOnRoutes.includes(location.pathname);


  return (
    <div>
      {!shouldHideNav && user?.role === Constants.EDUCATOR && <EducatorNavbar />}
      {!shouldHideNav && user?.role === Constants.STUDENT && <StudentNavbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to='/notfound' />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to='/notfound' />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path='/notfound' element={<NotFoundPage />} />

        {/* Protected Routes (Both roles) */}
        <Route element={<PrivateRoute allowedRoles={[Constants.EDUCATOR, Constants.STUDENT]} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Educator Only */}
        <Route element={<PrivateRoute allowedRoles={[Constants.EDUCATOR]} />}>
          <Route path="/educator/course-form" element={<CourseForm />} />
          <Route path="/educator/course-form/:id" element={<CourseForm />} />
          <Route path="/educator/enroll-requests" element={<EnrollRequests />} />
          <Route path="/educator/material-form/:courseId" element={<MaterialForm />} />

          <Route path="/educator/material-form/edit/:id/:courseId/:course" element={<MaterialForm />} />
          <Route path="/educator/view-course" element={<ViewCourse />} />
          <Route path="/educator/view-material/:courseId" element={<ViewMaterial />} />
        </Route>

        {/* Student Only */}
        <Route element={<PrivateRoute allowedRoles={[Constants.STUDENT]} />}>
          <Route path="/student/enrolled-course" element={<EnrolledCourse />} />
          <Route path="/student/view-course" element={<StudentViewCourse />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/error" />} />
      </Routes>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App