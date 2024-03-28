import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export function useAuthStatus() {
    let [loggedIn, setLoggedIn] = useState(false)
    let [checkingStatus, setCheckingStatus] = useState(true)

    let { user } = useSelector((state) => state.auth)
    useEffect(() => {

        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
        setCheckingStatus(false)
    }, [user])

    return { loggedIn, checkingStatus }
}
