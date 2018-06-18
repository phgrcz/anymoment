import React from 'react'
import Title from '../../others/title'
import { FadeIn } from 'animate-components'
import ToolTip from 'react-tooltip'
import { connect } from 'react-redux'
import { post } from 'axios'
import Notify from 'handy-notification'
import $ from 'jquery'
import { updateGroup } from '../../../store/actions/group-a'
import { Me, isAdmin } from '../../../utils/utils'
import Emojis from '../../others/emojis'

@connect(store => (
  { gd: store.Group.group_details }
))

export default class EditGroup extends React.Component {

  state = {
    name: '',
    bio: '',
    isPrivate: false,
    emojis: false
  }

  componentDidMount = async () => {
    let { gd: { name, bio, group_type } } = this.props
    await this.setState({
      name,
      bio,
      isPrivate: group_type == 'privado' ? true : false
    })
  }

  componentWillReceiveProps = ({ gd: { name, bio, group_type } }) => {
    this.setState({
      name,
      bio,
      isPrivate: group_type == 'privado' ? true : false
    })
  }

  _toggle = what =>
    this.setState({
      [what]: !this.state[what]
    })

  changeValue = (what, { target }) => {
    const value = target.type == 'checkbox' ? target.checked : target.value
    this.setState({
      [what]: value
    })
  }

  update = async e => {
    e.preventDefault()
    let
      { name, bio, isPrivate } = this.state,
      group_type = isPrivate ? 'privado': 'publico',
      { gd: { group_id }, dispatch } = this.props,
      btn = $('.g_e_save_btn')

    btn
      .text('Updating..')
      .addClass('sec_btn_disabled')

    await post('/api/edit-group', { name, bio, group_type, group: group_id })
    dispatch(updateGroup({ name, bio, group_type }))

    btn
      .text('Atualizado')
      .removeClass('sec_btn_disabled')
      .blur()

  }

  render() {
    let
      { name, bio, isPrivate, emojis } = this.state,
      { gd: { admin } } = this.props,
      disabled = !Me(admin) && !isAdmin()

    return (
      <div>

        <Title value='Editar' />

        <FadeIn duration='300ms' >
          <div className='app_sections pro_app_sections'>

            <div className='app_personal_sections'>
              <div className='grp_edit'>

                <div className='g_e_name'>
                  <span className='g_e_span'>Nome</span>
                  <input
                    type='text'
                    placeholder='nome'
                    spellCheck='false'
                    autoFocus
                    className='gen_text'
                    disabled={disabled}
                    value={name}
                    onChange={e => this.changeValue('name', e)}
                  />
                </div>

                <div className='g_e_bio'>
                  <span className='g_e_span'>Sobre</span>
                  <textarea
                    placeholder='sobre'
                    spellCheck='false'
                    className='gen_bio'
                    disabled={disabled}
                    value={bio}
                    onChange={e => this.changeValue('bio', e)}
                  ></textarea>
                </div>

                <div className='g_e_pri'>
                  <input
                    type='checkbox'
                    className='inst_checkbox'
                    id='grp_private'
                    disabled={disabled}
                    checked={isPrivate}
                    onChange={e => this.changeValue('isPrivate', e)}
                  />
                  <label for='grp_private'>Privado</label>
                  <span className='g_e_p_info'>Obs: apenas membros podem interagir em grupos privados</span>
                </div>

                <div className='g_e_save'>
                  <div>
                    {
                      Me(admin) || isAdmin() ?
                        <div>
                          <span
                            className='emoji_span'
                            data-tip='Emojis'
                            onClick={() => this._toggle('emojis')}
                          >
                            <i className='material-icons'>sentiment_very_satisfied</i>
                          </span>
                          <ToolTip/>
                        </div>
                        : null
                    }
                  </div>

                  <a
                    href='#'
                    className={`sec_btn g_e_save_btn ${!name || !bio || !Me(admin) && !isAdmin() ? 'sec_btn_disabled' : ''}`}
                    onClick={this.update}
                  >Atualizar</a>
                </div>

              </div>
            </div>

          </div>
        </FadeIn>

        {
          emojis ?
            <Emojis
              position={{ top: 304, left: 368 }}
              textArea={$('.gen_bio')}
              setState={value => {
                this.setState({ bio: value })
              }}
            />
            : null
        }

      </div>
    )
  }
}
