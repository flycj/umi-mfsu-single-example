import React from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
]);
const testPromise = () => new Promise((resolve) => {
  setTimeout(() => resolve(123), 1000)
})
(async () => {
  await testPromise()
  createRoot(document.getElementById('root')).render(<RouterProvider router={router}/>)
})()
