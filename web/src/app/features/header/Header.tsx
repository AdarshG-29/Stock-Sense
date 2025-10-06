'use client'
import React, { useEffect } from 'react'
import { useUserDataStore } from '@/stores/userData/store'
import { getUserData, onLogout } from '@/services/authActions'
import Login from './LoginPopup'
import Signup from './Signup'
import { Button } from '@/components/ui/button'

const Header = () => {
    useEffect(() => {
        getUserData();
    },[])

    const name = useUserDataStore.use.name();
    const userId = useUserDataStore.use.userId();

return (
    <header className="header flex justify-between items-center w-full px-4 py-8">
          <div className="header__logo text-xl font-bold">Stock-Sense</div>
          {userId 
          ? 
          <div className='flex items-center gap-6'>
            <span className='text-sm font-medium text-gray-700'>{`Hello ${name}`}</span>
            <Button variant="default" onClick={onLogout}>Logout</Button>
        </div>
        :
        <div className="flex items-center gap-6">
            <Login />
            <Signup />
          </div>          
          }
    </header>
);
}

export default Header