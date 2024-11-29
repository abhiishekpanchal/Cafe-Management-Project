import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NameLogo from '../assets/cafeNameLogo.png';
import TableLogo from '../assets/tableLogo.png';
import EmailLogo from '../assets/emailLogo.png';
import PhoneLogo from '../assets/callLogo.png';
import AddressLogo from '../assets/addressLogo.png';
import PasswordLogo from '../assets/passwordLogo.png';
import RegistrationBg from '../assets/registrationBg.png';
import UploadLogo from '../assets/uploadLogo.png';
import InstagramLogo from '../assets/instagramLogo.png';

function CafeRegistrationForm() {
    const navigate = useNavigate();
    const [imgFile, setImgFile] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        tables: 0,
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        instagram: '',
        logoImg: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value, 
        });
    };

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
            setFormData((prevFormData) => ({
                ...prevFormData,
                logoImg: reader.result
            }));
        };
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setFileToBase(file);
    }

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
                    ...formData,
                    tables: parseInt(formData.tables),
                    phone: parseInt(formData.phone),
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
    <div className='relative w-full h-screen flex justify-center items-center'>
        <div style={{backgroundImage: `url(${RegistrationBg})`, backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover', filter: 'invert(40%)'}} className='w-[100vw] h-[100vh]'></div>
        <div className='absolute bg-white w-[85%] flex flex-col justify-center items-start m-auto scale-90 border-2 border-blue rounded-xl py-7 px-20 shadow-[0_0_50px_5px_#0158A133]'>
            <h1 className='text-6xl mx-auto font-montsarret font-montserrat-700 uppercase mb-6'>Register Yourself</h1>
            <form onSubmit={handleSubmit} className='flex flex-col justify-between items-start w-full gap-7 px-10 pt-3'>
                <div className='flex justify-between w-full'>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={NameLogo} alt="User Logo" className='w-[42px] h-[42px] ml-1 scale-90' />
                        <input onChange={handleChange} type="text" name="cafeName" id="name" placeholder='cafe name' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={TableLogo} alt="Table Logo" className='w-[34px] h-[34px] mr-1 ml-2 scale-90' />
                        <input onChange={handleChange} type="number" name="cafeTables" id="tables" placeholder='number of tables' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                </div>
                
                <div className='flex justify-between w-full'>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={EmailLogo} alt="Email Logo" className='w-[42px] h-[42px] ml-1 scale-90' />
                        <input onChange={handleChange} type="email" name="cafeEmail" id="email" placeholder='email' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={PhoneLogo} alt="Phone Logo" className='w-[44px] h-[44px] ml-1 scale-[60%]' />
                        <input onChange={handleChange} type="phone" min={10} name="cafePhone" id="phone" placeholder='contact number' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                </div>

                <div className='flex gap-1 w-full items-center border-2 border-[#C6C6C6] rounded-xl'>
                    <img src={AddressLogo} alt="Address Logo" className='w-[42px] h-[42px] ml-1 scale-[80%]' />
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

                <div className='flex justify-between w-full'>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={InstagramLogo} alt="Instagram Logo" className='w-[44px] h-[44px] ml-1 scale-[80%]' />
                        <input onChange={handleChange} type="text" name="cafeInstagram" id="instagram" placeholder='instagram handle' className='outline-none border-l-2 pl-2 border-black w-[80%]' autoComplete='off' />
                    </div>
                    <div className='flex gap-1 w-[43%] items-center border-2 border-[#C6C6C6] rounded-xl'>
                        <img src={UploadLogo} alt="Email Logo" className='w-[42px] h-[42px] ml-1 scale-[85%]' />
                        <input onChange={handleImage} type="file" name="cafeLogo" id="cafeLogo" placeholder='logo' className='outline-non hidden' autoComplete='off' />
                        <label htmlFor="cafeLogo" className='border-l-2 pl-2 border-black w-[80%] text-[#888888]'>upload logo (.png, .jpg. .jpeg)</label>
                    </div>
                </div>

                <div className='w-full flex justify-center mt-4'>
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