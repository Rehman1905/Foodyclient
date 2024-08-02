'use client'
import Image from "next/image";
import basket from './image/basket.png'
import userImg from './image/user.png'
import style from './layout.module.css'
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { userContext } from "../context/userContext";
export default function UserLayout({ children }) {
    const path = usePathname()
    const [user,setUser]=useContext(userContext)
    const logout=useCallback(()=>{
        localStorage.removeItem('user')
        setUser({
            username:''
        })
    },[])
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <main className={style.main}>
            <nav className={style.nav} style={{display:isMobile?'none':'flex'}}>
                <div style={{ backgroundColor: path == '/user/profile' ? '#ee9991':null}}>
                    <Image src={userImg} alt="user" height={30} width={30} />
                    <Link style={{color:path== '/user/profile' ? '#D63626': '#828282'}} href={'/user/profile'}>Profile</Link>
                </div>
                <div style={{ backgroundColor: path == '/user/basket' ? '#ee9991' : null}}>
                    <Image src={basket} alt="basket" height={30} width={30} />
                    <Link style={{color:path== '/user/basket' ? '#D63626': '#828282'  }} href={'/user/basket'}>Your Basket</Link>
                </div>
                <div style={{ backgroundColor: path == '/user/orders' ? '#ee9991' : null }}>
                    <Image src={basket} alt="basket" height={30} width={30} />
                    <Link style={{color:path == '/user/orders'  ? '#D63626': '#828282' }} href={'/user/orders'}>Your Orders</Link>
                </div>
                <div style={{ backgroundColor: path == '/user/checkout' ? '#ee9991' : null }}>
                    <Image src={basket} alt="basket" height={30} width={30} />
                    <Link style={{color:path == '/user/checkout' ? '#D63626':'#828282' }} href={'/user/checkout'}>Checkout</Link>
                </div>
                <div>
                    <Image src={basket} alt="basket" height={30} width={30} />
                    <Link onClick={logout} style={{color:'#828282'}} href={'/'}>Logout</Link>
                </div>
            </nav >
            {children}
        </main>
    )
}