import React from 'react'
import { FadeIn } from 'animate-components'
import { Link } from 'react-router-dom'
import ToolTip from 'react-tooltip'
import TimeAgo from 'handy-timeago'
import PropTypes from 'prop-types'

export default class ImageTheatre extends React.Component {
  render() {
    let { showInfo, imgSrc, filter, username, time, link } = this.props

    return (
      <div className='image_show'>
        <FadeIn duration='300ms'>

          <div className='img_s_img'>
            <img src={imgSrc} className={filter} />

            {
              showInfo ?
                <div className='img_s_bottom'>
                  <span className='img_s_by'>por {username} ({ TimeAgo(time).replace(' atrás', '') })</span>
                  <Link to={link} className='img_s_window' data-tip='Abrir'>
                    <i className='material-icons'>open_in_new</i>
                  </Link>
                </div>
                : null
            }

          </div>

        </FadeIn>

        <ToolTip/>
      </div>
    )
  }
}

ImageTheatre.defaultProps = {
  showInfo: true,
  imgSrc: '/images/anymoment-500.png',
  filter: ''
}

ImageTheatre.propTypes = {
  showInfo: PropTypes.bool,
  imgSrc: PropTypes.string.isRequired,
  filter: PropTypes.string,
  username: PropTypes.string,
  link: PropTypes.string,
  time: PropTypes.string
}
