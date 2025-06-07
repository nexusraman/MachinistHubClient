import React from 'react'
import { Bar } from 'react-chartjs-2'
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
}
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',

      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',

      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const ActivitiesChart = () => {
  return (
    <div>
      <Bar options={options} data={data}></Bar>
    </div>
  )
}

export default ActivitiesChart
