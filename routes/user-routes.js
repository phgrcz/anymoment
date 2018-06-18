const
  app = require('express').Router(),
  db = require('../config/db'),
  dir = process.cwd(),
  mail = require('../config/mail'),
  User = require('../config/User'),
  fs = require('fs'),
  { promisify } = require('util'),
  { success } = require('handy-log'),
  mw = require('../config/middlewares'),
  { uniqBy } = require('lodash')


app.get('/login', mw.NotLoggedIn, (req, res) => {
  let options = {
    title: 'Entrar',
    users: req.cookies.users
      ? JSON.parse(req.cookies.users).slice(0, 15)
      : []
  }
  res.render('login', { options })
})

app.get('/signup', mw.NotLoggedIn, (req, res) => {
  let options = { title: 'Cadastre-se' }
  res.render('signup', { options })
})

app.post('/user/username-checker', async (req, res) => {
  let [{ count }] = await db.query(
    'SELECT COUNT(username) AS count FROM users WHERE username=?',
    [ req.body.value ]
  )
  res.json(count)
})


app.post('/user/signup', async (req, res) => {
  let {
    body: { username, firstname, surname, email, password },
    session
  } = req

  db.c_validator('username', req)

  req.checkBody('email', 'Preencha o e-mail').notEmpty()
  req.checkBody('email', 'E-mail inválido').isEmail()
  req.checkBody('password', 'Preencha a senha').notEmpty()

  let errors = await req.getValidationResult()
  if (!errors.isEmpty()){
    let array = []
    errors.array().forEach(e => array.push(e.msg))
    res.json({ mssg: array })
  } else {

    let
      [{ usernameCount }] = await db.query(
        'SELECT COUNT(username) as usernameCount from users WHERE username=?',
        [ username ]
      ),
      [{ emailCount }] = await db.query('SELECT COUNT(email) as emailCount from users WHERE email=?', [ email ])

    if (usernameCount == 1) {
      res.json({ mssg: '@usuario já existe' })
    } else if (emailCount == 1) {
      res.json({ mssg: 'E-mail já existe' })
    } else {

      let
        newUser = {
          username,
          firstname,
          surname,
          email,
          password,
          joined: new Date().getTime(),
          email_verified: 'no',
          isOnline: 'yes'
        },
        { insertId, affectedRows } = await User.create_user(newUser),
        mkdir = promisify(fs.mkdir)

      if (affectedRows == 1){

        await mkdir(`${dir}/public/users/${insertId}`)
        fs
          .createReadStream(`${dir}/public/images/default_avatar.png`)
          .pipe(fs.createWriteStream(`${dir}/public/users/${insertId}/avatar.jpg`))

        let
          url = `http://localhost:${process.env.PORT}/deep/most/topmost/activate/${insertId}`,
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

        session.id = insertId
        session.username = username
        session.email_verified = 'no'

        try {
          let m = await mail(options)
          success(m)

          res.json({
            mssg: `Olá, ${username}!`,
            success: true
          })
        } catch (error) {
          res.json({
            mssg: `Olá, ${username}. O e-mail não pode ser enviado`,
            success: true
          })
        }

      } else {
        res.json({ mssg: 'Ocorreu um erro ao criar a sua conta' })
      }

    }

  }

})


app.post('/user/login', async (req, res) => {
  let {
    body: { username: rusername, password: rpassword },
    session
  } = req

  req.checkBody('username', 'Digite o nome').notEmpty()
  req.checkBody('password', 'Digite a senha').notEmpty()

  let errors = await req.getValidationResult()
  if (!errors.isEmpty()) {
    let array = []
    errors.array().forEach(e => array.push(e.msg))
    res.json({ mssg: array })
  } else {

    let [{
      userCount, id, password, email_verified
    }] = await db.query(
      'SELECT COUNT(id) as userCount, id, password, email_verified from users WHERE username=? LIMIT 1',
      [ rusername ]
    )

    if (userCount == 0){
      res.json({ mssg: 'Usuário não encontrado' })
    } else {
      let same = User.comparePassword(rpassword, password)
      if (!same) {
        res.json({ mssg: 'Senha incorreta' })
      } else {

        session.id = id
        session.username = rusername
        session.email_verified = email_verified
        session.isadmin = false

        await db.query('UPDATE users SET isOnline=? WHERE id=?', [ 'yes', id ])

        res.json({
          mssg: `Bem vindo, ${rusername}!`,
          success: true
        })

      }
    }

  }
})


app.get('/logout', mw.LoggedIn, async (req, res) => {
  let
    { id, username } = req.session,
    user = { id, username },
    oldUsers = req.cookies.users ? JSON.parse(req.cookies.users) : [],
    users = []

  oldUsers.map(o => users.push(o) )
  let final = uniqBy([ user, ...users ], 'id')
  res.cookie('users', `${JSON.stringify(final)}`)

  let u = {
    isOnline: 'no',
    lastOnline: new Date().getTime()
  }
  await db.query('UPDATE users SET ? WHERE id=?', [ u, id ])

  let url = req.session.reset() ? '/login' : '/'
  res.redirect(url)
})


