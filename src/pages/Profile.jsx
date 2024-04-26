import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';

export default function Profile() {
  const auth=getAuth();
  const navigate= useNavigate();
  const [changeDetail,setChangeDetail]=useState(false);
  // error is occuring because we are rendering data before the page is reloaded
  const [formData,setFormData]=useState(
    {
     name :auth.currentUser.displayName,
     email:auth.currentUser.email,
    }
   );
   // destructring 
   const {name,email}=formData;
   function onLogout(){
    auth.signOut();
    navigate("/");

   }
   function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,

    }));

   }
   async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  }
  return (
    <>
        <section className='max-w-6xl mx-auto flex justify-center 
        items-center flex-col'>
          <h1 className='text-3xl text-center
          mt-6 font-bold'>My Profile</h1>
          <div className='w-full md:w-[50%] mt-6
          px-3'>
            <form action="">
              {/* Name Input */}
              <input type="text" id='name' value={name} 
              disabled={!changeDetail} onChange={onChange} className={`w-full px-4 py-2 text-xl
              text-gray-700 bg-white border border-gray-300
              rounded transition ease-in-out mb-6 ${changeDetail &&
              "bg-red-200 focus:bg-red-200"}`}/>

               {/* email input */}
               <input type="email" id='email' value={email} 
              disabled={!changeDetail} onChange={onChange}
               className={`w-full px-4 py-2 text-xl
              text-gray-700 bg-white border border-gray-300
              rounded transition ease-in-out mb-6 ${changeDetail &&
                "bg-red-200 focus:bg-red-200"}`}/>

              <div className='flex justify-between whitespace-nowrap
              text-sm sm:text-lg'>
                <p className='flex items-center mb-6'>Do you want to change your name?
                  <span className='text-red-600 hover:text-red-700
                  transition ease-in-out duration-200 ml-2
                  cursor-pointer' onClick={()=>{
                    changeDetail && onSubmit();
                    setChangeDetail((prevState)=>!prevState)
                  }}>
                    {changeDetail ? "Apply Change" : "Edit" }</span>
                </p>
                <p onClick={onLogout} className='text-blue-600 hover:text-blue-800
                transition ease-in-out duration-200 ml-1
                cursor-pointer'>Sign out</p>
              </div>

            </form>
          </div>
        </section>
      
    </>
  )
}
