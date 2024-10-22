import React from 'react'

function CategoryCard({ dishCategory }) {
  return (
    <div className='flex items-end justify-center pb-1 h-[145px] w-[145px] bg-black rounded-2xl flex-shrink-0 min-w-[145px]'>
        <div className='font-montsarret font-montserrat-500 text-white capitalize w-full truncate text-center'>
          {dishCategory}
        </div>
    </div>
  )
}

export default CategoryCard;
