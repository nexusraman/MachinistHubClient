import { Box, Button } from '@mui/material'
import React from 'react'

const ButtonComponent = (props) => {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      sx={{ mx: 'auto', width: 200 }}
    >
      <Button
        size='medium'
        variant='contained'
        color='primary'
        onClick={props.submit}
      >
        {props.submitLabel}
      </Button>
      <Button
        size='medium'
        variant='contained'
        color='warning'
        onClick={props.cancel}
      >
        {props.cancelLabel}
      </Button>
    </Box>
  )
}

export default ButtonComponent
