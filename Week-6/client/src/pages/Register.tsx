import { Check, LoaderCircle, X } from 'lucide-react'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';

type User = {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
}

const Register = () => {
  const [show, setShow] = useState<Boolean>(false)
  const [name, setName] = useState<string>('')
  const [role, setRole] = useState<string>('user')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [, setCookie] = useCookies(['session'])  
  const [isError, setError] = useState(false);
  const [err, setErr] = useState('')
  const [isLoading, setLoading] = useState(false);
  const nav = useNavigate();

  function toggleShow(){
    setShow(!show);
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    setLoading(true);

    try{
      const response = await axios.post(`http://localhost:5000/users/register`, { email, password, name, role })
      const token = response.data
      setEmail('');
      setPassword('');
      setRole('')
      setShow(false);
      setName('')
      setCookie('session', token, { path: '/' });
      nav('/dashboard')
    } catch(err){
      setLoading(false);
      setError(true);
      const error = err as AxiosError<{ message: string }>;
      setErr(error.response.data || "Something went wrong")
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-zinc-200'>
      {isError && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-red-100 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Error Found?</h3>
              <button onClick={() => setError(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>
            <p className="mb-6 text-gray-600">{err}</p>
          </div>
        </div>
      )}
      <form className='w-[20rem] sm:w-[26rem] bg-white p-6 sm:p-8 rounded-xl border border-zinc-100 space-y-6' onSubmit={submitHandler}>
        <p className='text-3xl font-medium'>Create new account</p>        
        <div className='space-y-4'>
          <div className='space-y-2'>
            <p className='text-zinc-600 text-sm font-medium'>Name</p>
            <input type='text' className='border w-full border-zinc-300 rounded px-2 py-1' value={name} onChange={e => setName(`${e.target.value}`)} placeholder='Enter your name' required />
          </div>
          <div className='space-y-2'>
            <p className='text-zinc-600 text-sm font-medium'>Email</p>
            <input type='email' className='border w-full border-zinc-300 rounded px-2 py-1' value={email} onChange={e => setEmail(`${e.target.value}`)} placeholder='Enter your email' required />
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <p className='text-zinc-600 text-sm font-medium'>Password</p>
              <div className='flex items-center space-x-[6px] cursor-pointer' onClick={toggleShow}>
                {
                  show
                    ? <div className='w-4 aspect-square rounded text-white bg-sky-600 flex justify-center items-center'><Check size={15} className='mt-[2px]' /></div>
                    : <div className='w-4 aspect-square border rounded border-zinc-300'></div>
                }
                <p className='text-zinc-600 text-sm font-medium mt-[-2px]'>Show</p>
              </div>
            </div>
            <input type={`${ show ?'text' :'password'}`} className='border border-zinc-300 w-full rounded px-2 py-1' placeholder='Password' value={password} onChange={e => setPassword(`${e.target.value}`)} required />
          </div>
          <div className='space-y-2'>
            <p className='text-zinc-600 text-sm font-medium'>Select a role</p>
            <select value={role} onChange={e => setRole(e.target.value as User["role"]) } className="w-full text-sm border border-zinc-300 cursor-pointer rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className='space-y-4 pt-2'>
            {
              isLoading
                ? <button type='submit' className='w-full bg-zinc-600 cursor-pointer rounded text-white font-semibold py-2 flex justify-center items-center'>Loading <LoaderCircle size={20} className='ml-2 animate-spin' /></button>
                : <button type='submit' className='w-full bg-sky-600 cursor-pointer hover:bg-sky-500 rounded text-white font-semibold py-2 flex justify-center items-center'>Register</button>
            }
            <p className='text-zinc-500 text-sm font-medium cursor-pointer text-center'>If you have an Account? <Link to={`/login`} className='underline hover:no-underline text-zinc-600 pl-1'>Log in</Link></p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Register