import React, { useState } from 'react';
import UploadLogo from '../assets/Arhive_export.png';
import PizzaLogo from '../assets/pizzaLogo.png';
import CrossLogo from '../assets/crossLogo.png';
import { FaAngleDown, FaCheck } from 'react-icons/fa';

function AddImages({ categories, handleAddImagesPopup, cafeId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownCategories, setDropdownCategories] = useState([...categories]);
  const [selectedCategory, setSelectedCategory] = useState('category');
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null); 
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file); 
    }
  };

  const uploadImage = async () => {
    if (!selectedCategory || !imageFile) {
      alert("Please select a category and upload an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append('category', selectedCategory);
    formData.append('imageFile', imageFile);

    try {
      const response = await fetch(`/server/cafeDetails/uploadImages/${cafeId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Image uploaded successfully');
        setSelectedCategory('category'); 
        setImageFile(null);
      } else {
        const errorData = await response.json();
        alert(`Error uploading image: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred while uploading the image.");
    }
  };

  const uploadBanner = async () => {
    if (!bannerFile) {
      alert("Please upload a banner image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append('bannerFile', bannerFile); 

    try {
      const response = await fetch(`/server/cafeDetails/uploadBanner/${cafeId}`, {
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        const result = await response.json();
        alert('Banner uploaded successfully');
        setBannerFile(null); 
      } else {
        const errorData = await response.json();
        alert(`Error uploading banner: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred while uploading the banner.");
    }
  };

  const closePopup = () => {
    handleAddImagesPopup();
  };

  return (
    <div>
      <div className='relative flex flex-col justify-center gap-5 h-[55vh] w-[30vw] bg-white rounded-2xl p-5'>
        
        <div className='absolute right-5 top-5 cursor-pointer' onClick={closePopup}>
          <img src={CrossLogo} alt="Close" className='h-6 w-6' />
        </div>

        <div className='flex flex-col justify-start items-center gap-2 w-full'>
          <div className='font-montserrat-700 text-xl mb-2'>ADD IMAGES</div>
          <div className='relative flex items-center w-[80%] py-1 px-2 border-2 border-gray rounded-xl'>
            <img src={PizzaLogo} alt="Logo" className='h-6 w-6' />
            <div className="relative w-full">
              <button
                onClick={toggleDropdown}
                className="flex justify-between text-sm font-montserrat-400 items-center w-full px-2 py-1"
              >
                <div className='border-l-2 border-gray pl-2 uppercase'>
                  {selectedCategory}
                </div>
                <FaAngleDown
                  className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            {isOpen && (
              <div className='absolute top-10 w-full'>
                {dropdownCategories.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategorySelect(item)}
                    className="py-1 cursor-pointer w-full rounded-3xl px-4 bg-white border-2 border-blue my-0.5 uppercase"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='w-[80%] flex justify-center items-center py-1.5 gap-3'>
            <div className='bg-blue rounded-xl flex items-center justify-center py-1.5 w-full'>
              <img src={UploadLogo} alt="Upload" className='h-6 w-6' />
              <div className='font-montserrat-500 text-md text-white'>
                <input 
                  type="file" 
                  name='imageFile' 
                  id={`image-${selectedCategory}`} 
                  className='hidden' 
                  onChange={handleImageChange} 
                />
                <label htmlFor={`image-${selectedCategory}`}>Upload Image</label>
              </div>
            </div>
            {imageFile && (
              <button onClick={uploadImage} className='bg-blue p-2.5 rounded-xl text-white'>
                <FaCheck />
              </button>
            )}
          </div>
        </div>

        {/* Section for Uploading Banner */}
        <div className='flex flex-col justify-start items-center gap-1 w-full'>
            <div className='font-montserrat-400 text-sm mb-1'>DISCOUNT BANNER</div>
            <div className='w-[80%] flex justify-center items-center py-1.5 gap-3'>
            <div className='bg-blue rounded-xl flex items-center justify-center py-1.5 w-full'>
              <img src={UploadLogo} alt="Upload" className='h-6 w-6' />
              <div className='font-montserrat-500 text-md text-white'>
                <input 
                  type="file" 
                  name='bannerFile' 
                  id='banner'
                  className='hidden' 
                  onChange={handleBannerChange} 
                />
                <label htmlFor='banner'>Upload Banner</label>
              </div>
            </div>
            {bannerFile && (
              <button onClick={uploadBanner} className='bg-blue p-2.5 rounded-xl text-white'>
                <FaCheck />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddImages;
