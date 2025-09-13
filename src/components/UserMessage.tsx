

export const UserMessage = ({message}:{message: string}) => {
  return (
    <div className=" flex relative">
      <div className=' bg-gradient-to-tr z-20 text-sm from-green-500 to-green-800 border-2 border-none  text-white p-2 px-4 rounded-3xl self-end w-fit max-w-[80%] ml-auto'>
        {message}
        </div>
      <div className=" z-10  absolute -right-1 -bottom-1 w-7 h-7 bg-gradient-to-bl from-green-500 to-green-800  rounded-full">

      </div>
      <div className=" absolute -right-2 -bottom-1 w-2 h-2 bg-gradient-to-bl from-green-500 to-green-600 rounded-full">

      </div>
    </div>
  )
}