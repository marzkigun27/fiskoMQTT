import React from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import BrokerInfoSection from './components/BrokerInfoSection.jsx';
import MqttVisualFlow from './components/MqttVisualFlow.jsx';
import Esp32GuideSection from './components/Esp32GuideSection.jsx';
import MqttPlayground from './components/MqttPlayground.jsx';
import ContactAndFaq from './components/ContactAndFaq.jsx';

export default function App() {
  return (
    <div className="home min-h-screen bg-black text-white flex flex-col">
      <div className="overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <BrokerInfoSection />
          <MqttVisualFlow />
          <Esp32GuideSection />
          <MqttPlayground />
          <ContactAndFaq />
        </main>
      </div>
    </div>
  );
}
