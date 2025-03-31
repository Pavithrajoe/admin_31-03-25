'use client';
import  React, { useState } from "react";
import { CreateUser } from "@/app/APILayer/CreateUser";
import FormInput from "@/app/Components/FormInput";
import Button from "@/app/Components/FormBtn";
import { useRouter } from "next/navigation";

const AddUserPage=()=>{
    const router=useRouter();
    const [formData,setFormData]=useState({
      user_id:'',
      username:'',
      email:'',
      password:'',
      role:'',
      company_id:'',
    });
    const [Formclose,setFormClose]=useState(true);

    const[loading, setLoading]=useState(false);
    const handlechange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    
    };
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const Result=await CreateUser(formData);
            console.log("the received ", Result.token)
            sessionStorage.setItem('token', Result.token);
            console.log(sessionStorage.getItem('token'))
            alert("User created successfully 👍!");

            router.push('admin/userList');

        }catch(error:any){
            alert(`Error:${error.message}`);

        }finally{
           setLoading(false);
        }

     

      
    };


    return(
       
        Formclose && (
            // closing the form 
            <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
                <div onClick={() => setFormClose(false)} className="text-black cursor-pointer text-right hover:text-red-600 font-bold">
                    X
                </div>
                <h1 className="text-2xl text-black">Create User</h1>
                <form onSubmit={handleSubmit}>
                    <FormInput label="User ID" name='user_id' value={formData.user_id} onchange={handlechange} />
                    <FormInput label="User name" name='username' value={formData.username} onchange={handlechange} />
                    <FormInput label="email" name="email" value={formData.email} onchange={handlechange} />
                    <FormInput label="password" name='password' value={formData.password} onchange={handlechange} />
                    <FormInput label="role" name='role' value={formData.role} onchange={handlechange} />
                    <FormInput label="Company" name="company_id" value={formData.company_id} onchange={handlechange} />
                    <div>
                        <Button text={loading ? 'Creating..' : 'Create User'} type="submit" disabled={loading} />
                    </div>
                </form>
            </div>
        )
    
        
    )
}

export default AddUserPage;