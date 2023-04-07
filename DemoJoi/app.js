const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    phoneNumber: '0356769119',
    gender: "Nam",
    role: 'admin'
  },
  {
    id: 2,
    username: 'thuphuong',
    phoneNumber: '0969691630',
    gender: "Nữ",
    password: 'Phuong9803',
    role: 'admin'
  },
  {
    id: 3,
    username: 'khachuong',
    phoneNumber: '0364339520',
    gender: "Nam",
    password: '12345678',
    role: 'user'
  },
];

const authLogin = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .alphanum()
    .required()
    .messages({
      "string.base": `"username" should be a type of 'text'`,
      "string.empty": `"username" cannot be an empty field`,
      "string.min": `"username" should have a minimum length of {#limit}`,
      "string.max": `"username" should have a maximum length of {#limit}`,
      "any.required": `"username" is a required field`,
    }),

  password: Joi.string()
    .min(3)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.empty': `"password" cannot be an empty field`,
      'string.min': `"password" should have a minimum length of {#limit}`,
      'any.required': `"password" is a required field`
    }),
})


const login = (req, res, next) => {
  var count = 0;
  const { error } = authLogin.validate(req.body);
  if (error) { // kiểm tra lỗi
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  for (let i = 0; i <= users.length - 1; i++) {
    if (
      req.body.username == users[i].username &&
      req.body.password == users[i].password
    ) {
      req.user = users[i];
      next();
    } else {
      count++;
    }
  }


  if (count == users.length) {
    return res.send({
      isSucess: false,
      message: "Tài khoản hoặc mật khẩu không chính xác!"
    })
  }
}

  const isCheckAccessRights = (req, res, next) => {
    const currentAccessRights = req.user;
    if (currentAccessRights.role !== "admin") {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập trang Admin' });
    }
    next();
  };


  app.post('/login', login, isCheckAccessRights, (req, res) => {
    res.redirect('/admin')
  });

  app.get('/admin', (req, res) => {
    res.send('Hello admin');
  });


  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
