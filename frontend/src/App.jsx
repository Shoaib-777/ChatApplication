import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes,Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Home from './pages/Home'
import { useThemeStore } from './store/useThemeStore'
import AddUsers from './pages/AddUsers'
import AddGroup from './pages/AddGroup'
import { useGetCookies } from './store/useGetCookies'
import Group from './pages/Group'
import ForgetPassword from './pages/ForgetPassword'
import Notifications from './pages/Notifications'

const App = () => {
  const {theme} = useThemeStore()
  const {authUser}=useGetCookies()
  useEffect(() => {
    // console.log("AuthUser changed:", authUser);
  }, [authUser]);
 
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <Home/> : <Navigate to='/login'/>} />
        <Route path='/group' element={authUser ? <Group/> : <Navigate to='/login'/>} />
        <Route path='/signup' element={authUser ? <Navigate to='/'/> :<Signup/>}/>
        <Route path='/login' element={authUser ? <Navigate to='/'/> :<Login/>}/>
        <Route path='/profile' element={authUser ? <Profile/> : <Navigate to='/login'/>}/>
        <Route path='/notifications' element={authUser ? <Notifications/> : <Navigate to='/login'/>}/>
        <Route path='/adduser' element={authUser ? <AddUsers/> : <Navigate to='/login'/>}/>
        <Route path='/addgroup' element={authUser ? <AddGroup/> : <Navigate to='/login'/>}/>
        <Route path='/forget-password' element={<ForgetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App