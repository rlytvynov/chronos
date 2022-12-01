import React, {useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import styles from "./AcceptCalendar.module.scss"
import api from "../../api/api"


export const AcceptCalendarInvetation = () => { 

    const params = useParams()
    const [state, setState] = useState({loading: false, success: true, message: 'Success'})

    useEffect(() => {
        api.get(`calendars/acceptInvitation/${params.token}`)
            .then(response => {
                setState({
                    loading: false,
                    success: true,
                    message: response.data.message
                })
            })
            .catch(error => {
                console.log(error);
                setState({
                    loading: false,
                    success: false,
                    message: error.response.data.message
                })
            })
    }, [params.token])

    return (
        <div className={styles.acceptCPage}>
            {
                state.loading ? 
                <h2 style={{textAlign: 'center'}}>Activating...</h2> :
                <div> 
                    {
                        state.success ? 
                        <div className={styles.info}>
                            <div className={styles.circle}><div><img src={require('../../assets/emailConfirm.png')} alt="confirmed" /></div></div>
                            <div style={{textTransform: 'uppercase', textAlign: 'center'}}> {state.message} <br/> </div>
                        </div>
                        :
                        <div className={styles.info}>
                            <div className={styles.circle}><img src={require('../../assets/emailReject.png')} alt="rejected" /></div>
                            <div style={{textTransform: 'uppercase', textAlign: 'center'}}> {state.message} </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}