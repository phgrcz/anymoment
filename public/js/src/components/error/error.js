import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import { FadeIn } from 'animate-components'
import Title from '../others/title'

export default class Error extends React.Component {
  render() {

    let
      username = $('.data').data('username'),
      { params: { what } } = this.props.match,
      title, desc

    if (what == 'user_nf') {
      title = 'Usuário não encontrado'
      desc = 'user'
    } else if (what == 'post_nf'){
      title = 'Momento não encontrado'
      desc = 'post'
    } else if (what == 'group_nf') {
      title = 'Grupo não encontrado'
      desc = 'group'
    } else {
      title = 'Erro'
      desc = 'page'
    }

    return (
      <div className='error' >
        <Title value={`Ops, ${title}!`} />
        <FadeIn duration='300ms' >
          <div className='error_div'>
            <div className='error_info'>
              <span>Ops, a página que você está procurando não existe!</span>
            </div>
            <img src='/images/error.svg' alt='' />
            <div className='error_bottom'>
              <Link to={`/profile/${username}`} className='sec_btn error_home' >Perfil</Link>
              <Link to='/' className='pri_btn error_login' >Inicio</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    )
  }
}
