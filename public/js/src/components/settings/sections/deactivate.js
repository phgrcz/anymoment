import React, { Fragment } from 'react'
import { FadeIn } from 'animate-components'
import Title from '../../others/title'
import { post } from 'axios'
import $ from 'jquery'
import Prompt from '../../others/prompt'
import Overlay from '../../others/overlay'
import Notify from 'handy-notification'

export default class Deactivate extends React.Component {

  state = {
    password: '',
    showPrompt: false
  }

  showPrompt = e => {
    e.preventDefault()
    this.setState({ showPrompt: true })
  }

  changePassword = e =>
    this.setState({ password: e.target.value })

  deactivate = async e => {
    e.preventDefault()
    let
      { password } = this.state,
      btn = $('.prompt-done'),
      o = $('.overlay-2')

    btn.addClass('a_disabled').text('Desativando...')
    o.show()

    let { data: { mssg, success } } = await post('/user/deactivate-account', { password })

    btn.removeClass('a_disabled').text('Desativada')
    o.hide()

    Notify({
      value: mssg,
      done: () => {
        success ?
          location.href = '/login'
          : this.setState({ showPrompt: false })
      }

    })
  }

  render() {
    let { password, showPrompt } = this.state

    return (
      <div>

        <Title value='Desativar sua conta' />

        <FadeIn duration='300ms'>
          <div className='dlt_acc'>

            <div className='c_p_header'>
              <span>Desativar sua conta</span>
            </div>

            <form className='dlt_acc_form' onSubmit={this.showPrompt} >
              <input
                type='password'
                placeholder='senha'
                autoFocus
                required
                value={password}
                onChange={e => this.changePassword(e)}
              />
              <input type='submit' value='Desativar' disabled={!password} />
            </form>

            <div className='dlt_acc_info'>
              <span className='dlt_acc_bold'>Obs:</span>
              <span>Todas as <span className='dlt_acc_bold'>suas informações serão permanentemente apagadas</span>.</span>
            </div>

          </div>
        </FadeIn>

        {
          showPrompt ?
            <Fragment>
              <Overlay/>
              <Prompt
                title='Desativar sua conta'
                content="Você tem certeza que deseja desativar sua conta? Isso não poderá ser desfeito."
                actionText= 'Desativar'
                action={this.deactivate}
                back={() => this.setState({ showPrompt: false })}
                blurred={true}
              />
            </Fragment>
            : null
        }

      </div>
    )
  }
}
