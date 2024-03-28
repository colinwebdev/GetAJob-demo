import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowRight,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { deleteSkill } from '../features/skills/skillsSlice'
import { skillListings, updateListing } from '../features/listings/listingSlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

function SkillListItem({ data }) {
    
    let dispatch = useDispatch()

    function onDeleteSkill(e) {
        e.preventDefault()
        let card = e.target.parentNode.parentNode.parentNode
        let id = card.id
        
        dispatch(deleteSkill(id))
            .unwrap()
            .then(() => {
                card.classList.add('vShrink', 'fade')
                setTimeout(() => {
                    card.remove()
                }, 600)
            })
            .catch(toast.error)
        toast('Skill deleted', {
            autoClose: 3000,
        })

        dispatch(skillListings(id))
            .unwrap()
            .then((res) => {
                res.forEach((item) => {
                    let updateSkills = item.skills.filter((skill) => {
                        return skill !== id
                    })

                    dispatch(updateListing({
                        ...item,
                        skills: updateSkills
                    }))
                })
            })
    }


    return (
        <div className='skillCard' id={data.id}>
            <span className='name'>{data.name}</span>
            <span className='list grow'>
                {data.count > 0 ? (
                    <Link className='flex items-center gap-5' to={`/listings/filter/skill?id=${data.id}`}>
                        View {data.count} listings
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                ) : (
                    ''
                )}
            </span>
            <span
                className='remove text-secondary cursor-pointer hover:text-error'
                onClick={onDeleteSkill}
            >
                <FontAwesomeIcon icon={faTrash} size='lg' />
            </span>
        </div>
    )
}

export default SkillListItem
