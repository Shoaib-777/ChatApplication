import React from 'react'

const Loading = () => {
    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="size-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="mt-2">Loading...</h4>
            </div>
        </>
    )
}

export default Loading