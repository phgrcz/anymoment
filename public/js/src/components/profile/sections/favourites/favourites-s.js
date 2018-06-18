import React from 'react'
import { FadeIn } from 'animate-components'
import { connect } from 'react-redux'
import Title from '../../../others/title'
import Nothing from '../../../others/nothing'
import End from '../../../others/end'
import { Me, humanReadable } from '../../../../utils/utils'
import FavList from './fav-list'

@connect(store => (
  {
    ud: store.User.user_details,
    favourites: store.Follow.favourites
  }
))

export default class Favourites extends React.Component {

  render() {
    let
      { favourites, param: username, ud: { id } } = this.props,
      len = favourites.length,
      map_favs = favourites.map(f =>
        <FavList key={f.fav_id} {...f} />
      )

    return (
      <div>

        <Title value={`Favoritos de @${username}`} />

        <FadeIn duration='300ms'>

          <div className='app_sections pro_app_sections'>
            <div className={ len != 0 ? 'm_div' : 'm_no_div' } >

              {
                len != 0
                  ? <div className='m_header'><span>{ humanReadable(len, 'favoritos') }</span></div>
                  : null
              }

              <div className='m_wrapper'>
                { len != 0 ? map_favs : null }
              </div>

            </div>
          </div>

          {
            len == 0
              ? <div>
                <Nothing mssg={ Me(id) ? 'Você não tem favoritos' : `${username} não tem favoritos` } />
              </div>
              : <End/>
          }

        </FadeIn>

      </div>
    )
  }
}
