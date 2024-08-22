'use client'
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import style from './checkout.module.css'
import axios from "axios";
import succesImg from '../image/succes.png'
import Image from "next/image";
import { languageContext } from "../../context/languageContext";
export default function Checkout() {
    const [phone, setPhone] = useState('+994');
    const [selectedPayment, setSelectedPayment] = useState('cash');
    const [basket, setBasket] = useState({})
    const [language, setLanguage] = useContext(languageContext)
    const [error, setError] = useState({
        address: '',
        contact: ''
    });
    const contact = useRef();
    const address = useRef();

    const inputChange = useCallback((e) => {
        let inpValue = e.target.value;
        inpValue = inpValue.replace(/[^\d+]/g, '');
        if (!inpValue.startsWith('+994') && !inpValue) {
            inpValue = '+994' + inpValue.replace(/^\+994/, '');
        }
        setPhone(inpValue);
    }, []);

    const handlePaymentChange = useCallback((e) => {
        setSelectedPayment(e.target.id);
    }, []);
    console.log(basket.id)
    const fetchBasket = async () => {
        let authorization
        if (typeof window !== undefined) {
            authorization = localStorage.getItem('access_token');
        }
        const responseBasket = await axios.get('/api/basket', {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        });
        setBasket(responseBasket.data.result.data)
    }
    useEffect(() => {
        fetchBasket()
    }, [])
    const checkoutFunc = useCallback(async (e) => {
        e.preventDefault()
        let errors = {}
        if (!address.current.value.trim()) {
            errors.address = 'The address provided is incorrect. Please try again.';
        }
        if (contact.current.value.length !== 13) {
            errors.contact = 'The phone provided is incorrect. Please try again.';
        }

        if (Object.keys(errors).length === 0) {
            let token
            if (typeof window !== undefined) {
                token = localStorage.getItem('access_token');
            }
            let method;
            if (selectedPayment == 'cash') {
                method = 0
            } else {
                method = 1
            }

            try {
                await axios.post('/api/order', {
                    basket_id: basket.id,
                    contact: contact.current.value,
                    delivery_address: address.current.value,
                    payment_method: method
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                deleteProduct()
            } catch (error) {
                console.error('Error updating user:', error);
            }

            contact.current.value = '+994'
            address.current.value = ''
            setSelectedPayment('cash')
            setError({
                address: '',
                contact: ''
            })
        } else {
            setError(errors)
        }
    }, [selectedPayment, basket])
    const deleteProduct = useCallback(async () => {
        let authorization
        if (typeof window !== undefined) {
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
            setBasket({})
        } catch (error) {
            console.error('Error deleting product from basket:', error);
        }
        fetchBasket();

    }, []);
    return (
        <>
            <section className={style.sec}>
                {!basket.items?.length ? <div className={style.success}>
                    <Image src={succesImg} width={300} height={300} />
                    <p>{language[0].user.received}</p>
                </div>
                    : <><div className={style.inpDiv}>
                        <div>
                            <h2>{language[0].user.checkout}</h2>
                        </div>
                        <form>
                            <div className={style.addCon}>
                                <label htmlFor='address'>{language[0].user.address}</label>
                                <input ref={address} placeholder='address' type='text' id='address' />
                                {error.address ? <p className={style.error}>{error.address}</p> : null}
                            </div>
                            <div className={style.addCon}>
                                <label htmlFor='contact'>{language[0].user.contact}</label>
                                <input type='tel' ref={contact} value={phone} maxLength="13" onChange={inputChange} id="contact" />
                                {error.contact ? <p className={style.error}>{error.contact}</p> : null}
                            </div>
                            <div>
                                <p>{language[0].user.payment_method}</p>
                                <div className={style.radioGroup}>
                                    <input
                                        type="radio"
                                        id="cash"
                                        checked={selectedPayment === 'cash'}
                                        onChange={handlePaymentChange}
                                        className={selectedPayment === 'cash' ? style.selected : ''}
                                    />
                                    <label htmlFor="cash">{language[0].user.payDoor}</label>
                                    <input
                                        type="radio"
                                        id="card"
                                        checked={selectedPayment === 'card'}
                                        onChange={handlePaymentChange}
                                        className={selectedPayment === 'card' ? style.selected : ''}
                                    />
                                    <label htmlFor="card">{language[0].user.payCard}</label>
                                </div>
                            </div>
                            <div>
                                <button onClick={checkoutFunc}>{language[0].user.checkout}</button>
                            </div>
                        </form>
                    </div>
                        <div className={style.itemDiv}>
                            <h3>{language[0].user.yourOrder}</h3>
                            <div className={style.container}>
                                {basket.items?.map(item => (
                                    <>
                                        <div className={style.mainDiv}>
                                            <p>{item.count} <span>x {item.name}</span></p>
                                            <p>${item.amount}</p>
                                        </div>
                                        <hr />
                                    </>
                                ))}
                                <div className={style.mainDiv}>
                                    <h4>{language[0].user.total}</h4>
                                    <p>${basket.total_amount}</p>
                                </div>
                            </div>
                        </div>
                    </>}
            </section>
        </>
    )
}
