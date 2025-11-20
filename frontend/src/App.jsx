import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Board from './pages/Board'


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element=<Layout />>
        <Route path='' element=<Home /> />
        <Route path='board/:boardId' element=<Board /> />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
