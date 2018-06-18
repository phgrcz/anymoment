import React from 'react'
import RecommendUsers from './recommend-users'
import Overlay from '../overlay'
import PropTypes from 'prop-types'

export default class Recommend extends React.Component {

  state = {
    recommend: false
  }

  toggleRecommend = () =>
    this.setState({ recommend: !this.state.recommend })

  recommend = e => {
    e.preventDefault()
    this.toggleRecommend()
  }

  render() {
    let
      { username } = this.props,
      { recommend } = this.state

    return (
      <div>

        <div className='recomm_teaser'>
          <span>Recomende {username} para outros amigos.</span>
          <a href='#' className='sec_btn' onClick={this.recommend} >Recomendar</a>
        </div>

        {
          recommend ?
            <div>
              <Overlay/>
              <RecommendUsers
                back={this.toggleRecommend}
              />
            </div>
            : null
        }

      </div>
    )
  }
}

Recommend.propTypes = {
  username: PropTypes.string
}
