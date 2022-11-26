import React from "react";
import { Header } from "./components/Header"
import { Home } from "./components/Home"
import { Account } from "./components/Account"
import { Login } from "./components/Login";
import { Register } from "./components/Registration";

import { CalendarList} from "./components/CalendarList"
import { CalendarItem } from "./components/CalendarItem"
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route index element={ <Home/> } />
                <Route exact path='/account' element={ <Account/> } />

                <Route exact path='/login' element={ <Login/> } />
                 <Route exact path='/register' element={ <Register/> } />
                {/*<Route exact path='/activation/:activationToken' element={ <Activation/> } /> */}


                <Route exact path='/calendars' element={ <CalendarList/> } />
                <Route exact path='/calendars/:id' element={ <CalendarItem/> } />
            </Routes>
            {/* <Footer/> */}
        </Router>
    )
}

export default App