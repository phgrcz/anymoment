import React from 'react'
import { FadeIn } from 'animate-components'
import $ from 'jquery'
import { humanReadable } from '../../utils/utils'
import PropTypes from 'prop-types'

export default class NotiSpeak extends React.Component {
  render() {
    let
      { un } = this.props,
      id = $('.data').data('session'),
      username = $('.data').data('username')

    return (
      <div>
        {
          un != 0 ?
            <div className="noti_speak">
              <FadeIn duration='300ms'>
                <img src={`/users/${id}/avatar.jpg`} />
                <div className="n_s_sn_div">
                  <span><b>@{username}</b>, você tem { humanReadable(un, 'notificações') }.</span>
                </div>
              </FadeIn>
            </div>
            : null
        }
      </div>
    )
  }
}

NotiSpeak.propTypes = {
  un: PropTypes.number.isRequired
}
