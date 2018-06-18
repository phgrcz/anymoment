import $ from 'jquery'
import * as fn from '../utils/utils'
import * as User from '../utils/user-system-utils'
import Notify from 'handy-notification'
import axios from 'axios'

$('.nh_logo').on('click', () => location.href = '/welcome' )
$('.h_logo').on('click', () => location.href = '/')


$('.s_p_s').on('click', () => {
  fn.viewPassword({
    input: document.getElementById('s_password'),
    icon: $('.s_p_s')
  })
})

$('.s_p_l').on('click', () => {
  fn.viewPassword({
    input: document.getElementById('l_password'),
    icon: $('.s_p_l')
  })
})

fn.replacer([
  $('.s_username'),
  $('.s_firstname'),
  $('.s_surname'),
], 'normal')

User.username_checker($('.s_username'))

$('form.form_register').submit(e => {
  e.preventDefault()

  let
    username = $('.s_username').val(),
    firstname = $('.s_firstname').val(),
    surname = $('.s_surname').val(),
    email = $('.s_email').val(),
    password = $('.s_password').val()

  if (!username || !firstname || !surname || !email || !password) {
    Notify({ value: 'Preencha as informações' })
  }  else {

    let signupOpt = {
      data: {
        username,
        firstname,
        surname,
        email,
        password,
      },
      when: 'signup',
      btn: $('.s_submit'),
      url: '/user/signup',
      redirect: '/registered',
      defBtnValue: 'Cadastre-se',
    }
    User.commonLogin(signupOpt)

  }

})

$('form.form_login').submit(e => {
  e.preventDefault()

  let
    username = $('.l_username').val(),
    password = $('.l_password').val()

  if (!username || !password) {
    Notify({ value: 'Preencha as informações' })
  } else {

    let loginOpt = {
      data: {
        username: $('.l_username').val(),
        password
      },
      when: 'login',
      btn: $('.l_submit'),
      url: '/user/login',
      redirect: '/',
      defBtnValue: 'Entrar',
    }
    User.commonLogin(loginOpt)

  }

})

$('.q_l_div').on('click', e => {
  let { id, username } = e.currentTarget.dataset
  User.quickLogin({ id, username })
})

$('.q_l_m_cancel').on('click', () => {
  $('.overlay-2-black').hide()
  $('#q_l_password').val('')
  $('.q_l_model').hide()
})

$('.clear_all_ql').on('click', async e => {
  e.preventDefault()
  await axios.post('/api/clear-all-quick-logins')
  Notify({
    value: 'Todos os logins recentes foram limpos',
    done: () => location.reload()
  })
})

$('form.form_fp').submit(async e => {
  e.preventDefault()
  let email = $('.fp_email').val()

  if (!email) {
    Notify({ value: 'Preencha o e-mail' })
  } else {

    let fpOpt = {
      data: { email },
      when: 'forgot_password',
      btn: $('.fp_submit'),
      url: '/user/password-retrieve',
      redirect: '/',
      defBtnValue: 'Recuperar',
    }
    User.commonLogin(fpOpt)

  }

})
