import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useNavigate } from 'react-router-dom'

const Clients = () => {
  const [clients, setClients] = useState([])
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_LINK + `/client`).then((res) => {
      setClients(res.data)
    })
  }, [])

  const handleTabChange = (event, newValue) => {
    setCategory(newValue)
  }

  const filteredClients =
    category === 'all'
      ? clients
      : clients.filter((client) => client.category === category)

  const handleViewDetails = (clientId) => {
    navigate(`/clients/${clientId}`)
  }

  return (
    <Layout title='Clients List'>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Client List</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mb={3} borderBottom={1} borderColor='divider'>
            <Tabs
              value={category}
              onChange={handleTabChange}
              textColor='primary'
              indicatorColor='primary'
              variant='scrollable'
              scrollButtons='auto'
            >
              <Tab label='All' value='all' />
              <Tab label='Fan' value='fan' />
              <Tab label='Submersible' value='submersible' />
            </Tabs>
          </Box>

          {filteredClients.length === 0 ? (
            <Alert severity='info'>No clients found in this category.</Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredClients.map((client, i) => (
                <Grid key={client._id || i} item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      transition: '0.3s',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        {client.name}
                      </Typography>
                      <Typography color='text.secondary'>
                        Phone: {client.phone}
                      </Typography>
                      <Typography color='text.secondary'>
                        Balance: ₹{client.balance.toLocaleString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size='small'
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={() => handleViewDetails(client._id)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
    </Layout>
  )
}

export default Clients
