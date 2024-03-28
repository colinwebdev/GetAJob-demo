// Paragraphs to array
export function formatDate(timestamp, returnTime = true) {
    if (!timestamp) return 
    let d = new Date(timestamp)
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    let getHours = d.getHours()
    let getMinutes = d.getMinutes()
    let hours = getHours > 12 ? getHours - 12 : getHours === 0 ? 12 : getHours
    let minutes = getMinutes < 10 ? '0'+getMinutes : getMinutes
    let amPm = getHours < 12 ? 'AM' : 'PM'
    let fullDate = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
    let fullTime = `at ${hours}:${minutes} ${amPm}`
    if (returnTime) {
        return `${fullDate} ${fullTime}`
    }
    return fullDate 
}

export function daysSince(date) {
    let start = new Date(date)
    let end = Date.now()
    return Math.round((end - start) / (1000 * 3600 * 24))
    

}

export function paraToArray(data) {
    let newArr = data.split('\n')
    for (let i; i < newArr.length; i++) {
        if (newArr[i] === '') delete newArr[i]
    }
    return newArr
}

// Array to paragraphs
export function arrayToPara(data) {
    let newString = ''
    for (let i; i < data.length; i++) {
        newString += `<p>${data[i]}</p>`
    }
    return newString
}

export function arrayToString(data) {
    let newString = ''
    for (let i; i < data.length; i++) {
        newString += `${data[i]}\n`
    }
    return newString
}

export function getNextId(data) {
    if (!data || data.length === 0) return 1
    let sorted = data.sort((a, b) => a.id - b.id)
    return sorted[sorted.length - 1].id + 1
}

export function deleteById(data, id) {
    let i = data.findIndex((obj)=>{
        return obj.id === +id
    })
    let newData
    if (i===0) {
        newData = data.slice(1)
    } else if (i === data.length - 1) {
        newData = data.slice(0, -1)
    } else {
        newData = [...data.slice(0, i), ...data.slice(i + 1)]
    }

    return newData
}



export default formatDate
