import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function DashCard({ type, data }) {
    let body
    let title
    switch (type) {
        case 'applied':
            title = 'Applied Jobs'
            body = (
                <>
                    <p className='flex gap-3 items-end'>
                        <span className='bigNumber'>{data.appliedWeek}</span>{' '}
                        <Link
                            to='/listings/filter/appliedWeek'
                            className='mb-2'
                        >
                            This week <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </p>
                    <p className='flex gap-3 items-end'>
                        <span className='bigNumber'>{data.appliedTotal}</span>
                        <Link to='/listings/filter/applied' className='mb-2'>
                            Total <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </p>
                </>
            )
            break
        case 'pending':
            title = 'Pending Applications'
            body = (
                <>
                    <p>
                        <span className='bigNumber'>{data.pending}</span>
                    </p>
                    <Link to='/listings/filter/pending'>
                        Review Listings <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </>
            )
            break
        case 'review':
            title = 'Jobs to Review'
            body = (
                <>
                    <p>
                        <span className='bigNumber'>{data.review}</span>
                    </p>
                    <Link to='/listings/filter/review'>
                        Review Listings <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </>
            )
            break
        default:
            break
    }

    return (
        <div className='dashCard'>
            <h3 className='mb-3'>{title}</h3>
            <div className='cardBody'>{body}</div>
        </div>
    )
}

export default DashCard
