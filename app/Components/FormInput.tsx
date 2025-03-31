import React from 'react';

interface Props{
    label:string;
    name:string;
    value:string;
    onchange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    type?:string;
}

const FormInput:React.FC<Props>=({label,name,value,onchange,type='text'})=>(
    <div className="mb-4">
    <label className="text-black block  font-bold mb-2">{label}</label>
    <input 
    type={type}
    name={name}
    value={value}
    onChange={onchange}
    className="w-full p-2 border rounded-lg text-black" 
    />
    </div>

);

export default  FormInput;