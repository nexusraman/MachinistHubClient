import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import SubmersibleClient from './SubmersibleClient'
import FanClient from './FanClient'

const Client = () => {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_LINK}/client/${id}`)
        setClient(res.data)
      } catch (err) {
        setError('Failed to load client data.')
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error || !client) return <p>{error || 'Client not found'}</p>

  if (client.category === 'fan') {
    return <FanClient client={client} />
  } else if (client.category === 'submersible') {
    return <SubmersibleClient client={client} />
  } else {
    return <p>Unsupported client category</p>
  }
}

export default Client
