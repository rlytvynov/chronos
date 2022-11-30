import React, { useEffect, useState }  from "react";
import { useForm } from 'react-hook-form';
import styles from "./EventData.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import api from "../../api/api";


export const EventData = (props) => {

    const {
        reset
    } = useForm();


// eslint-disable-next-line
    const [event, setEvent] = useState({loading: true})

    const getEvent = (eventID) => {
        api.get(`events/event=${eventID}`)
            .then(response => {
                setEvent({
                    loading: false,
                    data: response.data
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(()=>{
        if(props.id) {
            getEvent(props.id)
        }
    }, [props.id])


    const handleSubmit = () => {
        api.delete(`events/event=${props.id}`)
            .then(response => {
                alert(response.data.message)
            })
            .catch(error => {
                alert(error.message)
            })
        reset()
        props.handleClose()
    }

    const handleCloseSettings = (values) => {
        reset()
        props.handleClose()
    }

    return(
        <div className={`${styles.eventForm} ${props.open ? styles.active : styles.unactive}`}>
            {
                event.loading ? 
                <h2>Loading...</h2> : 
                <form className={styles.eventFormCenter} onSubmit={handleSubmit}>
                    <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                    <div className={styles.titleBlock}>
                        <div className={styles.title}>
                            <div>{event.data.title}</div>
                            <div className={styles.type}>{event.data.type}</div>
                        </div>
                        <div style={{backgroundColor: event.data.color}} className={styles.color}></div>
                    </div>
                    <div className={styles.description}>{event.data.description}</div>
                    <div><input type="submit" value="Delete" /></div>
                </form>
            }
        </div>
    )
}
