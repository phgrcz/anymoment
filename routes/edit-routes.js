const
  app = require('express').Router(),
  db = require('../config/db'),
  mail = require('../config/mail')

app.post('/what-exists', async (req, res) => {
  let { what, value } = req.body
  let s = await db.query(`SELECT COUNT(${what}) AS count FROM users WHERE ${what}=?`, [ value ])
  res.json(s[0].count)
})

app.post('/edit-profile', async (req, res) => {
  let
    {
      username, firstname, surname, email, bio, twitter, instagram, facebook, github, website, phone, tags
    } = req.body,
    { id } = req.session

  db.c_validator('username', req)
  db.c_validator('firstname', req)
  db.c_validator('surname', req)

  req.checkBody('email', 'Preencha o e-mail').notEmpty()
  req.checkBody('email', 'E-mail inválido').isEmail()

  let errors = await req.getValidationResult()
  if (!errors.isEmpty()){
    let array = []
    errors.array().forEach(e => array.push(e.msg))
    res.json({ mssg: array })
  } else {

    req.session.username = username

    await db.query(
      'UPDATE users SET username=?, firstname=?, surname=?, email=?, bio=?, instagram=?, twitter=?, github=?, facebook=?, website=?, phone=? WHERE id=?',
      [ username, firstname, surname, email, bio, instagram, twitter, github, facebook, website, phone, id ]
    )

    await db.query('UPDATE follow_system SET follow_by_username = ? WHERE follow_by=?', [username, id]),
    await db.query('UPDATE follow_system SET follow_to_username = ? WHERE follow_to=?', [username, id]),

    await db.query('DELETE FROM tags WHERE user=?', [ id ])

    tags.forEach(async t => {
      let insertTag = {
        user: t.user,
        tag: t.tag
      }
      await db.query('INSERT INTO tags SET ?', insertTag)
    })

    res.json({
      mssg: 'Perfil atualizado',
      success: true
    })

  }

})


app.post('/resend_vl', async (req, res) => {
  let
    { id } = req.session,
    [{ username, email }] = await db.query('SELECT username, email FROM users WHERE id=?', [id]),
    url = `http://localhost:${process.env.PORT}/deep/most/topmost/activate/${id}`,
    options = {
      to: email,
      subject: 'Verificar endereço de e-mail do AnyMoment',
      html: `<div style="max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden">
      <div style="margin:0px auto;max-width:640px;background:#ffffff">
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff" align="center" border="0">
      <tbody>
      <tr>
      <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px">
      <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
      <tr>
      <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
      <div style="color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left">
          <h2 style="font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">Olá ${username},</h2>
          <p align="justify">Agradecemos por se registrar no AnyMoment! Antes de começarmos, precisamos confirmar que é você mesmo. Clique abaixo para verificar seu endereço de e-mail:</p>
          </div>
          </td></tr>

          <center>
          <a href='${url}' style='font-weight: 400;
          color: #fff;
          border-radius: 3px;
          cursor: pointer;
          outline: none;
          background: #00BBB0;
          padding: 6px 17px; display: inline-block; text-decoration: none;'>Verificar e-mail</a></center>
          
          <tr><td style="word-break:break-word;font-size:0px;padding:30px 0px"><p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p></td></tr><tr><td style="word-break:break-word;font-size:0px;padding:0px" align="left"><div style="color:#747f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:13px;line-height:16px;text-align:left">
          </div></td></tr></tbody></table></div></td></tr></tbody></table></div></div>`
    }


    

  try {
    await mail(options)
    res.json({ mssg: 'Link de verificação enviado para seu e-mail!' })
  } catch (error) {
    res.json({ mssg: 'O e-mail não pode ser enviado' })
  }

})

app.post('/change-account-type', async (req, res) => {
  let
    { type } = req.body,
    { id } = req.session
  await db.query('UPDATE users SET account_type=? WHERE id=?', [ type, id ])
  res.json('anymoment')
})

module.exports = app
