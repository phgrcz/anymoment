import React from 'react'
import TimeAgo from 'handy-timeago'
import { toggle, Me } from '../../../../utils/utils'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { post } from 'axios'
import { removeRecommendation } from '../../../../store/actions/follow_a'
import Notify from 'handy-notification'

@connect(store => (
  { ud: store.User.user_details }
))

export default class RecommendList extends React.Component {

  toggleTime = () => toggle(this.time)

  remRecommendation = async e => {
    e.preventDefault()
    let { recommend_id, dispatch } = this.props
    await post('/api/remove-recommendation', { recommend_id })
    dispatch(removeRecommendation(recommend_id))
  }

  render() {
    let { recommend_of, recommend_of_username, recommend_of_firstname, recommend_of_surname, recommend_by_username, recommend_time, ud: { id } } = this.props

    return (
      <div
        className='m_on followers_m_on'
        onMouseOver={this.toggleTime}
        onMouseOut={this.toggleTime}
      >

        <div className='m_top'>
          <img src={`/users/${recommend_of}/avatar.jpg`} alt='' />
          <div className='m_top_right'>
            <Link to={`/profile/${recommend_of_username}`} >{recommend_of_username}</Link>
            <span>{recommend_of_firstname} {recommend_of_surname}</span>
          </div>
        </div>

        <span
          className='recommend_time'
          style={{ display: 'none' }}
          ref={t => this.time = t}
        >{TimeAgo(recommend_time)}</span>

        <div className='m_bottom'>
          <span className='recommend_by' >por
            <Link to={`/profile/${recommend_by_username}`} > {recommend_by_username}</Link>
          </span>
          {
            Me(id)
              ? <a href='#' className='sec_btn' onClick={this.remRecommendation} >Remover</a>
              : null
          }
        </div>

      </div>
    )
  }
}
