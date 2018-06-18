import React from 'react'
import { FadeIn } from 'animate-components'
import Nothing from '../../others/nothing'
import End from '../../others/end'
import Spinner from '../../others/spinner'
import { connect } from 'react-redux'
import { getTaggedPosts } from '../../../store/actions/post-a'
import Post from '../../post/post'
import { Me, profile_scroll } from '../../../utils/utils'
import Title from '../../others/title'
import Suggested from '../../others/suggested/suggested'

@connect(store => (
  {
    ud: store.User.user_details,
    tagged: store.Post.tagged
  }
))

export default class Tagged extends React.Component {

  state = {
    loading: true
  }

  componentDidMount = () => {
    profile_scroll()
    let { ud: { id }, dispatch } = this.props
    dispatch(getTaggedPosts(id))
  }

  componentWillReceiveProps = ({ dispatch, ud, ud: { id } }) => {
    this.props.ud != ud ? dispatch(getTaggedPosts(id)) : null
    this.setState({ loading: false })
  }

  render() {
    let
      { loading } = this.state,
      { tagged, param: username, ud: { id } } = this.props,
      len = tagged.length,
      map_posts = tagged.map(p =>
        <Post key={p.post_id} {...p} when='tagged' />
      )

    return (
      <div>
        <FadeIn duration='300ms' >

          { loading ? <Spinner/> : null }

          <Title value={`Menções de ${username}`} />

          <div className={`app_sections pro_app_sections ${loading ? 'cLoading' : ''}`} >

            <div className='app_static_sections'>
              <Suggested when='profile' />
            </div>

            <div className='app_personal_sections'>
              {
                len == 0
                  ? <Nothing
                    mssg={Me(id) ? 'Você não foi marcado em nenhum momento' : `${username} não foi marcado em nenhum momento`}
                  />
                  : <FadeIn duration='500ms'>{ map_posts }</FadeIn>
              }
            </div>

          </div>

          { len != 0 && !loading ? <End/> : null }

        </FadeIn>
      </div>
    )
  }
}
