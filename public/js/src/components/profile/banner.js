import React, { Fragment } from 'react'
import { toggle } from '../../utils/utils'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Link, NavLink, Redirect } from 'react-router-dom'
import Copy from 'handy-copy'
import Notify from 'handy-notification'
import { Me, isAdmin } from '../../utils/utils'
import { follow, unfollow, addToFavourites, block } from '../../utils/user-interact-utils'
import Avatars from '../others/avatar/avatars'
import Overlay from '../others/overlay'
import ViewAvatar from '../others/avatar/viewAvatar'
import ToolTip from 'react-tooltip'
import { PORT } from '../../../../../env'
import RecommendUsers from '../others/recommend/recommend-users'
import { toggleFollow } from '../../store/actions/follow_a'
import Prompt from '../others/prompt'
import ToTags from '../hashtag/toTags'
import { post } from 'axios'
import TimeAgo from 'handy-timeago'
import { newConversation } from '../../utils/message-utils'

@connect(store => (
  {
    User: store.User,
    Follow: store.Follow,
    posts: store.Post.posts
  }
))

export default class Banner extends React.Component {

  state = {
    changeAvatar: false,
    viewAvatar: false,
    recommendUser: false,
    blockUser: false,
    messagedUser: false,
  }

  _toggle = (e, what) => {
    e ? e.preventDefault() : null
    this.setState({
      [what]: !this.state[what]
    })
  }

  toggleAvatars = e => {
    e ? e.preventDefault() : null
    this._toggle('changeAvatar')
  }

  toggleOptions = when => {
    let element = document.querySelector(
      when == 'options'
        ? '.pro_banner_options'
        : '.pro_avatar_ch_teaser'
    )
    toggle(element)
  }

  toggleTags = () =>
    $('.pro_tags').slideToggle('fast')

  copyLink = e => {
    e.preventDefault()
    let { username } = this.props.User.user_details
    Copy({
      value: `http://localhost:${PORT}/profile/${username}`,
      done: () => {
        Notify({ value: 'Link copiado' })
        this.toggleOptions('options')
      }
    })
  }

  follow = e => {
    e.preventDefault()
    let { dispatch, User: { user_details: { id, username } } } = this.props
    follow({
      user: id,
      username,
      dispatch,
      update_followers: true,
      done: () => dispatch(toggleFollow(true))
    })
  }

  unfollow = e => {
    e.preventDefault()
    let { dispatch, User: { user_details: { id } } } = this.props
    unfollow({
      user: id,
      dispatch,
      update_followers: true,
      done: () => dispatch(toggleFollow(false))
    })
  }

  showRecommendUsers = e => {
    this._toggle(e, 'recommendUser')
    this.toggleOptions('options')
  }

  addToFavourites = async e => {
    e.preventDefault()
    let { User: { user_details: { id } } } = this.props
    this.toggleOptions('options')
    addToFavourites(id)
  }

  block = async e => {
    e.preventDefault()
    let { User: { user_details } } = this.props
    this.toggleOptions('options')
    block(user_details.id)
    this._toggle(null, 'blockUser')
  }

  removeUser = async e => {
    e.preventDefault()
    let
      o = $('.overlay-2'),
      { id } = this.props.User.user_details

    o.show()
    let { data: { mssg, success } } = await post('/user/remove-user', { user: id })
    o.hide()

    Notify({
      value: mssg,
      done: () => success ? location.href = '/login': null
    })
  }

  messageUser = e => {
    e.preventDefault()
    let {
      User: { user_details: { id, username } },
      dispatch
    } = this.props
    newConversation({
      user: id,
      username,
      dispatch,
      done: () => this._toggle(null, 'messagedUser')
    })
    this.toggleOptions('options')
  }

