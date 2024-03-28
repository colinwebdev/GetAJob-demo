import { formatDate } from '../features/global/globalService'

function NotesBlock({ data }) {
    if (Object.keys(data).length === 0 || !data)
        return (
            <div className='noteBox'>
                <p>No notes, yet</p>
            </div>
        )
    function noteBody(noteData) {
        let notes = noteData.split('\n')
        return notes.map((item, i) => {
            return <p key={i}>{item}</p>
        })
    }

    let dates = Object.keys(data)
    return (
        <div className='noteBox'>
            {dates.map((item, i) => {
                return (
                    <div key={i} className='note'>
                        <div className='date'>{formatDate(+item)}</div>
                        <div className='noteBody'>{noteBody(data[item])}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default NotesBlock
