import { X } from "lucide-react";
import React from "react";
import MessageInput from "../MessageInput";
import { useChatStore } from "../../store/useChatStore";

const ChatsLoading = ({ selectedUser, setSelectedUser, text, setText, imagePreview, setImagePreview, fileInputRef, removeImage, handleImageChange, handleSendMessage }) => {


    const {upDataSelectedUser} = useChatStore()

    const props = {
        text,
        setText,
        imagePreview,
        setImagePreview,
        fileInputRef,
        removeImage,
        handleImageChange,
        handleSendMessage,
      };
    return (
        <div className="w-full flex flex-col justify-between border border-gray-500 max-w-lg lg:max-w-full mx-auto">
            {/* Message Header */}
            <div className="w-full">
                <div className="flex px-2 py-1 justify-between items-center border border-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="size-14 skeleton rounded-full"></div>
                        <div className="space-y-2">
                            <div className="skeleton h-4 w-32"></div>
                            <div className="skeleton h-3 w-20"></div>
                        </div>
                    </div>
                    <div>
                        <button>
                            <X onClick={() => {
                                setSelectedUser(null);
                                upDataSelectedUser(null)}
                            } className="size-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Skeleton */}
            <div className="h-[calc(100vh-188px)] overflow-y-auto">
                <div className="flex-1 p-4 space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`chat ${i % 2 === 0 ? "chat-end" : "chat-start"}`}>
                            <div className="chat-image avatar">
                                <div className="size-10 skeleton rounded-full"></div>
                            </div>
                            <div className="chat-header mb-1">
                                <div className="skeleton h-3 w-16"></div>
                            </div>
                            <div className="chat-bubble skeleton w-40 h-10"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Section Skeleton */}
            <MessageInput selectedUser={selectedUser} {...props} />
        </div>
    );
};

export default ChatsLoading;
