import React, { useState } from "react"
import { useForm } from 'react-hook-form';
import styles from "./InviteFormEvent.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import api from "../../../api/api";

export const InviteFormEvent = (props) => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const[userFound, setUserFound] = useState({
        loading: true,
        found: false
    })
    const success = false

    const handleCloseSettings = (values) => {
        setUserFound({
            loading: true,
            found: false
        })
        reset()
        props.handleClose()
    }

    const onSubmit = (values) => {

      api.post(`events/event=${props.id}/invite/user=${values.userLogin}`)
        .then(response => {
            setUserFound({
                loading: false,
                found: true,
            })
        })
        .catch(error => {
            setUserFound({
                loading: false,
                found: false,
            })
        })


        console.log(values.userLogin)
        console.log(props.id)
        if(success) {
            setUserFound({
                loading: false,
                found: true
            })
        } else {
            setUserFound({
                loading: false,
                found: false
            })
        }
        reset()
    }

    return (
        <div className={`${styles.inviteForm} ${props.open ? styles.active : styles.unactive}`}>
            {
                userFound.loading ? 
                <form className={styles.inviteFormCenter} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                    <input className={styles.searchBar} type="search" name="search" placeholder="Search..." {...register('userLogin')}/>
                    <input className={styles.submit} type="submit" value="Add user" />
                </form> :
                (
                    userFound.found ? 
                    <div className={styles.inviteFormCenter}>
                        <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                        <div className={styles.found}>
                            <FontAwesomeIcon icon={faUserCheck} color='lightgreen'/>
                            <br />
                            Invitation has been sent!
                        </div>
                    </div>
                    :
                    <div className={styles.inviteFormCenter}>
                        <div className={styles.crossButton} onClick={handleCloseSettings}><FontAwesomeIcon icon={faXmark}/></div>
                        <div className={styles.notFound}>
                            <FontAwesomeIcon icon={faUserXmark} color='red'/>
                            <br />
                            User Not Found :&#40;
                        </div>
                    </div>
                )
            }
        </div>
    )
}