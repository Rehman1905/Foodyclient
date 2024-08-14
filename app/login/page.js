'use client'
import Image from "next/image";
import loginImg from './image/loginImg.png'
import registerImg from './image/register.png'
import showImg from './image/showActive.png'
import dontShowImg from './image/showDeactive.png'
import { useCallback, useContext, useRef, useState } from "react";
import style from './login.module.css'
import axios from "axios";
import { useRouter } from "next/navigation";
import { userContext } from "../context/userContext";
import { Alert } from "@mui/material";
import { languageContext } from "../context/languageContext";
export default function Login() {
    const [error, setError] = useState({
        username: '',
        password: '',
        fullname: '',
        email: ''
    })
    const [language]=useContext(languageContext)
    const [user, setUser] = useContext(userContext)
    const router = useRouter()
    const fullname = useRef()
    const username = useRef()
    const password = useRef()
    const email = useRef()
    const [logIn, setLogIn] = useState(true)
    const [inpType, setIntType] = useState('password')
    const [alertt,setAlertt]=useState(false)
    const [success,setSuccess]=useState('success')
    const register = useCallback(() => {
        email.current.value = ''
        password.current.value = ''
        setError({
            username: '',
            password: '',
            fullname: '',
            email: ''
        })
        setLogIn(false)
    }, [])
    const login = useCallback(() => {
        username.current.value = ''
        password.current.value = ''
        fullname.current.value = ''
        email.current.value = ''
        setError({
            username: '',
            password: '',
            fullname: '',
            email: ''
        })
        setLogIn(true)
    }, [])
    const show = useCallback(() => {
        if (inpType == 'password') {
            setIntType('text')
        } else if (inpType === 'text') {
            setIntType('password')
        }
    }, [inpType])
    const sendData = useCallback(async (e) => {
        e.preventDefault()
        let errors = {};
        if (logIn) {
            if (!email.current.value.trim()) {
                errors.username = 'The username provided is incorrect. Please try again.';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.current.value)) {
                errors.email = 'The email provided is incorrect. Please enter a valid email address.';
            }
            if (!password.current.value.trim()) {
                errors.password = 'The password provided is incorrect. Please try again.';
            }
        } else {
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
            if (!password.current.value.trim()) {
                errors.password = 'The password provided is incorrect. Please try again.';
            }
        }
        if (Object.keys(errors).length === 0) {
            if (logIn) {
                try {
                    const response = await axios.post('/api/auth/signin', {
                        email: email.current.value,
                        password: password.current.value
                    })
                    let data={
                        username: response.data.user.username,
                        fullname: response.data.user.fullname,
                        id: response.data.user.id,
                        email: response.data.user.email
                    }
                    setUser(data)
                    
                    localStorage.setItem('refresh_token', response.data.user.refresh_token)
                    localStorage.setItem('access_token', response.data.user.access_token)
                    localStorage.setItem('user', JSON.stringify(data))
                    setSuccess('success')
                    setAlertt(true);
                    setTimeout(() => {
                        router.push('/')
                      setAlertt(false);
                    }, 2000); 
                  }catch (err) {
                    setSuccess('error')
                    setAlertt(true);
                    setTimeout(() => {
                      setAlertt(false);
                    }, 2000); 
                    console.error(err)
                }
                email.current.value = ''
                password.current.value = ''
            } else {
                try {
                    console.log(username.current.value,fullname.current.value,email.current.value,password.current.value)
                    await axios.post('/api/auth/signup', {
                        username: username.current.value,
                        fullname: fullname.current.value,
                        email: email.current.value,
                        password: password.current.value
                    });
                    setSuccess('success')
                    setAlertt(true);
                    setTimeout(() => {
                        setLogIn(true);
                        setAlertt(false);
                    }, 2000); 
                    username.current.value = '';
                    password.current.value = '';
                    fullname.current.value = '';
                    email.current.value = '';
                } catch (error) {
                    setSuccess('error')
                    setAlertt(true);
                    setTimeout(() => {
                      setAlertt(false);
                    }, 2000); 
                    console.error("Error during signup:", error);
                }
            }
        } else {
            setError(errors);
        }
        return
    }, [logIn])
    return (
        <section className={`${style.sec} ${!logIn ? style.secRegisterRes : ''}`}>
            <div className={style.imgDiv}>
                <Image width={700} height={605} src={logIn ? loginImg : registerImg} alt="loginImg" />
            </div>
            <div className={style.inpDiv}>
                <div className={style.link}>
                    <a onClick={login} style={{ color: logIn ? '#EB5757' : '#828282' }}>{language[0].login.login}</a>
                    <a onClick={register} style={{ color: logIn ? '#828282' : '#EB5757' }}>{language[0].login.register}</a>
                </div>
                <div className={style.mainDiv}>
                    <form>
                        {!logIn ? <div>
                            <label for='fullname'>{language[0].login.fullname}</label>
                            <input ref={fullname} placeholder="fullname" type="text" id="fullname" />
                            {error.fullname ?
                                <p>{error.fullname}</p> : ''}
                        </div> : ''}
                        {!logIn ? <div>
                            <label for='username'>{language[0].login.username}</label>
                            <input ref={username} type="username" id="username" placeholder="username" />
                            {error.username ?
                                <p>{error.username}</p> : ''}
                        </div> : ''}
                        <div>
                            <label for='email'>{language[0].login.email}</label>
                            <input ref={email} placeholder="excample@gmail.com" type="email" id="email" />
                            {error.email ?
                                <p>{error.email}</p> : ''}
                        </div>
                        <div className={style.password}>
                            <label for='password'>{language[0].login.password}</label>
                            <input ref={password} placeholder="password" type={inpType} id="password" />
                            <Image onClick={show} width={50} height={50} src={inpType == 'password' ? showImg : dontShowImg} alt="show" />
                            {error.password ?
                                <p>{error.password}</p> : ''}
                        </div>
                        <div>
                            <button onClick={sendData}>{logIn ? `${language[0].login.loginBtn}` : `${language[0].login.registerBtn}`}</button>
                        </div>
                    </form>
                </div>
            </div>
            <Alert className={style.alert} style={{display:alertt?'block':'none'}} variant="filled" severity={success}>{success=='success'?'Succesfully':"Unsuccesfully"}</Alert>
        </section>
    )
}