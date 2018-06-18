/* eslint indent:0 */
import React from 'react'
import TimeAgo from 'handy-timeago'
import { follow, unfollow } from '../../utils/user-interact-utils'
import { Link } from 'react-router-dom'

export default class Notification extends React.Component {

  state = { isFollowing: false }

  componentDidMount = () =>
    this.setState({ isFollowing: this.props.isFollowing })

  componentWillReceiveProps = ({ isFollowing }) =>
    this.setState({ isFollowing })

  follow = e => {
    e.preventDefault()
    let { notify_by, notify_by_username } = this.props
    follow({
      user: notify_by,
      username: notify_by_username,
      done: () => this.setState({ isFollowing: true })
    })
  }

  unfollow = e => {
    e.preventDefault()
    let { notify_by } = this.props
    unfollow({
      user: notify_by,
      done: () => this.setState({ isFollowing: false })
    })
  }

  render() {
    let
      { notify_by, notify_by_username, notify_time, post_id, group_id, type, user_username } = this.props,
      { isFollowing } = this.state,
      follow = <a href='#' className='pri_btn follow' onClick={this.follow} >Seguir</a>,
      unfollow = <a href='#' className='pri_btn unfollow' onClick={this.unfollow} >Seguindo</a>,
      post = <Link to={`/post/${post_id}`} className='pri_btn'>Abrir</Link>,
      profile = <Link to={`/profile/${user_username}`} className='pri_btn' >Ver {user_username}</Link>,
      group = <Link to={`/group/${group_id}`} className='pri_btn' >Ver grupo</Link>,
      con = <Link to='/messages' className='pri_btn' >Ver conversas</Link>

    return (
      <div className='noti follow_noti'>
        <img src={`/users/${notify_by}/avatar.jpg`} alt='' className='noti_avatar' />
        <div className='noti_left'>
          <Link to={`/profile/${notify_by_username}`} className='noti_bold noti_username'>{ notify_by_username }</Link>
          <span>
            {
              type == 'follow' ? ' está seguindo você'
              : type == 'tag' ? ' te mencionou'
              : type == 'like' ? ' curtiu seu momento'
              : type == 'share' ? ' compartilhou um momento com você'
              : type == 'shared_your_post' ? ' compartilhou seu momento'
              : type == 'comment' ? ' comentou em seu momento'
              : type == 'favourites' ? ' te adicionou aos favoritos'
              : type == 'recommend' ? ` te recomendou ${user_username}`
              : type == 'add_grp_member' ? ' te adicionou em um grupo'
              : type == 'invite' ? ' te convidou para um grupo'
              : type == 'change_admin' ? ' te tornou administrador de um grupo'
              : type == 'new_con' ? ' começou uma conversa com você'
              : type == 'mention_post' ? ' te mencionou em um momento'
              : type == 'mention_comment' ? ' te mencionou em um comentário'
              : null
            }
          </span>
          <span className='noti_time'>{ TimeAgo(notify_time) }</span>
        </div>
        <div className='noti_right follow_noti_right'>
          {

            type == 'follow' || type == 'favourites' ? isFollowing ? unfollow : follow


            : type == 'tag' || type == 'like' || type == 'share' || type == 'shared_your_post' || type == 'comment' || type == 'mention_post' || type == 'mention_comment' ? post


            : type == 'recommend' ? profile


            : type == 'add_grp_member' || type == 'invite' || type == 'change_admin' ? group


            : type == 'new_con' ? con


            : null
          }
        </div>
      </div>
    )
  }
}
