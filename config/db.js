const db = require('./mysql')

/**
 * @param {String} q
 * @param {Object} data
 * @returns {<Promise>} 
 */
const query = (q, data) => {
  return new Promise((resolve, reject) => {
    db.query(q, data, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  })
}

/**
 * @param {String} what
 * @param {String} id
 */
const getWhat = async (what, id) => {
  let s = await query(`SELECT ${what} FROM users WHERE id=? LIMIT 1`, [id])
  return s[0][what]
}

/**
 * @param {String} field
 * @param {Object} req
 */
const c_validator = (field, req) => {
  let i = field.charAt(0).toUpperCase() + field.substr(1)
  req.checkBody(field, `${i} vazio`).notEmpty()
  req.checkBody(field, `${i} deve ter mais que 4 caracteres`).isLength({ min: 4 })
  req.checkBody(field, `${i} deve ter menos que 32 caracteres`).isLength({ max: 32 })
}

/**
 * @param {String} str
 * @param {Number} user
 * @param {Number} post
 */
const toHashtag = async (str, user, post) => {
  let hashtags = str.match(/[^|\s]?#[\d\w]+/g)

  if (hashtags) {
    for (let h of hashtags) {
      let hash = h.slice(1)
      if (hash.substr(0, 1) !== '#') {
        let newHashtag = {
          hashtag: h,
          post_id: post,
          user: user,
          hashtag_time: new Date().getTime()
        }
        await query('INSERT INTO hashtags SET ?', newHashtag)
      }
    }
  }

}

/**
 * @param {Number} value
 */
const tf = value =>
  value == 1 ? true : false

module.exports = {
  getWhat,
  query,
  c_validator,
  toHashtag,
  tf,
}
