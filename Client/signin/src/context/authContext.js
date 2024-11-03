import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticate, setIsAuthenticate] = useState(false);

    const StoreData = JSON.parse(localStorage.getItem('user_data'));

    useEffect(() => {
        if (StoreData) {
            const { userToken, user } = StoreData;
            setToken(userToken);
            setUserData(user);
            setIsAuthenticate(true);
        }
    }, []);

    const login = (newToken, newData) => {
        localStorage.setItem('user_data', JSON.stringify({ userToken: newToken, user: newData }));
        setToken(newToken);
        setUserData(newData);
        setIsAuthenticate(true);
    };

    const logout = () => {
        localStorage.removeItem('user_data'); // Clear user data
        setToken(null);
        setUserData(null);
        setIsAuthenticate(false);
        
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticate, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
