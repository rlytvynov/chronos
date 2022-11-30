import React, {useState, useCallback} from "react";
import "./CalendarItem.css"
import {EventForm} from '../../pages/EventForm'
import { EventData } from "../../pages/EventData";
import { useOpenModal } from "../../utils/stateEventCreationForm";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"
import enLocale from '@fullcalendar/core/locales/en-gb';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBucket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';
import { useEffect } from "react";
import api from "../../api/api";

export const CalendarItem =  () => {
    
    const params = useParams();
    // eslint-disable-next-line
    // const [events, setEvents] = useState([
    //     { 
    //         id: 1,
    //         title: 'event', 
    //         type: 'arrangement',
    //         color: 'red',
    //         start: '2022-11-18T10:30',
    //         end: '2022-11-18T11:30'
    //     },
    //     { 
    //         id: 2,
    //         title: 'arrangemet', 
    //         type: 'task',
    //         color: 'green',
    //         start: '2022-11-18T13:30:00',
    //         end: '2022-11-18T15:30:00',
    //     }
    // ])
    const [events, setEvents] = useState({loading: true, data: []})

    const getAllEvents = (calendarID) => {
        api.get(`events/calendar=${calendarID}`)
            .then((response) => {
                 setEvents({
                     loading: false,
                     data: response.data
                })
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    useEffect(() => {
        getAllEvents(params.id)
    }, [params.id])
    
    const modalAddEvent = useOpenModal(false)
    const modalInfoEvent = useOpenModal(false)

    const [formArgs, setFormArgs] = useState({
        startStr: '00:00',
        endStr: '23:00',
        dateFrom: '',
        dateTo: ''
    })

    const handleEventClick = (arg) => {
        console.log(arg.event)
        modalInfoEvent.handleData(arg.event)
        modalInfoEvent.handleOpen()  
    }

    const handleFormArgs = useCallback((arg) => setFormArgs({
        startStr: `${new Date(arg.startStr).getHours() >= 10 ? 
            new Date(arg.startStr).getHours() : 
            '0' + new Date(arg.startStr).getHours()}:${new Date(arg.startStr).getMinutes() >= 10 ? 
            new Date(arg.startStr).getMinutes() :
            '0' + new Date(arg.startStr).getMinutes()}`,
        endStr: `${new Date(arg.endStr).getHours() >= 10 ? 
            new Date(arg.endStr).getHours() : 
            '0' + new Date(arg.endStr).getHours()}:${new Date(arg.endStr).getMinutes() >= 10 ? 
            new Date(arg.endStr).getMinutes() :
            '0' + new Date(arg.endStr).getMinutes()}`,
        dateFrom : arg.startStr.slice(0, 10),
        dateTo: arg.endStr.slice(0, 10)
    }), [])

    const handleEventSet = (arg) => {
        console.log(arg)
        handleFormArgs(arg)
        modalAddEvent.handleOpen()
    }

    return(
        <div className='calendar-item'>
            {
                events.loading ? <h2>Loading...</h2> :
                <FullCalendar
                locale={enLocale}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin]}
                selectable={true}
                initialView="dayGridMonth"
                nowIndicator={true}
                headerToolbar={{
                    start: 'prev next title', // will normally be on the left. if RTL, will be on the right
                    end: 'dayGridMonth,timeGridWeek,timeGridDay' // will normally be on the right. if RTL, will be on the left
                }}

                views ={{
                    week: {
                        titleFormat: { year: 'numeric', month: 'long' }
                    },
                    day: {
                        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
                    }
                }}

                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                events={events.data}
                eventTimeFormat={{ // like '14:30:00'
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                eventClick={handleEventClick}
                select={handleEventSet}
                height="auto"
                allDaySlot={false}
            />
            }
            <EventForm 
                open={modalAddEvent.isOpen}
                handleClose={modalAddEvent.handleClose}
                formArgs = {formArgs}
                calendarID = {params.id}
            />
            <EventData
                open={modalInfoEvent.isOpen}
                handleClose={modalInfoEvent.handleClose}
                id={modalInfoEvent.extraData.id}
            />
            <div className="callendarButtons">
                <div><button className="addUser"><FontAwesomeIcon icon = {faUserPlus}/> Add User</button></div>
                <div><button className="deleteCalendar"><FontAwesomeIcon icon = {faBucket}/> Delete</button></div>
            </div>
        </div>
    )
}
