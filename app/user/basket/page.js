'use client'
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import exitImg from '../../restaurants/image/exit.png'
import basketImg from '../../restaurants/image/basket.png'
import emptyBasket from '../../restaurants/image/emptyBasket.png'
import empBasket from '../../restaurants/image/emoBasket.png'
import deleteImg from '../../restaurants/image/delete.png'
import style from '../../restaurants/[product]/basket.module.css'
import Image from 'next/image';
import axios from 'axios';
import styleBas from './basket.module.css'
import { languageContext } from '../../context/languageContext';
import { useRouter } from 'next/navigation';
import { refreshAccessToken } from '../../refresh'

export default function Basket() {
    const [basket, setBasket] = useState({})
    const [show, setShow] = useState(false)
    const [empty, setEmpty] = useState(true)
    const [isMobile, setIsMobile] = useState(false);
    const [language] = useContext(languageContext)
    useEffect(()=>{
        if (window) {
          setIsMobile(window.innerWidth <= 768);
        };
      },[])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            handleResize();

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);
    const showBasket = useCallback(() => {
        document.body.style.overflow = 'hidden';
        setShow(true)
    }, [])
    const exit = useCallback(() => {
        document.body.style.overflow = 'auto';
        setShow(false)
    }, [])
    // const fetchBasket = async () => {
    //     const authorization = localStorage.getItem('access_token');
    //     const responseBasket = await axios.get('/api/basket', {
    //         headers: {
    //             Authorization: `Bearer ${authorization}`
    //         }
    //     });
    //     setBasket(responseBasket.data.result.data)
    // }
    const fetchBasket = async () => {
        try {
            let token
            if (typeof window!=='undefined') {
                token = localStorage.getItem('access_token');
            }
            if (!token) {
                return;
            }
            try {
                const responseBasket = await axios.get('/api/basket', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBasket(responseBasket.data.result.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    token = await refreshAccessToken();
                    if (!token) {
                        return;
                    }
                    const retryResponseBasket = await axios.get('/api/basket', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setBasket(retryResponseBasket.data.result.data);
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error fetching basket:', error);
        }
    }
    useEffect(() => {
        fetchBasket()
    }, [])
    const resBasket = useRef()
    useEffect(() => {
        const handleClick = (event) => {
            if (resBasket.current && !resBasket.current.contains(event.target)) {
                setShow(false)
                document.body.style.overflow = 'auto';
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);
    useEffect(() => {
        if (basket.total_item) {
            setEmpty(false)
        } else {
            setEmpty(true)
        }
    }, [basket])
    const addProduct = useCallback(async (id) => {
        let authorization
        if(typeof window!=='undefined'){
        authorization = localStorage.getItem('access_token');
        }
        try {
            await axios.post('/api/basket/add', {
                product_id: id
            }, {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            });
        } catch (error) {
            console.error('Error adding product to basket:', error);
        }

        fetchBasket()

    }, [])
    const deleteProduct = useCallback(async () => {
        let authorization
        if(typeof window!=='undefined'){
        authorization = localStorage.getItem('access_token');
        }
        try {
            await axios.delete('/api/basket/clear', {
                headers: {
                    Authorization: `Bearer ${authorization}`
                },
                data: {
                    basket_id: basket.id
                }
            });
        } catch (error) {
            console.error('Error deleting product from basket:', error);
        }
        fetchBasket();

    }, []);
    const increaseProduct = useCallback(async (id) => {
        let authorization
        if(typeof window!=='undefined'){
            authorization = localStorage.getItem('access_token');
        }
        try {
            await axios.delete('/api/basket/delete', {
                headers: {
                    Authorization: `Bearer ${authorization}`
                },
                data: {
                    product_id: id
                }
            });
        } catch (error) {

            console.error('Error deleting product from basket:', error);
        }
        fetchBasket();
    }, []);
    const router = useRouter()
    const getCheckout = useCallback(() => {
        router.push('/user/checkout')
    }, [])
    return (
        <>
            <div className={`${style.basketDiv} ${styleBas.basketDiv}`}>
                <div ref={resBasket} className={`${style.orderDiv} ${show ? style.orderResDiv : null} ${styleBas.orderDiv}`}>
                    <Image onClick={exit} style={{ display: show ? 'block' : 'none' }} className={style.exit} src={exitImg} width={50} height={50} alt='exit' />
                    <div className={style.itemDiv}>
                        <Image src={empty ? empBasket : basketImg} alt='basket' width={30} height={30} />
                        <p style={{ color: empty ? '#BDBDBD' : '#D63626' }}>{basket.total_item} {language[0].restuarant.items}</p>
                    </div>
                    <hr />
                    {!empty ? (
                        basket.items.map(item => (
                            <>
                                <div className={style.productOrder} key={item.id}>
                                    <div className={style.orderItem}>
                                        <Image src={item.img_url} alt='img' height={50} width={50} />
                                        <div>
                                            <h3>${item.name}</h3>
                                            <p>${item.price}</p>
                                        </div>
                                    </div>
                                    <div className={style.increaseDiv}>
                                        <button onClick={() => addProduct(item.id)}>+</button>
                                        <p>{item.count}</p>
                                        <button onClick={() => increaseProduct(item.id)}>-</button>
                                        <Image onClick={() => deleteProduct(item.id)} className={style.delete} src={deleteImg} width={30} height={30} alt='item' />
                                    </div>
                                </div>
                                <hr />
                            </>
                        ))
                    ) : (
                        <Image className={style.emptyBasket} src={emptyBasket} alt="Empty Basket" width={300} height={300} />
                    )}
                    {empty ? (<p className={style.opps}>Opps!<span>{language[0].restuarant.basketEmpty}</span></p>) : null}
                    <button onClick={getCheckout} disabled={empty ? true : false} className={`${!empty ? style.activeBtn : style.deActiveBtn} ${styleBas.btn}`}>{language[0].user.checkout} <p className={style.btnP}>${basket.total_amount}</p></button>
                </div>
                {/* <button onClick={showBasket} style={{ display: isMobile ? 'flex' : 'none' }} disabled={empty ? true : false} className={`${!empty ? style.activeBtn : style.deActiveBtn}`}><Image src={empBasket} alt='basket' width={30} height={30} />
                    <p style={{ color: '#BDBDBD' }}>{basket.total_item} items</p>Checkout <p className={style.btnP}>${basket.total_amount}</p></button> */}
            </div>
        </>
    )
}