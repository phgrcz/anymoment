import React, { Fragment } from 'react'
import CreateGroupModal from './cg-modal'
import Overlay from '../../others/overlay'

export default class CreateGroup extends React.Component {

  state = {
    createGroup: false
  }

  toggleCreateGroup = e => {
    e.preventDefault()
    this.setState({ createGroup: !this.state.createGroup })
  }

  render() {
    let { createGroup } = this.state

    return (
      <div>

        <div className='recomm_teaser' >
          <span>Crie um grupo de pessoas com o mesmo interesse</span>
          <a href='#' className='sec_btn' onClick={this.toggleCreateGroup} >Criar grupo</a>
        </div>

        {
          createGroup ?
            <Fragment>
              <Overlay/>
              <CreateGroupModal back={this.toggleCreateGroup} />
            </Fragment>
            : null
        }

      </div>
    )
  }
}
