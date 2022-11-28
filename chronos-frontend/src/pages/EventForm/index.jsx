import React from "react";
import { useForm } from 'react-hook-form';
import styles from "./EventForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export const EventForm = (props) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const onSubmit = (values) => {
        const newEvent = {
            title: values.title,
            type: values.type,
            color: values.color,
            start: values.dateFrom + 'T' + values.start,
            end: values.dateTo + 'T' + values.end,
        }
        // api.post('events/calendar=:calendarId', values)
        // .then (function(response) {
        //     alert(response.data.message)
        // })
        // .catch(function(error){
        //     console.log(error);
        // }) 
        console.log(newEvent)
        reset()
        props.handleClose()
    }

    const handleCloseSettings = (values) => {
        reset()
        props.handleClose()
    }

    if(!props.open) {
        return
    }

    return(
        <div className={`${styles.eventForm} ${props.open ? styles.active : styles.unactive}`}>
            <form className={styles.eventFormCenter} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                <div className={styles.titleField}><input type="text" placeholder='Type name' {...register('title')}/></div>
                <div className={styles.typeField}>
                    <div className={styles.inputType}><input id="arrangement" type="radio" value='arrangement' {...register('type')}/><label htmlFor="arrangement">Arrangement</label></div>
                    <div className={styles.inputType}><input id="reminder" type="radio" value='reminder'{...register('type')}/><label htmlFor="reminder">Reminder</label></div>
                    <div className={styles.inputType}><input id="task" type="radio" value='task'{...register('type')}/><label htmlFor="task">Task</label></div>
                </div>
                <div className={styles.descriptionField}><input type="text" placeholder='Description' {...register('description')}/></div>
                <div className={styles.dateField}>
                    <div className={styles.inputType}><input type="date" value={props.formArgs.dateFrom}{...register('dateFrom')}/></div>
                    &mdash;
                    <div className={styles.inputType}><input type="date" value={props.formArgs.dateTo}{...register('dateTo')}/></div>
                </div>
                <div className={styles.timeField}>
                    <div className={styles.inputType}><input id="from" type="time" value={props.formArgs.startStr}{...register('start')}/></div>
                    &mdash;
                    <div className={styles.inputType}><input id="to" type="time" value={props.formArgs.endStr}{...register('end')}/></div>
                </div>
                <div className={styles.dateField}></div>
                <div className={styles.colorsField}>
                    <div id={styles.red} className={styles.inputColor}><input type="radio" value='red'{...register('color')}/></div>
                    <div id={styles.violet} className={styles.inputColor}><input type="radio" value='violet'{...register('color')}/></div>
                    <div id={styles.pink} className={styles.inputColor}><input type="radio" value='pink'{...register('color')}/></div>
                    <div id={styles.lightgreen} className={styles.inputColor}><input type="radio" value='lightgreen'{...register('color')}/></div>
                </div>
                <div className={styles.submitField}>
                    <div className='inputEventData'><input type="submit" value="Submit"/></div>
                </div>
            </form>
        </div>
    )
}
