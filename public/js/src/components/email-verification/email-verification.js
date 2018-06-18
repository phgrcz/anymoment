import React from 'react'
import Title from '../others/title'
import { FadeIn } from 'animate-components'

export default class EmailVerification extends React.Component {
  render() {

    let
      { params: { is } } = this.props.match,
      mssg =
      is == 'yes' ? 'E-mail verificado com sucesso!'
      : is == 'alr' ? 'E-mail já verificado!'
      : 'Ops, ocorreu um erro...'


    return (
      <div>
        <Title value='Verificação de e-mail' />
        <FadeIn duration='300ms'>
          <div className='registered email_verification' >
            <span>{ mssg }</span>
          </div>
        </FadeIn>
      </div>
    )
  }
}
