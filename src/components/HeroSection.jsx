import React from 'react';
import InteractiveAtomLogo from './InteractiveAtomLogo';

const HERO_FEATURES = [
  '24x7 BROKER AKTIF',
  'MQTT.FISKOMLAB.COM',
  'KHUSUS TUGAS IOT KAMPUS',
  'SUPPORT ESP32 & WEB',
  'BEBAS RIBET',
];

export default function HeroSection() {
  return (
    <div id="top" className="relative min-h-screen overflow-hidden bg-[#000000]">
      {/* Atmospheric Purple-Blue Gradient Glow (exact clone of bubba.ai) */}
      <div
        className="absolute left-0 top-[34%] h-[400px] w-full md:top-[33%] md:h-[600px]"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(1, 1, 1, 0) 0%,
            rgba(66, 30, 111, 0.04) 2%,
            rgba(66, 30, 111, 0.10) 8%,
            rgba(66, 30, 111, 0.08) 15%,
            rgba(66, 30, 111, 0.12) 18%,
            rgba(5, 13, 84, 0.18) 35%,
            rgba(5, 13, 84, 0.22) 50%,
            rgba(33, 15, 76, 0.24) 65%,
            rgba(33, 15, 76, 0.18) 75%,
            rgba(33, 15, 76, 0.15) 85%,
            rgba(33, 15, 76, 0.11) 90%,
            rgba(33, 15, 76, 0.04) 95%,
            rgba(1, 1, 1, 0) 100%
          )`,
          transform: 'translateZ(0)',
          willChange: 'transform',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 px-4 md:px-8">
        <div className="flex flex-col items-center justify-center pt-20 md:pt-20">
          {/* Interactive Blue Atom Cloud Logo Container with seamless ambient glow */}
          <div className="relative mb-6 md:mb-8 flex items-center justify-center">
            {/* Soft radial blue-indigo glow behind atom cloud to blend naturally into hero background */}
            <div
              className="pointer-events-none absolute -inset-12 rounded-full opacity-80 blur-[95px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.20) 42%, rgba(0, 0, 0, 0) 76%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-[1]">
              <InteractiveAtomLogo />
            </div>
          </div>

          {/* Headline + Subheadline centered overlapping with the Blue Atom Cloud */}
          <div className="pointer-events-none relative z-[5] mt-[-235px] max-w-4xl text-center sm:mt-[-285px] md:mt-[-330px]">
            {/* Subtle radial dark scrim directly behind headline/subtitle for crisp contrast over blue orbits */}
            <div
              className="pointer-events-none absolute -inset-x-8 -top-6 bottom-24 -z-10 rounded-full blur-xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.28) 52%, rgba(0, 0, 0, 0) 78%)',
              }}
              aria-hidden="true"
            />

            <h1 className="mb-4 bg-gradient-to-b from-white to-[#BEBEBE] bg-clip-text pt-[20px] text-[36px] font-[400] leading-[40px] text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] md:mb-6 md:pt-0 md:text-[52px] md:leading-[56px]">
              Meet FiskoMQTT,
              <br />
              Broker IoT untuk Tugas Kampus
            </h1>

            <p className="mx-auto max-w-[370px] text-center text-lg font-[400] text-[#D1D5DB] drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] md:mb-12 md:max-w-[430px] md:text-xl">
              Kirim, pantau &amp; uji data sensor — siap untuk kuliah &amp; skripsi. Cukup pakai{' '}
              <span className="pointer-events-auto font-[600] text-[#f1f1f1]">mqtt.fiskomlab.com</span>
            </p>

            {/* Dual CTA Row */}
            <div className="pointer-events-auto relative z-20 mb-10 flex w-full flex-row items-center justify-center gap-4 pt-12 md:pt-8">
              {/* Mobile Secondary CTA */}
              <a
                href="#contact-lab"
                className="flex h-[56px] flex-1 items-center justify-center whitespace-nowrap rounded-[40px] px-4 py-4 text-[16px] font-medium text-white transition-all duration-300 hover:bg-[#F1F1F1] hover:text-[#070709] md:hidden"
                style={{ border: '1px solid #F1F1F166' }}
              >
                Daftar User
              </a>

              {/* Primary Gradient CTA */}
              <a
                href="#mqtt-playground"
                className="group relative inline-flex h-[56px] flex-1 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[40px] px-6 py-2 text-lg font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0px_4px_16px_0px_#00000066] md:w-[240px] md:flex-none"
              >
                <div
                  className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                  style={{
                    background:
                      'linear-gradient(135.17deg, #7D35F1 1.89%, #4452DB 29.39%, #2E3CED 56.89%, #005CBE 85.23%)',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(132.52deg, #B181FF 1.8%, #7481FF 31.79%, #4E5BF5 61.77%, #1264BA 92.67%)',
                  }}
                />
                <div className="gradient-flow-bg absolute inset-0 overflow-hidden" />
                <span className="relative z-10 text-[16px] font-medium md:text-[18px]">
                  Test MQTT Live
                </span>
                <svg
                  className="relative z-10 h-[1.75rem] w-[1.75rem] transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>

              {/* Secondary Glassmorphic Pill Button (exact clone of .talk-to-bubba-btn) */}
              <a
                href="#contact-lab"
                className="talk-to-bubba-btn group hidden h-[58px] w-[241px] flex-row items-center justify-between rounded-[40px] px-2 py-2 text-lg font-medium text-white md:flex"
              >
                <div className="relative h-10 w-10">
                  <img
                    alt="Hubungi Lab Icon"
                    width={40}
                    height={40}
                    className="absolute h-10 w-10 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    src="/bubba/mic.webp"
                  />
                  <img
                    alt=""
                    aria-hidden="true"
                    width={40}
                    height={40}
                    className="absolute h-10 w-10 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    src="/bubba/Michover.webp"
                  />
                </div>
                <span className="flex-1 text-center">Hubungi Lab Fiskom</span>
              </a>
            </div>
          </div>

          {/* Bottom Feature Ticker (Mobile Marquee + Desktop Centered Row) */}
          <div className="relative z-10 w-full overflow-hidden pt-[28px] md:pt-0">
            {/* Mobile Marquee */}
            <div className="hero-feature-marquee relative z-10 w-full overflow-hidden pt-0 md:hidden">
              <div className="hero-feature-marquee-track flex w-max whitespace-nowrap py-6">
                {[...HERO_FEATURES, ...HERO_FEATURES, ...HERO_FEATURES].map((feat, idx) => (
                  <span key={idx} className="inline-flex items-center">
                    <span className="inline-flex w-auto items-center px-2">
                      <img alt="" width={20} height={20} className="!max-w-none h-6 w-6" src="/bubba/Live.webp" />
                    </span>
                    <span className="inline-flex min-w-fit items-center px-4">
                      <span className="feature-fg text-center text-[16px] font-[400] text-[#f1f1f1]">
                        {feat}
                      </span>
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop Row */}
            <div className="hidden justify-center gap-4 py-10 md:flex flex-wrap">
              {HERO_FEATURES.map((feat, idx) => (
                <div key={feat} className="flex flex-row items-center gap-4 text-center">
                  {idx > 0 && (
                    <img alt="" width={20} height={20} className="h-5 w-5" src="/bubba/Live.webp" />
                  )}
                  <span className="feature-fg text-lg font-medium text-[#f1f1f1]">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
