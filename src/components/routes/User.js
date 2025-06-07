import React from 'react'
import { Route, Routes, HashRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import Clients from '../Clients/Clients'
import Navbar from '../Navbar'
import InputForm from '../Forms/InputForm'
import Reports from '../Reports/Reports'

const User = () => {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/create' element={<InputForm />} />
        <Route path='/clients' element={<Clients />} />
        <Route path='/reports' element={<Reports />} />
      </Routes>
    </>
  )
}

export default User
