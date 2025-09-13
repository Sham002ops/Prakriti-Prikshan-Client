import { Bot } from 'lucide-react'
import React from 'react'

export const PrakritiMessage = ({message}:{message: string}) => {
  return (
      <div className=" flex relative">
      <div className=' bg-white mt-4 ml-3 text-sm shadow-lg text-slate-700    p-2 px-4 rounded-xl self-end w-fit max-w-[80%] mr-auto'>
        {message}
        </div>
      <div className=" z-10  absolute -left-4  -top-1 w-9 h-9 bg-gradient-to-bl flex items-center justify-center  from-green-500 to-green-800  shadow-md rounded-full">
        <Bot  color="#ffffff" />
      </div>
      
    </div>
  )
}
