function TextBlockFormat({ data }) {
    if (!data) return
    let breaks = data.split('\n')

    function handleBlocks(items) {
        let content = []
        let listItems = []
        items.forEach((item, i) => {
            if (item.startsWith('-')) {
                let newItem = item.replace('- ', '')
                listItems.push(newItem)
            }
            if (!item.startsWith('-') && listItems.length > 0) {
                content.push(<ul key={i}>{handleList(listItems)}</ul>)
                listItems= []
            }

            if (listItems.length === 0) {
                if (item !== '') content.push(<p key={i}>{item}</p>)
            }
        })
        if (listItems.length > 0) {
          content.push(<ul key={listItems.length+5}>{handleList(listItems)}</ul>)
          listItems= []
        }
        return content
    }

    function handleList(items) {
        let listItems = []
        items.forEach((item, i) => {
            listItems.push(<li key={`${i}-li`}>{item}</li>)
        })
        return listItems
    }

    return <div className='textBlock'>{handleBlocks(breaks)}</div>
}

export default TextBlockFormat
