import React from 'react';
interface Props{
    text:string;
    onClick?:()=>void;
    type?:'button'|'submit';
    disabled?:boolean;
}


const Button:React.FC<Props>=({text,onClick,type='button',disabled})=>(
    <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-500 text-white text-center rounded-lg ${
        disabled ?' opacity-50 cursor-not-allowed ':'hover:bg-black'}`}>
            {text}
        </button>
);

export default Button;