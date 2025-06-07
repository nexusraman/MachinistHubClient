import React from 'react'
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom'
import Clients from '../Clients/Clients'
import Dashboard from '../Dashboard'
import InputForm from '../Forms/InputForm'
import Navbar from '../Navbar'
import Reports from '../../components/Reports/Reports'
import Client from '../Clients/Client'
const Admin = (props) => {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/create' element={<InputForm />} />
        <Route path='/clients' element={<Clients />} />
        <Route path='/reports' element={<Reports role={props.role} />} />
        <Route path='/clients/:id' element={<Client />} />
      </Routes>
    </>
  )
}

export default Admin
