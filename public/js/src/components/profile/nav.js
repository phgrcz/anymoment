import React from 'react'
import { NavLink } from 'react-router-dom'

export default class Nav extends React.Component {
  render() {
    let { url } = this.props

    return (
      <div className="pro_nav user_nav">
        <ul>
          <li>
            <NavLink
              to={`${url}`}
              exact
              activeClassName='pro_nav_active'
              className="inst_nav">Momentos</NavLink>
          </li>
          <li>
            <NavLink
              to={`${url}/tagged`}
              activeClassName='pro_nav_active'
              className="inst_nav">Menções</NavLink>
          </li>
          <li>
            <NavLink
              to={`${url}/shared`}
              activeClassName='pro_nav_active'
              className="inst_nav">Compartilhados</NavLink>
          </li>
          <li>
            <NavLink
              to={`${url}/bookmarks`}
              activeClassName='pro_nav_active'
              className="inst_nav">Salvos</NavLink>
          </li>
          <li>
            <NavLink
              to={`${url}/groups`}
              activeClassName='pro_nav_active'
              className="inst_nav">Grupos</NavLink>
          </li>
          <li>
            <NavLink
              to={`${url}/about`}
              activeClassName='pro_nav_active'
              className="inst_nav">Sobre</NavLink>
          </li>
        </ul>
      </div>
    )
  }
}
