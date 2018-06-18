require('dotenv').config()

const
  express = require('express'),
  app = express(),
  { env: { PORT, SESSION_SECRET_LETTER } } = process,
  { rainbow } = require('handy-log'),
  favicon = require('serve-favicon'),
  { join } = require('path'),
  hbs = require('express-handlebars'),
  bodyParser = require('body-parser'),
  validator = require('express-validator'),
  session = require('client-sessions'),
  cookieParser = require('cookie-parser')

const
  { variables } = require('./config/middlewares'),
  userR = require('./routes/user-routes'),
  followR = require('./routes/follow-routes'),
  notifyR = require('./routes/notification-routes'),
  editR = require('./routes/edit-routes'),
  postR = require('./routes/post-routes'),
  commentR = require('./routes/comment-routes'),
  shareR = require('./routes/share-routes'),
  likesR = require('./routes/likes-routes'),
  exploreR = require('./routes/explore-routes'),
  groupR = require('./routes/group-routes'),
  avatarR = require('./routes/avatar-routes'),
  messageR = require('./routes/message-routes'),
  settingsR = require('./routes/settings-routes'),
  hashtagR = require('./routes/hashtag-routes'),
  apiR = require('./routes/api-routes'),
  mainR = require('./routes/main-routes')

app.engine('hbs', hbs({
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

app.use(favicon(
  join(__dirname, '/public/images/favicon/favicon.png')
))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(validator())
app.use(express.static(
  join(__dirname, '/public')
))
app.use(session({
  cookieName: 'session',
  secret: SESSION_SECRET_LETTER,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}))
app.use(cookieParser())

app.use(variables)


app.use('/', userR)
app.use('/api', followR)
app.use('/api', notifyR)
app.use('/api', editR)
app.use('/api', postR)
app.use('/api', commentR)
app.use('/api', shareR)
app.use('/api', likesR)
app.use('/api', exploreR)
app.use('/api', groupR)
app.use('/api', avatarR)
app.use('/api', messageR)
app.use('/api', settingsR)
app.use('/api', hashtagR)
app.use('/api', apiR)
app.use('/', mainR)


app.listen(PORT, () =>
  rainbow('...')
)
