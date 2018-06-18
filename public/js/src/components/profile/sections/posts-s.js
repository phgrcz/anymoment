import React from 'react'
import Post from '../../post/post'
import { connect } from 'react-redux'
import { FadeIn } from 'animate-components'
import Nothing from '../../others/nothing'
import End from '../../others/end'
import { Me } from '../../../utils/utils'
import Suggested from '../../others/suggested/suggested'
import Recommend from '../../others/recommend/recommend'
import AddToFavourites from '../../others/addToFavourites'
import MutualUsers from '../mutual-users'
import UserHashtags from '../../hashtag/user-hashtags'

@connect(store => (
  {
    posts: store.Post.posts,
    ud: store.User.user_details
  }
))

export default class Posts extends React.Component {

  render() {
    let
      { posts, ud: { id, username }, param } = this.props,
      len = posts.length,
      map_posts = posts.map(p =>
        <Post key={p.post_id} {...p} when='userPosts' />
      )

    return (
      <div>

        <FadeIn duration='300ms' >
          <div className='app_sections pro_app_sections'>

            <div className='app_static_sections'>
              { !Me(id) ? <MutualUsers username={username} /> : null }
              <Suggested when='profile' params={username} />
              <UserHashtags param={param} />
              { !Me(id) ? <Recommend username={username} /> : null }
              { !Me(id) ? <AddToFavourites user={id} username={username} /> : null }

              {
                !Me(id) ?
                  <div className='recomm_teaser'>
                    <span>Inicie uma conversa privada com {username}</span>
                    <a href='#' className='sec_btn af_btn' >Chat</a>
                  </div>
                  : null
              }
            </div>

            <div className='app_personal_sections'>
              {
                len == 0
                  ? <Nothing
                    mssg={Me(id) ? 'Você não tem momentos' : `${username} não tem momentos`}
                  />
                  : <FadeIn duration='500ms'>{ map_posts }</FadeIn>
              }
            </div>

          </div>

          { len != 0 ? <End/> : null }

        </FadeIn>

      </div>
    )
  }
}
