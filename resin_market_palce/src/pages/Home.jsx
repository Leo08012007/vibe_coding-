import React from 'react';
import HeroCanvas from '../components/HeroCanvas';
import Collections from '../components/Collections';
import CustomOrders from '../components/CustomOrders';
import About from '../components/About';
import Reviews from '../components/Reviews';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main>
      <HeroCanvas />
      <Collections onAddToCart={addToCart} />
      <CustomOrders />
      <About />
      <Reviews />
    </main>
  );
}
