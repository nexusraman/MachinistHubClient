import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const AccordianComponent = (props) => {
  return (
    <div>
      <Accordion className='MarginTop' defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>{props.heading}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{props.children}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default AccordianComponent
