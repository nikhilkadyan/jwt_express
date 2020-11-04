const Joi = require('@hapi/joi');

module.exports.createValidation = data => {
    const schema = Joi.object({
        title: Joi.string().min(6).max(255).required(),
        desc: Joi.string().min(6).required(),
        demo: Joi.string().min(6).required(),
        secret: Joi.string().min(6).required(),
        prices: Joi.object({
            INR: Joi.number().required(),
            USD: Joi.number().required()
        }).required()
    })
    return schema.validate(data);
}

module.exports.updateValidation = data => {
    const schema = Joi.object({
        title: Joi.string().min(6).max(255),
        desc: Joi.string().min(6),
        demo: Joi.string().min(6),
        secret: Joi.string().min(6),
        prices: Joi.object({
            INR: Joi.number(),
            USD: Joi.number()
        })
    })
    return schema.validate(data);
}
