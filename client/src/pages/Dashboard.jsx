import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs, fetchMyGigs } from '../redux/slices/gigSlice';
import { fetchMyBids } from '../redux/slices/bidSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { gigs, gigsLoading, gigsError } = useSelector((state) => state.gigs);
    const { myBids, isLoading: bidsLoading, error: bidsError } = useSelector((state) => state.bids);
    const { userInfo } = useSelector((state) => state.auth);

    const [keyword, setKeyword] = useState('');
    const [view, setView] = useState('browse'); // 'browse', 'my-gigs', 'my-bids'

    useEffect(() => {
        if (view === 'browse') {
            dispatch(fetchGigs(keyword));
        } else if (view === 'my-gigs') {
            dispatch(fetchMyGigs());
        } else if (view === 'my-bids') {
            dispatch(fetchMyBids());
        }
    }, [dispatch, keyword, view]);

    const searchHandler = (e) => {
        e.preventDefault();
        if (view === 'browse') {
            dispatch(fetchGigs(keyword));
        }
    };

    const isLoading = gigsLoading || bidsLoading;
    const error = gigsError || bidsError;
    const displayData = view === 'my-bids' ? myBids : gigs;

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">
                        {view === 'browse' ? 'Find Perfect Gigs' : view === 'my-gigs' ? 'My Posted Gigs' : 'My Applications'}
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        {view === 'browse' ? 'Explore opportunities and start working today.' : 'Manage your freelance activities.'}
                    </p>
                </div>

                {/* Search Bar - Only for Browse */}
                {view === 'browse' && (
                    <form onSubmit={searchHandler} className="mt-8 relative max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full py-4 pl-12 pr-4 text-gray-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg text-lg"
                                placeholder="Search for services (e.g., 'Web Development')..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-lg font-bold hover:bg-indigo-700 transition">
                            Search
                        </button>
                    </form>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setView('browse')}
                    className={`pb-2 px-4 font-bold text-lg transition-colors ${view === 'browse' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Browse Gigs
                </button>
                {userInfo?.role === 'client' && (
                    <button
                        onClick={() => setView('my-gigs')}
                        className={`pb-2 px-4 font-bold text-lg transition-colors ${view === 'my-gigs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Posted Gigs
                    </button>
                )}
                {userInfo?.role === 'freelancer' && (
                    <button
                        onClick={() => setView('my-bids')}
                        className={`pb-2 px-4 font-bold text-lg transition-colors ${view === 'my-bids' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Bids
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-40 bg-red-50 rounded-lg border border-red-100 p-6">
                    <div className="text-center">
                        <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-red-600 font-semibold text-lg">{typeof error === 'string' ? error : 'Error loading data'}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {view === 'my-bids' ? (
                        // Bids View
                        displayData.map((bid) => (
                            <div key={bid._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group relative">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${bid.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                bid.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {bid.status}
                                        </span>
                                        <span className="text-sm text-gray-400">{new Date(bid.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                        <Link to={`/gigs/${bid.gigId?._id}`}>{bid.gigId?.title || 'Unknown Gig'}</Link>
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2 italic">"{bid.message}"</p>
                                    <p className="font-bold text-indigo-600">Bid Price: ${bid.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Open Gigs or My Gigs View
                        displayData.map((gig) => (
                            <Link to={`/gigs/${gig._id}`} key={gig._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group transform hover:-translate-y-1">
                                <div className={`h-2 w-full ${view === 'my-gigs' && gig.status !== 'open' ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}></div>
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${gig.status === 'open' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {gig.status}
                                        </span>
                                        <span className="text-gray-400 text-sm font-medium">{new Date(gig.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">{gig.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 relative z-10">{gig.description}</p>

                                    <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <div className="flex items-center text-gray-700 font-bold">
                                            <span className="text-lg mr-1">$</span>
                                            <span className="text-xl">{gig.budget}</span>
                                        </div>
                                        <div className="flex items-center text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                            View Details
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                    {displayData.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-xl font-medium">No {view === 'my-bids' ? 'bids' : 'gigs'} found.</p>
                            <p className="mt-2 text-sm opacity-70">
                                {view === 'browse' ? 'Try adjusting your search.' : view === 'my-gigs' ? 'You haven\'t posted any gigs yet.' : 'You haven\'t applied to any gigs yet.'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
