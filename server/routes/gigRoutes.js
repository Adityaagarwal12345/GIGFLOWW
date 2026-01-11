const express = require('express');
const router = express.Router();
const { getGigs, createGig, getGigById, getMyGigs } = require('../controllers/gigController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getGigs).post(protect, authorize('client'), createGig);
router.get('/my-gigs', protect, getMyGigs);
router.route('/:id').get(getGigById);

module.exports = router;
