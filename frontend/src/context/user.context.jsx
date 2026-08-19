import { createContext, useState, useEffect } from 'react'
import axios from '../config/axios'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                setLoading(false)
                return
            }

            try {
                const res = await axios.get('/users/profile')
                setUser(res.data.user)
            } catch (error) {
                console.error('Failed to load user:', error)
                localStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading
            }}
        >
            {children}
        </UserContext.Provider>
    )
}