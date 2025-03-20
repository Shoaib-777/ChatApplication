import { Image, LoaderCircle, Send, XCircle } from 'lucide-react';
import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useGroupStore } from '../store/useGroupStore';

const MessageInputGroup = ({message,setMessage,image,setImage,handleImageUpload,handleCancel,handleSubmit}) => {
  const {theme}=useThemeStore()
const {SendingMessage} =useGroupStore()
  return (
    <>
      {/* Image Preview */}
      {image.imageUrl && (
        <div className='absolute w-[150px] h-[150px] left-2 bottom-[51px] z-10 bg-white flex justify-center items-center border border-gray-300 shadow-2xl'>
          <div className='w-28 h-28 border border-gray-300'>
            <img src={image.imageUrl} alt="Uploaded Image" className='w-full h-full object-contain' />
          </div>
          <div className='absolute top-0 right-0'>
            <button onClick={handleCancel}>
              <XCircle className='size-6 font-bold text-red-500' />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
          <div className='w-full'>
        <form onSubmit={handleSubmit}>
          <div className={`flex items-center p-2 ${theme === "dark" ? "bg-gray-700":"bg-[#eceef2] "} `}>
            {/* Text Input */}
            <div className='w-full'>
              <input
                type="text"
                name='message'
                placeholder='Type a message...'
                className={`outline-none border ${theme === "dark" ? "border-gray-900 bg-inherit":"border-gray-200"} px-2 py-1 w-full `}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className='px-2 py-1'>
              <input
                type="file"
                hidden
                id='getfile'
                name='image'
                accept='image/*'  // ✅ Corrected
                onChange={handleImageUpload}
              />
              <label htmlFor='getfile' className='cursor-pointer'>
                <Image className={`size-6 ${image.imageUrl ? "text-[aqua]":"text-gray-500"}`} />
              </label>
            </div>

            {/* Send Button */}
            <div className='px-2 py-1 flex justify-center items-center'>
              <button  disabled={!message || SendingMessage} className={`${SendingMessage && 'cursor-not-allowed'}`}>
                {SendingMessage ?(
                  <LoaderCircle className='size-6' />
                ):(
                  <Send className={`size-6 ${message ?  "text-green-500":"text-gray-500 hover:cursor-not-allowed"} `} />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default MessageInputGroup;
