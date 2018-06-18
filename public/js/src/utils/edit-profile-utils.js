import $ from 'jquery'
import { post } from 'axios'
import Notify from 'handy-notification'
import { addTag } from '../store/actions/user-a'
import { imageCompressor } from './utils'

/**
 * @param {Object} options
 * @param {String} options.value
 * @param {Number} options.user
 * @param {Function} options.dispatch
 */
export const addUserTags = options => {
  let { value, user, dispatch } = options
  if (value) {
    dispatch(addTag({
      user,
      tag: value
    }))
  } else {
    Notify({ value: 'Digite uma tag' })
  }
}

/**
 * @param {Object} options
 * @param {String} options.susername
 * @param {String} options.semail
 * @param {Object} options.values
 * @param {String} options.values.username
 * @param {String} options.values.email
 */
export const editProfile = async options => {
  let
    { susername, semail, values, values: { username, email } } = options,
    button = $('.edit_done'),
    { data: uCount} = await post('/api/what-exists', { what: 'username', value: username }),
    { data: eCount } = await post('/api/what-exists', { what: 'email', value: email })

  button
    .addClass('a_disabled')
    .text('Editando..')
    .blur()

  if(!username){
    Notify({ value: 'Preencha o usuário' })
  } else if(!email){
    Notify({ value: 'Preencha o e-mail' })
  } else if(uCount == 1 && username != susername){
    Notify({ value: 'Este usuário já existe' })
  } else if(eCount == 1 && email != semail){
    Notify({ value: 'Este e-mail já existe' })
  } else {

    let { data: { mssg, success } } = await post('/api/edit-profile', values)

    Notify({
      value:  typeof(mssg) == 'object' ? mssg.length > 1 ? mssg[0] : mssg : mssg,
      done: () => success ? location.reload() : null
    })

  }

  button
    .removeClass('a_disabled')
    .text('Editado')
    .blur()

}

export const resend_vl = async () => {
  let
    vl = $('.resend_vl'),
    o = $('.overlay-2')

  vl
    .addClass('sec_btn_disabled')
    .text('Enviando e-mail de verificação..')

  o.show()
  let { data: { mssg } } = await post('/api/resend_vl')

  Notify({ value: mssg })
  vl
    .text('Reenviar e-mail de verificação')
    .removeClass('sec_btn_disabled')
    .blur()
  o.hide()
}

/**
 * @param {Object} options
 * @param {File} options.file
 * @param {String} options.of
 * @param {Number} options.group
 */
export const upload_avatar = async options => {
  let
    { file: userFile, of, group } = options,
    form = new FormData(),
    file = await imageCompressor(userFile)

  if (file.size > 6000000) {
    Notify({ value: 'A imagem deve ser menor que 4MB!' })
  } else {
    $('.overlay-2').show()
    $('.c_a_add')
      .text('Alterando avatar..')
      .addClass('a_disabled')

    form.append('avatar', file)
    form.append('of', of)
    form.append('group', group)

    let { data: { mssg } } = await post('/api/upload-avatar', form)

    Notify({
      value: mssg,
      done: () => location.reload()
    })
  }

}
