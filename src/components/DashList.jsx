import { Link } from 'react-router-dom'

function DashList({ listType, data }) {
    return (
        <div className='dashList flex flex-col gap-5'>
            {data &&
                data.map((item, i) => {
                    return (
                        <Link
                            key={i}
                            to={
                                listType === 'skills'
                                    ? `/listing/filter/skill?${item.id}`
                                    : `/listing/${item.id}`
                            }
                            className='bg-white shadow-sm shadow-accent/15 p-3 w-full block rounded-md flex justify-between'
                        >
                            {item.title}
                            {listType === 'skills' && (
                                <span className='skillCount'>{item.count}</span>
                            )}
                        </Link>
                    )
                })}
        </div>
    )
}

export default DashList
