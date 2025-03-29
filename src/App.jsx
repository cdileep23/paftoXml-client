import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Body from './components/Body'
import Home from './Pages/Home'
import Auth from './Pages/Auth'
import { Toaster } from './components/ui/sonner'

const appRouter=createBrowserRouter([{
  path:"/",
  element:<Body/>,
  children:[{
    path:"/",
    element:<Home/>
  },{
    path:"auth",
    element:<Auth/>
  }]
}])

const App = () => {
  return (
    
    <main>
      <Toaster position="bottom-right" richColors />
      <RouterProvider  router={appRouter}/>
    </main>
  )
}

export default App
