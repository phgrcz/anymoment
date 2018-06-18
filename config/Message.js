const
  db = require('./db'),
  { promisify } = require('util'),
  { unlink } = require('fs')

/**
 * @param {Number} con_id
 */
const getLastMssgTime = async con_id => {
  let s = await db.query('SELECT MAX(message_time) AS ti FROM messages WHERE con_id = ?', [con_id])
  return s[0].ti
}

/**
 * @param {Number} con_id
 */
const getLastMssg = async con_id => {
  let [{ last }] = await db.query('SELECT MAX(message_id) AS last FROM messages WHERE con_id = ?', [con_id])
  let l = await db.query('SELECT message, type, mssg_by FROM messages WHERE message_id=?', [ last ])
  return l[0]
}

/**
 * @param {Number} con_id
 */
const deleteCon = async con_id => {
  let
    messages = await db.query('SELECT message, type FROM messages WHERE con_id=?', [ con_id ]),
    deleteMessageFile = promisify(unlink)

  for (let m of messages) {
    if (m.type != 'text') {
      await deleteMessageFile(`${root}/public/messages/${m.message}`)
    }
  }

  await db.query('DELETE FROM messages WHERE con_id=?', [ con_id ])
  await db.query('DELETE FROM conversations WHERE con_id=?', [ con_id ])
}

module.exports = {
  getLastMssgTime,
  getLastMssg,
  deleteCon
}
