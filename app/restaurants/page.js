'use client'
import { useCallback, useContext, useEffect, useState } from 'react'
import style from './retaurant.module.css'
import Image from 'next/image'
import axios from 'axios'
import Pagination from '@mui/material/Pagination';
import { PaginationItem } from '@mui/material'
import spinImg from '../image/spin.gif'
import exitImg from './image/exit.png'
import filterImg from './image/filter.png'
import { useRouter } from 'next/navigation'
import { languageContext } from '../context/languageContext'
import { refreshAccessToken } from '../refresh'
export default function Restaurants() {
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [categoryId, setCategoryId] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [spin, setSpin] = useState(true)
    const [isMobile, setIsMobile] = useState(false);
    const [filter, setFilter] = useState(false)
    const [showRestuarants, setShowRestuarants] = useState([])
    const [language, setLanguage] = useContext(languageContext)
    const router = useRouter()
    useEffect(()=>{
        if (window) {
          setIsMobile(window.innerWidth <= 768);
        };
      },[])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768)
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
                setITEMS_PER_PAGE(window.innerWidth <= 768 ? 4 : 2);
            };

            handleResize();

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);
    const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(isMobile ? 2 : 4);

    useEffect(() => {
        if (isMobile) {
            setITEMS_PER_PAGE(2)
        } else {
            setITEMS_PER_PAGE(4)
        }
    }, [isMobile])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setSpin(true);
                let token
                if (window) {
                    if (localStorage.getItem('access_token')) {
                        token = localStorage.getItem('access_token');
                    }
                }
                try {
                    const res = await axios.get('/api/category', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setCategories(res.data.result.data);

                    const resRes = await axios.get('/api/restuarants', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setRestaurants(resRes.data.result.data);
                } catch (error) {
                    if (error.response.status === 401) {
                        token = await refreshAccessToken();
                        const res = await axios.get('/api/category', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        setCategories(res.data.result.data);

                        const resRes = await axios.get('/api/restuarants', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        setRestaurants(resRes.data.result.data);
                    } else {
                        throw error;
                    }
                }

                setSpin(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const allRestaurants = restaurants;
                const filteredRestaurants = categoryId === 'all' ? allRestaurants : allRestaurants.filter(res => res.category_id === categoryId);
                setTotalRestaurants(filteredRestaurants.length);
                setTotalPages(Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE));
                const start = (page - 1) * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                setShowRestuarants(filteredRestaurants.slice(start, end));
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setSpin(false);
            }
        };

        fetchRestaurants();
    }, [categoryId, page, restaurants]);


    const handleCategoryChange = useCallback((id) => {
        setCategoryId(id);
        setFilter(false)
        setPage(1);
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const filterFunc = useCallback(() => {
        setFilter(true)
        document.body.style.overflow = 'hidden';
    }, [])
    const exit = useCallback(() => {
        setFilter(false)
        document.body.style.overflow = 'auto';
    }, [])
    const aboutProduct = useCallback((id) => {
        let user
        if (window) {
            user = localStorage.getItem('user')
        }
        if (!user) {
            alert('Please register first.')
            router.push('/login')
        } else {
            router.push(`/restaurants/${id}`)
        }
    }, [])
    const grayFunc = () => {
        setFilter(false)
    }
    return (
        <>
            <section style={{ display: spin ? 'none' : 'flex' }} className={style.sec}>
                <div onClick={filterFunc} className={style.filterDiv} style={{ display: isMobile ? 'flex' : 'none' }}>
                    <Image src={filterImg} width={50} height={50} alt='filter' />
                    <p>Filter</p>
                </div>
                <div style={{ display: (isMobile && filter) ? 'flex' : 'none' }} className={style.filterBottom}>
                    <Image onClick={exit} style={{ cursor: 'pointer' }} src={exitImg} width={50} height={50} alt='exit' />
                    <div onClick={() => handleCategoryChange('all')}>
                        <p>{language[0].restuarant.allRestaurant}</p>
                        <hr />
                    </div>
                    {categories.map(category => (
                        <div key={category.id} onClick={() => handleCategoryChange(category.id)}>
                            <p>{category.name}</p>
                            <hr />
                        </div>
                    ))}
                </div>
                <nav style={{ display: isMobile ? 'none' : 'flex' }} className={style.nav}>
                    <div onClick={() => handleCategoryChange('all')} style={{ backgroundColor: categoryId === 'all' ? '#E53935' : '#F3F4F6' }}>
                        <p style={{ color: categoryId === 'all' ? '#FFF' : '#333333' }}>{language[0].restuarant.allRestaurant}</p>
                    </div>
                    {categories.map(category => (
                        <div onClick={() => handleCategoryChange(category.id)} style={{ backgroundColor: categoryId === category.id ? '#E53935' : '#F3F4F6' }} key={category.id}>
                            <Image src={category.img_url} width={50} height={50} alt={category.name} />
                            <p style={{ color: categoryId === category.id ? '#FFF' : '#333333' }}>{category.name}</p>
                        </div>
                    ))}

                </nav>
                <div style={{ display: spin ? 'none' : 'flex' }} className={style.restaurant}>
                    <div className={style.restaurantDiv}>
                        {showRestuarants.map(restaurant => (
                            <div onClick={() => aboutProduct(restaurant.id)} className={style.mainDiv} key={restaurant.id}>
                                <div className={style.info}>
                                    <Image src={restaurant.img_url} width={100} height={100} alt='restaurant' />
                                    <h3>{restaurant.name}</h3>
                                    <p>{restaurant.cuisine}</p>
                                </div>
                                <div className={style.delievery}>
                                    <p>${restaurant.delivery_price} {language[0].restuarant.delivery}</p>
                                    <button>{restaurant.delivery_min} Min</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        style={{ margin: '0 auto' }}
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        renderItem={(item) => (
                            <PaginationItem
                                {...item}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: '#E53935',
                                        color: '#fff',
                                    },
                                    '& .MuiPaginationItem-icon': {
                                        color: '#E53935',
                                    },
                                }}
                            />
                        )}
                    />
                </div>
            </section>
            <Image className={style.spin} style={{ display: spin ? 'block' : 'none' }} width={600} height={600} src={spinImg} alt='spin' />
            <div className={style.gray} onClick={grayFunc} style={{ display: filter ? 'block' : 'none' }} ></div>
        </>
    );
}
