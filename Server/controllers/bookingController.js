import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

const parseBookingDates = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate)
    const returned = new Date(returnDate)

    if (isNaN(pickup) || isNaN(returned)) {
        return null
    }

    return { pickup, returned }
}

const checkAvailability = async (carId, pickupDate, returnDate) => {
    const dates = parseBookingDates(pickupDate, returnDate)
    if (!dates) {
        return false
    }

    const { pickup, returned } = dates
    if (pickup > returned) {
        return false
    }

    const bookings = await Booking.find({
        car: carId,
        pickupDate: { $lte: returned },
        returnDate: { $gte: pickup },
    })
    return bookings.length === 0
}

export const checkAvailabilityOfCar = async (req,res) => {
    try{
        const {location, pickupDate, returnDate} = req.body
        const dates = parseBookingDates(pickupDate, returnDate)
        if (!dates) {
            return res.json({ success: false, message: 'Invalid booking dates' })
        }

        const cars = await Car.find({ location, isAvailable: true })

        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
            return { ...car._doc, isAvailable }
        })

        let availableCars = await Promise.all(availableCarsPromises)
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({ success: true, availableCars })

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const createBooking = async (req,res) => {
    try{
      const {_id} = req.user
      const {car, pickupDate, returnDate} = req.body

      if (!car || !pickupDate || !returnDate) {
        return res.json({success: false, message: 'Pickup date, return date and car are required'})
      }

      const dates = parseBookingDates(pickupDate, returnDate)
      if (!dates) {
          return res.json({success: false, message: 'Invalid booking dates'})
      }

      const { pickup, returned } = dates
      if (pickup > returned) {
          return res.json({success: false, message: 'Return date must be after pickup date'})
      }

      const carData = await Car.findById(car)
      if (!carData) {
          return res.json({success: false, message: 'Car not found'})
      }

      const isAvailable = await checkAvailability(car, pickupDate, returnDate)
      if(!isAvailable){
        return res.json({success: false, message: 'Car is not available'})
      }

      const noOfDays = Math.ceil((returned - pickup) / (1000 * 60 * 60 * 24)) || 1
      const price = carData.pricePerDay * noOfDays

      await Booking.create({car, owner: carData.owner, user: _id, pickupDate: pickup, returnDate: returned, price})

      res.json({success: true , message: 'Booking Created'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const getUserBookings = async (req,res) => {
    try{
       const {_id} = req.user;
       const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 })
       res.json({success:true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getOwnerBookings = async (req,res) => {
    try{
      if(req.user.role !== 'owner'){
        return res.json({success: false, message: "Unauthorized"})
      }
    const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1})
      res.json({success: true, bookings})
       
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const changeBookingStatus = async (req,res) => {
    try{
     const {_id} = req.user;
     const {bookingId, status} = req.body

     const booking = await Booking.findById(bookingId)

     if(booking.owner.toString() !== _id.toString()){
        return res.json({success:false, message: "Unauthorized"})
     }
     booking.status = status;
     await booking.save();

     res.json({success: true, message: "Status Updated"})
       
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}