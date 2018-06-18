const
  nodemailer = require('nodemailer'),
  { MAIL, MAIL_PASSWORD } = process.env

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL,
    pass: MAIL_PASSWORD
  }
})

/**
 * @param {Object} options
 * @param {String} options.to
 * @param {String} options.subject
 * @param {String} options.html
 * @returns {<Promise>} 
 */
let mail = options => {
  return new Promise((resolve, reject) => {
    let o = {
      from: `AnyMoment <${MAIL}>`,
      ...options
    }
    transporter.sendMail(o, err =>
      err ? reject(err) : resolve('E-mail enviado')
    )
  })
}

module.exports = mail