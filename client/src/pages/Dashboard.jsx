import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function Dashboard({ cafeName, cafePhone, cafeAddress, cafeTables, cafeInstagram, cafeLogo, cafeEmail, cafeComplains, cafeEarnings, handleContentView }) {
    const { cafeId } = useParams();
    const [editable, setEditable] = useState(false);
    const [currentMonthEarnings, setCurrentMonthEarnings] = useState(0);
    const [complains, setComplains] = useState([...cafeComplains]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: cafeName,
        phone: cafePhone,
        address: cafeAddress,
        tables: cafeTables,
        instagram: cafeInstagram,
        email: cafeEmail,
        logo: cafeLogo, 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const data = [
        { title: 'Name', val: formData.name, key: 'name' },
        { title: 'Phone', val: formData.phone, key: 'phone' },
        { title: 'Address', val: formData.address, key: 'address' },
        { title: 'Tables', val: formData.tables, key: 'tables' },
        { title: 'Instagram', val: formData.instagram, key: 'instagram' },
        { title: 'Email', val: formData.email, key: 'email' },
    ];

    useEffect(() => {
        setFormData({
            name: cafeName,
            phone: cafePhone,
            address: cafeAddress,
            tables: cafeTables,
            instagram: cafeInstagram,
            logo: cafeLogo,
            email: cafeEmail,
        });
        setComplains([...cafeComplains]);

        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const earningsForCurrentMonth = cafeEarnings.find((earning) => earning.month === currentMonth);
        setCurrentMonthEarnings(earningsForCurrentMonth ? earningsForCurrentMonth.amount : 0);

    }, [cafeName, cafePhone, cafeAddress, cafeTables, cafeInstagram, cafeLogo, cafeEmail, cafeComplains]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/server/userDetails/getAllUsers/${cafeId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.users); 
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        };
    
        if (cafeId) {
            fetchUsers();
            console.log(users);
        }
    }, [cafeId]);    

    const getToken = () => localStorage.getItem('token');

    const handleChange = (key, value) => {
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            logo: file,
        }));
    };

    const updateCafeDetails = async () => {
        console.log('called');
        setLoading(true);
        setError(false);
        setSuccess(false);

        try {
            const token = getToken();
            const form = new FormData();
            form.append('name', formData.name);
            form.append('phone', formData.phone);
            form.append('address', formData.address);
            form.append('tables', formData.tables);
            form.append('instagram', formData.instagram);
            form.append('email', formData.email);
            if (formData.logo) form.append('logoImg', formData.logo);

            const response = await fetch(`/server/cafeDetails/updateCafe/${cafeId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                throw new Error('Failed to update cafe details');
            }

            setSuccess(true);
            setEditable(false);
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col h-[79vh] w-full pr-14 -mt-3 overflow-y-auto'>
            <div>
                <button onClick={() => handleContentView('monthlyEarnings')} 
                className='rounded-full border-2 border-blue py-1 px-4 text-xs font-montserrat-600 my-1 -mt-8 text-center'>VIEW MORE</button>
            </div>
            <div className='flex justify-between items-center bg-[#0158A12A] border-2 border-blue rounded-3xl my-1 py-6 px-12'>
                <div className='flex flex-col items-start justify-center font-montserrat-700 text-4xl'>
                    <div>TOTAL</div>
                    <div>EARNINGS</div>
                </div>
                <div className='font-montserrat-700 text-3xl'>
                    Rs.{currentMonthEarnings.toLocaleString()}
                </div>
            </div>
            <div className='flex gap-2 my-1 h-full mb-2'>
                <div className={`flex flex-col w-1/2 h-[50vh] rounded-3xl bg-[#0158A12A] ${editable ? 'border-4 border-blue' : ''}`}>
                    <div className='flex justify-between py-2.5 px-4'>
                        <div className='text-lg font-montserrat-700'>CAFE DETAILS</div>
                        <div className='flex gap-3 items-center'>
                            {editable ? (
                                <div className='bg-blue text-white rounded-full p-1 cursor-pointer' onClick={updateCafeDetails}>
                                    <FaCheck />
                                </div>
                            ) : null}
                            <button
                                className='font-montserrat-400 text-xs px-6 py-1 rounded-3xl border-2 bg-blue text-white'
                                onClick={() => setEditable(true)}
                            >
                                EDIT
                            </button>
                        </div>
                    </div>
                    <hr className='h-1 bg-white' />
                    <div className='flex justify-around h-full px-4'>
                        <div className='flex flex-col justify-start gap-2 w-[65%] mt-3 text-sm'>
                            {data.map((info, index) => (
                                <div key={index} className='flex gap-6 w-full'>
                                    <div className='w-1/4'>{info.title}:</div>
                                    {editable ? (
                                        <input
                                            type="text"
                                            value={formData[info.key]}
                                            onChange={(e) => handleChange(info.key, e.target.value)}
                                            className='p-0.5 pl-1 rounded-lg outline-none'
                                        />
                                    ) : (
                                        <div>{info.val}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='h-full w-[0.75%] bg-white'></div>
                        <div className='flex flex-col justify-center items-center pl-4 w-[35%]'>
                            {formData.logo instanceof File ? (
                                <img src={URL.createObjectURL(formData.logo)} alt="Logo Preview" className='h-20 w-20 -mt-10' />
                            ) : (
                                <img src={formData.logo} alt="Cafe Logo" className='h-20 w-20 -mt-10' />
                            )}
                            <input type='file' name='cafeLogo' id='cafeLogo' className='hidden' onChange={handleLogoChange} />
                            {editable ? (
                                <label htmlFor="cafeLogo" className='text-center mt-2 text-xs scale-90 font-montserrat-600 cursor-pointer'>
                                    Click here to change.
                                </label>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-start items-start w-1/2 rounded-3xl bg-[#0158A12A]'>
                    <div className='w-full my-3'>
                        <div className='pl-4 mb-2 font-montserrat-700 text-lg'>COMPLAIN LIST</div>
                        <hr className='h-1 bg-white mt-1' />
                    </div>
                    <div className='flex flex-col gap-4 w-full h-[30vh] overflow-y-auto'>
                        {complains.map((complain, index) => {
                            return (
                                <div key={index} className='flex justify-between w-full px-4 text-xs'>
                                    <div>{complain.complain}</div>
                                    <div>{complain.date.split('T')[0]}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-start items-start w-full rounded-3xl bg-[#0158A12A]'>
                <div className='w-full my-3'>
                    <div className='pl-4 mb-2 font-montserrat-700 text-lg'>CUSTOMER DETAILS</div>
                    <hr className='h-1 bg-white mt-1' />
                </div>
                <div className='flex justify-between px-4 font-montserrat-700 mb-1.5 w-full text-sm'>
                    <div>Name</div>
                    <div>Phone</div>
                    <div>Visited at</div>
                </div>
                <div className='flex flex-col gap-4 w-full h-[30vh] overflow-y-auto'>
                    {users.length > 0 ? (
                        users.map((user) => (
                                <div key={user._id} className='flex justify-between px-4 text-xs'>
                                    <div className='capitalize'>{user.name}</div>
                                    <div>{user.phone}</div>
                                    <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                        ))
                    ) : (
                        <div className='px-4 text-xs'>No users found for this cafe.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
