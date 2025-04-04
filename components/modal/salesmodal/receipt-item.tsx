'use client';

import {
  removeFromCart,
  updateQuantity,
} from '@/redux/features/product/product.slice';
import { useAppDispatch } from '@/redux/hooks';
import { AppDispatch, RootState } from '@/redux/store';
import { Product } from '@/types/product';
import { Minus, Plus } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface ReceiptItemProps {
  stockItem: Product;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ stockItem }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === stockItem.id)
  );
  const [inputValue, setInputValue] = useState(cartItem?.quantity || 1 || '');

  useEffect(() => {
    if(cartItem) {
    setInputValue(cartItem.quantity);
  }
 }, [cartItem?.quantity]);

  if (!cartItem) {
    return null;
  }

  const handleDecreaseQuantity = () => {
    if (cartItem.quantity > 1) {
      dispatch(
        updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 })
      );
    } else {
      dispatch(removeFromCart(cartItem.id));
    }
    setInputValue(cartItem.quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (cartItem.quantity < cartItem.availableQuantity) {
      dispatch(
        updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 })
      );
      setInputValue(cartItem.quantity + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow the field to be empty temporarily
    if (value === '') {
      setInputValue(''); // Keep it empty for a better user experience
      return;
    }

    // Convert to a number
    const newQuantity = Number(value);

    if (!isNaN(newQuantity)) {
      if (newQuantity < 1) {
        dispatch(removeFromCart(cartItem.id));
        return;
      }

      if (newQuantity <= cartItem.availableQuantity) {
        setInputValue(newQuantity);
        dispatch(updateQuantity({ id: cartItem.id, quantity: newQuantity }));
      } else {
        setInputValue(cartItem.availableQuantity); // Prevent exceeding max
      }
    }
  };

  return (
    <div className='flex items-center justify-between py-2'>
      <span className='font-sans text-sm  md:text-xl font-medium leading-5 md:leading-8 text-[#2A2A2A] tracking-normal'>
        {stockItem.name}
      </span>
      <div className='flex items-center gap-4'>
        <span className='font-sans text-xs md:text-lg font-medium leading-7 tracking-normal'>
          ₦ {stockItem.selling_price || stockItem.current_price[0]?.NGN[0]}
        </span>
        <div className='flex items-center gap-1.5'>
          <button
            type='button'
            onClick={handleDecreaseQuantity}
            className='w-7 h-7 md:w-10 md:h-10 rounded-lg cursor-pointer border border-[#0063CC] flex items-center justify-center md:p-[15px] hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Minus size={16} />
          </button>
          <input
            type='number'
            value={inputValue}
            onChange={handleChange}
            min={1}
            max={cartItem.availableQuantity}
            className='w-7 h-7 md:w-10 md:h-10 rounded-lg border border-gray-300 flex items-center justify-center text-center font-sans md:text-lg font-medium leading-7 tracking-normal text-sm [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance:textfield]'
          />

          <button
            type='button'
            onClick={handleIncreaseQuantity}
            disabled={cartItem.quantity >= cartItem.availableQuantity}
            className='w-7 h-7 md:w-10 md:h-10 rounded-lg cursor-pointer border border-[#0063CC] flex items-center justify-center md:p-[15px] hover:bg-gray-100 transition-colors'
          >
            <Plus size={16} className='text-black w-2 md:w-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptItem;
