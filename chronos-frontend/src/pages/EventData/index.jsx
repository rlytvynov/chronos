import React, { useState }  from "react";
import { useForm } from 'react-hook-form';
import styles from "./EventData.module.scss"
import './EventData.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


export const EventData = (props) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const [event, setEvent] = useState({ 
            id: props.id,
            title: 'Meeting with friends', 
            type: 'arrangement',
            description: 'sdlcmnldksmckdsmckl dsklcmdklsmcds cmnsdklnmcds lkcnsdkl',
            color: 'lightgreen',
            start: '2022-11-18T10:30',
            end: '2022-11-18T11:30'
        }
    )

    if(!props.open) {
        return
    } else {
        console.log(props.id)
    }



    const onSubmit = (values) => {
        reset()
        props.handleClose()
    }

    const handleCloseSettings = (values) => {
        reset()
        props.handleClose()
    }

    return(
        <div className={`${styles.eventForm} ${props.open ? styles.active : styles.unactive}`}>
            <form className={styles.eventFormCenter} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                <div className={styles.titleBlock}>
                    <div className={styles.title}>
                        <div>{event.title}</div>
                        <div className={styles.type}>{event.type}</div>
                    </div>
                    <div id={event.color} className={styles.color}></div>
                </div>
                <div className={styles.description}>{event.description}</div>
                <div><button>Delete</button></div>
            </form>
        </div>
    )
}
