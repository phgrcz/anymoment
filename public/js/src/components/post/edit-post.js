import React from 'react'
import { FadeIn } from 'animate-components'
import $ from 'jquery'
import { post } from 'axios'
import { connect } from 'react-redux'
import { editPost } from '../../store/actions/post-a'
import Notify from 'handy-notification'
import ToolTip from 'react-tooltip'
import Emojis from '../others/emojis'

@connect(store => (
  { store }
))

export default class EditPost extends React.Component {

  state = {
    description: '',
    emojis: false
  }

  toggleEmojis = () =>
    this.setState({ emojis: !this.state.emojis })

  componentDidMount = () => {
    let { description } = this.props
    this.setState({ description })
  }

  back = e => {
    e.preventDefault()
    this.props.back()
  }

  descChange = ({ target: { value } }) => {
    this.setState({ description: value })
    this.props.changeDesc(value)
  }

  updatePost = async e => {
    e.preventDefault()
    $('.e_p_update').addClass('a_disabled')
    let
      { description } = this.state,
      { dispatch, post: post_id, back } = this.props

    await post('/api/edit-post', { description, post: post_id })
    dispatch(editPost({ post_id, description }))
    back()
  }

  render() {
    let { description, emojis } = this.state

    return (
      <div>

        <div className='edit_post modal'>
          <FadeIn duration='300ms'>
            <div className='e_p_header modal_header'>
              <span className='title'>Editar momento</span>
            </div>

            <div className='e_p_middle modal_middle'>
              <textarea
                placeholder='Descreva o momento..'
                spellCheck='false'
                autoComplete='false'
                className='e_p_textarea'
                autoFocus
                value={description}
                onChange={this.descChange}
              ></textarea>
            </div>

            <div className='e_p_bottom modal_bottom'>
              <span
                className='emoji_span'
                data-tip='Emojis'
                onClick={this.toggleEmojis}
              >
                <i className='material-icons'>sentiment_very_satisfied</i>
              </span>
              <a href='#' className='e_p_cancel sec_btn' onClick={this.back} >Voltar</a>
              <a href='#' className='e_p_update pri_btn' onClick={this.updatePost} >Atualizar</a>
            </div>
          </FadeIn>
        </div>

        <ToolTip/>

        {
          emojis ?
            <Emojis
              position={{ top: 160, left: 269 }}
              textArea={$('.e_p_textarea')}
              setState={value => {
                this.setState({ description: value })
              }}
            />
            : null
        }

      </div>
    )
  }
}
