import React from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Demo from './views/demo'

const router = createBrowserRouter([
    {
      path: "/",
      element: <Demo/>,
    },
]);
console.log('1')
// const testPromise = () => new Promise((resolve) => {
//   console.log('2')
//   setTimeout(() => {
//     resolve(123)
//   }, 1000)
// })
// (async () => {
//   console.log('3')
//   await testPromise()
  createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>)
// })()
