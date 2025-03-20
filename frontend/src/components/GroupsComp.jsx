import { Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useGetCookies } from '../store/useGetCookies';
import { useGroupStore } from '../store/useGroupStore';
import UsersLoading from '../components/loading/UsersLoading'
import { useThemeStore } from '../store/useThemeStore';
import { Link } from 'react-router-dom';

const GroupsComp = ({ queryfind, setQueryfind, searchFind, setSearchFind, setGroupInfo }) => {

  const { authUser } = useGetCookies()
  const { getUserGroups, GetUserGroups, GroupSelectedId, setGroupSelectedId, GetGroupSelectedData, LoadingGroupUsers,subscribeToGroupMessages, unsubscribeFromGroupMessages} = useGroupStore()
  const { theme } = useThemeStore()


  useEffect(() => {
    getUserGroups(authUser)
  }, [])

  // useEffect(()=>{

  // },[queryfind])

  const GroupSelected = (data) => {
    setGroupSelectedId(data._id)
    GetGroupSelectedData(data._id)
    setQueryfind("")
    setGroupInfo(false)
  }

  useEffect(() => {
      GetGroupSelectedData(GroupSelectedId);
  
      subscribeToGroupMessages();
  
      return () => unsubscribeFromGroupMessages();
    }, [GroupSelectedId,GetGroupSelectedData, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  if (LoadingGroupUsers) return <UsersLoading />

  return (
    <div className=''>
      <div className='h-[calc(100vh-200px)] overflow-y-auto'>
        {/* start map here  */}

        {!queryfind ? (
          GetUserGroups.length > 0 ? (
            GetUserGroups.map((v, i) => (
              <div
                key={i}
                onClick={() => GroupSelected(v)}
                // onClick={()=>setSelectedUser(v._id)}
                className={`flex items-center w-full border-b border-gray-300 p-2 ${theme === 'dark' ? "hover:bg-gray-800" : "hover:bg-gray-50"} transition-shadow duration-300 `}
                style={{
                  background:
                    v._id === GroupSelectedId
                      ? theme === "dark"
                        ? "#374151" // Tailwind gray-600 for dark mode
                        : "#F3F4F6" // Light mode background
                      : "",
                }}
              >
                <div className="w-14 h-14 flex justify-center items-center">
                  <img
                    src={v.icon || "no-image.png"}
                    alt="Profile"
                    className="w-full h-full object-contain rounded-full border border-gray-300 shadow-md"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-bold">{v.groupName}</h2>
                  <span className="text-sm font-medium"></span>
                </div>
              </div>
            ))
          ) : (
            <div className={`flex flex-col items-center justify-center  p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <div className={`shadow-lg rounded-2xl p-8 text-center max-w-md w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <h2 className="text-2xl font-semibold">You{`'`}re not in a group</h2>
                <p className="mt-2">create a group to get started.</p>
                <Link to="/addgroup"><button
                  className="mt-4 btn btn-primary w-full"
                >
                  Create Group
                </button></Link>
              </div>
            </div>
          )
        ) : (
          searchFind.length > 0 ? (
            searchFind.map((v, i) => (
              <div
                key={i}
                onClick={() => GroupSelected(v)}
                className="flex items-center w-full border-b border-gray-300 p-2 transition-shadow duration-300"
              >
                <div className="w-14 h-14 flex justify-center items-center">
                  <img
                    src={v.icon || "no-image.png"}
                    alt="Profile"
                    className="w-full h-full object-contain rounded-full border border-gray-300 shadow-xl"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-bold">{v.groupName}</h2>
                  <span className="text-sm font-medium"></span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6  rounded-lg">
              <p className="text-lg font-semibold text-gray-700">
                No Group Found with
                <span className="text-red-600 font-bold"> "{queryfind}"</span>
              </p>
            </div>

          )
        )}




        <div className=''>
          <div className='flex justify-center items-center gap-x-2 py-1 '>
            <div>
              <Lock className='size-6 font-bold' />
            </div>
            <div>
              <p className='text-base font-semibold '>
                All Messages Are <span className='text-blue-400'>end-to-end-encrypted</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsComp;
