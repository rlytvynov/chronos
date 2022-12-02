import React, { useEffect, useState }  from "react";
import { useForm } from 'react-hook-form';
import styles from "./EventData.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import api from "../../api/api";
import { useOpenModal } from "../../utils/stateEventCreationForm";
import { InviteFormEvent } from "./InviteFormEvent";

export const EventData = (props) => {

    const {
        reset
    } = useForm();


// eslint-disable-next-line
    const [event, setEvent] = useState({loading: true})
    const modalInviteEventForm = useOpenModal(false)

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


    const handleDelete = () => {
        api.delete(`events/event=${props.id}`)
            .then(response => {
                alert(response.data.message)
            })
            .catch(error => {
                alert(error)
            })
        reset()
        props.handleClose()
    }

    const handleInvite = () =>  {
        modalInviteEventForm.handleOpen() 
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
                <div className={styles.eventFormCenter}>
                    <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                    <div className={styles.titleBlock}>
                        <div className={styles.title}>
                            <div>{event.data.title}</div>
                            <div className={styles.type}>{event.data.type}</div>
                        </div>
                        <div style={{backgroundColor: event.data.color}} className={styles.color}></div>
                    </div>
                    <div className={styles.description}>{event.data.description}</div>
                    <div className={styles.buttons}>
                        <button id={styles.delete} onClick={handleDelete}>Delete</button>
                        <button id={styles.invite} onClick={handleInvite}>Invite member <FontAwesomeIcon icon={faUserPlus}/></button>
                    </div>
                    <InviteFormEvent
                        open={modalInviteEventForm.isOpen}
                        handleClose={modalInviteEventForm.handleClose}
                        id={event.data.id}
                    />
                </div>
            }
        </div>
    )
}
