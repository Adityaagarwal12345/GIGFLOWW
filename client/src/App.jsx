import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';

const ENDPOINT = window.location.origin.replace('5173', '5000').replace('http', 'ws'); // Simple hack for dev or just use '/api' proxy logic for socket?
// Actually socket.io client usually defaults to window.location. But dev server is on 5173, backend on 5000.
// We set up proxy in vite.config.js for /api, but socket often needs explicit URL if ports differ and proxy isn't ws-configured.
// Let's hardcode localhost:5000 for local dev if needed, or use relative if proxy handles it.
// Vite proxy DOES handle ws if configured: { '/socket.io': { target: 'ws://localhost:5000', ws: true } }
// I didn't add that to vite.config.js. I'll use explicit URL for now to be safe.
const SOCKET_URL = 'http://localhost:5000';

function App() {
    const { userInfo } = useSelector((state) => state.auth);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (userInfo) {
            const socket = io(SOCKET_URL);

            // Join user-specific room
            // Server emits to: user_${freelancerId}
            // Client usually doesn't need to "join" explicitly if server handles logic, BUT server code just emits to room.
            // So client MUST join room. 
            // Wait, server: req.io.to(`user_${bidToHire.freelancerId}`).emit...
            // Socket.io default rooms are socket.id. Logic: "Ideally, user joins room 'user_<id>' on frontend connection"
            // So I need to emit 'join' event or similar?
            // Or server middleware assigns user ID to socket?
            // In my server implementation, I didn't add logic to make socket join the room!
            // I only wrote the Emit code.
            // I need to update Server index.js to handle connection event and joining room!

            // FIXING SERVER LOGIC VIA CLIENT SIDE EVENT:
            socket.emit('setup', userInfo._id);

            socket.on('notification', (data) => {
                setNotification(data.message);
                setTimeout(() => setNotification(null), 5000);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [userInfo]);

    return (
        <div className="min-h-screen bg-black font-sans text-gray-100 selection:bg-indigo-900 selection:text-indigo-200">
            {notification && (
                <div className="fixed top-24 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center animate-slide-in-right">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Hired!</p>
                        <p className="font-medium opacity-90">{notification}</p>
                    </div>
                </div>
            )}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="gigs/:id" element={<GigDetails />} />
                    <Route path="features/create-gig" element={<CreateGig />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
