const Gig = require('../models/Gig');

// @desc    Fetch all open gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                title: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            }
            : {};

        const gigs = await Gig.find({ ...keyword, status: 'open' }).populate('ownerId', 'name email');
        res.json(gigs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        if (!title || !description || !budget) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id
        });

        res.status(201).json(gig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

        if (gig) {
            res.json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @route   GET /api/gigs/my-gigs
// @access  Private
const getMyGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getGigs,
    createGig,
    getGigById,
    getMyGigs
};
