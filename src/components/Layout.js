import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import './Styles.css'
const Layout = (props) => {
  const capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1)
  }

  return (
    <Card className='card'>
      <CardContent>
        <Typography sx={{ fontSize: 28 }} color='text.secondary' gutterBottom>
          {props.title}
        </Typography>
        <Typography variant='h5' component='div'>
          {props.secondaryTitle}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {props.thirdTitle}
        </Typography>
        <Typography variant='body2'>{props.children}</Typography>
      </CardContent>
    </Card>
  )
}

export default Layout
