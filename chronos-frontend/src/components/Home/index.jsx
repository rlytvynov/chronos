import React from "react";
import styles from "./Home.module.scss"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth, fetchLogout } from "../../utils/redux/slices/auth";


export const Home =  () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch()
    const onClickLogout = (e) => {
		e.preventDefault()
		if(window.confirm('Are you sure to logout?')) {
			dispatch(fetchLogout())
			window.localStorage.removeItem('accessToken')
			window.location.reload()
		}
	}
    return(
        <div className={styles.homePage}>
            <div className={styles.homePageItem}>
                <h1 style={{margin: 0, color: '#393E46'}}>Easy Sheduling</h1>
                <h1 style={{margin: 0, color: '#6D9886'}}>Ahead</h1>
                <p>Chronos is your scheduling automation platform for eliminating the back-and-forth emails for finding the perfect time — and so much more.</p>
                {
                   isAuth ? 
                   <div><button onClick={onClickLogout} id={styles.logOut}>Log Out</button></div> :
                   <div>
                        <Link id={styles.signUp} to='/register'>Sign Up</Link>
                        <Link id={styles.logIn} to='/login'>Log In</Link>
                    </div>
                }
            </div>
            <div className={styles.homePageItem}><img alt='' src={require('../../assets/home.png')}/></div>
        </div>
    )
}
