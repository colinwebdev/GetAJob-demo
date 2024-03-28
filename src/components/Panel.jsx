// import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faGaugeHigh,
    faFileContract,
    faBuilding,
    faNoteSticky,
    faSquarePlus,
    faList,
    faCode
} from '@fortawesome/free-solid-svg-icons'

function Panel() {
    let currYear = new Date().getFullYear()

    return (
        <nav className='sidePanel '>
            <h1>GET-A-JOB</h1>

            <div className='links'>
                <Link to='/' className='dashboard linkWrap'>
                    <FontAwesomeIcon icon={faGaugeHigh} size='2x' />
                    <span>Dashboard</span>
                </Link>
                <div className='linkGroup'>
                    <Link to='/listings' className='listings linkWrap'>
                        <FontAwesomeIcon icon={faFileContract} size='2x' />
                        <span>Listings</span>
                    </Link>
                    <Link to='/newListing' className='newListing subLinkWrap'>
                        <span>New Listing</span>
                        <FontAwesomeIcon icon={faSquarePlus} size='2x' />
                    </Link>
                </div>
                <div className='linkGroup'>
                    <Link to='/companies' className='companies linkWrap'>
                        <FontAwesomeIcon icon={faBuilding} size='2x' />
                        <span>Companies</span>
                    </Link>
                    <Link to='/newCompany' className='newCompany subLinkWrap'>
                        <span>New Company</span>
                        <FontAwesomeIcon icon={faSquarePlus} size='2x' />
                    </Link>
                </div>
                <Link to='/skills' className='skills linkWrap'>
                    <FontAwesomeIcon icon={faList} size='2x' />
                    <span>Skills</span>
                </Link>
                <Link to='/notes' className='notes linkWrap'>
                    <FontAwesomeIcon icon={faNoteSticky} size='2x' />
                    <span>Notes</span>
                </Link>
                <Link to='/about' className='about linkWrap'>
                    <FontAwesomeIcon icon={faCode} size='2x' />
                    <span>About</span>
                </Link>
            </div>
            <div className='sideBottom'>&copy; {currYear} | Colin M</div>
        </nav>
    )
}

export default Panel
