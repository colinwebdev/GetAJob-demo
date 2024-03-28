import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatDate } from '../features/global/globalService'

function ListingListItem({ listing }) {
    if (!listing) return
    return (
        <tr>
            <td>
                <Link className='name' to={`/listing/${listing.id}`}>
                    {listing.title}
                </Link>
            </td>
            <td className='companyName'>
                {listing.company
                    ? listing.company.name
                    : 'Company not found'}
            </td>
            <td className='type'>{listing.type}</td>
            <td className='pay'>
                {listing.pay > 0 && '$'}
                {listing.pay}
                {listing.payBasis && <>/{listing.payBasis}</>}
            </td>
            <td className='isRemote'></td>
            <td className='posted'>{formatDate(listing.datePosted, false)}</td>
        </tr>
    )
}

ListingListItem.propTypes = {
    listing: PropTypes.object.isRequired,
}

export default ListingListItem
