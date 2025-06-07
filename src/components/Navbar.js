import React, { useState } from 'react'
import {
  AppBar,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import DrawerComponent from './DrawerComponent'
import Utils from './Utils/MenuItems'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Navbar = (props) => {
  let navigate = useNavigate()
  const theme = useTheme()
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'))
  const [value, setValue] = useState(0)
  const logoutHandler = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }
  return (
    <AppBar
      sx={{
        backgroundImage:
          ' linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,56,9,0.5242471988795518) 35%, rgba(0,212,255,1) 100%)',
      }}
      position='sticky'
    >
      <Toolbar>
        {!isMatch ? (
          <Grid sx={{ placeItems: 'center' }} container spacing={1}>
            <Grid item xs={2}>
              <Typography>
                <PrecisionManufacturingIcon />
              </Typography>
            </Grid>
            <Grid>
              <Tabs
                onChange={(e, val) => setValue(val)}
                textColor='inherit'
                indicatorColor='secondary'
                value={value}
              >
                {Utils.MainMenu.map((item, i) => {
                  return (
                    <Tab
                      key={'tab' + i}
                      label={item.text}
                      to={item.path}
                      component={Link}
                    >
                      <Link to={item.path}></Link>
                    </Tab>
                  )
                })}
              </Tabs>
            </Grid>
          </Grid>
        ) : (
          <>
            <Typography>
              <PrecisionManufacturingIcon />
            </Typography>
            <DrawerComponent />
          </>
        )}
        {!isMatch && (
          <Button color='secondary' variant='contained' onClick={logoutHandler}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
