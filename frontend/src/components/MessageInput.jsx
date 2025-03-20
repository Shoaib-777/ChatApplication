import { Image, Send, XCircle } from 'lucide-react';
import React from 'react'
import { useThemeStore } from '../store/useThemeStore';


const MessageInput = ({selectedUser,text, setText, imagePreview, setImagePreview, fileInputRef, removeImage, handleImageChange, handleSendMessage}) => {
    const {theme}=useThemeStore()
    
    
    return (
        <>
        {imagePreview && (
        <div className='absolute w-[150px] h-[150px] left-2 bottom-[52px] z-10 bg-white border border-gray-200 shadow-xl flex justify-center items-center'>
            <div className='w-28 h-28'>
                <img src={imagePreview} alt="" className='w-full object-contain ' />
            </div>
            <div className='absolute top-0 right-0'>
                <button  onClick={removeImage}><XCircle className='size-6 font-bold text-red-500'/></button>
            </div>
        </div>
        )}
        <div className='w-full'>
            <form onSubmit={handleSendMessage}>
                <div className={`flex  items-center p-2 ${theme === "dark" ? "bg-gray-700":"bg-[#eceef2] "}`}>
                    <div className='w-full'>
                        <input type="text" placeholder='Type a message...'
                         value={text}
                         onChange={(e) => setText(e.target.value)}
                        className={`outline-none border ${theme === "dark" ? "border-gray-900 bg-inherit":"border-gray-200"}   px-2 py-1 w-full`} />
                    </div>
                    <div className='px-2 py-1 '>
                        <input type="file" hidden id='getfile' 
                        accept='image/**'
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        
                        />
                        <label  className=' cursor-pointer' onClick={() => fileInputRef.current?.click()}><Image className={`size-6 ${imagePreview ? "text-[aqua]":""}`} /></label>
                    </div>
                    <div className='px-2 py-1 flex justify-center items-center'>
                        <button><Send className={`size-6 ${text ? "text-green-500":""}`} /></button>
                    </div>
                </div>
            </form>
        </div>
        </>)
}

export default MessageInput