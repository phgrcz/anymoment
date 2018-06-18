const
  app = require('express').Router(),
  mw = require('../config/middlewares')

app.get('/404', mw.LoggedIn, (req, res) => {
  let options = { title: 'Ops, ocorreu um erro!' }
  res.render('404', { options })
})

app.get('/help', (req, res) => {
  let options = { title: 'Help' }
  res.render('help', { options })
})


app.get('*', mw.LoggedIn, (req, res) => {
  let options = { title: 'Redirecionando.. ' }
  res.render('app', { options })
})

module.exports = app
