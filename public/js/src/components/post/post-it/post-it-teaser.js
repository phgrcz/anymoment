import React from 'react'
import $ from 'jquery'
import Overlay from '../../others/overlay'
import PostIt from './post-it'

export default class PostItTeaser extends React.Component {

  state = {
    postIt: false
  }

  togglePostIt = e => {
    e ? e.preventDefault() : null
    this.setState({ postIt: !this.state.postIt })
  }

  render() {
    let
      id = $('.data').data('session'),
      username = $('.data').data('username'),
      { postIt } = this.state,
      { type, group, disabled } = this.props

    return (
      <div>

        <div className='post_it inst' style={{ marginBottom: type == 'group' ? 10 : null }} >
          <img src={`/users/${id}/avatar.jpg`} alt='Your avatar' />
          <div className='post_teaser'>
            <span
              className='p_whats_new'
              onClick={disabled ? null : this.togglePostIt}
            >E aí, @{username}? vamos compartilhar #moments!</span>
          </div>
        </div>

        {
          postIt ?
            <div>
              <Overlay />
              <PostIt
                back={this.togglePostIt}
                type={type}
                group={group}
              />
            </div>
            : null
        }

      </div>
    )
  }
}

PostItTeaser.defaultProps = {
  disabled: false
}
