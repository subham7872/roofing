import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { Financing } from './components/Financing';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Process />
      <ImageAnalyzer />
      <Financing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;
