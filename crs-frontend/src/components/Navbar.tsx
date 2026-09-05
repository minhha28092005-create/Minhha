import {
    Link,
    useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const navigate =
        useNavigate();

    const handleLogout = () => {

        logout();

        navigate(
            '/login',
            {
                replace: true,
            }
        );
    };

    return (
        <nav
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 24px',
                borderBottom:
                    '1px solid #ddd',
                marginBottom: 16,
                flexWrap: 'wrap',
            }}
        >

            {/* PUBLIC */}
            <Link to="/courses">
                Danh sach mon hoc
            </Link>

            {/* ADMIN */}
            {isAuthenticated &&
                user?.role === 'ADMIN' && (
                    <>

                        <Link
                            to="/admin/courses"
                        >
                            Quan tri mon hoc
                        </Link>

                        <Link
                            to="/admin/api-keys"
                        >
                            Quan ly API Key
                        </Link>

                    </>
                )}

            {/* STUDENT */}
            {isAuthenticated &&
                user?.role === 'STUDENT' && (
                    <>

                        <Link
                            to="/register-course"
                        >
                            Dang ky hoc phan
                        </Link>

                        <Link
                            to="/my-registrations"
                        >
                            Mon hoc da dang ky
                        </Link>

                    </>
                )}

            <div
                style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}
            >

                {!isAuthenticated ? (

                    <Link to="/login">
                        Dang nhap
                    </Link>

                ) : (
                    <>

            <span>
              {user?.username}
                {' '}
                ({user?.role})
            </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Dang xuat
                        </button>

                    </>
                )}

            </div>

        </nav>
    );
}