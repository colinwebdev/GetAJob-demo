import Spinner from '../components/Spinner'
import DashCard from '../components/DashCard'
import DashList from '../components/DashList'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getDashboard } from '../features/listings/listingSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function Dashboard() {
    let { dashboard } = useSelector((state) => state.listings)
    let [isLoading, setIsLoading] = useState(true)
    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDashboard())
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [dispatch])

    return (
        <div className='page dashboard flex flex-col'>
            <div className='header'>
                <h1>Dashboard</h1>
            </div>
            <div className='top grid grid-cols-3 mb-8 gap-3'>
                {isLoading ? <div className='dashCard'><Spinner /></div> : <DashCard type='applied' data={dashboard} />}
                {isLoading ? <div className='dashCard'><Spinner /></div> : <DashCard type='pending' data={dashboard} />}
                {isLoading ? <div className='dashCard'><Spinner /></div> : <DashCard type='review' data={dashboard} />}
                
            </div>
            <div className='wrap flex gap-5 w-full grow'>
                <div className='dashCol grow'>
                    <Link to='/listings/filter/open'>
                        <h3>
                            Open Jobs <FontAwesomeIcon icon={faArrowRight} />
                        </h3>
                    </Link>

                    {isLoading ? (
                        <div className='spinnerCol'>
                            <Spinner />
                        </div>
                    ) : (
                        <DashList listType='open' data={dashboard.openList} />
                    )}
                </div>

                <div className='dashCol grow'>
                    <Link to='/listings/filter/applied'>
                        <h3>
                            Applied Jobs <FontAwesomeIcon icon={faArrowRight} />
                        </h3>
                    </Link>

                    {isLoading ? (
                        <div className='spinnerCol'>
                            <Spinner />
                        </div>
                    ) : (
                        <DashList
                            listType='applied'
                            data={dashboard.appliedList}
                        />
                    )}
                </div>
                <div className='dashCol grow'>
                    <Link to='/listings/filter/closing'>
                        <h3>
                            Closing Soon <FontAwesomeIcon icon={faArrowRight} />
                        </h3>
                    </Link>

                    {isLoading ? (
                        <div className='spinnerCol'>
                            <Spinner />
                        </div>
                    ) : (
                        <DashList
                            listType='closing'
                            data={dashboard.closingList}
                        />
                    )}
                </div>
                <div className='dashCol grow'>
                    <h3>
                        Popular Skills
                    </h3>
                    {isLoading ? (
                        <div className='spinnerCol'>
                            <Spinner />
                        </div>
                    ) : (
                        <DashList
                            listType='skills'
                            data={dashboard.skills}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
