import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faIndustry,
    faLocationDot,
    faUsers,
} from '@fortawesome/free-solid-svg-icons'

function CompanyCard({ company }) {
    return (
        <div className='companyCard mb-10'>
            <div className='cardHeader flex justify-between'>
                <h2>
                    <Link to={`/company/${company.id}`}>{company.name}</Link>
                </h2>
                <div
                    className={
                        'badge ml-auto px-5 py-4 ' +
                        (company.isValid
                            ? 'badge-secondary badge-outline '
                            : 'badge-error')
                    }
                >
                    {company.isValid ? 'Valid' : 'NOT VALID'}
                </div>
            </div>
            <div className='details'>
                <div className={company.industry ? 'pale' : 'dimmed'}>
                    <div className='icon'>
                        <FontAwesomeIcon icon={faIndustry} />
                    </div>

                    {company.industry ? company.industry : 'No industry listed'}
                </div>
                <div className={company.size ? 'pale' : 'dimmed'}>
                    <div className='icon'>
                        <FontAwesomeIcon icon={faUsers} />
                    </div>

                    {company.size ? company.size : 'No size given'}
                </div>

                <div className={company.location ? 'pale' : 'dimmed'}>
                    <div className='icon'>
                        <FontAwesomeIcon icon={faLocationDot} />
                    </div>

                    {company.location
                        ? `${company.location} `
                        : 'No location available'}
                    {company.commuteTime && `-- ${company.commuteTime} away`}
                </div>
            </div>
        </div>
    )
}

export default CompanyCard
