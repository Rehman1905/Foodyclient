'use client'
import axios from "axios";
import threeDote from '../image/3dote.png';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import style from './orders.module.css';
import Show from './product'
import spinner from '../../image/spin.gif'
import { languageContext } from "../../context/languageContext";
export default function Orders() {
    const [language,setLanguage]=useContext(languageContext)
    const [orders, setOrders] = useState([]);
    const [showStates, setShowStates] = useState({});
    const [spin,setSpin]=useState(true)
    const [product,setProduct]=useState({
        display:false,
        data:[]
    })
    const dropdownRefs = useRef({});
    const authorization = localStorage.getItem('access_token');
    
    const fetchOrders = async () => {
       
        const response = await axios.get('/api/order/user', {
            headers: {
                Authorization: `Bearer ${authorization}`
            }
        });
        setOrders(response);
        setSpin(false)
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const showFunc = useCallback((id) => {
        setShowStates(state => ({
            ...state,
            [id]: !state[id]
        }));
    }, []);

    const handleClickOutside = useCallback((event) => {
        Object.keys(dropdownRefs.current).forEach(id => {
            if (dropdownRefs.current[id] && !dropdownRefs.current[id].contains(event.target)) {
                setShowStates(state => ({
                    ...state,
                    [id]: false
                }));
            }
        });
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const deleteOrder = useCallback(async (id) => {
        setSpin(true)
        await axios.delete('/api/order', {
            headers: {
                Authorization: `Bearer ${authorization}`
            },
            data: {
                order_id: id
            }
        });
        fetchOrders(); 
        setShowStates(state => ({
            ...state,
            [id]: false
        })); 
    }, [authorization]);
    const showOrder=useCallback((products)=>{
        
        setProduct({
            display:true,
            data:products}
        )
    })
    return (
        <>
        <Image width={500} height={500} className={style.spin} src={spinner} style={{display:spin?'block':'none'}}/>
            <section style={{display:spin?'none':'flex'}} className={style.sec}>
                <h2>{language[0].nav.order}</h2>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>{language[0].user.time}</th>
                            <th>{language[0].user.delivery_address}</th>
                            <th>{language[0].user.amount}</th>
                            <th>{language[0].user.payment_method}</th>
                            <th>{language[0].user.contact}</th>
                            <th>{language[0].user.profile}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data?.result.data?.map((order, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{orders.headers.date.slice(4, 16)}</td>
                                <td style={{ maxWidth: '200px' }}>{order.delivery_address}</td>
                                <td>{order.amount}</td>
                                <td>{order.payment_method == 0 ? 'Cash On Delivery' : 'Pay at the door by credit card'}</td>
                                <td>{order.contact}</td>
                                <td>
                                    <div style={{ position: 'relative' }} ref={el => dropdownRefs.current[order.id] = el}>
                                        <Image
                                            onClick={() => showFunc(order.id)}
                                            src={threeDote}
                                            height={20}
                                            alt="img"
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {showStates[order.id] && (
                                            <div className={style.addDiv}>
                                                <p onClick={() => showOrder(order.products)} className={style.green}>{language[0].user.show}</p>
                                                <p onClick={() => deleteOrder(order.id)} className={style.red}>{language[0].user.delete}</p>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        <Show setProduct={setProduct} product={product}/>
        </>
    );
}
