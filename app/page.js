'use client'
import Image from 'next/image'
import style from './home.module.css'
import bigBurger from './image/burger.png'
import free from './image/free.png'
import pizza from './image/pizza.png'
import smallBurger from './image/miniburger.png'
import bigPerson from './image/bigPerson.png'
import soup from './image/soup.png'
import express from './image/express.png'
import dubbleBurger from './image/dubbleBurger.png'
import twister from './image/twister.png'
import margarita from './image/margaritta.png'
import pizzaDiscover from './image/pizzaDiscover.png'
import { useCallback, useEffect, useState } from 'react'
import leftImg from './image/leftRed.png'
import rightImg from './image/rightRed.png'
import axios from 'axios'
import { useRouter } from 'next/navigation'
export default function Home() {
    const [offer, setOffer] = useState([])
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axios.get('/api/offer')
                setOffer(response.data.result.data)
            } catch (error) {
                console.error('Error fetching offers:', error)
            }
        }
        fetchOffers()
    }, [])
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const router = useRouter()
    const singUp = useCallback(() => {
        router.push('/login')
    }, [])
    return (
        <div>
            <div className={style.container}>
                <div className={style.textDiv}>
                    <h1>Our Food site makes it easy to find local food</h1>
                    <p style={{ display: isMobile ? 'none' : 'block' }}>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                    <div>
                        <button onClick={singUp} className={style.register}>Register</button>
                        <button className={style.order}>Order now</button>
                    </div>
                </div>
                <div className={style.burgerDiv}>
                    <div className={style.burger}><Image src={bigBurger} className={style.bigBurger} alt='burger' width={700} height={600} /></div>
                    <div className={style.miniDiv}>
                        <div className={style.freeDiv}>
                            <Image height={80} src={free} alt='free' />
                            <div>
                                <h3>French Fries</h3>
                                <p>Yummy...</p>
                            </div>
                        </div>
                        <div className={style.pizzaDiv}>
                            <Image height={80} src={pizza} alt='pizza' />
                            <div>
                                <h3>Pizza Hut</h3>
                                <p>Yummy...</p>
                            </div>
                        </div>
                        <div className={style.smallBurgerDiv}>
                            <Image height={80} src={smallBurger} alt='burger' />
                            <div>
                                <h3>Cheesburger</h3>
                                <p>Yummy...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.featuresDiv}>
                <h3>Features</h3>
                <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                <div className={style.containerDivSec}>
                    <div>
                        <Image width={300} height={200} src={bigPerson} alt='person' />
                        <h4>Discount Boucher</h4>
                        <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
                    </div>
                    <div>
                        <Image width={300} height={200} src={soup} alt='soup' />
                        <h4>Fresh healthy Food</h4>
                        <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
                    </div>
                    <div>
                        <Image width={300} height={200} src={express} alt='express' />
                        <h4>Fast Home Delivery</h4>
                        <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
                    </div>
                </div>
            </div>
            <section >
                {offer.map((offer, index) => (
                    <div style={{ flexDirection: index % 2 != 0 ? 'row' : 'row-reverse' }} className={style.offerDiv}>
                        <div className={style.offerInfo}>
                            <h2>{offer.name}</h2>
                            <p>{offer.description}</p>
                        </div>
                        <div className={style.offerImg}>
                            <Image className={style.leftImg} src={offer.img_url} width={350} height={350} alt='offer' />
                            <Image width={500} height={500} src={index % 2 == 0 ? leftImg : rightImg} />
                        </div>
                    </div>
                ))}
            </section>
            <div className={style.featuresDiv} >
                <h3>Our Popular Update New Foods</h3>
                <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                <div className={style.containerDivSec}>
                    <div>
                        <Image width={300} height={200} src={dubbleBurger} alt='person' />
                        <h4>Dubble Chees</h4>
                        <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
                    </div>
                    <div>
                        <Image width={300} height={200} src={margarita} alt='soup' />
                        <h4>Margarita</h4>
                        <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
                    </div>
                    <div>
                        <Image width={300} height={200} src={twister} alt='express' />
                        <h4>Twister Menu</h4>
                        <p>Lorem ipsum is placeholder  commonly used in the graphic </p>
                    </div>
                </div>
            </div>
            <section>
                <div className={style.discover}>
                    <Image style={{ display: isMobile ? 'none' : 'block' }} width={200} height={200} src={pizzaDiscover} alt='pizza' />
                    <div>
                        <h2>Discover Restaurants
                            Near From you</h2>
                        <button>Explore now</button>
                    </div>
                    <Image style={{ display: isMobile ? 'none' : 'block' }} width={200} height={200} src={bigBurger} alt='pizza' />
                </div>
            </section>
        </div>
    )
}