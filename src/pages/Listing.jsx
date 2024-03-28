import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import FullPageSpinner from '../components/FullPageSpinner'
import {
    getListing,
    updateListing,
    deleteListing,
} from '../features/listings/listingSlice'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import NotesBlock from '../components/NotesBlock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GoogleMapBox from '../components/GoogleMapBox'
import {
    faPenToSquare,
    faArrowUpRightFromSquare,
    faGripLinesVertical,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import CompanyCard from '../components/CompanyCard'
import TextBlockFormat from '../components/TextBlockFormat'
import { daysSince, formatDate } from '../features/global/globalService'
import Spinner from '../components/Spinner'
import Modal from 'react-modal'

Modal.setAppElement('#root')

function Listing() {
    let { listing } = useSelector((state) => state.listings)
    let [isLoading, setIsLoading] = useState(true)
    let [saveLoading, setSaveLoading] = useState(false)
    let [fetchStatus, setFetchStatus] = useState(null)
    let [notesLoading, setNotesLoading] = useState(false)
    let [modalIsOpen, setModalIsOpen] = useState(false)
    let [appliedLoading, setAppliedLoading] = useState(false)
    let [responseLoading, setResponseLoading] = useState(false)
    let [archiveLoading, setArchiveLoading] = useState(false)
    let [showArchiveText, setShowArchiveText] = useState(false)

    let navigate = useNavigate()
    let dispatch = useDispatch()
    let notesRef = useRef(null)

    let daysAgo = daysSince(listing.datePosted)

    let { listingId } = useParams()

    // Open/close modal
    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    useEffect(() => {
        dispatch(getListing(listingId)).then((res) => {
            setFetchStatus(res.meta.requestStatus)
        })
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [dispatch])

    function setNotesData(notes) {
        return <NotesBlock data={notes} />
    }

    async function submitNote(e) {
        e.preventDefault()
        if (notesRef.current.value === '') return
        setSaveLoading(true)
        setNotesLoading(true)
        notesRef.current.disabled = true
        let currDate = Date.now()
        let saveData = {
            ...listing,
            notes: {
                ...listing.notes,
                [currDate]: notesRef.current.value,
            },
        }
        dispatch(updateListing({ listingId, listingData: saveData }))
            .unwrap()
            .then(() => {
                dispatch(getListing(listingId))
                notesRef.current.disabled = false
                setSaveLoading(false)
                setNotesData(listing.notes)

                notesRef.current.value = ''
                toast('Note added!', {
                    autoClose: 5000,
                })
                setNotesLoading(false)
            })
            .catch((err) => {})
    }

    function saveOption(e) {
        let field = e.target.id === '' ? e.target.dataset.field : e.target.id
        let value =
            field === 'isApplied' ? e.target.dataset.value : e.target.value
        e.target.id === 'response' || e.target.id === 'responseData'
            ? setResponseLoading(true)
            : setAppliedLoading(true)

        let data = {
            ...listing,
            [field]: value,
        }
        dispatch(updateListing({ listingId, listingData: data }))
            .unwrap()
            .then(() => {
                dispatch(getListing(listingId))
            })
        setTimeout(() => {
            e.target.id === 'response' || e.target.id === 'responseData'
                ? setResponseLoading(false)
                : setAppliedLoading(false)
        }, 100)
    }

    function archiveListing() {
        setArchiveLoading(true)
        let data = {
            ...listing,
            isArchived: listing.isArchived ? false : true,
        }
        dispatch(updateListing({ listingId, listingData: data }))
            .unwrap()
            .then(() => {
                dispatch(getListing(listingId))
            })
        setTimeout(() => {
            setArchiveLoading(false)
            setShowArchiveText(true)
            setTimeout(() => {
                setShowArchiveText(false)
            }, 3000)
        }, 100)
    }

    function onDeleteListing() {
        dispatch(deleteListing(listingId))
            .unwrap()
            .then((res) => {})
            .catch(toast.error)
        toast('Listing deleted', {
            autoClose: 3000,
        })
        navigate('/listings')
    }

    if (fetchStatus === 'rejected') navigate('/notFound')
    if (isLoading) return <FullPageSpinner />

    return (
        <div className='page listing'>
            <div className='header flex gap-5 items-center w-full flex-wrap items-end'>
                {listing.company && listing.company.logoUrl && (
                    <img
                        src={listing.company.logoUrl}
                        alt={`Logo for ${listing.company.name}`}
                    />
                )}

                <h1>{listing.title}</h1>
                <Link to={`/listing/edit/${listing.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
            </div>
            <div className='underHeader flex gap-3 ml-8 items-center mb-8'>
                <p
                    className={
                        ' ' +
                        (listing.isApplied ? 'text-primary' : 'text-secondary')
                    }
                >
                    {listing.isApplied ? 'Applied' : 'Not Applied'}
                </p>
                {listing.isArchived && (
                    <>
                        <FontAwesomeIcon icon={faGripLinesVertical} />
                        <p className='text-error'>Archived</p>
                    </>
                )}
                {listing.remoteStatus && (
                    <>
                        <FontAwesomeIcon icon={faGripLinesVertical} />
                        <p
                            className={
                                listing.remoteStatus === 'Remote'
                                    ? 'text-primary'
                                    : 'text-secondary'
                            }
                        >
                            {listing.remoteStatus}
                        </p>
                    </>
                )}
                {listing.type && (
                    <>
                        <FontAwesomeIcon icon={faGripLinesVertical} />
                        <p
                            className={
                                listing.type === 'Full Time'
                                    ? 'text-primary'
                                    : 'text-secondary'
                            }
                        >
                            {listing.type}
                        </p>
                    </>
                )}
                {listing.seniority && (
                    <>
                        <FontAwesomeIcon icon={faGripLinesVertical} />
                        <p className='text-secondary'>{listing.seniority}</p>
                    </>
                )}
            </div>
            {listing.pay && (
                <div className='pay ml-5 text-3xl text-primary'>
                    {listing.pay > 0 && '$'}
                    {listing.pay}
                    {listing.payBasis && <>/{listing.payBasis}</>}
                </div>
            )}
            {listing.schedule && (
                <div className='schedule mb-8 ml-8 text-primary/50'>
                    {listing.schedule}
                </div>
            )}
            {listing.company ? (
                <>
                    <CompanyCard company={listing.company} />
                    {listing.company.location && (
                        <GoogleMapBox address={listing.company.location} />
                    )}
                </>
            ) : (
                <>
                    Company not found 
                </>
            )}

            <div className='dates flex items-center ml-5 mb-5 text-secondary/75 text-lg gap-5'>
                {listing.closingDate && (
                    <div className='closes'>
                        Closes {formatDate(listing.closingDate, false)}
                    </div>
                )}
                {listing.ClosingDate && listing.datePosted && (
                    <FontAwesomeIcon icon={faGripLinesVertical} />
                )}
                {listing.datePosted && (
                    <div className='posted'>
                        Posted {formatDate(listing.datePosted, false)}{' '}
                        <span
                            className={`daysAgo ${
                                daysAgo > 29 && 'text-error'
                            }`}
                        >
                            ({daysAgo} days ago)
                        </span>
                    </div>
                )}
            </div>
            <div className='btn btn-secondary my-8' onClick={openModal}>
                Manage Application Status
            </div>
            <div className='2xl:flex gap-5'>
                <div className='side sideDetails'>
                    {(listing.directLink || listing.sourceLink) && (
                        <>
                            <h2 className='mb-2 mt-4'>Posted</h2>
                            <div className='buttons my-3 flex gap-3'>
                                {listing.directLink && (
                                    <div
                                        className='btn btn-secondary'
                                        onClick={() => {
                                            window.open(
                                                listing.directLink,
                                                '_blank'
                                            )
                                        }}
                                    >
                                        View Company Post
                                        <FontAwesomeIcon
                                            icon={faArrowUpRightFromSquare}
                                        />
                                    </div>
                                )}
                                {listing.sourceLink && (
                                    <div
                                        className='btn btn-secondary'
                                        onClick={() => {
                                            window.open(
                                                listing.sourceLink,
                                                '_blank'
                                            )
                                        }}
                                    >
                                        {listing.source
                                            ? `View on ${listing.source}`
                                            : 'View Source'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {listing.skillsList.length > 0 && (
                        <div className='skills m2 text-lg my-8'>
                            <h2>Skills</h2>
                            <div className='skillsList flex gap-5'>
                                {listing.skillsList.map((item, i) => {
                                    return (
                                        <div className='skill' key={i}>
                                            {item.name}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {listing.description && (
                        <div className='desc m-2 text-lg my-8'>
                            <h2>Job Description</h2>
                            <TextBlockFormat data={listing.description} />
                        </div>
                    )}
                    {listing.qualifications && (
                        <div className='desc m-2 text-lg my-8'>
                            <h2>
                                <span className='mr-6'>Qualifications</span>
                                {listing.education && (
                                    <div className='badge badge-secondary p-3'>
                                        {listing.education}
                                    </div>
                                )}
                            </h2>
                            <TextBlockFormat data={listing.qualifications} />
                        </div>
                    )}
                    {listing.benefits && (
                        <div className='desc m-2 text-lg my-8'>
                            <h2>Benefits</h2>
                            <TextBlockFormat data={listing.benefits} />
                        </div>
                    )}
                </div>
                <div className='side notes grow'>
                    <h2 className='noteHeader mb-2'>Notes</h2>
                    {listing.company && (
                        <>
                            <div className='collapse collapse-arrow  mb-8 rounded-xl bg-white shadow-accent/15 shadow-sm'>
                                <input type='checkbox' />
                                <div className='collapse-title text-xl font-medium flex align-center'>
                                    <h2>Company Notes</h2>
                                </div>
                                <div className='collapse-content'>
                                    <NotesBlock data={listing.company.notes} />
                                </div>
                            </div>
                        </>
                    )}
                    <h2>Listing Notes</h2>
                    {notesLoading ? <Spinner /> : setNotesData(listing.notes)}

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
            </div>
            <div className='bottom pb-10 mb-10 flex justify-between items-center'>
                <button
                    className='delete btn btn-secondary text-white shadow-sm shadow-accent/75 hover:btn-error hover:text-white'
                    onClick={onDeleteListing}
                >
                    Delete Listing <FontAwesomeIcon icon={faTrashCan} />
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
                            (!listing.isArchived
                                ? 'btn-secondary text-white'
                                : 'btn-ghost text-secondary hover:text-white')
                        }
                        onClick={archiveListing}
                    >
                        {!listing.isArchived
                            ? 'Archive Listing'
                            : 'Unarchive Listing'}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel='Manage application'
                className='Modal'
                overlayClassName='Overlay'
            >
                <div className='header'>
                    <h1>Manage Application</h1>
                </div>
                <div className='formLine flex gap-10 mt-5 w-full'>
                    <label
                        className='flex gap-5 items-center mr-5'
                        htmlFor='isApplied'
                    >
                        <span>Applied?</span>
                        <div className='swap'>
                            <input
                                type='checkbox'
                                defaultChecked={listing.isApplied}
                                id='isApplied'
                                name='isApplied'
                            />
                            <div
                                className='swap-on swap-option bg-secondary text-white'
                                data-field='isApplied'
                                data-value='true'
                                onClick={saveOption}
                            >
                                YES
                            </div>
                            <div
                                className='swap-off swap-option bg-white border-2 border-secondary text-secondary'
                                data-field='isApplied'
                                data-value='false'
                                onClick={saveOption}
                            >
                                NO
                            </div>
                        </div>
                    </label>

                    {listing.isApplied && (
                        <label htmlFor='dateApplied'>
                            <span>Date Applied</span>
                            <input
                                id='dateApplied'
                                name='dateApplied'
                                type='date'
                                value={
                                    listing.dateApplied
                                        ? listing.dateApplied.split('T')[0]
                                        : ''
                                }
                                onChange={saveOption}
                                className='mb-0 w-min ml-5'
                            />
                        </label>
                    )}
                    {!listing.isApplied && (
                        <label
                            htmlFor='reasonNotApplied'
                            className='flex gap-5 grow items-center'
                        >
                            <span className='text-nowrap'>
                                Reason Not Applied
                            </span>
                            <input
                                id='reasonNotApplied'
                                name='reasonNotApplied'
                                type='text'
                                defaultValue={
                                    listing.reasonNotApplied
                                        ? listing.reasonNotApplied
                                        : ''
                                }
                                onBlur={saveOption}
                                className='grow'
                            />
                        </label>
                    )}
                    <div className='loaderBox'>
                        {appliedLoading && <Spinner size={'small'} />}
                    </div>
                </div>
                <label htmlFor='response' className='flex gap-5 grow flex-col'>
                    <span>Response</span>
                    <textarea
                        id='response'
                        name='response'
                        type='text'
                        defaultValue={listing.response ? listing.response : ''}
                        onBlur={saveOption}
                        className='grow'
                    ></textarea>
                </label>
                <div className='formLine flex gap-5'>
                    <label htmlFor='responseDate'>
                        <span>Response Date</span>
                        <input
                            id='responseDate'
                            name='responseDate'
                            type='date'
                            value={
                                listing.responseDate
                                    ? listing.responseDate.split('T')[0]
                                    : ''
                            }
                            onChange={saveOption}
                            className='mb-0 w-min ml-5'
                        />
                    </label>
                    {responseLoading && <Spinner size={'small'} />}
                </div>
                <div className='btn btn-secondary close' onClick={closeModal}>
                    X
                </div>
                <div className='bottomLine'>
                    <div className='bottomInfo text-secondary/70'>
                        Saves automatically!
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Listing
