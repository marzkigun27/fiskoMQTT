import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Apa itu MQTT', href: '#mqtt-flow' },
    { label: 'Panduan ESP32', href: '#esp32-guide' },
    { label: 'Test MQTT', href: '#mqtt-playground' },
    { label: 'Kontak Lab', href: '#contact-lab' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-[#07070980] backdrop-blur-[40px] text-white px-4 md:px-6 py-3 md:py-4 z-50 transition-transform duration-300 translate-y-0 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full border border-white/15 bg-white/5 text-white"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a href="#top">
            <h3 className="text-[20px] font-[500] tracking-[-1.5px]">FiskomMQTT!</h3>
          </a>
        </div>

        {/* Desktop Logo + Nav */}
        <div className="hidden md:flex items-center gap-12 w-full">
          <a href="#top">
            <h3 className="text-[20px] md:text-[28px] font-[500] tracking-[-1.5px]">FiskomMQTT!</h3>
          </a>
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                <a
                  href={item.href}
                  className="relative text-gray-300 hover:text-white transition duration-300 group text-[18px] inline-block"
                >
                  {item.label}
                  <span className="absolute left-1/2 bottom-[-5px] w-[80%] h-[2px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 transform -translate-x-1/2" />
                </a>
              </div>
            ))}
          </nav>
        </div>

        {/* Desktop CTA Buttons (matching bubba.ai) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact-lab"
            className="px-6 pt-[20px] pb-[20px] h-[52px] flex items-center justify-center whitespace-nowrap text-[18px] font-[500] rounded-full transition-all duration-300 hover:bg-[#F1F1F1] hover:text-[#070709]"
            style={{ border: '1px solid #F1F1F166' }}
          >
            Daftar User
          </a>

          <div className="relative min-w-[178px] h-[52px]">
            <a
              href="#mqtt-playground"
              className="absolute inset-0 pr-[8px] pl-[24px] py-[6px] flex items-center justify-between gap-3 shadow-[0px_0px_2px_0px_#f1f1f1] rounded-full overflow-hidden group hover:shadow-none transition-opacity duration-300 ease-in-out"
            >
              <div
                className="absolute right-[8px] w-8 h-8 rounded-full transition-transform duration-500 ease-in-out scale-100 group-hover:scale-[15]"
                style={{
                  transformOrigin: 'center center',
                  background:
                    'linear-gradient(135.17deg, #7D35F1 34.71%, #4452DB 42.98%, #2E3CED 61.25%, #005CBE 85.22%)',
                }}
              />
              <div className="relative h-[26px] overflow-hidden z-10">
                <span className="block transform transition-all duration-500 font-medium text-[18px] ease-in-out group-hover:-translate-y-full">
                  Coba GRATIS
                </span>
                <span className="absolute top-0 left-0 w-full transform font-medium text-[18px] translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out text-white">
                  Coba GRATIS
                </span>
              </div>
              <div className="relative w-8 h-8 overflow-hidden z-10">
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                  style={{
                    background:
                      'linear-gradient(135.17deg, #7D35F1 14.71%, #4452DB 37.98%, #2E3CED 61.25%, #005CBE 85.22%)',
                  }}
                >
                  <div className="transform transition-all duration-500 ease-in-out group-hover:translate-x-[150%]">
                    <img alt="Next" width={18} height={18} src="/bubba/Arrow.webp" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center rounded-full bg-transparent">
                  <div className="transform -translate-x-[150%] transition-all duration-500 ease-in-out group-hover:translate-x-0">
                    <img alt="Next" width={18} height={18} src="/bubba/Arrow.webp" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Mobile Quick Action */}
        <a
          href="#mqtt-playground"
          className="md:hidden px-4 py-2 rounded-full text-xs font-medium text-white default-gradient"
        >
          Test MQTT
        </a>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pb-4 pt-2 border-t border-white/10 flex flex-col gap-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-base text-gray-300 hover:text-white px-2 py-1.5"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact-lab"
            onClick={() => setMobileOpen(false)}
            className="mt-1 px-4 py-2.5 text-center rounded-full text-sm font-medium border border-[#F1F1F166] text-white"
          >
            Daftar User Lab Fiskom
          </a>
        </div>
      )}
    </header>
  );
}
