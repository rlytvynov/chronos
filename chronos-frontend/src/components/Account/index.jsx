import React, {useState} from "react";
import styles from "./Account.module.scss"

export const Account = () => {
    // eslint-disable-next-line
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Jopa',
            color: 'red',
            start: '2023-12-28T10:30:00'
        },
        {
            id: 2,
            title: 'Bla Bla',
            color: 'yellow',
            start: '2022-11-28T10:30:00'
        },
        {
            id: 3,
            title: 'Hui',
            color: 'blue',
            start: '2022-11-21T10:30:00'
        },
        {
            id: 4,
            title: 'Kavun',
            color: 'red',
            start: '2022-11-21T11:25:00'
        },
    ])

    return (
        <div className={styles.accountPage}>
            <h2>Account</h2>
            <div className={styles.accountInfo}>
                <div className={styles.leftBar}>
                    <div className={styles.profilePicture}> <img alt='' src={require('../../assets/home.png')}/></div>
                    <div className={styles.userName}>Roman Lytvynov</div>
                    <div className={styles.userLogin}>rlytvynov</div>
                    <button>Settings</button>
                    <button>Upload Photo</button>
                </div>
                <div className={styles.rightBar}>
                    <h3>Upcomming event</h3>
                    {
                        events.map((item) => (
                            <div key={item.id} className={styles.eventItem}>
                                <div className={styles.eventTitle}>
                                    <div style={{background: item.color}} className={styles.eventColor}></div>
                                    <div className={styles.eventName}>{item.title}</div>
                                </div>
                                <div className={styles.eventTime}>
                                    {item.start}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}