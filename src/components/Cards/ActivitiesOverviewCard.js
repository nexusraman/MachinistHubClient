import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../Styles.css'
import CardComponent from './CardComponent'

const OverviewCard = (props) => {
  const [fan, setFan] = useState([])
  const [submersible, setSubmersible] = useState([])
  const [totalSubmersible, setTotalSumbersible] = useState(0)
  const [totalFan, setTotalFan] = useState(0)

  useEffect(() => {
    axios.get( process.env.REACT_APP_BACKEND_LINK +`/fan`).then((res) => {
      setFan(res.data)
    })

    axios.get( process.env.REACT_APP_BACKEND_LINK +`/submersible`).then((res) => {
      setSubmersible(res.data)
    })
  }, [])
  useEffect(() => {
    setTotalSumbersible(0)
    setTotalFan(0)
    let backwardDate = new Date()
    if (props.calenderValue === 'weekly') {
      backwardDate.setDate(backwardDate.getDate() - 7)
    }
    if (props.calenderValue === 'monthly') {
      backwardDate.setDate(backwardDate.getDate() - 30)
    }

    let fanSum = 0
    let sumbersibleSum = 0

    //Daily Filter
    //Income
    if (props.calenderValue === 'daily') {
      for (let i = 0; i < fan.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(fan[i].date).toLocaleDateString()
        ) {
          fanSum += fan[i].quantity
          setTotalFan(fanSum)
        }
      }
      //Daily Filter
      //Expense
      for (let i = 0; i < submersible.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(submersible[i].date).toLocaleDateString()
        ) {
          sumbersibleSum += submersible[i].quantity
          setTotalSumbersible(sumbersibleSum)
        }
      }
      //Custom Filter
    } else if (
      props.calenderValue === 'weekly' ||
      props.calenderValue === 'monthly'
    ) {
      for (let i = 0; i < fan.length; i++) {
        if (
          new Date(fan[i].date).getTime() >= backwardDate.getTime() &&
          new Date(fan[i].date).getTime() <= Date.now()
        ) {
          fanSum += fan[i].quantity
          setTotalFan(fanSum)
        }
      }
      for (let i = 0; i < submersible.length; i++) {
        if (
          new Date(submersible[i].date).getTime() >= backwardDate.getTime() &&
          new Date(submersible[i].date).getTime() <= Date.now()
        ) {
          sumbersibleSum += submersible[i].quantity
          setTotalSumbersible(sumbersibleSum)
        }
      }
    } else if (props.customDates[0] || props.customDates[1]) {
      for (let i = 0; i < fan.length; i++) {
        if (
          new Date(fan[i].date).getTime() >= props.customDates[0] &&
          new Date(fan[i].date).getTime() <= props.customDates[1]
        ) {
          fanSum += fan[i].quantity
          setTotalFan(fanSum)
        }
      }

      for (let i = 0; i < submersible.length; i++) {
        if (
          new Date(submersible[i].date).getTime() >= props.customDates[0] &&
          new Date(submersible[i].date).getTime() <= props.customDates[1]
        ) {
          sumbersibleSum += submersible[i].quantity
          setTotalSumbersible(sumbersibleSum)
        }
      }
    }
  }, [props.calenderValue, fan, submersible, props.customDates])

  return (
    <CardComponent
      FirstTitle='Submersible'
      SecondTitle='Fan'
      FirstValue={totalSubmersible}
      SecondValue={totalFan}
    />
  )
}

export default OverviewCard
