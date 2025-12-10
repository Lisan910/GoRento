const express = require('express');
const { createCar, listCars,getOwnerCars, getCar,  updateCar, deleteCar } = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { permit } = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload'); // <- this is for car images
const { getRelatedCars } = require('../controllers/carController');

const router = express.Router();

router.post('/', protect, permit('owner', 'admin'), upload.array('images', 5), createCar);
router.get('/', listCars);
router.get("/owner", protect, getOwnerCars);
router.get('/:id', getCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.get('/:id/related', getRelatedCars);



module.exports = router;
