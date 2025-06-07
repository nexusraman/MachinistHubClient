import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../Styles.css'
import CardComponent from './CardComponent'

const OverviewCard = (props) => {
  const [income, setIncome] = useState([])
  const [expenses, setExpenses] = useState([])
  const [totalExpense, setTotalExpense] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_LINK + `/expense`)
      .then((res) => {
        setExpenses(res.data)
      })

    axios
      .get(process.env.REACT_APP_BACKEND_LINK + `/income`)
      .then((res) => {
        setIncome(res.data)
      })
  }, [])

  useEffect(() => {
    setTotalExpense(0)
    setTotalIncome(0)
    let backwardDate = new Date()
    if (props.calenderValue === 'weekly') {
      backwardDate.setDate(backwardDate.getDate() - 7)
    }
    if (props.calenderValue === 'monthly') {
      backwardDate.setDate(backwardDate.getDate() - 30)
    }

    let incomeSum = 0
    let expenseSum = 0

    //Daily Filter
    //Income
    if (props.calenderValue === 'daily') {
      for (let i = 0; i < income.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(income[i].date).toLocaleDateString()
        ) {
          incomeSum += income[i].amount
          setTotalIncome(incomeSum)
        }
      }
      //Daily Filter
      //Expense
      for (let i = 0; i < expenses.length; i++) {
        if (
          new Date().toLocaleDateString() ===
          new Date(expenses[i].date).toLocaleDateString()
        ) {
          expenseSum += expenses[i].amount
          setTotalExpense(expenseSum)
        }
      }
      //Custom Filter
    } else if (
      props.calenderValue === 'weekly' ||
      props.calenderValue === 'monthly'
    ) {
      for (let i = 0; i < income.length; i++) {
        if (
          new Date(income[i].date).getTime() >= backwardDate.getTime() &&
          new Date(income[i].date).getTime() <= Date.now()
        ) {
          incomeSum += income[i].amount
          setTotalIncome(incomeSum)
        }
      }
      for (let i = 0; i < expenses.length; i++) {
        if (
          new Date(expenses[i].date).getTime() >= backwardDate.getTime() &&
          new Date(expenses[i].date).getTime() <= Date.now()
        ) {
          expenseSum += expenses[i].amount
          setTotalExpense(expenseSum)
        }
      }
    } else if (props.customDates[0] || props.customDates[1]) {
      for (let i = 0; i < income.length; i++) {
        if (
          new Date(income[i].date).getTime() >= props.customDates[0] &&
          new Date(income[i].date).getTime() <= props.customDates[1]
        ) {
          incomeSum += income[i].amount
          setTotalIncome(incomeSum)
        }
      }

      for (let i = 0; i < expenses.length; i++) {
        if (
          new Date(expenses[i].date).getTime() >= props.customDates[0] &&
          new Date(expenses[i].date).getTime() <= props.customDates[1]
        ) {
          expenseSum += expenses[i].amount
          setTotalExpense(expenseSum)
        }
      }
    }
  }, [props.calenderValue, expenses, income, props.customDates])

  return (
    <CardComponent
      FirstTitle='Total Income'
      SecondTitle='Total Expense'
      ThirdTitle='Total'
      FirstValue={totalIncome}
      SecondValue={totalExpense}
      ThirdValue={totalIncome - totalExpense}
    />
  )
}

export default OverviewCard
