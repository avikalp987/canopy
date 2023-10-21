import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {Link} from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';

export default function Profile() {
  const {currentUser,loading,error} = useSelector(state=>state.user);
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(file)
    {
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = (file)=>{
    const storage  = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on("state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      setFilePerc(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL) => setFormData({...formData,avatar:downloadURL})
      )
    });
  };

  const handleChange = (ev)=>{
    setFormData({...formData,[ev.target.id]:ev.target.value});
  }

  const handleSubmit = async (ev)=>{
    ev.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false)
      {
        dispatch(updateUserFailure(data.message));
        return;
      }

      //if everything is OK
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      })
      const data = await res.json();
      if(data.success===false)
      {
        dispatch(deleteUserFailure(data.message));
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if(data.success === false)
      {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form 
      className='flex flex-col gap-4'
      onSubmit={handleSubmit}>
        <input onChange={ev=>setFile(ev.target.files[0])}
        type="file" 
        ref={fileRef} 
        hidden 
        accept='image/*'/>

        <img onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        src={formData.avatar || currentUser.avatar} alt="Profile" />
        <p className='text-sm self-center'>
          {fileUploadError ? 
          (<span className='text-red-700'>Error!! Image must be less than 2MB</span>) 
          : filePerc>0 && filePerc<100 ?
          (<span className='text-slate-700'>
            {`Uploading ${filePerc}%`}
          </span>)
          : filePerc === 100 ?
          (
            <span className='text-green-700'>Image Uploaded Successfully</span>
          )
          :
          (
            ""
          )

        }
        </p>

        <input type="text" 
        placeholder='username' 
        className='border p-3 rounded-lg' 
        id="username"
        defaultValue={currentUser.username}
        onChange={handleChange}/>

        <input type="text" 
        placeholder='email' 
        className='border p-3 rounded-lg' 
        id="email"
        defaultValue={currentUser.email}
        onChange={handleChange}/>

        <input type="password" 
        placeholder='password' 
        className='border p-3 rounded-lg' 
        id="password"
        onChange={handleChange}/>

        <button disabled={loading}
        className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Loading..." : "UPDATE"}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
        to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5 font-semibold'>
        <span onClick={handleDeleteUser}
        className='text-red-700 cursor-pointer '>Delete Account</span>
        <span onClick={handleSignOut}
        className='text-red-700 cursor-pointer '>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5 font-semibold'>{error?error:""}</p>
      <p className='text-green-800 font-semibold'>{updateSuccess===true ? "User Updated Successfully" : ""}</p>
    </div>
  )
}
