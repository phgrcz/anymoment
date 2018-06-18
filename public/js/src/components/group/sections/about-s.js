import React from 'react'
import Title from '../../others/title'
import { FadeIn } from 'animate-components'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { profile_scroll, toggle } from '../../../utils/utils'
import ToolTip from 'react-tooltip'
import TimeAgo from 'handy-timeago'

@connect(store => (
  { gd: store.Group.group_details }
))

export default class AboutGroup extends React.Component {

  toggleEdit = () => {
    let element = document.querySelector('.a_edit')
    toggle(element)
  }

  componentDidMount = () => profile_scroll()

  render() {
    let { gd } = this.props

    return (
      <div>

        <Title value='Sobre' />

        <FadeIn duration='300ms' >
          <div className='app_sections pro_app_sections'>
            <div className='about'>

              <div
                className='fabout'
                onMouseOver={this.toggleEdit}
                onMouseOut={this.toggleEdit}
              >

                <div className='a_username'>
                  <span className='a_label'>Nome</span>
                  <span className='a_info'>{ gd.name }</span>
                </div>

                <div className='a_bio'>
                  <span className='a_label'>Sobre</span>
                  <span className='a_info'>{ gd.bio }</span>
                </div>

                <div className='a_email'>
                  <span className='a_label'>Momentos</span>
                  <span className='a_info'>{ gd.postsCount }</span>
                </div>

                <div className='a_created_by'>
                  <span className='a_label'>Criador</span>
                  <Link to={`/profile/${gd.admin_username}`} className='a_info' >{ gd.admin_username }</Link>
                </div>

                <div className='a_joined'>
                  <span className='a_label'>Criado</span>
                  <span className='a_info'>{`${TimeAgo(gd.created)}`}</span>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>

        <ToolTip/>

      </div>
    )
  }
}
