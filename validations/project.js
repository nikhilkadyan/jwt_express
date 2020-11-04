const Joi = require('@hapi/joi');

module.exports.createValidation = data => {
    const schema = Joi.object({
        title: Joi.string().min(6).max(255).required(),
        desc: Joi.string().min(6).required(),
        link: Joi.string().min(6).required(),
        source: Joi.string().min(6),
        date: Joi.date(),
    })
    return schema.validate(data);
}

module.exports.updateValidation = data => {
    const schema = Joi.object({
        title: Joi.string().min(6).max(255),
        desc: Joi.string().min(6),
        link: Joi.string().min(6),
        source: Joi.string().min(6),
        date: Joi.date(),
    })
    return schema.validate(data);
}
