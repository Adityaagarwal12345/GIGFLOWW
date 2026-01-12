import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, isLoading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
        return () => { dispatch(clearError()); };
    }, [userInfo, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register({ name, email, password, role }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-[-10%] right-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 relative z-10 transition-all duration-300 hover:shadow-indigo-500/10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Join GigFlow
                    </h2>
                    <p className="text-gray-400 mt-2">Start your journey today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-pulse">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-800 focus:bg-gray-700 text-white"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-800 focus:bg-gray-700 text-white"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-800 focus:bg-gray-700 text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2 ml-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('client')}
                                className={`py-2 px-4 rounded-xl border border-2 text-sm font-bold transition-all ${role === 'client'
                                    ? 'border-indigo-500 bg-indigo-900/50 text-indigo-300'
                                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('freelancer')}
                                className={`py-2 px-4 rounded-xl border border-2 text-sm font-bold transition-all ${role === 'freelancer'
                                    ? 'border-purple-500 bg-purple-900/50 text-purple-300'
                                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                Freelancer
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-8 text-center border-t border-gray-200 pt-6">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-purple-600 font-bold hover:underline transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
