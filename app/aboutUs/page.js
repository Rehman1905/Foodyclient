'use client'
import Image from 'next/image'
import style from './about.module.css'
import backImg from './image/background.png'
import burger from './image/burger.png'
import pizza from './image/pizza.png'
import soup from './image/soup.png'
import coffee from './image/coffee.png'
import stars from './image/stars.png'
import { useContext } from 'react'
import { languageContext } from '../context/languageContext'
export default function About() {
    const [language, setLanguage] = useContext(languageContext)
    return (
        <>
            <section className={style.sec}>
                <div className={style.text}>
                    <h2>{language[0].nav.about}</h2>
                    <p>{language[0].about.body}</p>
                </div>
                <div className={style.container}>
                    <Image width={600} height={600} src={backImg} alt='back' />
                    <div className={style.mainDiv}>
                        <Image className={style.food} width={100} height={100} src={burger} alt='burger' />
                        <h3>Hamburger</h3>
                        <Image src={stars} alt='stars' />
                        <p>$5.90</p>
                    </div>
                    <div className={`${style.mainDiv} ${style.divPizza}`}>
                        <Image className={style.food} width={100} height={100} src={pizza} alt='pizza' />
                        <h3>Sousage Pizza</h3>
                        <Image src={stars} alt='stars' />
                        <p>$7.90</p>
                    </div>
                    <div className={`${style.mainDiv} ${style.divSoup}`}>
                        <Image className={style.food} width={100} height={100} src={soup} alt='soup' />
                        <h3>Tomato Soup</h3>
                        <Image src={stars} alt='stars' />
                        <p>$7.90</p>
                    </div>
                    <div className={`${style.mainDiv} ${style.divCoffee}`}>
                        <Image className={style.food} width={100} height={100} src={coffee} alt='coffee' />
                        <h3>Papa Coffee</h3>
                        <Image src={stars} alt='stars' />
                        <p>$1.40</p>
                    </div>
                </div>
            </section>
        </>
    )
}