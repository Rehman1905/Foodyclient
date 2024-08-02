'use client'
import style from './basket.module.css'
import axios from "axios"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import spinImg from '../../image/spin.gif'
import plus from '../image/plus.png'
import basketImg from '../image/basket.png'
import emptyBasket from '../image/emptyBasket.png'
import empBasket from '../image/emoBasket.png'
import deleteImg from '../image/delete.png'
import exitImg from '../image/exit.png'
export default function Product() {
    const [spin, setSpin] = useState(true)
    const [restuarant, setRestuarant] = useState([])
    const [products, setProducts] = useState([])
    const [basket, setBasket] = useState({})
    const [empty, setEmpty] = useState(true)
    const [show, setShow] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const path = useParams()
    const router = useRouter()
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const fetchRestuarantData = async () => {
            setSpin(true)
            const response = await axios.get(`/api/restuarants/${path.product}`)
            setRestuarant(response.data.result.data)
            const responseProduct = await axios.get('/api/products')
            setProducts(responseProduct.data.result.data.filter(product => product.rest_id === path.product))
            fetchBasket()
            setSpin(false)
        }
        fetchRestuarantData()
    }, [])
    const back = useCallback(() => {
        router.push('/restaurants')
    }, [])
    const fetchBasket = async () => {
        const authorization = localStorage.getItem('access_token');
        const responseBasket = await axios.get('/api/basket', {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        });
        setBasket(responseBasket.data.result.data)
    }
    const addProduct = useCallback(async (id) => {
        const authorization = localStorage.getItem('access_token');
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
        const authorization = localStorage.getItem('access_token');
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
    useEffect(() => {
        if (basket.total_item) {
            setEmpty(false)
        } else {
            setEmpty(true)
        }
    }, [basket])
    const increaseProduct = useCallback(async (id) => {
        console.log(id);
        const authorization = localStorage.getItem('access_token');
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
    const showBasket = useCallback(() => {
        document.body.style.overflow = 'hidden';
        setShow(true)
    }, [])
    const exit = useCallback(() => {
        document.body.style.overflow = 'auto';
        setShow(false)
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
    const checkout=useCallback(()=>{
        router.push('/user/checkout')
    },[])
    return (
        <>
            <section style={{ display: spin ? 'none' : 'block' }} className={style.basket}>
                <div className={style.resDiv}>
                    <Image src={restuarant.img_url} alt='res' width={500} height={200} />
                    <div className={style.resInfo}>
                        <div className={style.resNameDiv}>
                            <h2>{restuarant.name}</h2>
                            <p>{restuarant.address}</p>
                        </div>
                        <div className={style.resCuisineDiv}>
                            <div className={style.cuisine}>
                                <h3>Cuisine</h3>
                                <p>{restuarant.cuisine}</p>
                            </div>
                            <div className={style.btn}>
                                <button className={style.delivery}>${restuarant.delivery_price} Delivery</button>
                                <button onClick={back} className={style.back}>Go Back</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
                <div className={style.basketDiv}>
                    <div className={style.basketProduct}>
                        <h2>Products</h2>
                        <hr />
                        {products.map(product => (
                            <>
                                <div className={style.productApi} key={product.id}>
                                    <div className={style.productInfo}>
                                        <Image src={product.img_url} alt='product' width={50} height={50} />
                                        <div>
                                            <h4>{product.name}</h4>
                                            <p>{product.description}</p>
                                        </div>
                                    </div>
                                    <div className={style.productAdd}>
                                        <p>From${product.price}</p>
                                        <Image onClick={() => addProduct(product.id)} src={plus} alt='plus' width={30} height={30} />
                                    </div>
                                </div>
                                <hr />
                            </>
                        ))}
                    </div>
                    <div ref={resBasket} style={{ display: isMobile && !show ? 'none' : 'flex' }} className={`${style.orderDiv} ${show ? style.orderResDiv : null}`}>
                        <Image onClick={exit} style={{ display: show ? 'block' : 'none' }} className={style.exit} src={exitImg} width={50} height={50} alt='exit' />
                        <div className={style.itemDiv}>
                            <Image src={empty ? empBasket : basketImg} alt='basket' width={30} height={30} />
                            <p style={{ color: empty ? '#BDBDBD' : '#D63626' }}>{basket.total_item} items</p>
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
                                            <Image onClick={() => deleteProduct(item.id)} className={style.delete} src={deleteImg} width={30} height={30} />
                                        </div>
                                    </div>
                                    <hr />
                                </>
                            ))
                        ) : (
                            <Image className={style.emptyBasket} src={emptyBasket} alt="Empty Basket" width={300} height={300} />
                        )}
                        {empty ? (<p className={style.opps}>Opps!<span>Basket empty</span></p>) : null}
                        <button onClick={checkout} disabled={empty ? true : false} className={`${!empty ? style.activeBtn : style.deActiveBtn}`}>Checkout <p className={style.btnP}>${basket.total_amount}</p></button>
                    </div>
                    <button  onClick={showBasket} style={{ display: isMobile ? 'flex' : 'none' }} disabled={empty ? true : false} className={`${!empty ? style.activeBtn : style.deActiveBtn}`}><Image src={empBasket} alt='basket' width={30} height={30} />
                        <p style={{ color: '#BDBDBD' }}>{basket.total_item} items</p>Checkout <p className={style.btnP}>${basket.total_amount}</p></button>
                </div>
            </section>
            <div className={style.gray} style={{ display: show ? 'block' : 'none' }}></div>
            <Image className={style.spin} style={{ display: spin ? 'block' : 'none' }} src={spinImg} width={300} height={300} alt='spin' />
        </>
    )
}