import React from "react";
import styles from './Login.module.scss'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchRegister } from "../../utils/redux/slices/register";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faAddressCard, faEnvelope} from "@fortawesome/free-solid-svg-icons";

export const Register = () => {
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values))
        console.log(values);
        if (!data.payload) {
            return alert('Unable to authorize')
        } else {
            alert(data.payload.msg)
        }
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.formName}>Registration</div>
            <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.loginField}><FontAwesomeIcon icon = {faUser}/><input type="text" placeholder='Login' {...register('login', { required: true })} /></div>
                {errors.login && <p className='loginError'>Login is required.</p>}
                <div className={styles.fullNameField}><FontAwesomeIcon icon = {faAddressCard}/><input type="text" placeholder='Full Name' {...register('fullName', { required: true })} /></div>
                <div className={styles.emailField}><FontAwesomeIcon icon = {faEnvelope}/><input type="email" placeholder='Email' {...register('email', { required: true })} /></div>
                {errors.email && <p className='loginError'>Email is required.</p>}
                <div className={styles.passwordField}><FontAwesomeIcon icon = {faLock}/><input type="password" placeholder='Password' {...register('password', { required: true })} /></div>
                {errors.password && <p className='loginError'>Password is required.</p>}

                <div className={styles.logInField}><input type="submit" value="Register"/></div>
                <div className={styles.reminders} style={{textAlign: 'center'}}>Don't have an account yet? <Link to='/login'>Sign in</Link></div>
            </form>
        </div>
    )
}