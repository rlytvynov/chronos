import React from "react";
import { Header } from "./components/Header"
import { Home } from "./components/Home"
import { Account } from "./components/Account"
import { Login } from "./components/Login";
import { Register } from "./components/Registration";
import { Activation } from "./components/Activation";

import { CalendarList} from "./components/CalendarList"
import { CalendarItem } from "./components/CalendarItem"
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAuthMe, selectIsAuth } from "./utils/redux/slices/auth";

function App() {
    const dispatch = useDispatch()
    // eslint-disable-next-line
    const isAuth = useSelector(selectIsAuth)
  
    useEffect(() => {
        const updateToken = async () => {
          const data = await dispatch(fetchAuthMe())
          //console.log(data)
          if (data.payload && 'accessToken' in data.payload) {
              window.localStorage.setItem('accessToken', data.payload.accessToken)
          }
      }
      updateToken()
    }, [dispatch])
    
    return (
        <Router>
            <Header/>
            <Routes>
                <Route index element={ <Home/> } />
                <Route exact path='/account' element={ <Account/> } />

                <Route exact path='/login' element={ <Login/> } />
                <Route exact path='/register' element={ <Register/> } />
                <Route exact path='/confirmEmail/:activationToken' element={ <Activation/> } />

                <Route exact path='/calendars' element={ <CalendarList/> } />
                <Route exact path='/calendars/:id' element={ <CalendarItem/> } />
            </Routes>
            {/* <Footer/> */}
        </Router>
    )
}

export default App