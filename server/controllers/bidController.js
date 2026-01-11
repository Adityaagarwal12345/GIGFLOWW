const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private (Any user)
const addBid = async (req, res) => {
    const { gigId, message, price } = req.body;

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
    }
    if (gig.status !== 'open') {
        return res.status(400).json({ message: 'Gig is not open for bidding' });
    }

    // Prevent owner from bidding on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if already bid
    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (existingBid) {
        return res.status(400).json({ message: 'You have already placed a bid' });
    }

    const bid = await Bid.create({
        gigId,
        freelancerId: req.user._id,
        message,
        price
    });

    res.status(201).json(bid);
};

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
const getBidsByGig = async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.json(bids);
};

// @desc    Hire a freelancer
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireFreelancer = async (req, res) => {
    const { bidId } = req.params;

    try {
        // 1. Fetch Bid and Verify Ownership
        const bidToHire = await Bid.findById(bidId).populate('gigId');

        if (!bidToHire) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = bidToHire.gigId;

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to hire for this gig' });
        }

        // 2. Race Condition Check: Ensure Gig is still Open
        const freshGig = await Gig.findById(gig._id);

        if (freshGig.status !== 'open') {
            return res.status(400).json({ message: `Gig is already ${freshGig.status}` });
        }

        // 3. Update Bid Status to Hired
        bidToHire.status = 'hired';
        await bidToHire.save();

        // 4. Update Gig Status to Assigned
        freshGig.status = 'assigned';
        freshGig.freelancerId = bidToHire.freelancerId;
        await freshGig.save();

        // 5. Reject all other bids for this gig
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bidId } },
            { status: 'rejected' }
        );

        // 6. Real-time Notification
        // Note: req.io is set in index.js middleware
        if (req.io) {
            req.io.to(`user_${bidToHire.freelancerId.toString()}`).emit('notification', {
                type: 'hired',
                message: `You have been hired for: ${gig.title}`,
                gigId: gig._id
            });
        }

        res.json({ message: 'Freelancer hired successfully', gigId: gig._id });

    } catch (error) {
        console.error('Hire Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @route   GET /api/bids/my-bids
// @access  Private
const getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
            .populate('gigId', 'title status ownerId')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addBid,
    getBidsByGig,
    hireFreelancer,
    getMyBids
};
