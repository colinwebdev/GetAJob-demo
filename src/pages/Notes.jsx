import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import FullPageSpinner from '../components/FullPageSpinner'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import {
    getNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
} from '../features/notes/noteSlice'
import { formatDate } from '../features/global/globalService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPenToSquare,
    faTrashCan,
    faPlus,
    faNoteSticky,
} from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'
import TextBlockFormat from '../components/TextBlockFormat'

Modal.setAppElement('#root')

function Notes() {
    let { notes } = useSelector((state) => state.notes)
    let [isLoading, setIsLoading] = useState(true)
    let [saveLoading, setSaveLoading] = useState(false)
    let [modalIsOpen, setModalIsOpen] = useState(false)
    let [isEdit, setIsEdit] = useState(false)
    let [noteId, setNoteId] = useState(null)

    let notesRef = useRef(null)
    let dispatch = useDispatch()

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => {
        setModalIsOpen(false)
        setIsEdit(false)
        setNoteId(null)
    }

    let initialState = {
        body: '',
        createdAt: '',
        updatedAt: '',
    }
    let [formData, setFormData] = useState(initialState)

    let { body } = formData

    useEffect(() => {
        
        dispatch(getNotes())
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [dispatch])

    function formatNotes() {
        return notes.map((item) => {
            
            return (
                <div key={item.id} className='note'>
                    <div className='date flex justify-between items-center'>
                        {formatDate(item.createdAt)}
                        <div className='controls flex gap-3'>
                            <button
                                onClick={() => {
                                    editNote(item.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteNote(item.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                    <TextBlockFormat data={item.body} />
                    {item.createdAt !== item.updatedAt && (
                        <div className='edited p-2 text-secondary/75'>
                            Edited {formatDate(item.updatedAt)}
                        </div>
                    )}
                </div>
            )
        })
    }

    async function submitNote(e) {
        e.preventDefault()
        if (notesRef.current.value === '') return
        setSaveLoading(true)
        notesRef.current.disabled = true
        dispatch(createNote(formData))
            .unwrap()
            .then((res) => {
                setTimeout(() => {
                    dispatch(getNotes())
                    notesRef.current.disabled = false
                    setSaveLoading(false)
                    setFormData(() => ({
                        ...initialState
                    }))
                    toast('Note Added!', {
                        autoClose: 5000,
                    })
                    closeModal()
                }, 200)
            })
    }

    function saveNote(e) {
        e.preventDefault()
        setSaveLoading(true)
        notesRef.current.disabled = true
        dispatch(updateNote({ noteId, noteData: formData }))
            .unwrap()
            .then((res) => {
                setTimeout(() => {
                    dispatch(getNotes())
                    notesRef.current.disabled = false
                    setSaveLoading(false)
                    setFormData(() => ({
                        ...initialState
                    }))
                    toast('Note saved', {
                        autoClose: 3000,
                    })
                    closeModal()
                }, 200)
            })
    }

    async function editNote(noteId) {
        setIsEdit(true)
        setNoteId(noteId)
        dispatch(getNote(noteId))
            .unwrap()
            .then((res) => {
                setFormData({
                    ...res
                })
                setNoteId(res.id)
            })
        openModal()
    }

    async function handleChange(e) {
        setFormData(() => ({
            body: e.target.value,
        }))
    }

    function onDeleteNote(noteId) {
        dispatch(deleteNote(noteId))
            .unwrap()
            .then((res) => {
                dispatch(getNotes())
            })
            .catch(toast.error)
        toast('Note deleted', {
            autoClose: 3000,
        })
    }

    if (isLoading) return <FullPageSpinner />

    return (
        <div className='page notes'>
            <div className='header flex gap-10 justify-between items-center pr-10'>
                <h1>Notes</h1>
                <button
                    className='addNote text-primary hover:text-secondary'
                    onClick={openModal}
                >
                    <div className='iconWrap'>
                        <FontAwesomeIcon icon={faNoteSticky} size='4x' />
                    </div>
                    <div className='iconWrap text-white'>
                        <FontAwesomeIcon icon={faPlus} size='2x' />
                    </div>
                </button>
            </div>
            <div className='notes'>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className='noteBox'>
                        {notes.length > 0 ? (
                            formatNotes()
                        ) : (
                            <p>No notes, yet</p>
                        )}
                    </div>
                )}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel='Manage application'
                className='Modal'
                overlayClassName='Overlay'
            >
                <form
                    onSubmit={isEdit ? saveNote : submitNote}
                    className='mt-3'
                >
                    <label htmlFor='notes'>
                        <h3>{isEdit ? 'Edit' : 'Add'} Note</h3>
                        <textarea
                            name='notes'
                            id='notes'
                            ref={notesRef}
                            value={body}
                            onChange={handleChange}
                        ></textarea>
                    </label>
                    <div className='flex justify-end mb-8 w-full'>
                        <button type='submit' className='btn btn-secondary'>
                            {saveLoading && <Spinner />} Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Notes
