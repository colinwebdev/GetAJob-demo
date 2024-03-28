import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import FullPageSpinner from '../components/FullPageSpinner'

import {
    createCompany,
    getCompany,
    updateCompany,
} from '../features/companies/companySlice'

function NewCompany() {
    let [isLoading, setIsLoading] = useState(false)
    let { isError, message } = useSelector((state) => state.companies)
    let { companyId } = useParams()
    let navigate = useNavigate()
    let dispatch = useDispatch()

    let [formData, setFormData] = useState({
        name: '',
        location: '',
        commuteTime: '',
        logoUrl: '',
        size: '',
        industry: '',
        notes: '',
    })

    let { name, location, commuteTime, logoUrl, size, industry, notes } =
        formData

    let logoRef = useRef(null)

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (companyId) {
            setIsLoading(true)
            dispatch(getCompany(companyId)).then((response) => {
                setFormData({ ...response.payload })
                setIsLoading(false)
            })
        }
    }, [companyId, dispatch])

    async function handleChange(e) {
        let text = e.target.value
        let field = e.target.id

        switch (field) {
            case 'logoUrl':
                logoRef.current.innerHTML = `<img src='${text}'>`
                break
            default:
                break
        }
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (companyId) {
            dispatch(updateCompany({ companyId, companyData: formData }))
                .unwrap()
                .then((response) => {
                    navigate('/companies')

                    toast('Company saved', {
                        autoClose: 3000,
                    })
                })
                .catch(toast.error)
        } else {
            dispatch(createCompany(formData))
                .unwrap()
                .then(() => {
                    navigate('/companies')
                    toast('Company created', {
                        autoClose: 3000,
                    })
                })
                .catch(toast.error)
        }
    }

    if (isLoading) return <FullPageSpinner />

    return (
        <div className='page newCompanyPage'>
            <div className='header'>
                <h1 className='text-primary pl-8'>
                    {companyId ? 'Edit' : 'New'} Company
                </h1>
            </div>

            <form
                className='flex gap-8 mb-8 mt-5 flex-wrap'
                onSubmit={handleSubmit}
            >
                <div className='grow side'>
                    <label htmlFor='name'>
                        <p>Name</p>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={name}
                            onChange={handleChange}
                            autoComplete='off'
                        />
                    </label>

                    <label htmlFor='location'>
                        <p>Location</p>
                        <textarea
                            id='location'
                            name='location'
                            value={location}
                            onChange={handleChange}
                        ></textarea>
                    </label>
                    <label htmlFor='commute'>
                        <p>Commute Time</p>
                        <input
                            type='text'
                            id='commuteTime'
                            name='commuteTime'
                            onChange={handleChange}
                            value={commuteTime}
                        />
                    </label>

                    <label htmlFor='logo'>
                        <p>Logo URL</p>
                        <input
                            type='text'
                            id='logoUrl'
                            name='logoUrl'
                            value={logoUrl}
                            onChange={handleChange}
                            autoComplete='off'
                        />
                    </label>
                    <div className='formLine'>
                        <label htmlFor='industry'>
                            <p>Industry</p>
                            <input
                                type='text'
                                id='industry'
                                name='industry'
                                value={industry}
                                onChange={handleChange}
                            />
                        </label>
                        <label htmlFor='size'>
                            <p>Company Size</p>
                            <input
                                type='text'
                                id='size'
                                name='size'
                                value={size}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    {!companyId && (
                        <label htmlFor='notes'>
                            <p>Notes</p>
                            <textarea
                                name='notes'
                                id='notes'
                                onChange={handleChange}
                                value={notes}
                            ></textarea>
                        </label>
                    )}

                    <div className='flex justify-end mb-8 w-full'>
                        <button type='submit' className='btn btn-secondary'>
                            Save
                        </button>
                    </div>
                </div>
                <div className='side'>
                    <div className='logo' ref={logoRef}></div>
                </div>
            </form>
        </div>
    )
}

export default NewCompany
