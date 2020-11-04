const Joi = require('@hapi/joi');

module.exports.registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).max(255),
        username : Joi.string().min(6).required(),
        password : Joi.string().min(6).required(),
    })
    return schema.validate(data);
}

module.exports.loginValidation = data => {
    const schema = Joi.object({
        username : Joi.string().min(6).required(),
        password : Joi.string().min(6).required(),
    })
    return schema.validate(data);
}

module.exports.updateValidation = data => {
    const schema = Joi.object({
        name : Joi.string().min(6).max(255),
        username : Joi.string().min(6),
        password : Joi.string().min(6),
    })
    return schema.validate(data);
}