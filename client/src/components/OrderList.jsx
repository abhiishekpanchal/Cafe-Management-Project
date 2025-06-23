import { useAuth } from "@/auth/AuthContext";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCheck, FaTimes, FaPrint } from "react-icons/fa";
import UPILogo from "../assets/UPI.png";
import WalletLogo from "../assets/wallet.png";
import CreditCardLogo from "../assets/credit-card.png";
import { useReactToPrint } from "react-to-print";

const KitchenTicket = React.forwardRef(({ order, orders, dishTypes }, ref) => (
  <div ref={ref} className="p-4 font-sans w-full max-w-md mx-auto">
    <div className="text-center font-bold text-lg mb-2">KITCHEN TICKET</div>
    <div className="text-center mb-4">Order #{order._id.slice(-6)}</div>
    <div className="text-center mb-2">Table: {order.tableId}</div>
    <div className="text-center mb-4">Customer: {order.customer}</div>
    <hr className="border-t border-black my-2" />
    <div className="mb-2">
      {orders.map((item, index) => (
        <div key={index} className="mb-2">
          <div className="font-semibold">
            {item.quantity}x {item.dishName}
            {item.dishVariants && item.dishVariants.variantName && (
              <div className="text-sm">({item.dishVariants.variantName})</div>
            )}
            {dishTypes[item.dishName] === "NON-VEG" && (
              <span className="ml-2 w-3 h-3 bg-red-600 rounded-full inline-block"></span>
            )}
          </div>
          {item.dishAddOns && item.dishAddOns.length > 0 && (
            <div className="pl-4">
              {item.dishAddOns.map((addon, idx) => (
                <div key={idx}>+ {addon.addOnName}</div>
              ))}
            </div>
          )}
          {item.cookingRequest && (
            <div className="pl-4 text-sm italic">
              Note: {item.cookingRequest}
            </div>
          )}
        </div>
      ))}
    </div>
    <hr className="border-t border-black my-2" />
    <div className="text-center mt-4 text-sm">
      {new Date().toLocaleString()}
    </div>
  </div>
));
KitchenTicket.displayName = "KitchenTicket";

