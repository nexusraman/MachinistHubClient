import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const CardLayout = (props) => {
  const navigate = useNavigate()
  return (
    <Card backgroundColor='primary.secondary' sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 28 }} color='text.secondary' gutterBottom>
          {props.name}
        </Typography>
        <Typography variant='h5' component='div'>
          {props.balance}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {props.phone}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          variant='contained'
          onClick={() => navigate(`/clients/${props.name}`)}
        >
          View Account
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardLayout
