const Car = require('../models/Car');

const createCar = async (req, res, next) => {
  try {
    const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const carData = {
      ...req.body,
      images: imagePaths,
      owner: req.user._id,
    };

    // Save coordinates if provided
    if (req.body.lat && req.body.lng) {
      carData.lat = parseFloat(req.body.lat);
      carData.lng = parseFloat(req.body.lng);
    }

    const car = await Car.create(carData);
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
};

const listCars = async (req, res, next) => {
  try {
    let cars;
    if (req.user && req.user.role === 'owner') {
      cars = await Car.find({ owner: req.user._id }).populate('owner', '_id name email');
    } else {
      cars = await Car.find().populate('owner', '_id name email');
    }
    res.json(cars);
  } catch (err) {
    next(err);
  }
};

const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', '_id name email policies phone');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    next(err);
  }
};

const getOwnerCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load owner's cars" });
  }
};

const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    Object.assign(car, req.body);

    if (req.body.lat && req.body.lng) {
      car.lat = parseFloat(req.body.lat);
      car.lng = parseFloat(req.body.lng);
    }

    await car.save();
    res.json(car);
  } catch (err) {
    next(err);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car removed' });
  } catch (err) {
    next(err);
  }
};

const getRelatedCars = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Only show other cars from the same owner (exclude current car)
    const related = await Car.find({
      owner: car.owner,
      _id: { $ne: car._id }
    }).limit(4);

    res.json(related);
  } catch (err) {
    next(err);
  }
};


module.exports = { createCar, listCars, getCar, getOwnerCars, updateCar, deleteCar, getRelatedCars };
