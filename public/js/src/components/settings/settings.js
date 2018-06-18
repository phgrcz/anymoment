import React from 'react'
import { FadeIn } from 'animate-components'
import { Switch, Route, Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUnreadNotifications } from '../../store/actions/notification-a'
import { getUnreadMessages } from '../../store/actions/message-a'

import ChangePassword from './sections/change-password'
import ProfileSettings from './sections/profile-settings/profile-settings'
import Deactivate from './sections/deactivate'

@connect(store => (
  { store }
))

export default class Settings extends React.Component {

  componentDidMount = () => {
    let { dispatch } = this.props
    dispatch(getUnreadNotifications())
    dispatch(getUnreadMessages())
  }

  render() {
    let { match: { url } } = this.props

    return (
      <div>

        <FadeIn duration='300ms'>
          <div className='app_sections'>

            <div className='app_static_sections settings_app_static_sections'>
              <div className='settings_nav_div'>
                <ul>
                  <li>
                    <NavLink
                      to={`${url}`} exact
                      activeClassName='settings_nav_active'
                      className='settings_nav'
                    >Configurações</NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`${url}/change-password`}
                      activeClassName='settings_nav_active'
                      className='settings_nav'
                    >Alterar senha</NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`${url}/deactivate`}
                      activeClassName='settings_nav_active'
                      className='settings_nav'
                    >Desativar</NavLink>
                  </li>
                </ul>
              </div>
            </div>

            <div className='app_personal_sections settings_app_personal_sections'>
              <Switch>
                <Route path={`${url}`} exact component={ProfileSettings} />
                <Route path={`${url}/change-password`} component={ChangePassword} />
                <Route path={`${url}/deactivate`} component={Deactivate} />
                <Redirect to='/error' />
              </Switch>
            </div>

          </div>
        </FadeIn>

      </div>
    )
  }
}
