import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Notify from 'handy-notification'
import { insta_notify } from '../../../utils/utils'
import $ from 'jquery'
import { post } from 'axios'
import Overlay from '../../others/overlay'
import Prompt from '../../others/prompt'

export default class ChangeAdminList extends React.Component {

  state = {
    change: false
  }

  toggleChange = e => {
    e.preventDefault()
    this.setState({ change: true })
  }

  transfer = async e => {
    e.preventDefault()
    $('.invite_btn').blur()
    let { member, username, group } = this.props
    await post('/api/change-admin', { user: member, group })
    insta_notify({
      to: member,
      type: 'change_admin',
      group_id: group
    })
    Notify({
      value: `${username} agora é um administrador do grupo`,
      done: () => location.reload()
    })
  }

  render() {
    let
      { member, username, firstname, surname } = this.props,
      { change } = this.state

    return (
      <div>

        <div className='modal_items'>
          <div className='modal_it_img'>
            <img src={`/users/${member}/avatar.jpg`} />
          </div>
          <div className='modal_it_content '>
            <div className='modal_it_info'>
              <Link to={`/profile/${username}`} className='modal_it_username' >{username}</Link>
              <span className='modal_it_light' >{`${firstname} ${surname}`}</span>
            </div>
            <div className='modal_ff'>
              <a href='#' className='t_admin_btn pri_btn' onClick={this.toggleChange} >Alterar</a>
            </div>
          </div>
          <hr/>
        </div>

        {
          change ?
            <Fragment>
              <Overlay/>
              <Prompt
                title='Alterar administrador'
                content={`${username} será o administrador deste grupo`}
                actionText= 'Alterar'
                action={this.transfer}
                back={() => this.setState({ change: false })}
                blurred={true}
              />
            </Fragment>
            : null
        }

      </div>
    )
  }
}
