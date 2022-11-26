import React from "react";
import { useForm } from 'react-hook-form';
import styles from "./CalendarForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';

export const CalendarForm = (props) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = (values) => {
        console.log(values)
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
                <div className={styles.titleField}><input type="text" placeholder='Type name' {...register('title')}/></div>
                <div className={styles.description}><textarea name="description" id="description" maxLength={100} placeholder="Description..." {...register('description')}></textarea></div>
                <div className={styles.submitField}>
                    <input type="submit" value="Add"/>
                </div>
            </form>
        </div>
    )
}
