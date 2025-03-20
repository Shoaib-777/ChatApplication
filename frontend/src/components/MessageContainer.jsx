import React, { useEffect, useRef, useState } from 'react';
import MessageInput from './MessageInput';
import MessageHeader from './MessageHeader';
import { useGetCookies } from '../store/useGetCookies';
import ChatsLoading from './loading/ChatsLoading';
import { useThemeStore } from '../store/useThemeStore';

const MessageContainer = ({ MessagingLoding, Messages, selectedUser, setSelectedUser, text, setText, imagePreview, setImagePreview, fileInputRef, removeImage, handleImageChange, handleSendMessage, subscribeToMessages, unsubscribeFromMessages, }) => {
  const { authUser } = useGetCookies();
  const { theme } = useThemeStore();
  const messageEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [Messages]);

  if (MessagingLoding) return <ChatsLoading selectedUser={selectedUser} setSelectedUser={setSelectedUser} />;

  return (
    <div className='w-full flex flex-col justify-between h-[calc(100vh-65px)] max-w-lg lg:max-w-full mx-auto border-x border-gray-500 lg:border-none'>
      <div className='w-full'>
        <MessageHeader Messages={Messages} setSelectedUser={setSelectedUser} />
      </div>
      <div className='h-[calc(100vh-188px)] overflow-y-auto'>
        <div className="h-full p-4 space-y-4">
          {Array.isArray(Messages) && Messages.length > 0 ? (
            Messages.map((message, i) => (
              <div
                key={message._id || i}
                className={`chat ${message.senderId === authUser ? "chat-end" : "chat-start"}`}
              >
                <div className={`chat-bubble ${theme === "dark" ? "bg-gray-600" : "bg-sky-500"} flex flex-col`}>  
                  {message.image && (
                    <div>
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                        onClick={() => setSelectedImage(message.image)}
                      />
                      <button
                        onClick={() => setSelectedImage(message.image)}
                        className={`text-xs ${theme === "dark"? "text-gray-300":"text-black"} underline mt-1`}
                      >
                        View Image
                      </button>
                    </div>
                  )}
                  {message.message && <p className={`${theme === "dark" && "text-gray-100"}`}>{message.message}</p>}
                </div>
                <div className="chat-footer mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center w-full'>Start Conversation</div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className='w-full relative'>
        <MessageInput selectedUser={selectedUser} {...{ text, setText, imagePreview, setImagePreview, fileInputRef, removeImage, handleImageChange, handleSendMessage, subscribeToMessages, unsubscribeFromMessages }} />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full flex flex-col items-center">
            <img src={selectedImage} alt="Preview" className="w-full rounded-md" />
            <div className="mt-2 flex space-x-4">
              <a href={selectedImage} download className="text-blue-500 underline">Download</a>
              <button onClick={() => setSelectedImage(null)} className="text-red-500 underline">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;

function formatMessageTime(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
}