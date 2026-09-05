import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import ApiKeysPage from './pages/ApiKeysPage';

export default function App() {

    return (
        <>

            <Navbar />

            <Routes>

                {/* PUBLIC */}
                <Route
                    path="/login"
                    element={
                        <LoginPage />
                    }
                />

                <Route
                    path="/courses"
                    element={
                        <CoursesPage />
                    }
                />

                {/* ADMIN */}
                <Route
                    path="/admin/courses"
                    element={
                        <ProtectedRoute
                            requiredRole="ADMIN"
                        >
                            <AdminCoursesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/api-keys"
                    element={
                        <ProtectedRoute
                            requiredRole="ADMIN"
                        >
                            <ApiKeysPage />
                        </ProtectedRoute>
                    }
                />

                {/* STUDENT */}
                <Route
                    path="/register-course"
                    element={
                        <ProtectedRoute
                            requiredRole="STUDENT"
                        >
                            <RegisterCoursePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-registrations"
                    element={
                        <ProtectedRoute
                            requiredRole="STUDENT"
                        >
                            <MyRegistrationsPage />
                        </ProtectedRoute>
                    }
                />

                {/* DEFAULT */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/courses"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/courses"
                            replace
                        />
                    }
                />

            </Routes>

        </>
    );
}