  render() {
    let
      {
        User: { user_details: { id, username, firstname, surname, bio, isOnline, lastOnline }, tags },
        Follow: { isFollowing, followers, followings, profile_views, favourites, recommendations },
        posts
      } = this.props,
      { changeAvatar, viewAvatar, recommendUser, blockUser, messagedUser } = this.state,
      url = `/profile/${username}`,
      tags_len = tags.length,
      map_tags = tags.map(t => <NavLink to='/' key={t.tag} className='tags'>{t.tag}</NavLink>)

    return (
      <div className='pro_banner'>

        { messagedUser ? <Redirect to='/messages' /> : null }

        <div className='pro_top'>
          <div className='pro_more'>
            <span className='pro_more_horiz' onClick={() => this.toggleOptions('options')} data-tip='Opções' >
              <i className='material-icons'>more_horiz</i>
            </span>
          </div>
          <div className='options pro_banner_options' style={{ display: 'none' }} >
            <ul>
              {
                !Me(id) ?
                  <li>
                    <a href='#' className='pro_block' onClick={e => this._toggle(e, 'blockUser')} >Bloquear</a>
                  </li>
                  : null
              }
              {
                !Me(id) ?
                  <li>
                    <a href='#' className='pro_recommend' onClick={this.showRecommendUsers} >Recomendar</a>
                  </li>
                  : null
              }
              {
                !Me(id) ?
                  <li>
                    <a href='#' className='add_fav' onClick={this.addToFavourites} >Adicionar aos favoritos</a></li>
                  : null
              }
              {
                isFollowing && !Me(id)
                  ? <li><a href='#' onClick={this.messageUser} >Mensagem</a></li>
                  : null
              }

              {
                isAdmin() ?
                  <li>
                    <a href='#' className='rem_user' onClick={this.removeUser} >Remover como admin</a>
                  </li>
                  : null
              }
              <li><a href='#' className='p_copy_link' onClick={this.copyLink} >Copiar link</a></li>
            </ul>
          </div>
          <div className='pro_ff' >
            {
              Me(id)
                ? <Link to='/edit-profile' className='pri_btn ff'>Editar perfil</Link>
                : isFollowing
                  ? <a href='#' className='pri_btn unfollow' onClick={this.unfollow} >Seguindo</a>
                  : <a href='#' className='pri_btn follow' onClick={this.follow} >Seguir</a>
            }
          </div>

        </div>

        <div
          className='pro_avatar'
          onMouseOver={() => this.toggleOptions('avatar')}
          onMouseOut={() => this.toggleOptions('avatar')}
        >
          <img src={ id ? `/users/${id}/avatar.jpg` : '/images/default_avatar.png' } alt='avatar' />
          <div className='pro_avatar_ch_teaser' style={{ display: 'none' }} >
            <span className='view_avatar_span' onClick={() => this._toggle(null, 'viewAvatar')} >Ver</span>
            {
              Me(id) ?
                <span className='change_pro' onClick={() => this._toggle(null, 'changeAvatar')} >Alterar</span>
                : null
            }
          </div>
        </div>

        <div className='pro_info'>
          <div className='pro_username'>
            <Link to={`${url}`} className='username'>{username}</Link>
          </div>
          <div className='pro_name'>
            <span>{firstname} {surname}</span>
          </div>
          <div className='pro_bio'>
            <span><ToTags str={`${bio}`} /></span>
          </div>
        </div>

        <div className='pro_exp_more' onClick={this.toggleTags} >
          <span data-tip='Tags' ><i className='material-icons'>expand_more</i></span>
        </div>

        <div className='pro_tags' >
          {
            tags_len != 0
              ? map_tags
              : `${Me(id) ? 'você' : username} não possui tags`
          }
          {
            tags_len == 0 && Me(id)
              ? <NavLink to='/edit-profile' className='add_tags'>Add</NavLink>
              : null
          }
        </div>

        <hr/>

        {
          !Me(id) && isOnline ?
            <span className='grp_admin user_online'>
              <span className='user_online_circle'></span>
              <span>online</span>
            </span>
            : null
        }

        {
          !Me(id) && !isOnline && lastOnline ?
            <span className='last_online' >Última vez online {TimeAgo(lastOnline)}</span>
            : null
        }

        <div className='pro_bottom'>
          <div className='pro_post stat_disabled'>
            <span className='pro_hg'>{posts.length}</span>
            <span className='pro_nhg'>Momentos</span>
          </div>
          <Link to={`${url}/followers`} className='pro_followers'>
            <span className='pro_hg no_of_followers'>{followers.length}</span>
            <span className='pro_nhg'>Seguidores</span>
          </Link>
          <Link to={`${url}/followings`} className='pro_followings'>
            <span className='pro_hg no_of_followings'>{followings.length}</span>
            <span className='pro_nhg'>Seguindo</span>
          </Link>
          {
            Me(id) ?
              <Link to={`${url}/recommendations`} className='pro_recomm'>
                <span className='pro_hg'>{recommendations.length}</span>
                <span className='pro_nhg'>Recomendações</span>
              </Link>
              : null
          }
          {
            !Me(id) ?
              <Link to={`${url}/favourites`} className='pro_fav'>
                <span className='pro_hg'>{ favourites.length }</span>
                <span className='pro_nhg'>Favoritos</span>
              </Link>
              : null
          }
          <div className='pro_views stat_disabled'>
            <span className='pro_hg'>{ profile_views }</span>
            <span className='pro_nhg'>Visualizações</span>
          </div>
        </div>

        <ToolTip/>

        {
          changeAvatar ?
            <Fragment>
              <Overlay/>
              <Avatars
                back={() => this._toggle(null, 'changeAvatar')}
                of='user'
              />
            </Fragment>
            : null
        }

        {
          viewAvatar ?
            <Fragment>
              <Overlay
                close_on_click={true}
                close={() => this._toggle(null, 'viewAvatar')}
                opacity={0.9}
              />
              <ViewAvatar imgSrc={`/users/${id}/avatar.jpg`} />
            </Fragment>
            : null
        }

        {
          recommendUser ?
            <Fragment>
              <Overlay/>
              <RecommendUsers
                back={() => this._toggle(null, 'recommendUser')}
              />
            </Fragment>
            : null
        }

        {
          blockUser ?
            <Fragment>
              <Overlay/>
              <Prompt
                title={`Bloquear ${username}`}
                content={`Você não poderá interagir com ${username}.`}
                actionText= 'Bloquear'
                action={this.block}
                back={() => this._toggle(null, 'blockUser')}
              />
            </Fragment>
            : null
        }

      </div>

    )
  }
}
