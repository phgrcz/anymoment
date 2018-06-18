import React, { Component } from 'react'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import $ from 'jquery'
import { Redirect } from 'react-router-dom'
import { isAdmin } from '../../utils/utils'

export default class IsAdmin extends Component {

  componentDidMount = () =>
    $('.nav_options').hide()

  render() {
    return (
      <div>

        { !isAdmin() ? <Redirect to='/admin-login' /> : null }

        <Title
          value='Acesso administrador'
          desc=''
        />

        <FadeIn duration='300ms'>
          <div className='registered email_verification' >
            <span></span>
          </div>
        </FadeIn>
      </div>
    )
  }
}
