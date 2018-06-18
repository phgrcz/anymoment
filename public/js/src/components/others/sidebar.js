import React from 'react'
import { toggle, isAdmin } from '../../utils/utils'
import { NavLink } from 'react-router-dom'
import $ from 'jquery'
import { post } from 'axios'
import Notify from 'handy-notification'
import PropTypes from 'prop-types'

export default class SideBar extends React.Component {

  toggle = e => {
    e.preventDefault()
    let ele = document.querySelector('.nav_options')
    toggle(ele)
  }

  adminLogout = async e => {
    e.preventDefault()
    await post('/api/admin-logout')
    Notify({
      value: 'see ya!',
      done: () => location.reload()
    })
  }

  render() {
    let
      username = $('.data').data('username'),
      { un, uc } = this.props,
      { pathname } = location

    return (
      <div className='m_n_wrapper'>
        <div className='m_n'>
          <ul className='m_n_ul'>
            <li className='m_n_li'>
              <NavLink to={`/profile/${username}`} exact activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>@{username}</span>
                <span className='mm_nm_n_n_new'></span>
              </NavLink>
            </li>
            <li className='m_n_li'>
              <NavLink to='/' exact activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>FeedMoment</span>
                <span className='m_n_new'></span>
              </NavLink>
            </li>
            <li className='m_n_li'>
              <NavLink to='/explore' activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>Explorar</span>
                <span className='m_n_new'></span>
              </NavLink>
            </li>
            <li className='m_n_li'>
              <NavLink to='/messages' activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>Chat</span>
                {
                  uc
                    ? <span className='m_n_new'>{ uc > 9 ? '+' : uc }</span>
                    : null
                }
              </NavLink>
            </li>
            <li className='m_n_li'>
              <NavLink to={`/profile/${username}/gallery`} exact activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>MyMoments</span>
                <span className='m_n_new'></span>
              </NavLink>
            </li>
            <li className='m_n_li'>
              <NavLink to={`/profile/${username}/favourites`} activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>Favoritos</span>
                <span className='m_n_new'></span>
              </NavLink>
            </li>
            <li className='m_n_li'>
              <NavLink to={`/profile/${username}/groups`} activeClassName='sidebar_active' className='m_n_a' >
                <span className='m_n_text'>Grupos</span>
                <span className='m_n_new'></span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

    )
  }
}

SideBar.propTypes = {
  un: PropTypes.number.isRequired,
  uc: PropTypes.number.isRequired
}