const router = require('express').Router()
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET
})

// Create New Project
router.post('/checkout', async (req, res) => {
    const payment_id = req.body.payment_id;
    let payment = await instance.payments.fetch(payment_id);
    if (payment) {
        let charge = await instance.payments.capture(payment_id, payment.amount, payment.currency)
        if (charge) {
            res.send("Payment Successfull");
        }
    }
})

module.exports = router