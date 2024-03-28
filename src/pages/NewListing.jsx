import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import {
    createListing,
    getListing,
    updateListing,
} from '../features/listings/listingSlice'
import {
    payBasisTypes,
    jobTypes,
    remoteStatuses,
    seniorityTypes,
    educationLevels,
    sourceSites,
} from '../data/miscData'
import {
    createCompany,
    searchCompanies,
    clearCompanies,
} from '../features/companies/companySlice'
import {
    getSkills,
    getSkill,
    searchSkills,
    createSkill,
    checkSkills,
} from '../features/skills/skillsSlice'

function NewListing() {
    const { companies } = useSelector((state) => state.companies)
    const { skillsList } = useSelector((state) => state.skills)

    let { listing, isError, message } = useSelector((state) => state.listings)

    let { listingId } = useParams()

    let [showCompanies, setShowCompanies] = useState(false)
    let [showSources, setShowSources] = useState(false)
    let [showBasis, setShowBasis] = useState(false)
    let [showTypes, setShowTypes] = useState(false)
    let [showRemote, setShowRemote] = useState(false)
    let [showSen, setShowSen] = useState(false)
    let [showEdu, setShowEdu] = useState(false)
    let [showSkills, setShowSkills] = useState(false)
    let [isLoading, setIsLoading] = useState(false)
    let [isAddingCompany, setIsAddingCompany] = useState(false)
    let [nextPage, setNextPage] = useState(null)
    let [autoSave, setAutoSave] = useState(false)
    let [companyName, setCompanyName] = useState('')
    let [skillData, setSkillData] = useState([])

    let initialState = {
        title: '',
        companyID: 0,
        datePosted: '',
        skills: [],
        seniority: '',
        pay: '',
        payBasis: '',
        type: '',
        schedule: '',
        remoteStatus: '',
        education: '',
        description: '',
        benefits: '',
        qualifications: '',
        duration: '',
        directLink: '',
        closingDate: '',
        notes: [],
        source: '',
        sourceLink: '',
    }

    let [formData, setFormData] = useState(initialState)
    let {
        title,
        companyID,
        datePosted,
        skills,
        seniority,
        pay,
        payBasis,
        type,
        schedule,
        remoteStatus,
        education,
        description,
        benefits,
        qualifications,
        duration,
        directLink,
        closingDate,
        source,
        sourceLink,
    } = formData

    let navigate = useNavigate()
    let dispatch = useDispatch()

    let companyRef = useRef(null)

    let companyContent =
        showCompanies && companies ? mapData(companies, 'company') : ''
    let sourceContent =
        showSources && sourceSites ? mapData(sourceSites, 'source') : ''
    let basisContent =
        showBasis && payBasisTypes ? mapData(payBasisTypes, 'basis') : ''
    let typesContent = showTypes && jobTypes ? mapData(jobTypes, 'type') : ''
    let remoteContent =
        showRemote && remoteStatuses ? mapData(remoteStatuses, 'remote') : ''
    let senContent =
        showSen && seniorityTypes ? mapData(seniorityTypes, 'sen') : ''
    let eduContent =
        showEdu && educationLevels ? mapData(educationLevels, 'edu') : ''
    let skillsContent =
        showSkills && skillsList ? mapData(skillsList, 'skill') : ''

    function mapData(data, type) {
        let items = []
        let i = 0
        data.forEach((item) => {
            if (i > 9) return
            if (type === 'skill' && skills.includes(item.id.toString())) return

            items.push(
                <span
                    key={i}
                    data-id={item.id ? item.id : i}
                    data-type={type}
                    onClick={addValues}
                >
                    {item.name}
                </span>
            )
            i++
        })
        return items
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (listingId) {
            setIsLoading(true)
            dispatch(getListing(listingId))
                .unwrap()
                .then((response) => {
                    setFormData({ ...response })
                    setCompanyName(response.company.name)
                    setSkillData(response.skillsList)
                    setIsLoading(false)

                })
        } else {
            setFormData(initialState)
        }
    }, [dispatch, listingId, isError, message])

    function populateSkills(arr = [], updateForm = false) {
        let skillsArr = []
        let useArr = arr.length === 0 ? skills : arr
        useArr.forEach((item) => {
            dispatch(getSkill(+item))
                .unwrap()
                .then((res) => {
                    if (!res) return
                    let skillCheck = skillsArr.filter((item) => {
                        return +item.id === +res.id
                    })
                    if (skillCheck.length === 0) skillsArr.push(res)
                })
        })
        if (updateForm) {
            setFormData((prevState) => ({
                ...prevState,
                skills: useArr,
            }))
        }
        setSkillData(skillsArr)
    }

    async function addSkill(e) {
        let skillID = e.target.dataset.id

        let updateSkills = [...skills, +skillID]
        if (listingId) {
            let updated = {
                ...formData,
                skills: updateSkills,
            }
            dispatch(
                updateListing({
                    listingId,
                    listingData: updated,
                })
            )
                .unwrap()
                .then((res) => {
                    toast('Skill added', {
                        autoClose: 2000,
                    })
                    dispatch(getListing(listingId))
                })
                .catch(toast.error)
        }

        populateSkills(updateSkills, true)
    }

    async function addValues(e) {
        
        e.preventDefault()

        let type = e.target.dataset.type

        let text = e.target.innerText
        let field = ''
        if (type === 'skill') {
            addSkill(e)
            return
        }
        switch (type) {
            case 'company':
                setCompanyName(text)
                setFormData((prevState) => ({
                    ...prevState,
                    companyID: e.target.dataset.id,
                }))
                break
            case 'remote':
                field = 'remoteStatus'
                break
            case 'sen':
                field = 'seniority'
                break
            case 'edu':
                field = 'education'
                break
            case 'basis':
                field = 'payBasis'
                break
            default:
                field = type
                break
        }
        setFormData((prevState) => ({
            ...prevState,
            [field]: text,
        }))
    }

    async function handleFocus(e) {
        e.target.parentNode.parentNode.style.zIndex = 990
        switch (e.target.id) {
            case 'company':
                break
            case 'source':
                setShowSources(true)
                break
            case 'payBasis':
                setShowBasis(true)
                break
            case 'type':
                setShowTypes(true)
                break
            case 'remoteStatus':
                setShowRemote(true)
                break
            case 'seniority':
                setShowSen(true)
                break
            case 'education':
                setShowEdu(true)
                break
            case 'skills':
                dispatch(getSkills())
                setShowSkills(true)
                break
            default:
                break
        }
    }

    async function removeSkill(e) {
        e.preventDefault()

        let updateSkills = skills.filter((item) => {
            return +item !== +e.target.id
        })

        if (listingId) {
            dispatch(
                updateListing({
                    listingId,
                    listingData: {
                        ...formData,
                        skills: updateSkills,
                    },
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(getListing(listingId))
                })
                .catch(toast.error)
        }

        populateSkills(updateSkills, true)
    }

    async function removeFocus(e) {
        setTimeout(() => {
            e.target.parentNode.parentNode.style.zIndex = ''
            switch (e.target.id) {
                case 'companyName':
                    dispatch(clearCompanies())
                    setShowCompanies(false)
                    break
                case 'source':
                    setShowSources(false)
                    break
                case 'payBasis':
                    setShowBasis(false)
                    break
                case 'type':
                    setShowTypes(false)
                    break
                case 'remoteStatus':
                    setShowRemote(false)
                    break
                case 'seniority':
                    setShowSen(false)
                    break
                case 'education':
                    setShowEdu(false)
                    break
                case 'skills':
                    setShowSkills(false)
                    if (e.target.value !== '') {
                        handleSkillText(e.target.value)
                        e.target.value = ''
                    }

                    break
                default:
                    break
            }

            if (listingId && e.target.id !== 'skills') handleSubmit(e, true)
        }, 100)
    }

    async function createNewSkill(text) {
        
        let newSkill = await dispatch(createSkill({ name: text }))
            .unwrap()
            .then((newRes) => {
                return newRes
            })
        return newSkill
    }

    async function handleSkillText(text) {
        
        let splitText = text.split(',')
        let skillIDs = []
        for (let item of splitText) {
            let skill = await dispatch(
                checkSkills({ field: 'name', text: item })
            )
                .unwrap()
                .then((res) => {
                    if (res.length > 0) {
                        return res[0]
                    } else {
                        return null
                    }
                })
            skill = skill ? skill : await createNewSkill(item)
            skillIDs.push(+skill.id)
        }
        
        populateSkills([...skills, ...skillIDs], true)
    }

    async function handleChange(e) {
        let text = e.target.value
        if (e.target.id === 'companyName') {
            setShowCompanies(true)
            dispatch(searchCompanies({ field: 'name', text }))
            setCompanyName(text)
        } else if (e.target.id === 'skills') {
            let skillsText = e.target.value.split(',')

            dispatch(
                searchSkills({
                    field: 'name',
                    text: skillsText[skillsText.length - 1].trim(),
                })
            )
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: e.target.value,
            }))
        }
    }

    async function submitListing(autoSave = false) {
        if (listingId) {
            dispatch(updateListing({ listingId, listingData: formData }))
                .unwrap()
                .then((response) => {
                    if (!autoSave) {
                        !nextPage
                            ? navigate(`/listing/${response.id}`)
                            : navigate(nextPage)
                        toast('Listing saved!', {
                            autoClose: 2000,
                        })
                    }
                })
                .catch(toast.error)
        } else {
            dispatch(createListing(formData))
                .unwrap()
                .then((response) => {
                    !nextPage
                        ? navigate(`/listing/${response.id}`)
                        : navigate(nextPage)
                    toast('Listing created!', {
                        autoClose: 2000,
                    })
                })
                .catch(toast.error)
        }
    }

    async function addCompany() {
        setIsAddingCompany(true)
        dispatch(
            createCompany({
                name: companyRef.current.value,
            })
        )
            .then((response) => {
                setNextPage(`/company/edit/${response.payload.id}`)
                setFormData((prevState) => ({
                    ...prevState,
                    companyID: response.payload.id,
                }))
                setIsAddingCompany(false)
            })
            .then(submitListing())
    }

    async function handleSubmit(e, autoSave = false) {
        e.preventDefault()
        if (title === '') {
            toast.error('Please enter a title')
            companyRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        } else if (!listingId && companyRef.current.value === '') {
            toast.error('Please add a company')
            companyRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        } else {
            autoSave ? setAutoSave(true) : setIsLoading(true)
            if (companyID === 0) {
                addCompany()
            }
            if (!isAddingCompany) {
                submitListing(autoSave)
            }
            setTimeout(() => {
                autoSave ? setAutoSave(false) : setIsLoading(false)
            }, 150)
        }
    }

    if (isLoading)
        return (
            <div className='page'>
                <div className='spinnerWrap'>
                    <div className='spinnerInner'>
                        <Spinner />
                    </div>
                </div>
            </div>
        )

    return (
        <div className='page newListingPage'>
            <div className='autoSaveSpinner'>{autoSave && <Spinner />}</div>
            <div className='header flex gap-5 items-center'>
                <h1 className='text-primary pl-8'>New Listing</h1>
                {listingId && (
                    <Link
                        to={`/listing/${listing.id}`}
                        className='bg-white border border-secondary rounded-lg py-2 px-4 mt-3'
                    >
                        View Listing
                    </Link>
                )}
            </div>

            <form
                className='flex gap-8 mb-8 mt-5 flex-wrap formCols'
                onSubmit={handleSubmit}
            >
                <div className='col smallFields grow'>
                    <label htmlFor='title'>
                        <p>Title</p>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={title}
                            autoComplete='off'
                            onChange={handleChange}
                            onBlur={removeFocus}
                        />
                    </label>
                    <div className='formLine'>
                        <div className='autoComplete grow'>
                            <label htmlFor='company'>
                                <p>Company</p>
                                <input
                                    type='text'
                                    id='companyName'
                                    name='companyName'
                                    ref={companyRef}
                                    onBlur={removeFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    value={companyName}
                                />
                            </label>
                            <div className='box'>{companyContent}</div>
                        </div>
                        <label htmlFor='datePosted' className='narrow'>
                            <p>Date Posted</p>
                            <input
                                type='date'
                                id='datePosted'
                                name='datePosted'
                                onChange={handleChange}
                                autoComplete='off'
                                value={
                                    datePosted ? datePosted.split('T')[0] : ''
                                }
                            />
                        </label>
                    </div>

                    {/* End form line */}
                    <div className='formLine'>
                        <label htmlFor='pay' className='narrow'>
                            <p>Pay</p>
                            <input
                                type='text'
                                id='pay'
                                name='pay'
                                onChange={handleChange}
                                autoComplete='off'
                                value={pay}
                            />
                        </label>
                        <div className='autoComplete grow'>
                            <label htmlFor='payBasis' className='narrow'>
                                <p>Pay Basis</p>
                                <input
                                    type='text'
                                    id='payBasis'
                                    name='payBasis'
                                    onFocus={handleFocus}
                                    onBlur={removeFocus}
                                    onChange={handleChange}
                                    // autoComplete='off'
                                    value={payBasis}
                                />
                            </label>
                            <div className='box'>{basisContent}</div>
                        </div>
                        <div className='autoComplete grow'>
                            <label htmlFor='type'>
                                <p>Type</p>
                                <input
                                    type='text'
                                    id='type'
                                    name='type'
                                    onFocus={handleFocus}
                                    onBlur={removeFocus}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    value={type}
                                />
                            </label>
                            <div className='box'>{typesContent}</div>
                        </div>
                    </div>
                    {/* End form line */}
                    <div className='formLine'>
                        <div className='autoComplete grow'>
                            <label htmlFor='seniority'>
                                <p>Seniority</p>
                                <input
                                    type='text'
                                    id='seniority'
                                    name='seniority'
                                    onFocus={handleFocus}
                                    onBlur={removeFocus}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    value={seniority}
                                />
                            </label>
                            <div className='box'>{senContent}</div>
                        </div>

                        <div className='autoComplete grow'>
                            <label htmlFor='remoteStatus'>
                                <p>Remote Status</p>
                                <input
                                    type='text'
                                    id='remoteStatus'
                                    name='remoteStatus'
                                    onFocus={handleFocus}
                                    onBlur={removeFocus}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    value={remoteStatus}
                                />
                            </label>
                            <div className='box'>{remoteContent}</div>
                        </div>
                        <label htmlFor='closingDate'>
                            <p>Closing Date</p>
                            <input
                                type='date'
                                id='closingDate'
                                name='closingDate'
                                onFocus={handleFocus}
                                onBlur={removeFocus}
                                onChange={handleChange}
                                autoComplete='off'
                                value={
                                    closingDate ? closingDate.split('T')[0] : ''
                                }
                            />
                        </label>
                    </div>
                    {/* end form line */}
                    <div className='formLine'>
                        <label htmlFor='schedule'>
                            <p>Schedule</p>
                            <input
                                type='text'
                                id='schedule'
                                name='schedule'
                                onChange={handleChange}
                                autoComplete='off'
                                value={schedule}
                            />
                        </label>
                        <label htmlFor='duration'>
                            <p>Duration</p>
                            <input
                                type='text'
                                id='duration'
                                name='duration'
                                onChange={handleChange}
                                autoComplete='off'
                                value={duration}
                            />
                        </label>
                    </div>
                    {/* end form line */}

                    <label htmlFor='directLink'>
                        <p>Direct Link</p>
                        <input
                            type='text'
                            id='directLink'
                            name='directLink'
                            onChange={handleChange}
                            autoComplete='off'
                            value={directLink}
                        />
                    </label>

                    <div className='formLine'>
                        <div className='autoComplete grow sourceBox'>
                            <label htmlFor='source'>
                                <p>Source</p>
                                <input
                                    type='text'
                                    id='source'
                                    name='source'
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={removeFocus}
                                    autoComplete='off'
                                    value={source ? source : ''}
                                />
                            </label>
                            <div className='box'>{sourceContent}</div>
                        </div>
                        <label htmlFor='sourceLink'>
                            <p>Source Link</p>
                            <input
                                type='text'
                                id='sourceLink'
                                name='sourceLink'
                                onChange={handleChange}
                                autoComplete='off'
                                value={sourceLink ? sourceLink : ''}
                            />
                        </label>
                    </div>
                    {/* end form line */}

                    <div className='skillsLine'>
                        <div className='autoComplete grow'>
                            <label htmlFor='skills'>
                                <p>Skills</p>
                                <input
                                    type='text'
                                    id='skills'
                                    name='skills'
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={removeFocus}
                                    autoComplete='off'
                                />
                            </label>

                            <div className='box'>{skillsContent}</div>
                        </div>
                    </div>
                    <div className='skillsBox px-10 flex gap-5 flex-wrap'>
                        {skillData.map((skill, i) => {
                            return (
                                <p
                                    key={i}
                                    className='skill p-2 bg-secondary/15 w-min border border-secondary rounded-md flex gap-2'
                                >
                                    {skill.name}{' '}
                                    <span
                                        className='cursor-pointer hover:text-primary/50'
                                        id={skill.id}
                                        onClick={removeSkill}
                                    >
                                        x
                                    </span>
                                </p>
                            )
                        })}
                    </div>
                </div>

                {/* end col */}
                <div className='col largeFields flex flex-col'>
                    <label htmlFor='description' className='grow flex flex-col'>
                        <p>Description</p>
                        <textarea
                            className='grow'
                            id='description'
                            name='description'
                            onChange={handleChange}
                            autoComplete='off'
                            value={description}
                        ></textarea>
                    </label>
                    <div className='autoComplete grow'>
                        <label htmlFor='education'>
                            <p>Education</p>
                            <input
                                type='text'
                                id='education'
                                name='education'
                                onFocus={handleFocus}
                                onBlur={removeFocus}
                                onChange={handleChange}
                                autoComplete='off'
                                value={education}
                            />
                        </label>
                        <div className='box'>{eduContent}</div>
                    </div>
                    <label
                        htmlFor='qualifications'
                        className='grow flex flex-col'
                    >
                        <p>Qualifications</p>
                        <textarea
                            className='grow'
                            id='qualifications'
                            name='qualifications'
                            onChange={handleChange}
                            autoComplete='off'
                            value={qualifications}
                        ></textarea>
                    </label>
                    <label htmlFor='benefits' className='grow flex flex-col'>
                        <p>Benefits</p>
                        <textarea
                            className='grow'
                            id='benefits'
                            name='benefits'
                            onChange={handleChange}
                            autoComplete='off'
                            value={benefits}
                        ></textarea>
                    </label>
                </div>
                <div className='flex justify-end mb-8 w-full'>
                    <button type='submit' className='btn btn-secondary'>
                        Save
                    </button>
                </div>
                {/* end col */}
            </form>
        </div>
    )
}

export default NewListing
