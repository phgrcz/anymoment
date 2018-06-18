import React from 'react'
import { FadeIn } from 'animate-components'
import Title from '../../others/title'
import $ from 'jquery'
import Notify from 'handy-notification'
import { post } from 'axios'

export default class ChangePassword extends React.Component {

  change = async e => {
    e.preventDefault()

    let
      old = $('.c_p_old_text').val(),
      new_ = $('.c_p_new_text').val(),
      new_a = $('.c_p_new_a_text').val(),
      btn = $('.c_p_btn'),
      overlay2 = $('.overlay-2')

    if (!old || !new_ || !new_a) {
      Notify({ value: 'Preencha todos os campos' })
    } else if (new_ != new_a) {
      Notify({ value: 'As senhas não conferem' })
    } else {

      btn
        .addClass('a_disabled')
        .text('Alterando...')
      overlay2.show()

      let {
        data: { mssg, success }
      } = await post('/user/change-password', { old, new_, new_a })

      if (success) {
        Notify({
          value: mssg,
          done: () => location.reload()
        })
      } else {
        Notify({ value: typeof(mssg) == 'object' ? mssg.length > 1 ? mssg[0] : mssg : mssg })

        btn
          .removeClass('a_disabled')
          .text('Alterar')
        overlay2.hide()

      }

    }

  }

  render() {
    return (
      <div>

        <Title value='Alterar senha' />

        <FadeIn duration='300ms'>

          <div className='change_pass'>
            <div className='c_p_header'>
              <span>Alterar senha</span>
            </div>

            <div className='c_p_main'>
              <div className='c_p_old'>
                <span>Senha atual</span>
                <input type='password' placeholder='********' autoFocus spellCheck='false' className='c_p_old_text' />
              </div>
              <div className='c_p_new'>
                <span>Nova senha</span>
                <input type='password' placeholder='********' spellCheck='false' className='c_p_new_text' />
              </div>
              <div className='c_p_new_a'>
                <span>Confirmar nova senha</span>
                <input type='password' placeholder='********' spellCheck='false' className='c_p_new_a_text' />
              </div>
              <a href='#' className='c_p_btn pri_btn' onClick={this.change} >Alterar</a>
            </div>

          </div>

        </FadeIn>

      </div>
    )
  }
}
