const Joi = require('@hapi/joi');

module.exports.createValidation = data => {
    const schema = Joi.object({
        uid: Joi.string().min(6),
        payment_method: Joi.string().min(6).required(),
        product_id: Joi.string().min(6).required(),
        date: Joi.date(),
        
    })
    return schema.validate(data);
}
