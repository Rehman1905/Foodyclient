'use client'
import Image from 'next/image'
import imgCloud from './image/image.png'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import style from './profil.module.css'
import axios from 'axios'
import { userContext } from '../../context/userContext'
import { languageContext } from '../../context/languageContext'

export default function Profile() {
    const [user, setUser] = useContext(userContext)
    const [language, setLanguage] = useContext(languageContext)
    const [phone, setPhone] = useState('+994')
    const [error, setError] = useState({
        address: '',
        email: '',
        fullname: '',
        username: '',
        contact: ''
    })
    const inputChange = useCallback((e) => {
        let inpValue = e.target.value
        inpValue = inpValue.replace(/[^\d+]/g, '');
        if (!inpValue.startsWith('+994') && !inpValue) {
            inpValue = '+994' + inpValue.replace(/^\+994/, '');
        }
        setPhone(inpValue);
    }, [])
    const [addImg, setAddImg] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                setAddImg(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const email = useRef()
    const contact = useRef()
    const address = useRef()
    const username = useRef()
    const fullname = useRef()

    useEffect(() => {
        email.current.value = user.email
        username.current.value = user.username
        fullname.current.value = user.fullname
    }, [user])

    const save = useCallback(async (e) => {
        e.preventDefault()

        let errors = {}
        if (!email.current.value) {
            errors.email = 'The email provided is incorrect. Please try again.'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.current.value)) {
            errors.email = 'The email provided is incorrect. Please enter a valid email address.';
        }
        if (!fullname.current.value.trim()) {
            errors.fullname = 'The fullname provided is incorrect. Please try again.';
        }
        if (!username.current.value.trim()) {
            errors.username = 'The username provided is incorrect. Please try again.';
        }
        if (!address.current.value.trim()) {
            errors.address = 'The address provided is incorrect. Please try again.';
        }
        if (contact.current.value.length !== 13) {
            errors.contact = 'The phone provided is incorrect. Please try again.';
        }

        if (Object.keys(errors).length === 0) {
            if (typeof window !== undefined) {
                const token = localStorage.getItem('access_token');

                try {
                    const res = await axios.put('/api/auth/user', {
                        username: username.current.value,
                        fullname: fullname.current.value,
                        phone: contact.current.value,
                        address: address.current.value,
                        email: email.current.value,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(res.data.user)
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    localStorage.setItem('img', JSON.stringify(addImg))

                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
            contact.current.value = '+994'
            address.current.value = ''
            fileInputRef.current.value = ''
            setAddImg(null)
            setError({
                address: '',
                email: '',
                fullname: '',
                username: '',
                contact: ''
            })
        } else {
            setError(errors)
        }
    }, [addImg, setUser])
    const deletImg = useCallback(() => {
        setAddImg(null)
    }, [])
    return (
        <section className={style.sec}>
            <h2>{language[0].user.profile}</h2>
            <div className={style.addDiv}>
                <input ref={fileInputRef}
                    style={{ display: 'none' }} type='file' onChange={handleImageChange}></input>
                <Image onClick={handleImageClick} src={imgCloud} width={130} height={130} alt='img' />
                {addImg ? <Image onClick={deletImg} src={addImg} width={130} height={130} alt='img' /> : null}
            </div>
            <form>
                <div>
                    <label htmlFor='contact'>{language[0].user.contact}</label>
                    <input type='tel' ref={contact} value={phone} maxLength="13" onChange={inputChange} id="contact" />
                    {error.contact ? <p>{error.contact}</p> : null}
                </div>
                <div>
                    <label htmlFor='email'>{language[0].login.email}</label>
                    <input ref={email} placeholder='example@gmail.com' type='email' id='email' />
                    {error.email ? <p>{error.email}</p> : null}
                </div>
                <div>
                    <label htmlFor='username'>{language[0].login.username}</label>
                    <input ref={username} type='text' id='username' placeholder='username' />
                    {error.username ? <p>{error.username}</p> : null}
                </div>
                <div>
                    <label htmlFor='address'>{language[0].user.address}</label>
                    <input ref={address} placeholder='address' type='text' id='address' />
                    {error.address ? <p>{error.address}</p> : null}
                </div>
                <div>
                    <label htmlFor='fullname'>{language[0].login.fullname}</label>
                    <input ref={fullname} type='text' placeholder='fullname' id='fullname' />
                    {error.fullname ? <p>{error.fullname}</p> : null}
                </div>
                <div>
                    <button onClick={save}>{language[0].user.save}</button>
                </div>
            </form>
        </section>
    )
}
