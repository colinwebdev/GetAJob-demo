import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCompanies } from '../features/companies/companySlice'
import { Link } from 'react-router-dom'
import FullPageSpinner from '../components/FullPageSpinner'
import CompanyListItem from '../components/CompanyListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

function Companies() {
    let { companies } = useSelector((state) => state.companies)
    let [isLoading, setIsLoading] = useState(true)
    let dispatch = useDispatch()

    // localStorage.clear()

    useEffect(() => {
        dispatch(getCompanies())
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [dispatch])
    if (isLoading) return <FullPageSpinner />

    return (
        <div className='page companies'>
            <div className='header'>
                <h1>Companies</h1>
            </div>

            <div className='companiesDetailList wideList mt-5 mb-8'>
                {companies.length === 0 ? (
                    <div className='flex p-5 justify-center items-center flex-col'>
                        <p>No companies added, yet</p>
                        <p className='addItem'>
                            <Link to='/newCompany'>
                                <FontAwesomeIcon icon={faAdd} /> Add one
                            </Link>
                        </p>
                    </div>
                ) : (
                    <table className='table-auto'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Industry</th>
                                <th># Jobs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => (
                                <CompanyListItem
                                    key={company.id}
                                    company={company}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Companies
