import React from 'react'
import $ from 'jquery'
import PropTypes from 'prop-types'

const End = ({ mssg }) => {

  const toTop = () => {
    $('html, body').animate({
      scrollTop: 0
    }, 450)
  }

  return (
    <div className='page_end' onClick={toTop} >
      <span>{mssg}</span>
    </div>
  )
}

End.defaultProps = {
  mssg: 'Parece que chegamos ao fim...'
}

End.propTypes = {
  mssg: PropTypes.string.isRequired
}

export default End
