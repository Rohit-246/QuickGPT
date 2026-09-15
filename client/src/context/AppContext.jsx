import { createContext , useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { dummyChats, dummyUserData } from '../assets/assets'
import { useEffect } from 'react'


const AppContext = createContext()


export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
    const fetchuser = async () => {
        setUser(dummyUserData)
    }

   const fetchUsersChat = async () => {
    setChats(dummyChats)
    setSelectedChat(dummyChats[0])
   }

   useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
   }, [theme]);

   useEffect(() => {
    if (user) {
        fetchUsersChat();
    }   
    else {
        setChats([]);
        setSelectedChat(null);
    }
   }, [user]);

   useEffect(() => {
        fetchuser();
    }, []);


    const value = {
        navigate,
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        fetchuser
    }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()=> useContext(AppContext)