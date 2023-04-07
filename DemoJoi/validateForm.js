const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

   // email: Joi.string()
       // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'password');


const result = schema.validate({ 
    username: 'thuphuong',
    password: "090803"});


console.log(result);

schema.validate({});


// Also -

