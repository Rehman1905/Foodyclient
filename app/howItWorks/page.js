'use client'
import Image from 'next/image'
import style from './how.module.css'
import back from './image/back.png'
import delivery from './image/delivery.png'
import { useContext } from 'react'
import { languageContext } from '../context/languageContext'
export default function HowWork() {
    const [language,setLanguage]=useContext(languageContext)
    return (
        <>
            <section className={style.sec}>
                <div className={style.textDiv}>
                    <h2>{language[0].howWork.work}</h2>
                    <p>{language[0].howWork.body}</p>
                </div>
                <div className={style.imgDiv}>
                    <Image className={style.delivery} src={delivery} width={400} height={500} alt='delivery' />
                    <Image className={style.back} src={back} width={300} height={400} alt='back' />
                </div>
            </section>
        </>
    )
}