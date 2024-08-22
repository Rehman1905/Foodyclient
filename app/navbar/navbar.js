'use client'
import Image from "next/image";
import Link from "next/link";
import style from '../layout.module.css'
import styleRes from './navbar.module.css'
import { usePathname, useRouter } from "next/navigation"
import basketImg from '../image/basket.png'
import exit from '../image/exit.png'
import burgerMenu from '../image/burgerMenu.png'
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../context/userContext";
import lang from '../language.json'
import { languageContext } from "../context/languageContext";
import en from '../image/en.png'
import az from '../image/aze.png'
import ru from '../image/ru.png'
export default function Navbar() {
  const path = usePathname()
  const [navbar, setNavbar] = useState(false)
  const [animation, setAnimation] = useState(false)
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useContext(userContext)
  const [avatar, setAvatar] = useState('')
  const [userPage, setUserPage] = useState(false)
  const [avatarImg, setAvatarImg] = useState('')
  const [language, setLanguage] = useContext(languageContext)
  useEffect(()=>{
    if (window) {
      setIsMobile(window.innerWidth <= 768);
    };
  },[])
  let langImg
  if (typeof window !== 'undefined') {
    langImg = localStorage.getItem('lang')
  }
  const [showLang, setShowLang] = useState(false)
  const changeLanguage = (data) => {
    if (window) {
      localStorage.setItem('lang', data)
    }
    if (data == 'en') {
      setLanguage(lang.en)
    } else if (data == 'aze') {
      setLanguage(lang.aze)
    } else if (data == 'ru') {
      setLanguage(lang.ru)
    }
    setShowLang(false)
    document.body.style.overflow = 'auto'
  }

  useEffect(() => {
    if (user.username !== '') {
      if (user.fullname?.split(' ')) {
        let dataHead = user.fullname?.split(' ');
        let arr = [];
        for (let i of dataHead) {
          if (i.length > 0) {
            arr.push(i[0]);
          }
          setAvatar(arr.join(""));
        }
      } else {

      }

    } else {
      setAvatar('')
    }
  }, [user])
  useEffect(() => {
    let img
    if (window) {
      img = localStorage.getItem('img')
    }
    setAvatarImg(JSON.parse(img))
  }, [user])
  useEffect(() => {
    const handleResize = () => {
      if (window) {
        setIsMobile(window.innerWidth <= 768);
      };

      handleResize();

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  const burgerMenuFunc = useCallback(() => {
    setNavbar(true)
    document.body.style.overflow = 'hidden';
    setAnimation(true)
  }, [])
  const exitFunc = useCallback(() => {
    setAnimation(false)
    const timer = setTimeout(() => {
      setNavbar(false);
      document.body.style.overflow = 'auto';
    }, 750);
    return () => clearTimeout(timer)
  }, [])
  const otherPage = useCallback(() => {
    setAnimation(false)
    const timer = setTimeout(() => {
      setNavbar(false);
      document.body.style.overflow = 'auto';
    }, 750);
    return () => clearTimeout(timer)
  })
  const router = useRouter()
  const singUp = useCallback(() => {
    router.push('/login')
    setAnimation(false)
    const timer = setTimeout(() => {
      setNavbar(false);
      document.body.style.overflow = 'auto';
    }, 750);
    return () => clearTimeout(timer)
  }, [])
  const userInfo = useCallback(() => {
    document.body.style.overflow = 'hidden';
    setUserPage(true)

  }, [])

  const menuRef = useRef()
  const langDorp = useRef()
  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserPage(false)
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  useEffect(() => {
    const handleClick = (event) => {
      if (langDorp.current && !langDorp.current.contains(event.target)) {
        setShowLang(false)
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  const clickLink = useCallback(() => {
    setUserPage(false)
  }, [])
  const clickLinkLogout = useCallback(() => {
    setUserPage(false)
    if (window) {
      localStorage.removeItem('user')
      localStorage.removeItem('img')
    }
    setAvatar('')
    setAnimation(false)
    const timer = setTimeout(() => {
      setNavbar(false);
      document.body.style.overflow = 'auto';
    }, 750);
    return () => clearTimeout(timer)
  }, [])
  const showLanguage = useCallback(() => {
    setShowLang(true)
    document.body.style.overflow = 'hidden'
  }, [])
  return (
    <header style={{ width: isMobile ? '100%' : '90%', position: isMobile ? 'fixed' : '' }} className={`${style.head} ${path === '/login' ? styleRes.loginHead : ''}`}>
      <div className={style.container} style={{ justifyContent: isMobile || path === '/login' ? 'start' : 'space-around', }}>
        <Image onClick={burgerMenuFunc} className={styleRes.burgerMenu} width={50} height={50} style={{ display: isMobile && path !== '/login' ? 'block' : 'none' }} src={burgerMenu} alt="burgerMenu" />
        <div>
          <Link className={style.foody} href={'/'}><h2 >Foody<span>.</span></h2></Link>
        </div>
        <div style={{ display: ((navbar || !isMobile) && (path !== '/login')) ? 'flex' : 'none', justifyContent: navbar ? 'flex-end' : 'space-between' }} className={`${isMobile ? styleRes.responsiveDiv : ''} ${styleRes.mainDiv} ${animation && isMobile ? styleRes.slideIn
          : !animation && isMobile ? styleRes.slideOut
            : ''
          }`}>
          <div className={`${isMobile ? styleRes.responsiveLink : ''} ${style.link}`}>
            <Link onClick={otherPage} style={{ color: path == '/' ? '#D63626' : '#828282' }} href={'/'}>{language[0].nav.home}</Link>
            <Link onClick={otherPage} style={{ color: path.slice(0, 12) == '/restaurants' ? '#D63626' : '#828282' }} href={'/restaurants'}>{language[0].nav.restuarant}</Link>
            {avatar && isMobile ? <><Link onClick={otherPage} style={{ color: path == '/user/profile' ? '#D63626' : '#828282' }} href={'/user/profile'}>{language[0].nav.profile}</Link>
              <Link onClick={otherPage} style={{ color: path == '/user/basket' ? '#D63626' : '#828282' }} href={'/user/basket'}>{language[0].nav.basket}</Link>
              <Link onClick={otherPage} style={{ color: path == '/user/orders' ? '#D63626' : '#828282' }} href={'/user/orders'}>{language[0].nav.order}</Link>
              <Link onClick={otherPage} style={{ color: path == '/user/checkout' ? '#D63626' : '#828282' }} href={'/user/checkout'}>{language[0].nav.checkout}</Link></> : null}
            <Link onClick={otherPage} style={{ color: path == '/aboutUs' ? '#D63626' : '#828282' }} href={'/aboutUs'}>{language[0].nav.about}</Link>
            <Link onClick={otherPage} style={{ color: path == '/howItWorks' ? '#D63626' : '#828282' }} href={'/howItWorks'}>{language[0].nav.works}</Link>
            <Link onClick={otherPage} style={{ color: path == '/faqs' ? '#D63626' : '#828282' }} href={'/faqs'}>{language[0].nav.faqs}</Link>

            {avatar && isMobile ? <Link onClick={clickLinkLogout} style={{ color: path == '/faqs' ? '#D63626' : '#828282' }} href={'/'}>Logout</Link> : null}

          </div>
          <div className={`${isMobile ? styleRes.btnDiv : ''} ${style.signUpDiv} ${styleRes.langDiv}`}>
            <ul ref={langDorp} className={styleRes.lang} >
              <li>
                {langImg === 'ru' ? (
                  <Image onClick={() => showLanguage('ru')} src={ru} width={100} height={50} alt="language" />
                ) : langImg === 'aze' ? (
                  <Image onClick={() => showLanguage('aze')} src={az} width={50} height={50} alt="language" />
                ) : (
                  <Image onClick={() => showLanguage('en')} src={en} width={50} height={50} alt="language" />
                )}
              </li>
              <ul style={{ display: showLang ? 'flex' : 'none' }}>
                <li>
                  <Image onClick={() => changeLanguage('en')} src={en} width={50} height={50} alt="language" />
                </li>
                <li>
                  <Image onClick={() => changeLanguage('aze')} src={az} width={50} height={50} alt="language" />
                </li>
                <li>
                  <Image onClick={() => changeLanguage('ru')} src={ru} width={100} height={50} alt="language" />
                </li>
              </ul>
            </ul>
            <div >
              <Image onClick={exitFunc} width={50} height={50} className={styleRes.exit} style={{ display: isMobile ? 'block' : 'none' }} src={exit} alt="exit" />
              <button style={{ display: avatar ? 'none' : 'block' }} onClick={singUp}>Sign up</button>
              <div ref={menuRef} style={{ display: !avatar || isMobile ? 'none' : 'flex' }} className={styleRes.avatar}>
                {/* <Image width={50} height={50} src={basketImg} alt="basket" /> */}

                {!avatarImg ? <p onClick={userInfo} >{avatar}</p> :
                  <Image style={{ borderRadius: "50%", cursor: 'pointer' }} src={avatarImg} width={50} height={50} onClick={userInfo} />}
              </div>

            </div>
          </div>

        </div>
      </div>
      <div ref={menuRef} style={{ display: userPage && !isMobile ? 'flex' : 'none' }} className={styleRes.user}>
        <Link onClick={clickLink} href={'/user/profile'}>Profile</Link>
        <hr />
        <Link onClick={clickLink} href={'/user/basket'}>Your Basket</Link>
        <hr />
        <Link onClick={clickLink} href={'/user/orders'}>Your Orders</Link>
        <hr />
        <Link onClick={clickLink} href={'/user/checkout'}>Checkout</Link>
        <hr />
        <Link onClick={clickLinkLogout} href={'/'}>Logout</Link>
      </div>
      <div className={`${animation ? styleRes.slideLeft : styleRes.slideLeftOut} ${styleRes.gray}`} style={{ display: navbar ? 'block' : 'none' }} alt='exit'></div>
    </header>
  )
}