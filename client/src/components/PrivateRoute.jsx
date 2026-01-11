import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    return userInfo ? (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoute;
