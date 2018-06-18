import React from 'react'
import { FadeIn } from 'animate-components'
import { connect } from 'react-redux'
import Title from '../../../others/title'
import Nothing from '../../../others/nothing'
import End from '../../../others/end'
import { Me, humanReadable } from '../../../../utils/utils'
import PeopleYouKnowList from './puk-list'
import { Redirect } from 'react-router-dom'

@connect(store => (
  {
    ud: store.User.user_details,
    mutuals: store.User.mutualUsers
  }
))

export default class PeopleYouKnow extends React.Component {

  render() {
    let
      { mutuals, param: username, ud: { id } } = this.props,
      len = mutuals.length,
      map_mutuals = mutuals.map(m =>
        <PeopleYouKnowList key={m.follow_id} {...m} />
      )

    return (
      <div>

        { Me(id) ? <Redirect to={`/profile/${username}`} /> : null }

        <Title value={`Seguidores de @${username} que você conhece`} />

        <FadeIn duration='300ms'>

          <div className='app_sections pro_app_sections'>
            <div className={ len != 0 ? 'm_div' : 'm_no_div' } >

              {
                len != 0
                  ? <div className='m_header'>
                    <span>{humanReadable(len, 'seguidores ')} que você conhece</span>
                  </div>
                  : null
              }

              <div className='m_wrapper'>
                { len != 0 ? map_mutuals : null }
              </div>

            </div>
          </div>

          {
            len == 0
              ? <Nothing mssg={ Me(id) ? 'Você não tem seguidores' : `${username} não tem seguidores` } />
              : <End/>
          }

        </FadeIn>

      </div>
    )
  }
}
