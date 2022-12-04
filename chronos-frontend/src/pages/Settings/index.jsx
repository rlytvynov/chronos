import React from "react";
import { useForm } from 'react-hook-form';
import styles from "./Settings.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import api from "../../api/api";

export const Settings = (props) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = (values) => {
        api.patch('users', values)
        .then (function(response) {
            alert(response.data.message)
        })
        .catch(function(error){
            console.log(error);
        }) 
        props.handleClose()
        reset()
    }

    const handleCloseSettings = () => {
        props.handleClose()
        reset()
    }

    return(
        <div className={`${styles.eventForm} ${props.open ? styles.active : styles.unactive}`}>
            <form className={styles.eventFormCenter} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                <div className={styles.titleField}><input type="text" placeholder='New login' {...register('login')}/></div>
                <div className={styles.titleField}><input type="text" placeholder='New Password' {...register('password')}/></div>
                <div className={styles.titleField}><input type="text" placeholder='New Full Name' {...register('fullName')}/></div>
                <div className={styles.titleField}><input type="text" placeholder='New Email' {...register('email')}/></div>
                <div className={styles.locationField}>
                    <h3> Choose your new location</h3>
                    <div className={styles.location}>
                        <div className={styles.inputType}><input id="ukraine" type="radio" value='ua' {...register('location')}/><label htmlFor="ukraine">Ukraine</label></div>
                        <div className={styles.inputType}><input id="germany" type="radio" value='ge'{...register('location')}/><label htmlFor="germany">Germany</label></div>
                        <div className={styles.inputType}><input id="usa" type="radio" value='us'{...register('location')}/><label htmlFor="usa">USA</label></div>
                        <div className={styles.inputType}><input id="france" type="radio" value='fr' {...register('location')}/><label htmlFor="france">France</label></div>
                        <div className={styles.inputType}><input id="bulgaria" type="radio" value='bg'{...register('location')}/><label htmlFor="bulgaria">Bulgaria</label></div>
                        <div className={styles.inputType}><input id="poland" type="radio" value='pl'{...register('location')}/><label htmlFor="poland">Poland</label></div>
                    </div>
                </div>
                <div className={styles.submitField}>
                    <input type="submit" value="Submit Changes"/>
                </div>
            </form>
        </div>
    )
}
