'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getUser, loginUser, registerUser } from '@/services/apis'

const Header = () => {
    const onLogin = async () => {
        try {
            const res = await loginUser({email: 'adarsh12@gmail.com', password: 'password'}) 
            console.log(res)
        }
        catch (error) {
            console.log(error);
        }
    }

    const onSignUp = async() => {
        try{
            const res = await registerUser({username: 'Adarsh12', email: 'adarsh12@gmail.com', password: 'password'})
            console.log(res)
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const handleUser = async () => {
            try {
                const res = await getUser();
                console.log(res);
            }
            catch (error) {
                console.log(error);
            }
        }
        handleUser();
    },[])

return (
    <header className="header flex justify-between items-center w-full px-4 py-8">
          <div className="header__logo text-xl font-bold">Stock-Sense</div>
          <div className="header__actions flex gap-4">
            <Button size={'lg'} onClick={onLogin}>
              <span className='text-lg'>Login</span>
            </Button>
            <Button size={'lg'} onClick={onSignUp}>
              <span className='text-lg'>Sign up</span>
            </Button>
        </div>
    </header>
);
}

export default Header