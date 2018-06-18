require('dotenv').config()

const User = require('./config/User')

User.getId('ph')
  .then(s => console.log(s))
  .catch(e => console.log(e))
