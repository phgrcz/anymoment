import React from 'react'
import { NavLink } from 'react-router-dom'
import { Me, isAdmin } from '../../utils/utils'

export default class GroupNav extends React.Component {
  render() {
    let { url, admin } = this.props

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
              to={`${url}/members`}
              activeClassName='pro_nav_active'
              className="inst_nav">Membros</NavLink>
          </li>
          {
            Me(admin) || isAdmin() ?
              <li>
                <NavLink
                  to={`${url}/edit`}
                  activeClassName='pro_nav_active'
                  className="inst_nav">Editar</NavLink>
              </li>
              : null
          }
          {
            Me(admin) ?
              <li>
                <NavLink
                  to={`${url}/add-members`}
                  activeClassName='pro_nav_active'
                  className="inst_nav">Adicionar membros</NavLink>
              </li>
              : null
          }
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
