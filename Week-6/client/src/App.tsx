import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTask from './pages/Create-Task'
import UpdateTask from './pages/Update-Task'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import axios from 'axios'

function LoadingPage(){
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <p className="font-bold animate-pulse text-center ml-[-1.6rem] text-sky-600 text-4xl">Taskify</p>
    </div>
  )
}

function App() {
  const [isLoading, setLoading] = useState<Boolean>(true)
  const [cookie] = useCookies(["session"])
  const nav = useNavigate();

  useEffect(() => {
    (async function(){
      try{
        await axios.get("http://localhost:5000/tasks", { headers: {token: cookie.session} })
        setLoading(false);
      } catch(err){
        nav("/login");
      }
    }())
  }, [])

  return (
    <div className='w-screen h-[100dvh] overflow-auto'>
      <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {
            isLoading 
              ? <Route path='/*' element={<LoadingPage />} />
              : <>
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/tasks' element={<Tasks />} />
                  <Route path='/create-task' element={<CreateTask />} />
                  <Route path='/update-task/:id' element={<UpdateTask />} />
                  <Route path='/settings' element={<Settings />} />
                </>
          }

      </Routes>    
    </div>
  )
}

export default App
