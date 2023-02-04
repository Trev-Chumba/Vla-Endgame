import React, { useState } from 'react';

export const UserContext = React.createContext({
    userData: {},
    setUserData : () => {},
    loginStatus: false,
    setLoginStatus: () => {}
})

export const UserContextProvider = (props) => {

    const [userData, setUserData] = useState({})
    const [loginStatus, setLoginStatus] = useState(false)

    const updateUserData = (newData) => {
        setUserData(newData)
    }

    const updateLoginStatus = (newStatus) =>{
        setLoginStatus(newStatus)
    }

    return(
        <UserContext.Provider value={
            {
                userData: userData,
                setUserData: updateUserData,
                loginStatus: loginStatus,
                setLoginStatus: updateLoginStatus

            }
        }
        >
            { props.children }    

        </UserContext.Provider>
    )

}

