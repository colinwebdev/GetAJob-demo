import PropTypes from 'prop-types'

function Spinner({ size }) {
    let classes = 'spinner ' + size
    return <div className={classes} id={size}></div>
}

Spinner.defaultProps = {
  size: 'med'
}

Spinner.propTypes = {
    size: PropTypes.string,
}

export default Spinner
