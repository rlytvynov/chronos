import React, { useState }  from "react";
import styles from "./CalendarList.module.scss"
import "./Pagination.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSortAmountUpAlt, faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom'
import  Pagination from 'react-js-pagination'
import { useOpenModal } from "../../utils/stateEventCreationForm";
import { CalendarForm } from "../../pages/CalendarForm";
import { EventData } from "../../pages/EventData";


export const CalendarList =  () => {

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

    // eslint-disable-next-line
    const [calendars , setCalendars] = useState({
        currentPage: 1,
        itemsCountPerPage: 4,
        totalItems: 5,
        totalPages: 2,
        calendars: [
            {
                id: 1,
                title: 'Office Calendar',
                description: 'Here all important ...',
                events: [],
            },
            {
                id: 2,
                title: 'Home Calendar',
                description: 'Here all thi',
                events: [],
            },
            {
                id: 3,
                title: 'Travel Calendar',
                description: 'Here all important ',
                events: [],
            },

            {
                id: 4,
                title: 'Jopa Calendar',
                description: 'Mnogaaaaaaaaaa',
                events: [],
            },

            // {
            //     id: 5,
            //     title: 'Test Calendar',
            //     description: 'Dohuiiiiaaaaaa',
            //     events: [],
            // }
            
        ]
    })

    const sortEventsAsc = () => {
        let arr = [...events]
        setEvents(arr.sort((a,b) => new Date (a.start) - new Date (b.start)))
    }

    const sortEventsDesc= () => {
        let arr = [...events]
        setEvents(arr.sort((a,b) => new Date (b.start) - new Date (a.start)))
    }

    const modalInfoCalendar = useOpenModal(false)
    const modalInfoEvent = useOpenModal(false)

    const handlePageChange = (page) => {
    // API.get(`calendars?page=${page}`)
    //     .then(response => {
    //         setCalendars(response.data)
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    }

    const handleNewCalendarOpen = () => {
        modalInfoCalendar.handleOpen()
    }

    return (
        <div className={styles.calendarList}>
            <div className={styles.hederBlock}>
                <h2>Calendars</h2>
                <div><button onClick={handleNewCalendarOpen}>+ New Calendar</button></div>
            </div>
            <div className={styles.calendarListInner}>
                <div className={styles.allEvents}>
                    <div className={styles.sortBlock}>
                        <div style={{cursor: 'pointer'}} onClick={sortEventsAsc}><FontAwesomeIcon icon={faSortAmountDownAlt}/></div>
                        <h3>All Events</h3>
                        <div style={{cursor: 'pointer'}} onClick={sortEventsDesc}><FontAwesomeIcon icon={faSortAmountUpAlt}/></div>
                    </div>
                    <div className={styles.eventScroll}>
                    {
                        events.map((item) => (
                            <div key={item.id} className={styles.eventItem} onClick={() => { modalInfoEvent.handleData(item); modalInfoEvent.handleOpen() }} style={new Date(Date.now()) > new Date(item.start) ? {opacity: 0.3} : {opacity: 1}}>
                                <div className={styles.eventTitle}>
                                    <div style={{background: item.color}} className={styles.eventColor}></div>
                                    <div className={styles.eventName}>{item.title}</div>
                                </div>
                                <div className={styles.eventTime}>
                                    {
                                        (()=>{
                                            const dateNow = new Date(Date.now())
                                            // console.log(dateNow.getFullYear())
                                            // console.log(new Date(item.start).getFullYear())
                                            let arr = []
                                            if(dateNow.getFullYear() !== (new Date(item.start)).getFullYear()) {
                                                arr.push((new Date(item.start)).getDate())
                                                arr.push((new Date(item.start)).getMonth() + 1)
                                                arr.push((new Date(item.start)).getFullYear())
                                            } else {
                                                const day = (new Date(item.start)).getDate()
                                                const month = (new Date(item.start)).getMonth() + 1
                                                const hours = (new Date(item.start)).getHours()
                                                const minutes = (new Date(item.start)).getMinutes()
    
                                                if(dateNow.getMonth() + 1 !== month) {
                                                    arr.push(day)
                                                    arr.push((new Date(item.start)).getMonth()+1)
                                                } else {
                                                    let str = ''
                                                    if(dateNow.getDate() !== day) {
                                                        arr.push(day)
                                                        arr.push((new Date(item.start)).getMonth() + 1)
                                                    } else {
                                                        str = hours + ':' + minutes + '(today)'
                                                        arr.push(str)
                                                    }
                                                }
                                            }
                                            //console.log(arr)
                                            return arr.join('-')
                                        })()
                                    }
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
                <div className={styles.allCalendars}>
                    <div className={styles.allCalendarsInner}>
                        {
                            calendars.calendars.map(calendar => (
                                <Link key={calendar.id} to={"/calendars/" + calendar.id} className={styles.calendarLink}>
                                    <div className={styles.calendarItem}>
                                        <div className={styles.calendarItemLeftBar}>
                                            {calendar.title}
                                        </div>
                                        <div className={styles.calendarItemRightBar}>
                                            <div className={styles.calendarEvents}>
                                                {
                                                    calendar.events.map(event => (
                                                        <div key={event.id} className={styles.eventItem} style={new Date(Date.now()) > new Date(event.start) ? {opacity: 0.3} : {opacity: 1}}>
                                                            <div className={styles.eventTitle}>
                                                                <div style={{background: event.color}} className={styles.eventColor}></div>
                                                                <div className={styles.eventName}>{event.title}</div>
                                                            </div>
                                                            <div className={styles.eventTime}>
                                                                {
                                                                    (()=>{
                                                                        const dateNow = new Date(Date.now())
                                                                        // console.log(dateNow.getFullYear())
                                                                        // console.log(new Date(item.start).getFullYear())
                                                                        let arr = []
                                                                        if(dateNow.getFullYear() !== (new Date(event.start)).getFullYear()) {
                                                                            arr.push((new Date(event.start)).getDate())
                                                                            arr.push((new Date(event.start)).getMonth() + 1)
                                                                            arr.push((new Date(event.start)).getFullYear())
                                                                        } else {
                                                                            const day = (new Date(event.start)).getDate()
                                                                            const month = (new Date(event.start)).getMonth() + 1
                                                                            const hours = (new Date(event.start)).getHours()
                                                                            const minutes = (new Date(event.start)).getMinutes()
                                
                                                                            if(dateNow.getMonth() + 1 !== month) {
                                                                                arr.push(day)
                                                                                arr.push((new Date(event.start)).getMonth()+1)
                                                                            } else {
                                                                                let str = ''
                                                                                if(dateNow.getDate() !== day) {
                                                                                    arr.push(day)
                                                                                    arr.push((new Date(event.start)).getMonth() + 1)
                                                                                } else {
                                                                                    str = hours + ':' + minutes + '(today)'
                                                                                    arr.push(str)
                                                                                }
                                                                            }
                                                                        }
                                                                        //console.log(arr)
                                                                        return arr.join('-')
                                                                    })()
                                                                }
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="calendarDescription">
                                                <p>{calendar.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                        <Pagination className={styles.pagination}
                            activePage={calendars.currentPage}
                            itemsCountPerPage={calendars.itemsCountPerPage}
                            totalItemsCount={calendars.totalItems}
                            pageRangeDisplayed={calendars.totalPages}
                            onChange={handlePageChange}
                        />
                </div>
            </div>
            <CalendarForm
                open={modalInfoCalendar.isOpen}
                handleClose={modalInfoCalendar.handleClose}
            />
            <EventData
                open={modalInfoEvent.isOpen}
                handleClose={modalInfoEvent.handleClose}
                id={modalInfoEvent.extraData.id}
            />
        </div>
    )
}
