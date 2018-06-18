import React from 'react'
import { FadeIn } from 'animate-components'
import Title from '../../others/title'
import { Link } from 'react-router-dom'
import SearchFollowings from '../../others/search-followings'
import { connect } from 'react-redux'
import { Me } from '../../../utils/utils'
import { joinGroup } from '../../../utils/user-interact-utils'
import $ from 'jquery'

@connect(store => (
  { gd: store.Group.group_details }
))

export default class AddGroupMembers extends React.Component {

  addMember = user => {
    let
      session = $('.data').data('session'),
      { gd } = this.props
    joinGroup({
      user,
      added_by: session,
      group: gd.group_id,
      when: 'add_grp_member'
    })
  }

  render() {
    let { gd } = this.props

    return (
      <div>

        <Title value='Adicionar membros' />

        <FadeIn duration='300ms'>
          <div className='app_sections pro_app_sections'>
            <div className='app_add_member'>

              <div className='a_m2'>
                <div className='a_m_header'>
                  <span>Adicionar membros</span>
                </div>

                <div className='a_m_main'>
                  <SearchFollowings
                    placeholder='Buscar...'
                    when='add_grp_members'
                    disabled={!Me(gd.admin)}
                    done={user =>
                      this.addMember(user)
                    }
                  />
                </div>
              </div>

            </div>

          </div>
        </FadeIn>

      </div>
    )
  }
}
