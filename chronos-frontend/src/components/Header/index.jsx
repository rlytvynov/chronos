import React, {useRef} from "react";
import "./Header.css"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export const Header =  () => {
    const navRef = useRef();
	const isAuth = false
	const userData = {}



	const onClickLogout = (e) => {
		// e.preventDefault()
		// if(window.confirm('Are you sure to logout?')) {
		// 	dispatch(fetchLogout())
		// 	window.localStorage.removeItem('accessToken')
		// 	window.location.reload()
		// }
	}

	const showNavbar = () => {
		navRef.current.classList.toggle("responsive_nav");
	};
    return(
        <header>
            <h3 className="Logo"><Link className="logo" to="/">Chronos</Link></h3>

            <nav ref={navRef}>
                <form className="nosubmit">
                    <input className="nosubmit" type="search" name="search" placeholder="Search..."/>
                </form>
                <Link onClick={showNavbar} to="/account">Home</Link>
                <Link onClick={showNavbar} to="/calendars">Calendars</Link>

                <button
                    className="nav-btn nav-close-btn"
                    onClick={showNavbar}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </nav>
            {
                isAuth ? <div>
                            <img style={{borderRadius: '50%', marginRight: '5px'}} src={userData.profilePicture} alt='pic' width={32} height={32}></img>
                            <span style={{marginRight: '10px'}}>{userData.login}</span>
                            <button className="logout" onClick={onClickLogout}>Logout</button>
                        </div> : 
                        <Link className="logIn" to="/login">Log in</Link>
            }
            <button className="nav-btn" onClick={showNavbar}>
                <FontAwesomeIcon icon={faBars}/>
            </button>
    </header>
    )
}
