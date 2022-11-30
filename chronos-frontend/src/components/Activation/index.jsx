import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import styles from './Activation.module.scss'

export const Activation = () => { 

    const params = useParams()
    const [state, setState] = useState({loading: true, success: true})

    useEffect(() => {
        api.get(`auth/confirmEmail/${params.activationToken}`)
            .then(response => {
                setState({
                    loading: false,
                    success: true,
                })
            })
            .catch(error => {
                setState({
                    loading: false,
                    success: false,
                })
            })
    }, [params.activationToken])

    return(
        <div className={styles.activationPage}>
            {
                state.loading ? 
                <h2 style={{textAlign: 'center'}}>Activating...</h2> :
                <div> 
                    {
                        state.success ? 
                        <div className={styles.info}>
                            <div className={styles.circle}><div><img src={require('../../assets/emailConfirm.png')} alt="confirmed" /></div></div>
                            <div style={{textTransform: 'uppercase', textAlign: 'center'}}>Email has been succesfully <br/> <span style={{color: '#6D9886'}}>confirmed</span></div>
                        </div>
                        :
                        <div className={styles.info}>
                            <div className={styles.circle}><img src={require('../../assets/emailReject.png')} alt="rejected" /></div>
                            <div style={{textTransform: 'uppercase', textAlign: 'center'}}>Some error has<br/><span style={{color: '#FF6F6F'}}>happened</span></div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}