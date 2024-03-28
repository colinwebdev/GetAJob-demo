import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import FullPageSpinner from '../components/FullPageSpinner'
import {
    getCompany,
    updateCompany,
    deleteCompany,
} from '../features/companies/companySlice'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
// import ListingListItem from '../components/ListingListItem'
import NotesBlock from '../components/NotesBlock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GoogleMapBox from '../components/GoogleMapBox'
import {
    faPenToSquare,
    faIndustry,
    faLocationDot,
    faUsers,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import Spinner from '../components/Spinner'

function Company() {
    let { company } = useSelector((state) => state.companies)
    let [isLoading, setIsLoading] = useState(true)
    let [saveLoading, setSaveLoading] = useState(false)
    let [notesLoading, setNotesLoading] = useState(true)
    let [archiveLoading, setArchiveLoading] = useState(false)
    let [showArchiveText, setShowArchiveText] = useState(false)

    let navigate = useNavigate()
    let dispatch = useDispatch()
    let notesRef = useRef(null)

    let { companyId } = useParams()

    useEffect(() => {
        dispatch(getCompany(companyId)).then((res) => {
            // setFetchStatus(res.meta.requestStatus)
        })
        setTimeout(() => {
            setNotesLoading(false)
            setIsLoading(false)
        }, 500)
    }, [dispatch])

    function setNotesData(notes) {
        return <NotesBlock data={notes} />
    }

    function onDeleteCompany() {
        dispatch(deleteCompany(companyId))
            .unwrap()
            .then((res) => {
                
            })
            .catch(toast.error)
        toast('Company deleted', {
            autoClose: 3000,
        })
        navigate('/companies')
    }

    function invalidCompany() {
        setArchiveLoading(true)
        let data = {
            ...company,
            isValid: !company.isValid,
        }
        dispatch(updateCompany({ companyId, companyData: data }))
            .unwrap()
            .then(() => {
                dispatch(getCompany(companyId))
            })
        setTimeout(() => {
            setArchiveLoading(false)
            setShowArchiveText(true)
            setTimeout(() => {
                setShowArchiveText(false)
            }, 3000)
        }, 100)
    }

    async function submitNote(e) {
        e.preventDefault()
        if (notesRef.current.value === '') return
        setSaveLoading(true)
        setNotesLoading(true)
        notesRef.current.disabled = true
        let currDate = Date.now()
        let saveData = {
            ...company,
            notes: {
                ...company.notes,
                [currDate]: notesRef.current.value,
            },
        }
        dispatch(updateCompany({ companyId, companyData: saveData }))
            .unwrap()
            .then(() => {
                dispatch(getCompany(companyId))
                notesRef.current.disabled = false
                setSaveLoading(false)
                setNotesData(company.notes)

                notesRef.current.value = ''
                toast('Note added!', {
                    autoClose: 5000,
                })
                setNotesLoading(false)
            })
    }

    if (isLoading) return <FullPageSpinner />

    return (
        <div className='page company'>
            <div className='header flex gap-5 items-center w-full'>
                {company.logoUrl && (
                    <img
                        src={company.logoUrl}
                        alt={`Logo for ${company.name}`}
                    />
                )}
                <h1>{company.name}</h1>
                <Link to={`/company/edit/${company.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                <div
                    className={
                        'badge ml-auto px-5 py-4 ' +
                        (company.isValid
                            ? 'badge-secondary badge-outline '
                            : 'badge-error text-white')
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
            <GoogleMapBox address={company.location} />

            <div className='notes'>
                <h2>Notes</h2>
                {notesLoading ? <Spinner /> : setNotesData(company.notes)}
                <form onSubmit={submitNote} className='mt-3'>
                    <label htmlFor='notes'>
                        <h3>Add Note</h3>
                        <textarea
                            name='notes'
                            id='notes'
                            ref={notesRef}
                        ></textarea>
                    </label>
                    <div className='flex justify-end mb-8 w-full'>
                        <button type='submit' className='btn btn-secondary'>
                            {saveLoading && <Spinner />} Save
                        </button>
                    </div>
                </form>
            </div>
            <h2 className='mt-7'>Listings from {company.name}</h2>
            <div className='listingsDetailList wideList mt-5 mb-8'>
                {company.listings && company.listings.length === 0 && (
                    <p>This company has no listings, yet</p>
                )}
                <table>
                    <tbody>
                        {/* {company.listings.map((listing) => (
                            <ListingListItem
                                key={listing.id}
                                listing={listing}
                            />
                        ))} */}
                    </tbody>
                </table>
            </div>
            <div className='bottom pb-10 mb-10 flex justify-between items-center'>
                <button
                    className='delete btn btn-secondary text-white shadow-sm shadow-accent/75 hover:btn-error hover:text-white'
                    onClick={onDeleteCompany}
                >
                    Delete Company <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <div className='archive flex gap-5 items-center'>
                    {archiveLoading && <Spinner size={'small'} />}
                    <span
                        className={
                            'text-error hideText ' +
                            (showArchiveText && 'showText')
                        }
                    >
                        Saved!
                    </span>
                    <div
                        className={
                            'btn shadow-sm shadow-accent/75 hover:btn-error hover:text-white ' +
                            (company.isValid
                                ? 'btn-secondary text-white'
                                : 'btn-ghost text-secondary hover:text-white')
                        }
                        onClick={invalidCompany}
                    >
                        {company.isValid ? 'Mark Invalid' : 'Mark Valid'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Company
