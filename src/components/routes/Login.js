import * as React from 'react'
import { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import image from '../../Images/machine.jpg'
import CircularProgress from '@mui/material/CircularProgress'
function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        MachinistHub
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const Login = () => {
  let navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault()

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_BACKEND_LINK + '/auth/login',
        { username, password },
        config
      )
      while (!data) setLoading(true)

      localStorage.setItem('authToken', data.token)
      navigate('/')
    } catch (e) {
      setError(e.message)
      setTimeout(() => {
        setError('')
      }, 5000)
    }
    setLoading(false)
  }

  return (
    <div className='image'>
      <Box
        className='login'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Box
          className='borderBox'
          display='flex'
          flexDirection='column'
          alignItems='center'
          marginTop='20'
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              value={password}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            /> */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, p:1.5 }}
            >
              {!loading ? (
                <>Log In</>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size="1.5rem" color="inherit"/>
                </Box>
              )}
            </Button>
            <div>
              {error.includes('401') && <>Incorrect Credentials</>}
              {error.includes('400') && <>Please try again</>}
              {error.includes('403') && <>Server Error. Try Again</>}
            </div>
        
            {/* <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='#' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
      </Box>
    </div>
  )
}

export default Login
