import { useEffect, useState } from 'react'
import Admin from './Admin'
import User from './User'
import jwtDecode from 'jwt-decode'

const PrivateScreen = () => {
  const [role, setRole] = useState(null)

  useEffect(() => {
    var token = localStorage.getItem('authToken')

    if (token) {
      var decoded = jwtDecode(token)
      setRole(decoded.role)
    }
  }, [])

  //choose which UI to display based on the role
  let RoleComponent = null // this value has to be changed to a default component in case role string is not recognize
  switch (role) {
    case 'Admin':
      RoleComponent = <Admin role={role} />
      break
    case 'User':
      RoleComponent = <User role={role} />
      break
    default:
      break
  }
  return (
    <>
      <div>{RoleComponent}</div>
    </>
  )
}

export default PrivateScreen
