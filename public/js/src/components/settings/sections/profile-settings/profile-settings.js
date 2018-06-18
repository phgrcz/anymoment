import React from 'react'
import { FadeIn } from 'animate-components'
import Title from '../../../others/title'
import { connect } from 'react-redux'
import { getUserDetails } from '../../../../store/actions/user-a'
import $ from 'jquery'
import Spinner from '../../../others/spinner'
import { post } from 'axios'
import Notify from 'handy-notification'
import { getBlockedUsers } from '../../../../store/actions/settings-a'
import Nothing from '../../../others/nothing'
import BlockedUser from './blocked-user'

@connect(store => (
  {
    ud: store.User.user_details,
    blockedUsers: store.Setting.blockedUsers
  }
))

export default class ProfileSettings extends React.Component {

  state = {
    loading: true,
    type: 'publico'
  }

  componentDidMount = () => {
    let { dispatch } = this.props
    let username = $('.data').data('username')
    dispatch(getUserDetails(username))
    dispatch(getBlockedUsers())
  }

  componentWillReceiveProps = ({ ud: { account_type } }) =>
    this.setState({ loading: false, type: account_type })

  changeType = async ({ target: { value: type } }) => {
    this.setState({ type })
    await post('/api/change-account-type', { type })
    Notify({ value: `Alterado para ${type}` })
  }

  render() {
    let
      { loading, type } = this.state,
      { blockedUsers } = this.props,
      len = blockedUsers.length,
      map_users = blockedUsers.map(b =>
        <BlockedUser key={b.block_id} {...b} />
      )

    return (
      <div>

        <Title value='Configurações' />

        <FadeIn duration='300ms'>

          { loading ? <Spinner/> : null }

          <div className={`pro_settings ${loading ? 'cLoading' : ''}`} >

            <div className='acc_type'>
              <div className='set_header acc_type_header'>
                <span className='acc_type_h'>Altere o tipo de perfil</span>
              </div>
              <div className='acc_type_main'>
                <select value={type} className='acc_select' onChange={this.changeType} >
                  <option value='publico'>Publico</option>
                  <option value='privado'>Privado</option>
                </select>
                <span className='bold'>Obs:</span>
                <span>Quando seu perfil é <span className='bold'>privado, apenas quem te segue pode interagir com você.</span></span>
                <span>E quando seu perfil é <span className='bold'>público, qualquer usuário pode ver seu perfil e interagir com você.</span></span>
              </div>
            </div>

            <div className='blocking'>
              <div class='set_header block_header'>
                <span class='acc_type_h'>Usuários bloqueados</span>
              </div>
              {
                len == 0
                  ? <Nothing mssg='Você não bloqueou ninguém' />
                  : map_users
              }
            </div>

          </div>

        </FadeIn>

      </div>
    )
  }
}
