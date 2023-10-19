import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure,signInStart,siginInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function Signup() {
  const [formData,setFormData] = useState({});//entire form data is present in this object
  //const [error,setError] = useState(null);//state for error
  //const [loading,setLoading] = useState(false);//state for loading
  const {loading,error} = useSelector(state => state.user);//name of the state was user
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  }

  const handleSubmit = async (ev)=>{
    ev.preventDefault();
    try {
    //setLoading(true);
    dispatch(signInStart());
    const res = await fetch("/api/auth/signin",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(formData),
    });

    const data = await res.json(); //converting the response to json
    if(data.success === false)
    {
      //setLoading(false);
      //setError(data.message);
      dispatch(signInFailure(data.message));
      return;
    }
    //setLoading(false);
    //setError(null);
    dispatch(siginInSuccess(data));
    navigate("/");

    } catch (error) {
      //setLoading(false);
      //setError(error.message);
      signInFailure(error.message);
    }
    
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit}
      className='flex flex-col gap-4'>

        <input type="email" placeholder='email'
        className='border p-3 rounded-lg' id='email'
        onChange={handleChange}
        />

        <input type="password" placeholder='password'
        className='border p-3 rounded-lg' id='password'
        onChange={handleChange}
        />

        <button 
        disabled = {loading}
        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95
        disabled:opacity-80'>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-4'>
        <p>Dont have an account? <Link to={"/sign-up"}>
          <span className='text-blue-700'>
            Sign Up
          </span>
        </Link></p>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
