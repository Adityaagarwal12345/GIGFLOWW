const express = require('express');
const router = express.Router();
const { addBid, getBidsByGig, hireFreelancer, getMyBids } = require('../controllers/bidController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('freelancer'), addBid);
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getBidsByGig); // Owner only check is inside controller
router.patch('/:bidId/hire', protect, authorize('client'), hireFreelancer); // Explicitly client only

module.exports = router;
