'use client'
import Image from "next/image";
import style from './product.module.css';
import { useCallback, useContext, useEffect, useRef } from "react";
import { languageContext } from "../../context/languageContext";

export default function Show({ product, setProduct }) {
    const dropdownRef = useRef(null);
    const [language]=useContext(languageContext)
    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setProduct({
                display: false,
                data: []
            });
        }
    }, [setProduct]);

    useEffect(() => {
        if (product.display) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [product.display, handleClickOutside]);

    useEffect(() => {
        if (product.display) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [product.display]);

    return (
        <>
            <section ref={dropdownRef} style={{ display: product.display ? 'flex' : 'none' }} className={style.sec}>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>{language[0].user.image}</th>
                            <th>{language[0].user.name}</th>
                            <th>{language[0].user.price} $</th>
                            <th>{language[0].user.count}</th>
                            <th>{language[0].user.amount}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.data?.map((productItem, index) => (
                            <tr key={index}>
                                <td><Image src={productItem.img_url} width={50} height={50} alt="img" /></td>
                                <td style={{ maxWidth: '120px' }}>{productItem.name}</td>
                                <td>{productItem.price}</td>
                                <td>{productItem.count}</td>
                                <td>{productItem.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <div className={style.backFont} style={{ display: product.display ? 'block' : 'none' }}></div>
        </>
    );
}
