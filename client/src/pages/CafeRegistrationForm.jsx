import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NameLogo from '../assets/cafeNameLogo.png';
import TableLogo from '../assets/tableLogo.png';
import EmailLogo from '../assets/emailLogo.png';
import PhoneLogo from '../assets/callLogo.png';
import AddressLogo from '../assets/addressLogo.png';
import PasswordLogo from '../assets/passwordLogo.png';

function CafeRegistrationForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        tables: 0,
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value, 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/server/cafeDetails/cafeRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    tables: parseInt(formData.tables),
                    email: formData.email,
                    phone: parseInt(formData.phone),
                    password: formData.password,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                // Store the JWT token
                localStorage.setItem('token', data.token);
                navigate(`/menu/${data.cafeId}`);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

  return (
    <div className='w-full h-screen flex justify-center items-center bg-base1'>
        <div className='w-[85%] flex flex-col justify-center items-start m-auto scale-90 border-2 border-blue rounded-xl py-10 px-20 shadow-[0_0_50px_5px_#0158A133]'>
            <h1 className='text-6xl mx-auto font-montsarret font-montserrat-700 uppercase mb-8'>Register Yourself</h1>
            <form onSubmit={handleSubmit} className='flex flex-col justify-between items-start w-full gap-7 px-10 pt-6'>
                <div className='flex justify-between w-full'>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={NameLogo} alt="User Logo" className='w-[42px] h-[42px] ml-1' />
                        <input onChange={handleChange} type="text" name="cafeName" id="name" placeholder='cafe name' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={TableLogo} alt="Table Logo" className='w-[34px] h-[34px] mr-1 ml-2' />
                        <input onChange={handleChange} type="number" name="cafeTables" id="tables" placeholder='number of tables' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                </div>
                
                <div className='flex justify-between w-full'>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={EmailLogo} alt="Email Logo" className='w-[42px] h-[42px] ml-1' />
                        <input onChange={handleChange} type="email" name="cafeEmail" id="email" placeholder='email' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={PhoneLogo} alt="Phone Logo" className='w-[44px] h-[44px] ml-1 scale-75' />
                        <input onChange={handleChange} type="phone" min={10} name="cafePhone" id="phone" placeholder='contact number' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                </div>

                <div className='flex gap-1 w-full items-center border-2 border-[#C6C6C6] rounded-xl'>
                    <img src={AddressLogo} alt="Address Logo" className='w-[42px] h-[42px] ml-1 scale-75' />
                    <input onChange={handleChange} type="text" name="cafeAddress" id="address" placeholder='cafe address' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                </div>
                
                <div className='flex justify-between w-full'>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={PasswordLogo} alt="Password Logo" className='w-[42px] h-[42px] ml-1 pt-1 scale-125' />
                        <input onChange={handleChange} type="password" name="cafePassword" id='password' placeholder='password' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={PasswordLogo} alt="Password Logo" className='w-[42px] h-[42px] ml-1 pt-1 scale-125' />
                        <input onChange={handleChange} type="password" name="cafePassword" id='confirmPassword' placeholder='confirm password' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                </div>

                <div className='w-full flex justify-center mt-6'>
                    <button className='border-2 border-blue rounded-xl w-[45%] text-xl p-1 shadow-[0_0_7.6px_0_#0158A133]'>Register</button>
                </div>
            </form>

            <div className='mx-auto mt-2'>
                <Link to="/" className="font-montsarret font-montserrat-500 text-sm italic text-blue">Login..?</Link>
            </div>
        </div>
    </div>
  )
}

export default CafeRegistrationForm