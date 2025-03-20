import { ArrowLeft, Check, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { useGetCookies } from '../store/useGetCookies';
import { axiosInstance } from '../lib/axios';
import { useThemeStore } from '../store/useThemeStore';

const Notifications = () => {
    const { authUser } = useGetCookies();
    const { theme } = useThemeStore();
    const { getUserRequestsProfiles, UsersFriendRequestsProfiles } = useChatStore();
    const router = useNavigate();


    const notifications = UsersFriendRequestsProfiles;

    // Group & Sort Requests
    const groupRequestsByDate = (requests) => {
        if (!requests || !Array.isArray(requests)) return {};

        return requests
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
            .reduce((acc, request) => {
                const formattedDate = new Date(request.createdAt).toLocaleDateString('en-GB'); // DD-MM-YYYY
                if (!acc[formattedDate]) acc[formattedDate] = [];
                acc[formattedDate].push(request);
                return acc;
            }, {});
    };

    const groupedRequests = groupRequestsByDate(notifications);

    // Cancel Friend Request
    const handleCancelRequest = async (data) => {
        try {
            await axiosInstance.put(`/addfriends/cancel`, { senderId: data.senderId._id, receiverId: authUser,documentSenderId:data.documentSenderId,
                documentReceiverId:data.documentReceiverId });
                alert("request cancelled")
            getUserRequestsProfiles(authUser);
        } catch (error) {
            console.error("Error cancelling request", error);
        }
    };

    // Accept Friend Request
    const handleAcceptRequest = async (data) => {
        try {
            await axiosInstance.put(`/addfriends/accepts`, { senderId: data.senderId._id, receiverId: authUser,documentSenderId:data.documentSenderId,
                documentReceiverId:data.documentReceiverId });
            alert(`Accepted request`);
            getUserRequestsProfiles(authUser);
        } catch (error) {
            console.error("Error accepting request", error);
        }
    };

    useEffect(() => {
        getUserRequestsProfiles(authUser);
    }, []);

    if (!groupedRequests || Object.keys(groupedRequests).length === 0) {
        return (
            <div className='mt-[65px] h-[calc(100vh-65px)] w-full'>
                <div className='container w-full h-full px-2'>
                    <div className='flex items-center gap-x-4 mb-4'>
                        <ArrowLeft onClick={() => router(-1)} className='size-7 cursor-pointer ' />
                        <h2 className='text-lg font-bold'>Notifications</h2>
                    </div>
                    <div className='w-full h-full flex justify-center items-center'>
                        <span className='font-bold text-lg'>No Notifications Yet</span>
                    </div>
                </div>
            </div>
        );
    }
    // <div className='w-full h-[calc(100vh-65px)] mt-[65px]'>
    //     <div className='container py-2 px-2 mx-auto h-full'>
    //         <div className='flex items-center gap-x-4 mb-4'>
    //             <ArrowLeft onClick={() => router(-1)} className='size-7 cursor-pointer ' />
    //             <h2 className='text-lg font-bold'>Notifications</h2>
    //         </div>
            // <div className='w-full flex flex-col gap-2'>
            //     {/* Request Date */}
            //     <div className='w-full flex justify-center'>
            //         <h2 className='bg-primary text-primary-content p-4 rounded-lg shadow-md'>Requests on 12-02-2024</h2>
            //     </div>

            //     {/* User sender request Card */}
            //     <div className='card w-full bg-base-100 shadow-md border border-base-300 flex flex-row items-center p-2 gap-4'>
            //         <div className='avatar'>
            //             <div className='w-16 rounded-full'>
            //                 <img src="/no-image.png" alt="User" />
            //             </div>
            //         </div>
            //         <div className='flex flex-col flex-grow'>
            //             <h3 className='font-bold text-lg'>User Name</h3>
            //             <p className='text-sm text-gray-500'>shoaib786@gmail.com</p>
            //         </div>
            //         <div className='badge badge-error text-white px-4 py-4 text-lg font-bold'>
            //             Pending
            //         </div>
            //     </div>
            //     {/* Request Time */}
            //     <div className='text-center'>
            //         <h2 className='text-sm text-gray-600'>You Requested On 12-03-2024 at 5:00pm</h2>
            //     </div>
            // </div>


            // {/* for user receiver request card  */}

            // <div className='card w-full bg-white shadow-lg border border-gray-300 flex flex-row items-center p-2 gap-2 rounded-lg'>
            //     <div className='avatar'>
            //         <div className='w-16 rounded-full'>
            //             <img src='/no-image.png' alt='User' />
            //         </div>
            //     </div>
            //     <div className='flex flex-col flex-grow'>
            //         <h3 className='font-bold text-lg text-gray-800'>User Name</h3>
            //         <p className='text-sm text-gray-500'>shoaib786@gmail.com</p>
            //     </div>
            //     {status === 'pending' ? (
            //         <div className='flex gap-4 text-white font-bold'>
            //             <button  className='bg-red-600 flex items-center rounded-full p-2 sm:hidden'>
            //         <X className=' size-6' />
            //     </button>
            //     <button className=' bg-emerald-600 flex items-center  rounded-full p-2 sm:hidden'>
            //         <Check className=' size-6' />
            //     </button>
            //             <button className='px-2 sm:px-4 py-1 rounded-3xl text-center bg-error sm:flex items-center gap-1 hidden '>Cancel</button>
            //             <button className='px-2 sm:px-4 py-1 rounded-3xl text-center bg-primary sm:flex items-center gap-1 hidden '>Accept</button>
            //         </div>
            //     ) : (
            //         <div className={`badge p-4 text-white text-sm font-semibold ${status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}>
            //             {status.charAt(0).toUpperCase() + status.slice(1)}
            //         </div>
            //     )}

            // </div>
            // <div className='text-center'>
            //     <h2 className='text-sm text-gray-600'>You have Request On 12-03-2024 at 5:00pm</h2>
            // </div>

    //     </div>
    // </div>

    return (
        <div className={`w-full h-[calc(100vh-65px)] mt-[65px] overflow-y-auto  ${theme === "dark" && 'bg-[#1d232a]'} `}>
    <div className='container py-2 px-2 mx-auto h-full'>
        <div className='flex items-center gap-x-4 mb-4'>
            <ArrowLeft onClick={() => router(-1)} className='size-7 cursor-pointer ' />
            <h2 className='text-lg font-bold'>Notifications</h2>
        </div>

        {Object.entries(groupedRequests).map(([date, requests]) => (
  <div key={date} className="w-full flex flex-col gap-2">
    {/* Request Date */}
    <div className="w-full flex justify-center">
      <h2 className="bg-primary text-primary-content p-4 rounded-lg shadow-md">
        Requests on {date}
      </h2>
    </div>

    {/* User sender request Card */}
    {requests.map((request) => (
      <div key={request._id} className={`w-full flex flex-col gap-2`}>
        {request.isSender ? (
          <>
            <div className={`card w-full bg-base-100 shadow-md border border-base-300 flex flex-row items-center p-2 gap-4 ${theme === "dark" && "border-gray-300"} `}>
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img src="/no-image.png" alt="User" />
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="font-bold text-lg">{request.receiverId.name}</h3>
                <p className="text-sm text-gray-500">{request.receiverId.email}</p>
              </div>
              <div className={`badge badge-error text-white p-4 text-lg font-bold ${
                    request.status === "accepted" ? "bg-green-500" : "bg-red-500"
                  } `}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
            </div>
            <div className="text-center">
              <h2 className="text-sm text-gray-600">
                You Requested On {formatTime(request.updatedAt)}
              </h2>
            </div>
          </>
        ) : (
          <>
            <div className="card w-full  shadow-lg border border-gray-300 flex flex-row items-center p-2 gap-2 rounded-lg">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img src="/no-image.png" alt="User" />
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="font-bold text-lg">{request.senderId.name}</h3>
                <p className="text-sm ">{request.senderId.email}</p>
              </div>
              {request.status === "pending" ? (
                <div className="flex gap-4 text-white font-bold">
                  <button className="bg-red-600 flex items-center rounded-full p-2 sm:hidden" onClick={()=>handleCancelRequest(request)}>
                    <X className="size-6" />
                  </button>
                  <button className="bg-emerald-600 flex items-center rounded-full p-2 sm:hidden" onClick={()=>handleAcceptRequest(request)}>
                    <Check className="size-6" />
                  </button>
                  <button className="px-2 sm:px-4 py-1 rounded-3xl text-center bg-error sm:flex items-center gap-1 hidden" onClick={()=>handleCancelRequest(request)}>
                    Cancel
                  </button>
                  <button className="px-2 sm:px-4 py-1 rounded-3xl text-center bg-primary sm:flex items-center gap-1 hidden" onClick={()=>handleAcceptRequest(request)}>
                    Accept
                  </button>
                </div>
              ) : (
                <div
                  className={`badge p-4 text-white text-lg font-bold ${
                    request.status === "accepted" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-sm text-gray-600">
                You have a Request On {formatTime(request.updatedAt)}
              </h2>
            </div>
          </>
        )}
      </div>
    ))}
  </div>
))}

    </div>
</div>

    );
};

export default Notifications;

function formatTime(date) {
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