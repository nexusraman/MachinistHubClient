import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import '../Styles.css'

const CardComponent = (props) => {
  return (
    <Card className='dashboardCardHeader'>
      <CardContent className='dashboardCard'>
        <div className='baseFlex'>
          <Typography sx={{ fontSize: 15 }} color='text.secondary' gutterBottom>
            {props.FirstTitle}
          </Typography>
          <Typography sx={{ fontSize: 15 }} color='text.primary' gutterBottom>
            {props.FirstValue}
          </Typography>
        </div>
        <div className='baseFlex'>
          <Typography sx={{ fontSize: 15 }} color='text.secondary' gutterBottom>
            {props.SecondTitle}
          </Typography>
          <Typography sx={{ fontSize: 15 }} color='text.primary' gutterBottom>
            {props.SecondValue}
          </Typography>
        </div>

        <div className='baseFlex'>
          <Typography sx={{ fontSize: 15 }} color='text.secondary' gutterBottom>
            {props.ThirdTitle}
          </Typography>
          <Typography sx={{ fontSize: 15 }} color='text.primary' gutterBottom>
            {props.ThirdValue}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardComponent
