import React, { useEffect, useState } from 'react';
import UserLogo from '../assets/cafeNameLogo.png';
import PhoneLogo from '../assets/callLogo.png';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

function UserPage() {
  const { cafeId, tableId } = useParams();
  const navigate = useNavigate();
  const [cafeLogo, setCafeLogo] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchCafeDetails = async () => {
      try {
        const res = await fetch(`/server/cafeDetails/getCafeDetails/${cafeId}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setCafeLogo(data.logoImg.url);
        } else {
          console.log(`Error: ${data.message}`);
        }
      } catch (err) {
        console.log('Failed to fetch cafe details');
      }
    };

    fetchCafeDetails();
  }, [cafeId]);


  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch(`/server/userDetails/postUserDetails/${cafeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/order/${cafeId}/${tableId}/${name}`);
      } else {
        console.log(`Error: ${data.message}`);
      }
    } catch (err) {
      console.log('Failed to save user details');
    }
  };

  return (
    <div className='h-[80vh] w-full flex justify-center items-center'>
      <div className='flex flex-col justify-start items-center gap-2'>
        <div className='h-[30%] w-[30%]'><img src={cafeLogo} alt="Cafe Logo" /></div>
        <div className='font-montserrat-600 text-xl'>WELCOME</div>
        <div className='flex flex-col gap-4 items-center'>
          <div className='flex items-center gap-2 p-1 border-2 border-gray rounded-xl w-[110%]'>
            <img src={UserLogo} alt="User Logo" className='h-7 w-7' />
            <input
              type="text"
              placeholder='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-l-2 border-black pl-2 outline-none font-montserrat-400'
            />
          </div>
          <div className='flex items-center gap-2 p-1.5 border-2 border-gray rounded-xl w-[110%]'>
            <img src={PhoneLogo} alt="Phone Logo" className='h-6 w-6' />
            <input
              type="number"
              placeholder='number'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='border-l-2 border-black pl-2 outline-none font-montserrat-400'
            />
          </div>
          <div className='w-[110%] flex justify-end'>
            <div>
              <div
                onClick={handleSubmit} // Call the function when clicked
                className='bg-blue p-2.5 text-white rounded-lg cursor-pointer'
              >
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
