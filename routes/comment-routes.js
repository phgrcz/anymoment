const
  app = require('express').Router(),
  db = require('../config/db'),
  User = require('../config/User'),
  root = process.cwd(),
  upload = require('multer')({
    dest: `${root}/public/temp/`
  }),
  { ProcessImage, DeleteAllOfFolder } = require('handy-image-processor'),
  { unlinkSync, createReadStream, createWriteStream } = require('fs')

app.post('/comment-text', async (req, res) => {
  let
    { post, text } = req.body,
    { id } = req.session,
    comment = {
      type: 'text',
      text,
      comment_by: id,
      post_id: post,
      comment_time: new Date().getTime()
    },
    { insertId } = await db.query('INSERT INTO comments SET ?', comment)
  await User.mentionUsers(text, id, post, 'comment')

  res.json({ comment_id: insertId })
})

app.post('/comment-image', upload.single('commentImage'), async (req, res) => {
  let
    { id } = req.session,
    { post } = req.body,
    filename = `anymoment_${new Date().getTime()}.jpg`,
    obj = {
      srcFile: req.file.path,
      destFile: `${root}/public/comments/${filename}`
    },
    insert = {
      type: 'image',
      commentSrc: filename,
      comment_by: id,
      post_id: post,
      comment_time: new Date().getTime()
    }

  await ProcessImage(obj)
  DeleteAllOfFolder(`${root}/public/temp/`)

  let { insertId } = await db.query('INSERT INTO comments SET ?', insert)

  res.json({
    comment_id: insertId,
    filename
  })
})


app.post('/comment-sticker', async (req, res) => {
  let
    { sticker, post } = req.body,
    { id } = req.session,
    filename = `anymoment_${new Date().getTime()}.jpg`,
    comment = {
      type: 'sticker',
      commentSrc: filename,
      comment_by: id,
      post_id: post,
      comment_time: new Date().getTime()
    }

  await createReadStream(`${root}/public/images/stickers/${sticker}`)
    .pipe(createWriteStream(`${root}/public/comments/${filename}`))

  let { insertId } = await db.query('INSERT INTO comments SET ?', comment)

  res.json({
    comment_id: insertId,
    filename
  })
})

app.post('/delete-comment', async (req, res) => {
  let { comment_id, type, commentSrc } = req.body
  await db.query('DELETE FROM comments WHERE comment_id=?', [ comment_id ])

  if (type == 'image' || type == 'sticker') {
    unlinkSync(`${root}/public/comments/${commentSrc}`)
  }

  res.json('H')
})

app.post('/edit-comment', async (req, res) => {
  let { comment_id, comment } = req.body
  await db.query('UPDATE comments SET text=? WHERE comment_id=?', [ comment, comment_id ])
  res.json('anymoment')
})

module.exports = app
