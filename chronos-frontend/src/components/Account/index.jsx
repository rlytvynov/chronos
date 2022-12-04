import React, {useState, useRef, useEffect} from "react";
import styles from "./Account.module.scss"
import { useSelector } from 'react-redux'
import { selectIsAuth, selectAuthUser } from "../../utils/redux/slices/auth";
import { Settings } from "../../pages/Settings";
import axios from "axios";
import { useOpenModal } from "../../utils/stateEventCreationForm";
import api from "../../api/api";

export const Account = () => {
    
    const isAuth = useSelector(selectIsAuth)
    const userData = useSelector(selectAuthUser)
    const inputFileRef = useRef(null)
    let avatarName = 'none.png';
    if (userData) avatarName = userData.profilePic;
    const AvatarUrl = 'http://localhost:8888/api/users/avatar/' + avatarName;
    // eslint-disable-next-line
    const [events, setEvents] = useState({loading: false, data: []})

    const handleUploadPhoto = async (event) => {
        try {
            let formData = new FormData()
            const file = event.target.files[0]
            console.log(file)
            formData.append('', file)
            console.log(formData)

            const { data } = await axios({
                method: "patch",
                url: `http://localhost:8888/api/users/avatar`,
                data: formData,
                headers: {'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" },
                credentials: 'include',   
                withCredentials: true
            })
            console.log(data);
        } catch (error) {
            console.warn(error)
            alert('Error occured!')
        }
    }

    const modalSettings = useOpenModal(false)
    const handleSettingsClick = () => {
        modalSettings.handleOpen()
    }

    const getAllEvents = () => {
        const dateStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
        const dateEnd = new Date(new Date().getFullYear()+1, 0, 0).toISOString();
        // console.log(dateStart.getTime())
        api.get(`events/start=${dateStart}-end=${dateEnd}`)
        .then(function(response) {
             setEvents({
                loading: false,
                data: response.data
            })
            console.log(response.data)
        })
        .catch(function(error) {
            console.log(error.message)
        })
    }

    useEffect(() => {
        getAllEvents()
    }, [userData])

    return (
        <div className={styles.accountPage}>
            <h2>Account</h2>
            {
                isAuth ? 
                <div className={styles.accountInfo}>
                    <div className={styles.leftBar}>
                        <div className={styles.profilePicture}> <img alt='' src={AvatarUrl}/></div>
                        <div className={styles.userName}>{userData.fullName}</div>
                        <div className={styles.userLogin}>{userData.login}</div>

                        <button onClick={handleSettingsClick} className={styles.settings}>Settings</button>
                        <button className={styles.upload} onClick={() => inputFileRef.current.click()}>Upload Photo</button>
                        <input ref={inputFileRef} onChange={handleUploadPhoto} type="file" hidden/>
                    </div>
                    <div className={styles.rightBar}>
                        <h3>Upcomming event</h3>
                        {
                            events.loading ? <h2>Loading events...</h2> :
                            
                            (
                                events.data.length ? events.data.map((item) => (
                                <div key={item.id} className={styles.eventItem}>
                                    <div className={styles.eventTitle}>
                                        <div style={{background: item.color}} className={styles.eventColor}></div>
                                        <div className={styles.eventName}>{item.title}</div>
                                    </div>
                                    <div className={styles.eventTime}>
                                        {item.start}
                                    </div>
                                </div>
                                )) : <h2>There are not events on this week</h2>
                            )
                        }
                    </div>
                    <Settings
                        open={modalSettings.isOpen}
                        handleClose={modalSettings.handleClose}
                    />
                </div> : 
                <div className={styles.logInContinue}>Log in to continue...</div>
            }
        </div>
    )
}