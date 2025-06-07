import React, { useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Utils from './Utils/MenuItems'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Styles.css'

const DrawerComponent = () => {
  let navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const logoutHandler = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }
  return (
    <>
      <Drawer className='drawer' open={open} onClose={() => setOpen(false)}>
        <List className='DrawerList'>
          {Utils.MainMenu.map((item, i) => (
            <ListItem key={'Mc' + i} button component={Link} to={item.path}>
              <ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </ListItemIcon>
            </ListItem>
          ))}
          <Box mx>
            <Button
              className='drawerButton'
              size='small'
              color='secondary'
              variant='contained'
              onClick={logoutHandler}
            >
              Logout
            </Button>
          </Box>
        </List>
      </Drawer>
      <IconButton
        sx={{ marginLeft: 'auto', color: 'white' }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon></MenuIcon>
      </IconButton>
    </>
  )
}

export default DrawerComponent
