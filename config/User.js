const
  db = require('./db'),
  bcrypt = require('bcrypt-nodejs'),
  { deletePost } = require('./Post'),
  { deleteGroup } = require('./Group'),
  { deleteCon } = require('./Message'),
  root = process.cwd(),
  { promisify } = require('util'),
  { rmdir } = require('fs'),
  { DeleteAllOfFolder } = require('handy-image-processor'),
  { intersectionBy } = require('lodash'),
  catchify = require('catchify')

/**
 * @param {String} username
 */

const getId = async username => {
  let s = await db.query('SELECT id FROM users WHERE username=? LIMIT 1', [username])
  return s[0].id
}

/**
 * @param {String} what
 * @param {String} id
 */
const getWhat = async (what, id) => {
  let s = await db.query(`SELECT ${what} FROM users WHERE id=? LIMIT 1`, [id])
  return s[0][what]
}

/**
 * @param {Object} User
 */
const create_user = async user => {
  let hash = bcrypt.hashSync(user.password)
  user.password = hash
  let [e, s] = await catchify(db.query('INSERT INTO users SET ?', user))
  e ? console.log(e) : null
  return s
}

const change_password = async ({ password, id }) => {
  let hash = bcrypt.hashSync(password)
  let [e] = await catchify(db.query('UPDATE users SET password=? WHERE id=?', [ hash, id ]))
  return (e ? false : true)
}

/**
 * @param {String} password
 * @param {String} hash 
 * @returns {Boolean}
 */
const comparePassword = (password, hash) => {
  let comp = bcrypt.compareSync(password, hash)
  return comp
}

/**
 * @param {Number} session
 * @param {Number} user
 */
const isFollowing = async (session, user) => {
  let is = await db.query(
    'SELECT COUNT(follow_id) AS is_following FROM follow_system WHERE follow_by=? AND follow_to=? LIMIT 1', [session, user]
  )
  return db.tf(is[0].is_following)
}

/**
 * @param {Number} fav_by
 * @param {Number} user
 */
const favouriteOrNot = async (fav_by, user) => {
  let s = await db.query(
    'SELECT COUNT(fav_id) AS fav_count FROM favourites WHERE fav_by=? AND user=?',
    [fav_by, user]
  )
  return db.tf(s[0].fav_count)
}

/**
 * @param {Number} block_by
 * @param {Number} user
 */
const isBlocked = async (block_by, user) => {
  let s = await db.query(
    'SELECT COUNT(block_id) AS block_count FROM blocks WHERE block_by=? AND user=?',
    [ block_by, user ]
  )
  return db.tf(s[0].block_count)
}

/**
 * @param {user} user
 * @param {Object} req
 * @param {Object} res
 */
const deactivate = async (user, req, res) => {
  let
    posts = await db.query('SELECT post_id FROM posts WHERE user=?', [ user ]),
    groups = await db.query('SELECT group_id FROM groups WHERE admin=?', [ user ]),
    cons = await db.query('SELECT con_id FROM conversations WHERE user_one=? OR user_two=?', [ user, user ]),
    dltDir = promisify(rmdir),
    QLusers = JSON.parse(req.cookies.users),
    filtered = QLusers.filter(u => u.id != user )

  posts.map(async p => {
    await deletePost({
      post: p.post_id,
      user,
      when: 'user'
    })
  })

  groups.map(async g => {
    await deleteGroup(g.group_id)
  })
  await db.query('DELETE FROM group_members WHERE member=? OR added_by=?', [ user, user ])


  cons.map(async c => {
    await deleteCon(c.con_id)
  })

  await db.query('DELETE FROM tags WHERE user=?', [ user ])
  await db.query('DELETE FROM favourites WHERE fav_by=? OR user=?', [ user, user ])
  await db.query('DELETE FROM follow_system WHERE follow_by=? OR follow_to=?', [ user, user ])
  await db.query('DELETE FROM notifications WHERE notify_by=? OR notify_to=? OR user=?', [ user, user, user ])
  await db.query('DELETE FROM profile_views WHERE view_by=? OR view_to=?', [ user, user ])
  await db.query(
    'DELETE FROM recommendations WHERE recommend_by=? OR recommend_to=? OR recommend_of=?',
    [ user, user, user ]
  )
  await db.query('DELETE FROM hashtags WHERE user=?', [ user ])

  DeleteAllOfFolder(`${root}/public/users/${user}/`)
  await dltDir(`${root}/public/users/${user}`)

  await db.query('DELETE FROM users WHERE id=?', [ user ])

  res.cookie('users', `${JSON.stringify(filtered)}`)
  req.session.reset()
}

/**
 * @param {Number} session 
 * @param {Number} user
 */
const mutualUsers = async (session, user) => {
  let
    myFollowings = await db.query(
      'SELECT follow_system.follow_id, follow_system.follow_to AS user, follow_system.follow_to_username AS username, users.firstname, users.surname FROM follow_system, users WHERE follow_system.follow_by=? AND follow_system.follow_to = users.id',
      [ session ]
    ),
    userFollowers = await db.query(
      'SELECT follow_system.follow_id, follow_system.follow_by AS user, follow_system.follow_by_username AS username, users.firstname, users.surname FROM follow_system, users WHERE follow_system.follow_to=? AND follow_system.follow_by = users.id',
      [ user ]
    ),
    mutuals = intersectionBy(myFollowings, userFollowers, 'user')

  return mutuals
}

/**
 * @param {String} str
 * @param {Number} session
 * @param {Number} post 
 * @param {String} when
 */
const mentionUsers = async (str, session, post, when) => {
  let users = str.match(/[^|\s]?@[\d\w]+/g)

  if (users) {
    for (let h of users) {
      let hash = h.slice(1)
      if (hash.substr(0, 1) !== '@') {
        let [{ userCount }] = await db.query(
          'SELECT COUNT(id) AS userCount FROM users WHERE username=?',
          [ hash ]
        )
        let id = await getId(hash)

        if (userCount == 1 && id != session) {
          await db.query('INSERT INTO notifications SET ?', {
            notify_by: session,
            notify_to: id,
            post_id: post,
            type: when == 'post' ? 'mention_post' : 'mention_comment',
            notify_time: new Date().getTime(),
          })
        }

      }
    }
  }

}

module.exports = {
  getId,
  getWhat,
  create_user,
  change_password,
  comparePassword,
  isFollowing,
  favouriteOrNot,
  isBlocked,
  deactivate,
  mutualUsers,
  mentionUsers
}
