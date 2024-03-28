import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    getListings,
    filterListings,
    skillListings,
} from '../features/listings/listingSlice'
import { getSkill } from '../features/skills/skillsSlice'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import FullPageSpinner from '../components/FullPageSpinner'
import ListingListItem from '../components/ListingListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

function Listings() {
    let { listings } = useSelector((state) => state.listings)
    let { skill } = useSelector((state) => state.skills)
    let [isLoading, setIsLoading] = useState(true)
    let [title, setTitle] = useState('Listings')
    let [isType, setIsType] = useState('open')

    const [queryParameters] = useSearchParams()

    let dispatch = useDispatch()

    let { type } = useParams()

    function loadListings(filterType) {
        setIsLoading(true)
        
        switch (filterType) {
            case 'appliedWeek':
                dispatch(filterListings('appliedWeek'))
                setTitle('Applied to This Week')
                setIsType('other')
                break
            case 'applied':
                dispatch(filterListings('applied'))
                setTitle('All Applied Listings')
                setIsType('applied')
                break
            case 'pending':
                dispatch(filterListings('pending'))
                setTitle('Pending Listings')
                setIsType('other')
                break
            case 'review':
                dispatch(filterListings('review'))
                setTitle('Review Listings')
                setIsType('other')
                break
            case 'skill':
                let skillId = queryParameters.get('id')
                dispatch(skillListings(skillId))
                dispatch(getSkill(skillId))

                setTitle(`Listings with ${skill.name}`)
                setIsType('other')
                break
            case 'archived':
                dispatch(filterListings('archived'))
                setTitle('Archived Listings')
                setIsType('archived')
                break
            case 'all':
                dispatch(filterListings('all'))
                setTitle('All Listings')
                setIsType('all')
                break
            default:
                dispatch(getListings())
                setTitle('Open Listings')
                setIsType('open')
                break
        }
        setTimeout(() => {
            setIsLoading(false)
            
        }, 500)
    }

    useEffect(() => {
        setIsLoading(true)
        loadListings(type)
        
    }, [])

    if (isLoading) return <FullPageSpinner />

    return (
        <div className='page listings'>
            <div className='header flex justify-between items-center'>
                <h1>{title}</h1>
                <div className='linkButtons flex gap-3'>
                    <button
                        className='btn btn-secondary'
                        disabled={isType === 'archived'}
                        onClick={() => loadListings('archived')}
                    >
                        Archived
                    </button>
                    <button
                        className='btn btn-secondary'
                        onClick={() => loadListings('all')}
                        disabled={isType === 'all'}
                    >
                        All
                    </button>
                    <button
                        className='btn btn-secondary'
                        onClick={() => loadListings('applied')}
                        disabled={isType === 'applied'}
                    >
                        Applied
                    </button>
                    <button
                        className='btn btn-secondary'
                        onClick={() => loadListings('open')}
                        disabled={isType === 'open'}
                    >
                        Open
                    </button>
                </div>
            </div>

            <div className='listingsDetailList wideList mt-5 mb-8'>
                {listings.length === 0 ? (
                    <div className='flex p-5 justify-center items-center flex-col'>
                        <p>No listings added, yet</p>
                        <p className='addItem'>
                            <Link to='/newListing'>
                                <FontAwesomeIcon icon={faAdd} /> Add one
                            </Link>
                        </p>
                    </div>
                ) : (
                    <table className='table-auto'>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Type</th>
                                <th>Pay</th>
                                <th>Remote</th>
                                <th>Posted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {listings.map((listing) => {
                                let item
                                if (listing)
                                    item = (
                                        <tr>
                                            <td>{listing.title}</td>
                                        </tr>
                                    )
                                return item
                            })} */}
                            {listings.map((listing, i) => (
                                <ListingListItem
                                    key={i}
                                    listing={listing}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Listings
