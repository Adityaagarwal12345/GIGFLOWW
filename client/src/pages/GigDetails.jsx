import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../redux/slices/gigSlice';
import api from '../utils/axiosConfig';

const GigDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentGig, gigsLoading, gigsError } = useSelector((state) => state.gigs);
    const { userInfo } = useSelector((state) => state.auth);

    const [bids, setBids] = useState([]);
    const [bidMessage, setBidMessage] = useState('');
    const [bidPrice, setBidPrice] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    const isOwner = userInfo && currentGig && userInfo._id === currentGig.ownerId._id;

    useEffect(() => {
        dispatch(fetchGigById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (isOwner && currentGig) {
            fetchBids();
        }
    }, [isOwner, currentGig]);

    const fetchBids = async () => {
        try {
            const { data } = await api.get(`/bids/${id}`);
            setBids(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bids', {
                gigId: id,
                message: bidMessage,
                price: Number(bidPrice)
            });
            setStatusMsg('Bid placed successfully!');
            setBidMessage('');
            setBidPrice('');
        } catch (error) {
            setStatusMsg(error.response?.data?.message || 'Error placing bid');
        }
    };

    const handleHire = async (bidId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer?')) return;
        try {
            await api.patch(`/bids/${bidId}/hire`);
            setStatusMsg('Freelancer hired! Refreshing...');
            fetchBids();
            dispatch(fetchGigById(id)); // Refresh gig status
        } catch (error) {
            setStatusMsg(error.response?.data?.message || 'Error hiring');
        }
    };

    if (gigsLoading) return <div className="p-8">Loading...</div>;
    if (gigsError) return <div className="p-8 text-red-600">Error: {gigsError}</div>;
    if (!currentGig) return <div className="p-8">Gig not found.</div>;

    return (
        <div className="container mx-auto max-w-5xl px-6 py-10">
            {/* Gig Header Card */}
            <div className="bg-gray-900 shadow-xl rounded-2xl overflow-hidden mb-8 border border-gray-800">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{currentGig.title}</h1>
                            <p className="text-gray-400 flex items-center">
                                Posted by <span className="font-semibold text-gray-300 ml-1 mr-1">{currentGig.ownerId.name}</span>
                                on {new Date(currentGig.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <span className={`mt-4 md:mt-0 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${currentGig.status === 'open'
                            ? 'bg-green-900/30 text-green-400 border border-green-900'
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}>
                            {currentGig.status}
                        </span>
                    </div>

                    <div className="border-t border-b border-gray-800 py-6 mb-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Project Description</h3>
                        <div className="prose max-w-none text-gray-300 leading-relaxed text-lg">
                            {currentGig.description}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-indigo-900/30 px-6 py-3 rounded-xl border border-indigo-900/50">
                            <span className="text-gray-400 text-sm font-bold uppercase block mb-1">Budget</span>
                            <span className="text-2xl font-bold text-indigo-400">${currentGig.budget.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ERROR / SUCCESS Message */}
            {statusMsg && (
                <div className={`p-4 rounded-xl mb-8 shadow-md border-l-4 ${statusMsg.includes('success') ? 'bg-green-50 border-green-500 text-green-800' : 'bg-blue-50 border-blue-500 text-blue-800'
                    }`}>
                    {statusMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Gig Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{currentGig.title}</h1>
                        <p className="text-gray-400 flex items-center mb-6">
                            Posted by <span className="font-semibold text-gray-300 ml-1 mr-1">{currentGig.ownerId.name}</span>
                            on {new Date(currentGig.createdAt).toLocaleDateString()}
                        </p>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <span className="bg-indigo-900/50 p-2 rounded-lg mr-3">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                            </span>
                            Project Description
                        </h3>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-line">{currentGig.description}</p>
                    </div>

                    {/* Bids Section (Visible to Owner, or if user is freelancer we might show something else? Usually only owner sees all bids) */}
                    {/* Requirement says: Clients can view bids on their own gigs. */}
                    {userInfo && userInfo.role === 'client' && userInfo._id === currentGig.ownerId._id && (
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                Proposals
                                <span className="ml-3 bg-gray-800 text-gray-300 text-sm py-1 px-3 rounded-full">{bids.length}</span>
                            </h3>
                            <div className="space-y-4">
                                {bids.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-900 rounded-2xl border border-dashed border-gray-800">
                                        <p className="text-gray-500">No proposals yet.</p>
                                    </div>
                                ) : (
                                    bids.map((bid) => (
                                        <div key={bid._id} className={`bg-gray-900 rounded-xl p-6 shadow-sm border transition-all ${bid.status === 'hired' ? 'border-green-600 ring-2 ring-green-500/20' : 'border-gray-800 hover:border-indigo-500/50'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg text-white">{bid.freelancerId.name}</h4>
                                                    <p className="text-sm text-gray-400">{bid.freelancerId.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-2xl font-bold text-indigo-400">${bid.price}</span>
                                                    <span className="text-xs text-gray-500">Bid Amount</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                                                <p className="text-gray-300 italic">"{bid.message}"</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${bid.status === 'hired' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                                                    bid.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-900' :
                                                        'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                                    }`}>
                                                    {bid.status}
                                                </span>

                                                {currentGig.status === 'open' && bid.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleHire(bid._id)}
                                                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-95"
                                                    >
                                                        Hire Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Action / Budget */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 sticky top-24">
                        <div className="text-center mb-8">
                            <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Project Budget</span>
                            <div className="text-4xl font-extrabold text-white mt-2">${currentGig.budget}</div>
                        </div>

                        {/* Bid Form - Only for Freelancers */}
                        {userInfo && userInfo.role === 'freelancer' && currentGig.status === 'open' && (
                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="font-bold text-gray-800 mb-4 text-center">Submit a Proposal</h4>
                                <form onSubmit={handleBidSubmit} className="space-y-4">
                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={bidPrice}
                                                onChange={(e) => setBidPrice(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800 focus:bg-gray-700 text-white"
                                                placeholder="Your Price"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <textarea
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 bg-gray-800 focus:bg-gray-700 text-white"
                                            placeholder="Why are you the best fit?"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Send Proposal
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Status Info for non-open gigs */}
                        {currentGig.status !== 'open' && (
                            <div className="bg-gray-800 rounded-xl p-4 text-center">
                                <p className="text-gray-400 font-medium">This gig is currently {currentGig.status}</p>
                            </div>
                        )}

                        {/* Creator Info */}
                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold">
                                    {currentGig.ownerId?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-200">{currentGig.ownerId?.name}</p>
                                    <p className="text-xs text-gray-500">Project Owner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetails;
