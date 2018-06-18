import React from 'react'
import { FadeIn } from 'animate-components'
import Title from '../../../others/title'
import { connect } from 'react-redux'
import { Me, humanReadable } from '../../../../utils/utils'
import Spinner from '../../../others/spinner'
import Nothing from '../../../others/nothing'
import { getUserGroups } from '../../../../store/actions/group-a'
import GroupList from './group-list'
import End from '../../../others/end'
import CreateGroup from '../../../group/create-group/create-group'

@connect(store => (
  {
    groups: store.Group.userGroups,
    ud: store.User.user_details
  }
))

export default class UserGroups extends React.Component {

  state = {
    loading: true
  }

  componentDidMount = () => {
    let { ud: { id }, dispatch } = this.props
    dispatch(getUserGroups(id))
  }

  componentWillReceiveProps = ({ dispatch, ud, ud: { id } }) => {
    this.props.ud != ud ? dispatch(getUserGroups(id)) : null
    this.setState({ loading: false })
  }

  render() {
    let
      { loading } = this.state,
      { param: username, groups, ud: { id } } = this.props,
      len = groups.length,
      map_groups = groups.map(g =>
        <GroupList key={g.group_id} {...g} />
      )

    return (
      <div>

        <Title value={`Grupos de @${username}`} />

        { loading ? <Spinner/> : null }

        <FadeIn duration='300ms' className={loading ? 'cLoading' : ''}>

          <div className='app_sections pro_app_sections' >
            <div className={ len != 0 ? 'm_div' : 'm_no_div' } >

              {
                len != 0
                  ? <div className='m_header'><span>{ humanReadable(len, 'grupos') }</span></div>
                  : null
              }

              <div className='m_wrapper'>
                { len != 0 ? map_groups : null }
              </div>

            </div>
          </div>

          {
            len == 0 ?
              <div className='app_sections' >
                <div className='app_static_sections' style={{ marginTop: -8 }} >
                  <CreateGroup/>
                </div>
                <div className='app_personal_sections' >
                  <Nothing
                    mssg={Me(id) ? 'Você não é membro de nenhum grupo' : `${username} não é membro de nenhum grupo`}
                  />
                </div>
              </div>
              : <End/>
          }

        </FadeIn>

      </div>
    )
  }
}
