import $ from 'jquery'
import { post } from 'axios'
import Notify from 'handy-notification'
import { getUserDetails, getMutualUsers } from '../store/actions/user-a'
import * as follow_action from '../store/actions/follow_a'
import { getUserPosts, getGroupPosts, } from '../store/actions/post-a'
import { getGroupDetails, joinedGroup } from '../store/actions/group-a'
import Compress from 'image-compressor.js'
import { GOOGLE_GEOLOCATION_KEY } from '../../../../env'

/**
 * @param {String} what
 * @param {Number} length
 */
export const shortener = (what, length) => {
  let
    parse = parseInt(length),
    len = what.length
  if (!parse) { return }
  return (len >= parse) ? `${what.substr(0, length - 2)}..` : (len < parse) ? what : null
}

export const uniq = () =>
  Math.random().toString(5).slice(2)

/**
 * @param {Number} value
 * @param {String} text
 */
export const humanReadable = (value, text) => {
  let hr =
    value == 0 ? `Não há ${text}`
      : value == 1 ? `1 ${text}`
        : `${value} ${text}`
  return hr
}

/**
 * @param {HTMLElement} el
 */
export const toggle = el => {
  let style = el.style.display
  style === 'none' ? el.style.display = 'block' : el.style.display = 'none'
}

/**
 * @param {String} str
 */
export const c_first = str =>
  str.charAt(0).toUpperCase() + str.substr(1)

export const llr = () => {
  let
    f = $('.modal_main').children(),
    s = $('.display_content').children().length - 1
  f.eq(s).find('hr').remove()
}

export const viewPassword = ({ input, icon }) => {
  if (input.type == 'password') {
    input.type = 'text'
    icon.html('<i class="fas fa-unlock-alt"></i>')
    icon.css('color', '#e91e63')
  } else {
    input.type = 'password'
    icon.html('<i class="fas fa-lock"></i>')
    icon.css('color', 'darkturquoise')
  }
  input.focus()
}

export const hide_h_options = () => {
  let element = document.querySelector('.sp_options')
  element.style.display = 'none'
}

export const replacer = (elements, filter) => {
  let regex =
    filter == 'normal' ? /[^a-z0-9_.@$#]/i
      : filter == 'bio'
        ? /[<>]/i : null

  for (let el of elements) {
    el.on('keyup', () => {
      let value = el.val()
      el.val(value.replace(regex, ''))
    })
  }
}

export const Me = user =>
  user == $('.data').data('session') ? true : false

export const e_v = () => {
  let ea = $('.data').data('email-verified')
  return ea == 'yes' ? true : false
}

export const isPrivate = (user, isFollowing, accountType) => {
  let sprivate = !Me(user) && !isFollowing && accountType == 'privado' ? true : false
  return sprivate
}

export const isAdmin = () =>
  $('.data').data('isadmin')

/**
 * @param {File} file
 */
export const imageCompressor = file => {
  return new Promise(resolve => {
    new Compress(file, {
      quality: .6,
      success: file => resolve(file),
      error: err => console.log(err.message)
    })
  })
}

export const forProfile = async options => {
  let
    { username, dispatch, invalidUser } = options,
    { data: valid } = await post('/api/is-user-valid', { username }),
    s_username = $('.data').data('username')

  if (!valid) {
    invalidUser()
  } else {

    if (username != s_username) {
      dispatch(follow_action.isFollowing(username))
      dispatch(getMutualUsers(username))
      post('/api/view-profile', { username })
    }

    dispatch(getUserDetails(username))
    dispatch(follow_action.getUserStats(username))
    dispatch(getUserPosts(username))

  }

}

export const forGroup = async options => {
  let
    { grp_id, dispatch, invalidGroup } = options,
    { data: valid } = await post('/api/is-group-valid', { grp_id })

  if (!valid) {
    invalidGroup()
  } else {
    dispatch(joinedGroup(grp_id))
    dispatch(getGroupDetails(grp_id))
    dispatch(getGroupPosts(grp_id))
  }

}

export const profile_scroll = () => {
  $('html, body').animate({
    scrollTop: 380
  }, 'slow')
}

/**
 * @param {Object} options
 * @param {Number} options.to
 * @param {String} options.type
 * @param {Number} options.post_id
 * @param {Number} options.group_id
 * @param {Number} options.user
 */
export const insta_notify = async options => {
  let
    defaults = {
      to: null,
      type: '',
      post_id: 0,
      group_id: 0,
      user: 0
    },
    obj = { ...defaults, ...options },
    { to, type, post_id, group_id, user } = obj

  await post('/api/notify', { to, type, post_id, group_id, user })
}

/**
 * @param {Function} success Success function
 */
export const geolocation = success => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(success, geolocationError)
  } else {
    Notify({ value: 'Localização não suportada' })
  }
}

/**
 */
export const geolocationError = ({ code }) => {
  let mssg =
    code == 1 ? 'Localização não permitida'
      : code == 2 ? 'Localização sem sinal'
        : code == 3 ? 'O tempo de resposta da localização expirou'
          : code == 0 ? 'Erro de localização desconhecido'
            : null

  Notify({ value: mssg })
}

/**
 * @param {Object} pos
 */
export const getAddress = async pos => {
  let
    { latitude, longitude } = pos.coords,
    { data: { results } } = await post(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOLOCATION_KEY}`
    ),
    loc = results[0].formatted_address
  return loc
}

/**
 * @param {String} type
 * @param {String} url
 * @param {Object} data
 */
export const dispatchHelper = (type, url, data={}) =>
  dispatch =>
    post(`/api/${url}`, data)
      .then(p => dispatch({ type, payload: p.data }))
      .catch(e => console.log(e))
