import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGig } from '../redux/slices/gigSlice';
import { useNavigate } from 'react-router-dom';

const CreateGig = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        const res = await dispatch(createGig({ title, description, budget }));
        if (!res.error) {
            navigate('/');
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-10 px-4">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                    <h2 className="text-3xl font-extrabold">Post a New Gig</h2>
                    <p className="opacity-80 mt-2">Connect with top freelance talent</p>
                </div>

                <form onSubmit={submitHandler} className="p-8 space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 ml-1 text-sm">Gig Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            placeholder="e.g. Build a React Website"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 ml-1 text-sm">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-40 bg-gray-50 focus:bg-white"
                            placeholder="Describe the project details, requirements, and timeline..."
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 ml-1 text-sm">Budget ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                placeholder="e.g. 500"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <span>Publish Gig</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
