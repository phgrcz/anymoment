import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import $ from 'jquery'

@connect(store => (
  { un: store.Notification.unreadNotifications }
))

export default class Title extends React.Component {
  render() {
    let { value, desc, un } = this.props

    let element = $('meta[data-desc-src="hbs"]')
    element.remove()

    return (
      <Helmet>
        <title>{ un ? `(${un})` : '' } {`${value}`} | AnyMoment</title>
        <meta name='description' content={desc} />
      </Helmet>
    )
  }
}

Title.defaultProps = {
  value: '',
  desc: 'compartilhe seus momentos! :)'
}

Title.propTypes = {
  value: PropTypes.string,
  desc: PropTypes.string
}
