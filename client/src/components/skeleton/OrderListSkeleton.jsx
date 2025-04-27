import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const OrderListSkeleton = () => {
  const skeletonCards = Array(3).fill(0)

  return (
    <>
      {skeletonCards.map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-1 bg-[#0158A11A] rounded-xl py-3.5 min-w-[40vw] max-w-[50vw] flex-1"
        >
          {/* Order header */}
          <div className="flex justify-between items-center px-3.5">
            <div className="w-40">
              <Skeleton height={24} width="80%" />
            </div>
            <div className="flex gap-2">
              <Skeleton height={40} width={120} borderRadius={12} />
              <Skeleton height={40} width={100} borderRadius={12} />
            </div>
          </div>

          {/* Order info */}
          <div className="flex justify-between px-3.5 font-montserrat-400 text-sm">
            <div className="w-24">
              <Skeleton height={16} />
            </div>
            <div className="w-24">
              <Skeleton height={16} />
            </div>
          </div>

          <hr className="h-1.5 bg-white" />

          {/* Order items table */}
          <div className="flex flex-col gap-3 py-2 px-3.5">
            <div className="bg-[#3295E866] rounded-xl py-2 h-[30vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white">
                    <th className="text-left px-3 py-2 font-semibold w-1/2">
                      <Skeleton height={20} />
                    </th>
                    <th className="text-center px-3 py-2 font-semibold w-1/6">
                      <Skeleton height={20} />
                    </th>
                    <th className="text-center px-3 py-2 font-semibold w-1/6">
                      <Skeleton height={20} />
                    </th>
                    <th className="text-right px-3 py-2 font-semibold w-1/6">
                      <Skeleton height={20} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array(2)
                    .fill(0)
                    .map((_, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white border-opacity-20"
                      >
                        <td className="px-3 py-3">
                          <div>
                            <Skeleton height={20} width="90%" />
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Skeleton
                                height={16}
                                width={60}
                                borderRadius={20}
                              />
                              <Skeleton
                                height={16}
                                width={70}
                                borderRadius={20}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="text-center relative">
                          <Skeleton height={24} width={80} borderRadius={6} />
                        </td>
                        <td className="text-center">
                          <Skeleton height={20} width={20} />
                        </td>
                        <td className="text-right px-3">
                          <Skeleton height={20} width={60} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Note section */}
            <div className="flex gap-1 bg-white rounded-lg w-full py-2 pl-2 text-xs">
              <Skeleton height={20} width="100%" />
            </div>

            {/* Action buttons */}
            <div className="flex justify-between">
              <Skeleton height={40} width={100} borderRadius={12} />
              <Skeleton height={40} width={100} borderRadius={12} />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default OrderListSkeleton
