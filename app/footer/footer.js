'use client'
import Image from 'next/image'
import facebook from '../image/facebook.png'
import insta from '../image/insta.png'
import twitter from '../image/twitter.png'
import style from './footer.module.css'
import { useEffect, useState } from 'react'
export default function Footer() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(()=>{
        if (window) {
          setIsMobile(window.innerWidth <= 768);
        };
      },[])
    useEffect(() => {
        const handleResize = () => {
            if (window) {
                setIsMobile(window.innerWidth <= 768);
            }
        

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
        }
    }, []);
    return (
        <div className={style.container}>
            <div className={style.descriptionDiv}>
                <div className={style.foodyDiv}>
                    <h4>Foody<span>.</span></h4>
                    <p>Lorem ipsum is placeholder text commonly used in the graphic,</p>
                    <div>
                        <Image className={style.facebook} width={60} height={60} src={facebook} alt='facebook' />
                        <Image className={style.insta} width={60} height={60} src={insta} alt='insta' />
                        <Image className={style.twitter} width={60} height={60} src={twitter} alt='twitter' />
                    </div>
                </div>
                <div style={{ display: isMobile ? 'none' : 'flex' }} className={style.footerData}>
                    <div>
                        <h5>Popular</h5>
                        <p>Programming</p>
                        <p>Books for children</p>
                        <p>Psychology</p>
                        <p>Business</p>
                    </div>
                    <div>
                        <h5>Cash</h5>
                        <p>Delivery</p>
                        <p>Payment</p>
                        <p>About the store</p>
                    </div>
                    <div>
                        <h5>Help</h5>
                        <p>Contacts</p>
                        <p>Purchase returns</p>
                        <p>Buyer help</p>
                    </div>
                </div>
            </div>
            <div className={style.footerEnd}>
                All rights reserved © 2005-2024 Foody TERMS OF USE | Privacy Policy
            </div>
        </div>
    )
}