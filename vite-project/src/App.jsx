
import {Routes, Route} from 'react-router-dom'
import Home from './components/home'
import User from './components/user'
import Doctor from './components/doctor'
import Appointment from './components/appointment'
import DoctorProfile from './components/doctorProfile'
import './App.css'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path='/doctor' element={<Doctor/>}/>
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/doctorProfile' element={<DoctorProfile/>}/>
      </Routes>
    </>
  )
}

export default App
