import React from 'react'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import { connect } from 'react-redux'
import { getPost } from '../../store/actions/post-a'
import Post from './post'
import End from '../others/end'
import Loading from '../others/loading'
import { getUnreadNotifications } from '../../store/actions/notification-a'
import { getUnreadMessages } from '../../store/actions/message-a'
import Suggested from '../others/suggested/suggested'
import CreateGroup from '../group/create-group/create-group'

@connect(store => (
  { post: store.Post.viewPost }
))

export default class ViewPost extends React.Component {

  state = {
    loading: true
  }

  componentDidMount = () => {
    let { match: { params: { post_id } }, dispatch } = this.props
    dispatch(getUnreadNotifications())
    dispatch(getUnreadMessages())
    post_id ? dispatch(getPost(post_id)) : null
  }

  componentWillReceiveProps = ({ post: { post_id }, history }) => {
    !post_id
      ? history.push('/error/post_nf')
      : this.setState({ loading: false })
  }

  render() {
    let
      { loading } = this.state,
      { post } = this.props

    return (
      <div>
        <Title value='Ver momento' />

        <FadeIn duration='300ms'>

          { loading ? <Loading/> : null }

          <div className={`app_sections view_app_sections ${loading ? 'cLoading' : ''}`}>

            <div className='app_personal_sections'>
              <Post key={post.post_id} {...post} when='viewPost' />
              <End/>
            </div>

            <div className='app_static_sections'>
              <Suggested />
              <CreateGroup/>
            </div>

          </div>
        </FadeIn>

      </div>
    )
  }
}