app.get('/forgot-password', mw.NotLoggedIn, (req, res) => {
  let options = { title: 'Esqueci a senha' }
  res.render('forgotPassword', { options })
})

app.post('/user/password-retrieve', async (req, res) => {
  let
    { email } = req.body,
    [{ emailExists, id, username, email_verified }]  = await db.query(
      'SELECT COUNT(email) AS emailExists, id, username, email_verified FROM users WHERE email=?',
      [ email ]
    )

  req.checkBody('email', 'E-mail vazio').notEmpty()
  req.checkBody('email', 'E-mail invalido').isEmail()

  let errors = await req.getValidationResult()
  if (!errors.isEmpty()) {
    let array = []
    errors.array().forEach(e => array.push(e.msg))
    res.json({ mssg: array })
  } else {

    if (emailExists == 0) {
      res.json({ mssg: 'Usuário não existe' })
    } else {

      req.session.id = id
      req.session.username = username
      req.session.email_verified = email_verified

      res.json({
        mssg: 'Usuário encontrado',
        success: true
      })

    }

  }

})

app.get('/registered', mw.LoggedIn, async (req, res) => {
  let
    { id } = req.session,
    [{ email_verified }] = await db.query('SELECT email_verified FROM users WHERE id=? LIMIT 1', [ id ]),
    options = {
      title: 'Registrado',
      mssg: 'E-mail enviado. Confira sua caixa de entrada.'
    }

  email_verified == 'yes'
    ? res.redirect('/')
    : res.render('registered', { options })

})


app.get('/deep/most/topmost/activate/:id', async (req, res) => {
  let
    { params: { id }, session } = req,
    { changedRows } = await db.query('UPDATE users SET email_verified=? WHERE id=?', ['yes', id]),
    mssg

  session.email_verified = 'yes'
  mssg = changedRows == 0 ? 'alr' : 'yes'

  res.redirect(`/email-verification/${mssg}`)

})

app.post('/user/change-password', async (req, res) => {
  let
    { old, new_, new_a } = req.body,
    { id } = req.session,
    user_pass = await User.getWhat('password', id)

  req.checkBody('old', 'Preencha a senha antiga').notEmpty()
  req.checkBody('new_', 'Preencha a nova senha').notEmpty()
  req.checkBody('new_a', 'Preencha a confirmação da nova senha').notEmpty()

  let errors = await req.getValidationResult()
  if (!errors.isEmpty()) {
    let array = []
    errors.array().forEach(e => array.push(e.msg))
    res.json({ mssg: array })
  } else {
    let same = await User.comparePassword(old, user_pass)

    if (!same) {
      res.json({ mssg: 'Senha incorreta' })
    } else if (new_ != new_a) {
      res.json({ mssg: 'As senhas não conferem' })
    } else {
      let done = await User.change_password({ id, password: new_ })

      if (done) {
        res.json({
          mssg: 'Senha alterada',
          success: true
        })
      } else {
        res.json({ mssg: 'Erro ao alterar a senha' })
      }

    }

  }

})


app.post('/user/deactivate-account', async (req, res) => {
  let
    { id } = req.session,
    userPassword = await User.getWhat('password', id),
    { password } = req.body,
    samePassword = await User.comparePassword(password, userPassword)

  req.checkBody('password', 'Preencha a senha').notEmpty()

  let errors = await req.getValidationResult()
  if (!errors.isEmpty()) {
    let array = []
    errors.array().forEach(e => array.push(e.msg))
    res.json({ mssg: array })
  } else if (!samePassword) {
    res.json({ mssg: 'Senha incorreta' })
  } else {

    await User.deactivate(id, req, res)

    res.json({
      mssg: 'Conta desativada com sucesso',
      success: true
    })

  }

})


app.post('/user/remove-user', async (req, res) => {
  let
    { user } = req.body,
    username = await User.getWhat('username', user)

  await User.deactivate(user, req, res)
  res.json({
    mssg: `${username} removido`,
    success: true
  })
})

app.post('/api/remove-quick-login', (req, res) => {
  let
    users = JSON.parse(req.cookies.users),
    filtered = users.filter(u => u.id != req.body.id )

  res.cookie('users', `${JSON.stringify(filtered)}`)
  res.json('anymoment')
})

app.post('/api/clear-all-quick-logins', (req, res) => {
  res.clearCookie('users')
  res.json('anymoment')
})

app.post('/api/check-is-admin', async (req, res) => {
  let
    { password } = req.body,
    { ADMIN_PASSWORD } = process.env

  if (password != ADMIN_PASSWORD) {
    res.json({ mssg: 'Senha incorreta' })
  } else {
    req.session.isadmin = true
    res.json({
      mssg: 'Olá admin!',
      success: true
    })
  }

})


app.post('/api/admin-logout', async (req, res) => {
  req.session.isadmin = false
  res.json('anymoment')
})

module.exports = app