const Bill = React.forwardRef(({ order, orders, totalPrice, gstNumber, cafeName }, ref) => (
  <div ref={ref} className="p-4 font-sans w-full max-w-md mx-auto">
    <div className="text-center font-bold text-lg mb-2">BILL</div>
    <div className="text-center mb-2">{cafeName}</div>
    {gstNumber && (
      <div className="text-center mb-2 text-sm">GST No: {gstNumber}</div>
    )}
    <div className="text-center mb-4">Order #{order._id.slice(-6)}</div>
    <div className="text-center mb-2">Table: {order.tableId}</div>
    <div className="text-center mb-4">Customer: {order.customer}</div>
    <hr className="border-t border-black my-2" />
    <table className="w-full mb-4">
      <thead>
        <tr className="border-b border-black">
          <th className="text-left py-1">Item</th>
          <th className="text-right py-1">Qty</th>
          <th className="text-right py-1">Price</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((item, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-1">
              {item.dishName}
              {item.dishVariants && item.dishVariants.variantName && (
                <div className="text-sm">({item.dishVariants.variantName})</div>
              )}
              {item.dishAddOns && item.dishAddOns.length > 0 && (
                <div className="pl-4 text-sm">
                  {item.dishAddOns.map((addon, idx) => (
                    <div key={idx}>+ {addon.addOnName}</div>
                  ))}
                </div>
              )}
            </td>
            <td className="text-right py-1">{item.quantity}</td>
            <td className="text-right py-1">Rs. {item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <hr className="border-t border-black my-2" />
    <div className="text-right font-bold text-lg">Total: Rs. {totalPrice}</div>
    <div className="text-center mt-4 text-sm">
      {new Date().toLocaleString()}
    </div>
  </div>
));
Bill.displayName = "Bill";

export default function OrderList({ order, refetchOrders }) {
  const [orders, setOrders] = useState([...order.orderList]);
  const { token, load } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalPrice, setTotalPrice] = useState(order.totalPrice);
  const [showRemoveAddon, setShowRemoveAddon] = useState(null);
  const [dropdownStatus, setDropdownStatus] = useState(null);
  const [dishTypes, setDishTypes] = useState({});
  const [isPrintReady, setIsPrintReady] = useState(false);
  const [printError, setPrintError] = useState(null);
  const [gstNumber, setGstNumber] = useState('');
  const [cafeName, setCafeName] = useState('');

  const kitchenTicketRef = useRef(null);
  const billRef = useRef(null);

  // State to control print rendering
  const [isPrinting, setIsPrinting] = useState(false);
  const [printType, setPrintType] = useState(null);

  // Print handlers
  const handlePrint = useCallback(() => {
    if (!printType) return;

    setIsPrinting(false);
    const content =
      printType === "kitchen" ? kitchenTicketRef.current : billRef.current;

    if (!content) {
      setPrintError(`Failed to generate ${printType} ticket`);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);
    const printDocument = iframe.contentWindow.document;
    printDocument.open();
    printDocument.write(`
      <html>
        <head>
          <title>${printType === "kitchen" ? "Kitchen Ticket" : "Bill"}</title>
          <style>
            @page { size: auto; margin: 5mm; }
            body { font-family: sans-serif; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printDocument.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
      setPrintType(null);
    }, 500);
  }, [printType]);
  useEffect(() => {
    if (isPrinting && printType) {
      handlePrint();
    }
  }, [isPrinting, printType, handlePrint]);

  // ... your existing useEffect hooks ...

  // Simplified print trigger functions
  const triggerKitchenPrint = () => {
    if (!order?._id || orders.length === 0) {
      setPrintError("Order data not ready for printing");
      return;
    }
    setPrintType("kitchen");
    setIsPrinting(true);
  };

  const fetchGSTNumber = async () => {
    try {
      const response = await fetch(
        `/server/cafeDetails/getGSTNumber/${order.cafeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setGstNumber(data.data.gstNumber);
        setCafeName(data.data.cafeName);
      } else {
        console.warn("GST number not found:", data.message);
      }
    } catch (error) {
      console.error("Error fetching GST number:", error);
    } 
  };

  const triggerBillPrint = async () => {
    if (!order?._id || orders.length === 0) {
      setPrintError("Order data not ready for printing");
      return;
    }
    await fetchGSTNumber();
    setPrintType("bill");
    setIsPrinting(true);
  };

  useEffect(() => {
    setOrders([...order.orderList]);
    setTotalPrice(order.totalPrice);
    setIsPrintReady(!!order._id && order.orderList.length > 0);
  }, [order]);

  useEffect(() => {
    const newTotal = orders.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(newTotal);
  }, [orders]);

  useEffect(() => {
    const fetchDishTypes = async () => {
      const types = {};

      const promises = orders.map(async (item) => {
        if (types[item.dishName]) return;

        try {
          const response = await fetch(
            `/server/menuDetails/getDishType/${
              order.cafeId
            }/${encodeURIComponent(item.dishName)}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            types[item.dishName] = data.dishType;
          }
        } catch (error) {
          console.error(
            `Error fetching dish type for ${item.dishName}:`,
            error
          );
        }
      });

      await Promise.all(promises);
      setDishTypes(types);
    };

    if (orders.length > 0) {
      fetchDishTypes();
    }
  }, [orders, order.cafeId, token]);

  const paymentMethods = [
    { name: "Cash", logo: WalletLogo },
    { name: "UPI", logo: UPILogo },
    { name: "Card", logo: CreditCardLogo },
  ];

  const handleStatusUpdate = async (status, method = null) => {
    try {
      const response = await fetch(
        `/server/cafeDetails/updateEarnings/${order.cafeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: order._id, status, method }),
        }
      );

      if (!response.ok) throw new Error("Failed to update earnings");

      if (status === "paid") {
        setOrders(orders.filter((item) => item._id !== order._id));
      }

      refetchOrders();
      setDropdownStatus(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const updateItemStatus = async (itemIndex, newStatus) => {
    try {
      const response = await fetch(`/server/orderDetails/updateItemStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
          newStatus,
        }),
      });

      if (response.ok) {
        const updatedOrders = [...orders];
        updatedOrders[itemIndex].status = newStatus;
        setOrders(updatedOrders);
        setActiveDropdown(null);
        refetchOrders();
      } else {
        console.error("Failed to update item status");
      }
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  const updateItemQuantity = async (e, itemIndex, newQuantity) => {
    e.stopPropagation();

    if (newQuantity < 1) return;

    try {
      const item = orders[itemIndex];
      const unitPrice = item.price / item.quantity;
      const newTotalItemPrice = unitPrice * newQuantity;

      const updatedOrders = [...orders];
      updatedOrders[itemIndex].quantity = newQuantity;
      updatedOrders[itemIndex].price = newTotalItemPrice;
      setOrders(updatedOrders);

      const response = await fetch(`/server/orderDetails/updateItemQuantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
          newQuantity,
          newPrice: newTotalItemPrice,
        }),
      });

      if (response.ok) {
        refetchOrders();
      } else {
        console.error("Failed to update item quantity");
        setOrders([...order.orderList]);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setOrders([...order.orderList]);
    }
  };

  const removeItem = async (e, itemIndex) => {
    e.stopPropagation();

    try {
      const updatedOrders = orders.filter((_, idx) => idx !== itemIndex);
      setOrders(updatedOrders);
      setActiveDropdown(null);

      const response = await fetch(`/server/orderDetails/removeItem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
        }),
      });

      if (response.ok) {
        refetchOrders();
      } else {
        console.error("Failed to remove item");
        setOrders([...order.orderList]);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setOrders([...order.orderList]);
    }
  };

  const removeAddon = async (e, itemIndex, addonIndex) => {
    e.stopPropagation();

    try {
      const updatedOrders = [...orders];
      const item = updatedOrders[itemIndex];
      const addonPrice = item.dishAddOns[addonIndex].addOnPrice;
      item.dishAddOns.splice(addonIndex, 1);
      item.price -= addonPrice * item.quantity;

      setOrders(updatedOrders);
      const response = await fetch(`/server/orderDetails/removeAddon`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
          addonIndex,
        }),
      });

      if (response.ok) {
        refetchOrders();
      } else {
        console.error("Failed to remove addon");
        setOrders([...order.orderList]);
      }
    } catch (error) {
      console.error("Error removing addon:", error);
      setOrders([...order.orderList]);
    }
  };

  const toggleDropdown = (index) => {
    if (orders[index].status === "paid") {
      return;
    }

    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const toggleShowRemoveAddon = (itemIndex) => {
    if (showRemoveAddon === itemIndex) {
      setShowRemoveAddon(null);
    } else {
      setShowRemoveAddon(itemIndex);
    }
  };

  return (
    <div className="flex flex-col gap-1 bg-[#0158A11A] rounded-xl py-3.5 min-w-[40vw] max-w-[50vw] flex-1">
      <div className="flex justify-between items-center px-3.5">
        <div className="font-montserrat-600 text-lg capitalize">
          {order.customer}&apos;s Order
        </div>
        <div className="flex gap-2">
          <button
            onClick={triggerKitchenPrint}
            disabled={!isPrintReady}
            className={`bg-blue-500 text-black px-3 py-2 rounded-xl flex items-center gap-2 ${
              isPrintReady
                ? "hover:bg-blue-600"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <FaPrint size={16} />
            <span>Kitchen Ticket</span>
          </button>

          <button
            onClick={triggerBillPrint}
            disabled={!isPrintReady}
            className={`bg-green-500 text-black px-3 py-2 rounded-xl flex items-center gap-2 ${
              isPrintReady
                ? "hover:bg-green-600"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <FaPrint size={16} />
            <span>Print Bill</span>
          </button>
        </div>
      </div>

      {printError && (
        <div className="px-3.5 text-red-500 text-sm">{printError}</div>
      )}

      {/* Hidden components for printing */}
      {printError && (
        <div className="px-3.5 text-red-500 text-sm">{printError}</div>
      )}

      {/* Always render print components but keep them hidden */}
      <div className="hidden">
        <KitchenTicket
          ref={kitchenTicketRef}
          order={order}
          orders={orders}
          dishTypes={dishTypes}
        />
        <Bill
          ref={billRef}
          order={order}
          orders={orders}
          totalPrice={totalPrice}
          gstNumber={gstNumber}
          cafeName={cafeName}
        />
      </div>

      <div className="flex justify-between px-3.5 font-montserrat-400 text-sm">
        <div>Table No. : {order.tableId}</div>
        <div>Total : Rs {totalPrice}</div>
      </div>
      <hr className="h-1.5 bg-white" />
      <div className="flex flex-col gap-3 py-2 px-3.5">
        <div className="bg-[#3295E866] rounded-xl py-2 h-[30vh] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white">
                <th className="text-left px-3 py-2 font-semibold">Item Name</th>
                <th className="text-center py-2 font-semibold">Status</th>
                <th className="text-center py-2 font-semibold">QTY</th>
                <th className="text-right px-3 py-2 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-white border-opacity-20"
                >
                  <td className="px-3 py-3">
                    <div className="font-semibold flex items-center">
                      {item.dishName}
                      {item.dishVariants && item.dishVariants.variantName && (
                        <div className="text-sm">
                          ({item.dishVariants.variantName})
                        </div>
                      )}
                      {dishTypes[item.dishName] === "VEG" ? (
                        <span className="ml-2 w-3 h-3 bg-green rounded-full"></span>
                      ) : (
                        <span className="ml-2 w-3 h-3 bg-red rounded-full"></span>
                      )}
                    </div>
                    {item.dishAddOns && item.dishAddOns.length > 0 && (
                      <div
                        className="flex flex-wrap gap-1 mt-1 relative"
                        onClick={() =>
                          item.status !== "paid" && toggleShowRemoveAddon(index)
                        }
                      >
                        {item.dishAddOns.map((addon, idx) => (
                          <span
                            key={idx}
                            className="text-xs border-2 border-blue bg-white rounded-full px-2 py-0.5 flex items-center"
                          >
                            {addon.addOnName}
                            {showRemoveAddon === index &&
                              item.status !== "paid" && (
                                <button
                                  onClick={(e) => removeAddon(e, index, idx)}
                                  className="ml-1 text-red-500"
                                >
                                  <FaTimes size={10} />
                                </button>
                              )}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="text-center relative">
                    <div
                      className={`inline-flex items-center justify-center ${
                        item.status !== "paid" ? "cursor-pointer" : ""
                      }`}
                      onClick={() => toggleDropdown(index)}
                    >
                      <span
                        className={`px-1 py-1 rounded-md text-sm font-medium ${
                          item.status === "pending"
                            ? "text-yellow-400"
                            : item.status === "preparing"
                            ? "text-green"
                            : "text-white"
                        }`}
                      >
                        {item.status === "pending"
                          ? "New"
                          : item.status === "preparing"
                          ? "Preparing"
                          : "Paid"}
                      </span>
                      {item.status !== "paid" && (
                        <span>
                          <RiArrowDropDownLine size={28} />
                        </span>
                      )}
                    </div>
                    {activeDropdown === index && item.status !== "paid" && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white rounded-3xl shadow-lg z-10 w-52">
                        {item.status === "pending" && (
                          <>
                            <div
                              className="px-4 py-3 font-medium text-green-600 border-b cursor-pointer hover:bg-gray-50 w-full text-green text-left"
                              onClick={() =>
                                updateItemStatus(index, "preparing")
                              }
                            >
                              Preparing
                            </div>

                                <hr className="h-0.5 bg-user_blue" />
                              </>
                            )}
                            <div className="border-b w-full">
                              <div className="px-4 py-3 flex items-center justify-between">
                                <span>Qty :</span>
                                <div className="flex items-center border rounded-full bg-blue text-white">
                                  <button
                                    onClick={(e) =>
                                      updateItemQuantity(
                                        e,
                                        index,
                                        item.quantity - 1
                                      )
                                    }
                                    className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-l-md"
                                  >
                                    -
                                  </button>
                                  <span className="px-3">{item.quantity}</span>
                                  <button
                                    onClick={(e) =>
                                      updateItemQuantity(
                                        e,
                                        index,
                                        item.quantity + 1
                                      )
                                    }
                                    className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-r-md"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            <hr className="h-0.5 bg-user_blue" />
                            <div
                              className="px-4 py-3 text-red text-left font-medium text-red-600 cursor-pointer hover:bg-gray-50 w-full"
                              onClick={(e) => removeItem(e, index)}
                            >
                              Remove
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right px-3">Rs. {item.price}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-1 bg-white rounded-lg w-full py-2 pl-2 text-xs">
          <div>Note :</div>
          <div>{order.cookingRequest ? order.cookingRequest : "No note"}</div>
        </div>
        <div className="flex justify-between">
          <div
            onClick={() =>
              setDropdownStatus(dropdownStatus === "paid" ? null : "paid")
            }
            className="font-montserrat-500 px-4 py-2 uppercase bg-[#008D3899] rounded-xl cursor-pointer relative"
          >
            <div className="px-7">Paid</div>
            {dropdownStatus === "paid" && (
              <div className="absolute w-full -left-0 top-9 text-sm font-montserrat-400 capitalize bg-white shadow-md mt-1 rounded-2xl overflow-hidden">
                {paymentMethods.map(({ name, logo }) => (
                  <>
                    <div
                      key={name}
                      onClick={() =>
                        handleStatusUpdate("paid", name.toLowerCase())
                      }
                      className="px-6 py-1.5 cursor-pointer hover:bg-gray flex items-center gap-2"
                    >
                      <img src={logo} alt={name} className="w-3 h-3" />
                      <div>{name}</div>
                    </div>
                    <hr className="h-0.5 bg-user_blue"></hr>
                  </>
                ))}
                <div
                  onClick={() => setDropdownStatus(null)}
                  className="px-6 py-1.5 cursor-pointer hover:bg-gray text-center text-red flex items-center gap-2"
                >
                  <FaTimes className="h-3 w-3" />
                  <div>Cancel</div>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() =>
              setDropdownStatus(dropdownStatus === "cancel" ? null : "cancel")
            }
            className="font-montserrat-500 px-4 py-2 uppercase bg-[#FF000099] rounded-xl cursor-pointer relative"
          >
            <div className="px-4">Cancel</div>
            {dropdownStatus === "cancel" && (
              <div className="absolute w-full -left-0 top-9 text-sm font-montserrat-400 capitalize bg-white shadow-md mt-1 rounded-xl overflow-hidden">
                <div
                  onClick={() => handleStatusUpdate("cancelled")}
                  className="px-6 py-1.5 cursor-pointer hover:bg-gray flex items-center gap-2"
                >
                  <FaCheck className="h-3 w-3 text-green" />
                  <div>Confirm</div>
                </div>
                <hr className="h-0.5 bg-user_blue"></hr>
                <div
                  onClick={() => setDropdownStatus(null)}
                  className="px-6 py-1.5 cursor-pointer hover:bg-gray text-red flex items-center gap-2"
                >
                  <FaTimes className="h-3 w-3" />
                  <div>Cancel</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
