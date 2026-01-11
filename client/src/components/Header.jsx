import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { LogOut, PlusCircle, User as UserIcon, Briefcase } from 'lucide-react';

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
                        GigFlow
                    </span>
                </Link>
                <nav className="flex items-center space-x-6">
                    {userInfo ? (
                        <>
                            <Link
                                to="/features/create-gig"
                                className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${isActive('/features/create-gig')
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                <PlusCircle className="w-5 h-5 mr-1.5" />
                                Post Gig
                            </Link>

                            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                                <div className="flex items-center text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium ml-2 hidden md:block">{userInfo.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
