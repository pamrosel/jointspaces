// Call express-async-handler to wrap async/await try/catch functionality 
const asyncHandler = require('express-async-handler')
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private

const getBookings = asyncHandler (async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id })

    res.status(200).json(bookings)
})

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private

const createBooking = asyncHandler (async (req, res) => {
    if(!req.body.spacename) {
        res.status(400).json
        throw new Error('Please add a space name')
    }
    if(!req.body.bookingstart) {
        res.status(400).json
        throw new Error('Please add a booking start time')
    }
    if(!req.body.bookingend) {
        res.status(400).json
        throw new Error('Please add a booking end time')
    }

    const booking = await Booking.create({
        spacename: req.body.spacename,
        bookingstart: req.body.bookingstart,
        bookingend: req.body.bookingend,
        user: req.user.id
    })
    res.status(200).json(booking)
})

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private

const updateBooking = asyncHandler (async (req, res) => {
    const booking = await Booking.findById(req.params.id)

    if(!booking) {
        res.status(400)
        throw new Error ('Booking not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the space user 
    if(booking.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, })

    res.status(200).json(updatedBooking)
})

// @desc    Delete space
// @route   DELETE /api/bookings/:id
// @access  Private

const deleteBooking = asyncHandler (async (req, res) => {
    const booking = await Booking.findById(req.params.id)

    if(!booking) {
        res.status(400)
        throw new Error ('Booking not found')
    }

    const user = await User.findById(req.user.id)

    // Check for user
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the booking user 
    if(booking.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await Booking.remove()

    res.status(200).json({ id: req.params.id })
})



module.exports = {
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking,
}