import './App.css'
import InputForm from './components/Forms/InputForm'
import Navbar from './components/Navbar'
import { Route, Routes, Router, Switch } from 'react-router-dom'
import Login from './components/routes/Login'
import PrivateRoute from './components/routes/PrivateRoute'
import PrivateScreen from './components/routes/PrivateScreen'


function App() {


  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='*'
          element={
            <PrivateRoute>
              <PrivateScreen />
            </PrivateRoute>
          }
        />
     
      </Routes>
    </div>
  )
}

export default App
