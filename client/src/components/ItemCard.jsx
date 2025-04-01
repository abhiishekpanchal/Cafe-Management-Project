import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import VegLogo from '../assets/vegLogo.png';
import NonVegLogo from '../assets/nonvegLogo.png';
import RemoveLogo from '../assets/removeLogo.png';
import PizzaLogo from '../assets/pizzaLogo.png';
import DescriptionLogo from '../assets/descriptionLogo.png';
import CurrencyLogo from '../assets/currencyLogo.png';
import CrossLogo from '../assets/crossLogo.png';
import DropDown from './DropDown';
import { useAuth } from '@/auth/AuthContext';
import { FaAngleDown, FaCheck, FaPlus } from 'react-icons/fa';

function ItemCard({
  dishname,
  dishdescription,
  dishprice,
  dishType,
  dishCategory,
  dishVariants,
  dishAddOns,
  onDelete,
}) {
  const { cafeId } = useParams();
  const { token } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // State for update form
  const [updatedDishName, setUpdatedDishName] = useState(dishname);
  const [updatedDishDescription, setUpdatedDishDescription] =
    useState(dishdescription);
  const [updatedDishPrice, setUpdatedDishPrice] = useState(dishprice);
  const [updatedDishType, setUpdatedDishType] = useState(dishType);
  const [variantsEnabled, setVariantsEnabled] = useState(
    dishVariants && dishVariants.length > 0
  );
  const [updatedVariants, setUpdatedVariants] = useState(dishVariants || []);
  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [availableAddons, setAvailableAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState(dishAddOns || []);

  // Fetch all available addons when update form is opened
  const fetchAddons = async () => {
    try {
      const res = await fetch(`/server/cafeDetails/getCafeDetails/${cafeId}`);
      const data = await res.json();
      if (res.ok && data.addons) {
        setAvailableAddons(data.addons);
      }
    } catch (err) {
      console.error('Error fetching addons:', err);
    }
  };

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleDeleteDish = async () => {
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`/server/menuDetails/deleteDish/${cafeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dishname, dishCategory }),
      });

      if (response.ok) {
        console.log('Dish deleted:', dishname);
        onDelete(dishCategory);
      } else {
        console.error(
          'Failed to delete dish, server responded with:',
          response.status
        );
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleUpdateDish = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`/server/menuDetails/updateDish/${cafeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalDishName: dishname,
          dishCategory,
          updatedDish: {
            dishName: updatedDishName,
            dishDescription: updatedDishDescription,
            dishPrice: updatedDishPrice,
            dishType: updatedDishType,
            variants: updatedVariants.map((variant) => ({
              variantName: variant.name || variant.variantName,
              variantPrice: variant.price || variant.variantPrice,
            })),
            addons: selectedAddons.map((addon) => ({
              addOnName: addon.addon_name || addon.addOnName,
              addOnPrice: addon.addon_price || addon.addOnPrice,
            })),
          },
        }),
      });

      if (response.ok) {
        console.log('Dish updated:', updatedDishName);
        setShowUpdateForm(false);
        onDelete(dishCategory); // Refresh the dish list
      } else {
        console.error(
          'Failed to update dish, server responded with:',
          response.status
        );
      }
    } catch (error) {
      console.error('Error updating dish:', error);
    }
  };

  const addVariant = () => {
    if (variantName && variantPrice) {
      setUpdatedVariants([
        ...updatedVariants,
        { name: variantName, price: variantPrice },
      ]);
      setVariantName('');
      setVariantPrice('');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openUpdateForm = () => {
    fetchAddons();
    setShowUpdateForm(true);
  };

  const closeUpdateForm = () => {
    setShowUpdateForm(false);
    // Reset form to original values
    setUpdatedDishName(dishname);
    setUpdatedDishDescription(dishdescription);
    setUpdatedDishPrice(dishprice);
    setUpdatedDishType(dishType);
    setVariantsEnabled(dishVariants && dishVariants.length > 0);
    setUpdatedVariants(dishVariants || []);
    setSelectedAddons(dishAddOns || []);
  };

  // Format variants for display
  const formattedVariants = updatedVariants.map((variant) => ({
    name: variant.name || variant.variantName,
    price: variant.price || variant.variantPrice,
  }));

  return (
    <div className="relative flex flex-col justify-start items-center w-full md:w-[27%] min-h-[55%] py-3 pt-7 bg-[#0158A12A] rounded-3xl">
      {/* Dish type icon */}
      <div className="absolute top-1 left-1 scale-110">
        {dishType === 'VEG' ? (
          <img
            src={VegLogo}
            alt="Veg Logo"
            className="h-[42px] w-[42px] scale-50"
          />
        ) : (
          <img
            src={NonVegLogo}
            alt="NonVeg Logo"
            className="h-[42px] w-[42px] scale-50"
          />
        )}
      </div>

      {/* Delete icon */}
      <div className="absolute top-1 right-1 scale-110">
        <button onClick={handleDeleteDish} className="text-base4 scale-75">
          <img
            src={RemoveLogo}
            alt="Remove Logo"
            className="h-[42px] w-[42px] scale-75"
          />
        </button>
      </div>

      {/* Dish name */}
      <div className="flex justify-between items-center w-full px-3 mt-4 mb-2">
        <div className="capitalize text-sm font-montserrat-700 w-full rounded-md">
          {dishname}
        </div>
        <div className="text-xs capitalize font-montserrat-500 font-montsarret whitespace-nowrap">{`Price - Rs ${dishprice}`}</div>
      </div>

      <div className="w-full h-1 bg-white"></div>

      {/* Dish description and dropdowns */}
      <div className="flex flex-col justify-between h-full items-start gap-1 px-3 font-semibold bg-base4 rounded-md w-full">
        <div
          className="text-xs font-montsarret font-montserrat-500 capitalize break-words max-h-20 text-ellipsis w-full my-2"
          style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {dishdescription}
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="relative bg-[#3295E866] rounded-3xl w-full">
            <button
              className="flex justify-between text-sm font-montserrat-400 items-center w-full px-4 py-1"
              onClick={openUpdateForm}
            >
              Update dish
            </button>
          </div>
          <DropDown
            title="Variants"
            listItems={dishVariants}
            isOpen={activeDropdown === 'variants'}
            onToggle={() => handleDropdownToggle('variants')}
          />
          <DropDown
            title="Add-ons"
            listItems={dishAddOns}
            isOpen={activeDropdown === 'addons'}
            onToggle={() => handleDropdownToggle('addons')}
          />
        </div>
      </div>

      {/* Update Dish Form Popup */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl px-6 pt-12 pb-5 w-[40vw] scale-75 relative">
            <h2 className="text-2xl font-montsarret font-montserrat-700 mb-4 py-2 text-center uppercase">
              Update {dishname}
            </h2>
            <div className="flex flex-col gap-3">
              <div className="border-2 border-gray rounded-2xl flex items-center gap-1 py-1">
                <img
                  src={PizzaLogo}
                  alt="Pizza Logo"
                  className="h-[42px] w-[42px] ml-1 scale-75"
                />
                <input
                  type="text"
                  value={updatedDishName}
                  onChange={(e) => setUpdatedDishName(e.target.value)}
                  placeholder="dish name"
                  className="outline-none p-1 border-l-2 w-[89%]"
                  required
                />
              </div>
              <div className="border-2 border-gray rounded-2xl flex items-center gap-1 py-1">
                <img
                  src={DescriptionLogo}
                  alt="Description Logo"
                  className="h-[42px] w-[42px] ml-1 pl-2 py-2 scale-75"
                />
                <input
                  type="text"
                  value={updatedDishDescription}
                  onChange={(e) => setUpdatedDishDescription(e.target.value)}
                  placeholder="dish description"
                  className="outline-none p-1 border-l-2 w-[89%]"
                  maxLength={150}
                  required
                />
              </div>
              <div className="border-2 border-gray rounded-2xl flex items-center gap-1 py-1">
                <img
                  src={CurrencyLogo}
                  alt="Currency Logo"
                  className="h-[42px] w-[42px] ml-1 scale-75"
                />
                <input
                  type="number"
                  value={updatedDishPrice}
                  onChange={(e) => setUpdatedDishPrice(e.target.value)}
                  placeholder="dish price"
                  className="outline-none p-1 border-l-2 w-[89%]"
                  min={0}
                  required
                />
              </div>

              <div
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 
                ${updatedDishType === 'VEG' ? 'bg-[#008D38]' : 'bg-[#D80303]'}`}
                onClick={() =>
                  setUpdatedDishType(
                    updatedDishType === 'VEG' ? 'NON-VEG' : 'VEG'
                  )
                }
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 
                  ${
                    updatedDishType === 'VEG'
                      ? 'translate-x-0'
                      : 'translate-x-7'
                  }`}
                />
              </div>

              {/* Variants Enabled Toggle */}
              <div className="flex gap-2 items-center">
                <div
                  onClick={() => setVariantsEnabled(!variantsEnabled)}
                  className={`h-5 w-5 cursor-pointer transition-colors duration-300 ${
                    variantsEnabled ? 'bg-blue' : 'bg-white'
                  } border-2 border-gray rounded flex items-center justify-center`}
                >
                  <input
                    type="checkbox"
                    checked={variantsEnabled}
                    onChange={() => setVariantsEnabled(!variantsEnabled)}
                    className="hidden"
                  />
                  {variantsEnabled && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </div>
                <div className="uppercase font-montserrat-500">
                  Add Variants
                </div>
              </div>

              {/* Displaying Added Variants */}
              {formattedVariants.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {formattedVariants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex gap-6 items-center justify-around w-[45%] border-2 border-blue rounded-xl py-1 my-0.5"
                    >
                      <span className="font-montserrat-500 capitalize">
                        {variant.name}
                      </span>
                      <span className="text-gray-600 flex items-center gap-2">
                        <div>Rs.{variant.price}</div>
                        <button
                          onClick={() =>
                            setUpdatedVariants(
                              updatedVariants.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <img
                            src={CrossLogo}
                            alt=""
                            className="h-6 w-6 scale-90"
                          />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Variant Input Fields */}
              <div
                className={`overflow-hidden transition-transform duration-500 ${
                  variantsEnabled ? 'scale-y-100' : 'scale-y-0'
                } transform origin-top -mt-2`}
              >
                {variantsEnabled && (
                  <div className="flex justify-between items-center gap-2 mt-2">
                    <div className="w-2/3 border-2 border-gray rounded-2xl flex items-center gap-1 py-1">
                      <img
                        src={PizzaLogo}
                        alt="pizza logo"
                        className="rotate-180 h-[42px] w-[42px] ml-1 scale-75"
                      />
                      <input
                        type="text"
                        placeholder="name"
                        value={variantName}
                        onChange={(e) => setVariantName(e.target.value)}
                        className="outline-none p-1 border-l-2 w-[75%]"
                      />
                    </div>
                    <div className="border-2 border-gray rounded-2xl flex items-center gap-1 py-1">
                      <img
                        src={CurrencyLogo}
                        alt="currency logo"
                        className="h-[42px] w-[42px] ml-1 scale-75"
                      />
                      <input
                        type="number"
                        placeholder="price"
                        value={variantPrice}
                        onChange={(e) => setVariantPrice(e.target.value)}
                        className="outline-none p-1 mr-2 border-l-2 w-[75%]"
                      />
                    </div>
                    <button
                      onClick={addVariant}
                      type="button"
                      className="bg-blue p-3 rounded-xl text-white align-middle"
                    >
                      <FaCheck className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="dropdown-addons flex flex-col gap-2">
                <div className="relative flex items-center w-full py-2 px-2 border-2 border-gray rounded-2xl">
                  <FaPlus className="h-4 w-4 ml-2 mr-1.5" />
                  <div className="relative w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown();
                      }}
                      className="flex justify-between text-md font-montserrat-400 items-center w-full px-2"
                    >
                      <div className="border-l-2 border-gray pl-2 uppercase font-montserrat-500">
                        ADD-ONS
                      </div>
                      <FaAngleDown
                        className={`transform transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="absolute top-10 w-full -ml-1.5 z-10">
                      {availableAddons
                        .filter(
                          (addon) =>
                            !selectedAddons.some(
                              (selected) =>
                                (selected.addon_name || selected.addOnName) ===
                                (addon.addon_name || addon.addOnName)
                            )
                        )
                        .map((addon, index) => (
                          <button
                            key={index}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedAddons([...selectedAddons, addon]);
                              setIsOpen(false); // Close dropdown after selection
                            }}
                            className="py-1 w-full rounded-3xl px-4 bg-white border-2 border-blue my-0.5 uppercase flex justify-between items-center"
                          >
                            <div>{addon.addon_name || addon.addOnName}</div>
                            <div>
                              Rs {addon.addon_price || addon.addOnPrice}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Display selected add-ons */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedAddons.map((addon, index) => (
                    <div
                      key={index}
                      className="rounded-full pl-2 pr-1 text-sm flex items-center justify-around py-1 border-2 border-blue gap-4"
                    >
                      <div className="uppercase font-montserrat-500">
                        {addon.addon_name || addon.addOnName}
                      </div>
                      <img
                        src={CrossLogo}
                        alt="Remove addon"
                        className="h-5 w-5 cursor-pointer"
                        onClick={() =>
                          setSelectedAddons(
                            selectedAddons.filter((_, i) => i !== index)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdateDish}
                className="bg-blue text-lg text-white py-2 px-6 mb-3 rounded-2xl uppercase hover:opacity-90"
              >
                Update Dish
              </button>
            </div>
            <button
              className="absolute right-2 top-2 scale-75"
              onClick={closeUpdateForm}
            >
              <img
                src={CrossLogo}
                alt="Cross Logo"
                className="h-[42px] w-[42px]"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemCard;
