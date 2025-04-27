import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const UserPageSkeleton = () => {
  return (
    <div className="flex flex-col justify-start items-center gap-2">
      {/* Logo*/}
      <div className="h-[30%] w-[30%]">
        <Skeleton circle width={100} height={100} />
      </div>

      {/* Welcome text  */}
      <div className="my-1">
        <Skeleton width={120} height={28} />
      </div>

      {/* Form */}
      <div className="flex flex-col px-6 gap-4 items-center w-full">
        {/* input*/}
        <div className="w-[110%]">
          <Skeleton height={46} borderRadius={12} />
        </div>
        <div className="w-[110%]">
          <Skeleton height={46} borderRadius={12} />
        </div>

        {/* Button  */}
        <div className="w-[110%] flex justify-end">
          <Skeleton width={46} height={46} borderRadius={12} />
        </div>
      </div>
    </div>
  )
}

export default UserPageSkeleton
