import React from "react";
import styles from './Login.module.scss'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock} from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (values) => {
        // const data = await dispatch(fetchAuth(values))
        // if (!data.payload) {
        //     return alert('Unable to authorize')
        // }
        // if ('accessToken' in data.payload) {
        //     window.localStorage.setItem('accessToken', data.payload.accessToken)
        // } else {
        //     alert('Unable to authorize')
        // }
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.formName}>Login</div>
            <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.emailField}><FontAwesomeIcon icon = {faUser}/><input type="text" placeholder='Login' {...register('login', { required: true })} /></div>
                {errors.email && <p className='loginError'>Email is required.</p>}
                <div className={styles.passwordField}><FontAwesomeIcon icon = {faLock}/><input type="password" placeholder='Password' {...register('password', { required: true })} /></div>
                {errors.password && <p className='loginError'>Password is required.</p>}
                <div className={styles.reminders} style={{textAlign: 'right'}}> <Link to='/register'>Forgot password?</Link></div>
                <div className={styles.logInField}><input type="submit" value="Login"/></div>
                <div className={styles.reminders} style={{textAlign: 'center'}}>Don't have an account yet? <Link to='/register'>Sign up</Link></div>
            </form>
        </div>
    )
}