import React, { useState } from 'react';
import { Copy, Check, Server, Cpu, Globe, ShieldCheck, GraduationCap } from 'lucide-react';

const ENDPOINTS = [
  {
    icon: Server,
    tag: 'Broker Host',
    label: 'Domain Utama',
    value: 'mqtt.fiskomlab.com',
    desc: 'Host resmi broker Mosquitto Laboratorium Fisika Komputasi.',
    footer: 'Mosquitto v2 / TLS Ready',
  },
  {
    icon: Cpu,
    tag: 'Mikrokontroler',
    label: 'Port TCP (ESP32)',
    value: '1883',
    desc: 'Digunakan oleh library PubSubClient, ESP-IDF, atau Python Paho.',
    footer: 'Standard MQTT TCP',
  },
  {
    icon: Globe,
    tag: 'Web & React',
    label: 'WebSockets TLS',
    value: 'wss://mqtt.fiskomlab.com:443',
    desc: 'Koneksi aman port 443 untuk dashboard web & React client.',
    footer: 'HTTPS / WSS Port 443',
  },
];

const CAMPUS_BENEFITS = [
  {
    icon: GraduationCap,
    tag: 'FiskomLab',
    title: 'Tugas IoT Kampus',
    desc: 'Praktikum sensor, proyek kuliah mikrokontroler, PKM, hingga skripsi mahasiswa.',
    footer: 'Gratis / Akademik',
  },
  {
    icon: Cpu,
    tag: 'Hardware',
    title: 'Siap di ESP32',
    desc: 'Langsung arahkan setServer("mqtt.fiskomlab.com", 1883) tanpa sewa VPS cloud.',
    footer: 'PubSubClient / Arduino',
  },
  {
    icon: Globe,
    tag: 'Browser',
    title: 'Web Real-Time',
    desc: 'WebSockets port 443 memungkinkan dashboard HTML/React memantau sensor live.',
    footer: 'WSS / Port 443',
  },
  {
    icon: ShieldCheck,
    tag: 'Keamanan',
    title: 'User Terkelola',
    desc: 'Autentikasi username & password menjaga trafik topik tugas agar tetap aman.',
    footer: 'Managed / Lab Fiskom',
  },
];

export default function BrokerInfoSection() {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (key, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section id="broker-info" className="relative py-20 md:py-28 px-4 md:px-8 bg-[#03040d] overflow-hidden">
      {/* Ambient Glassmorphism Backdrop Orbs for entire BrokerInfoSection */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-28 -left-24 w-96 h-96 rounded-full opacity-45 blur-xl"
          style={{ background: 'radial-gradient(circle at 35% 35%, #f472b6 0%, #7d35f1 50%, #06b6d4 100%)' }}
        />
        <div
          className="absolute top-44 -right-20 w-[420px] h-[420px] rounded-full opacity-40 blur-xl"
          style={{ background: 'radial-gradient(circle at 30% 30%, #22d3ee 0%, #4452db 50%, #c026d3 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="feature-fg text-xs text-[#9AACFC] uppercase">
              ENDPOINT LAYANAN BROKER
            </span>
          </div>
          <h2 className="text-3xl md:text-[42px] font-[500] bg-gradient-to-b from-white to-[#C1C1C1] bg-clip-text text-transparent md:leading-[50px] mb-4">
            Satu Domain Broker untuk Semua Proyek IoT Kuliah Anda
          </h2>
          <p className="text-[#B2B2B2] text-base md:text-lg leading-relaxed">
            Tidak perlu repot menyewa server atau mengonfigurasi broker dari nol. Hubungkan perangkat ESP32 dan dashboard monitoring ke domain resmi Lab Fiskom.
          </p>
        </div>

        {/* Broker Address Highlight Cards (Watermark Layout + Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {ENDPOINTS.map((ep) => {
            const EpIcon = ep.icon;
            return (
              <div key={ep.label} className="glass-morphism-card overflow-hidden p-6 md:p-7 flex flex-col justify-between min-h-[210px]">
                {/* Subtle Watermark Icon on Right */}
                <EpIcon
                  className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 w-28 h-28 text-white/[0.06]"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-white/75 mb-3">{ep.tag}</div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight font-mono break-all">
                      {ep.value}
                    </h3>
                    <p className="text-sm text-[#9AACFC]/85 mt-1.5 leading-relaxed max-w-[85%]">
                      {ep.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-white/60">
                      <strong className="text-white font-medium">{ep.label}</strong> / {ep.footer}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ep.label, ep.value)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9AACFC] hover:text-white transition"
                      title="Salin"
                    >
                      {copiedKey === ep.label ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice Banner: Request User via Lab Fiskom */}
        <div className="mb-14 glass-morphism-card p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <div className="feature-fg text-xs text-[#e8b4ff] uppercase mb-1">
              AKSES AKUN &amp; PENAMBAHAN USER
            </div>
            <h3 className="text-lg md:text-xl font-medium text-white mb-1">
              Ingin memakai broker <span className="font-mono text-[#9AACFC]">mqtt.fiskomlab.com</span> untuk tugas IoT?
            </h3>
            <p className="text-sm md:text-base text-white/75">
              Broker menggunakan sistem user terdaftar agar aman saat praktikum. Hubungi sosial media atau admin Lab Fiskom untuk dibuatkan akun user gratis.
            </p>
          </div>
          <a
            href="#contact-lab"
            className="shrink-0 px-6 py-3.5 rounded-full text-sm md:text-base font-medium text-white default-gradient hover:opacity-95 transition whitespace-nowrap shadow-lg"
          >
            Minta Akun ke Lab Fiskom &rarr;
          </a>
        </div>

        {/* 4 Benefit Cards (Glassmorphism style with vibrant atmospheric blobs behind glass) */}
        <div className="relative rounded-[32px] p-4 sm:p-6 md:p-8 overflow-hidden bg-[#060714]/90 border border-white/10">
          {/* Decorative Gradient Spheres & Glass Shapes Behind Cards */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Top-left large vibrant purple -> cyan orb */}
            <div
              className="absolute -top-20 -left-16 w-72 h-72 rounded-full opacity-85"
              style={{
                background:
                  'radial-gradient(circle at 30% 25%, #ff8fd4 0%, #8b5cf6 45%, #22d3ee 100%)',
              }}
            />
            {/* Bottom-right magenta -> violet organic glow */}
            <div
              className="absolute -bottom-24 right-4 w-96 h-72 rounded-[48%] rotate-[-14deg] opacity-85"
              style={{
                background:
                  'linear-gradient(135deg, #f472b6 0%, #c026d3 38%, #6366f1 75%, #2dd4bf 100%)',
              }}
            />
            {/* Center-bottom soft cyan/indigo wave */}
            <div
              className="absolute bottom-[-60px] left-[30%] w-64 h-44 rounded-full opacity-55 blur-xl"
              style={{
                background: 'linear-gradient(135deg, #7d35f1 0%, #06b6d4 100%)',
              }}
            />
            {/* Floating mini glass square accent top-left */}
            <div
              className="hidden md:block absolute top-6 left-[20%] w-16 h-16 rounded-2xl border border-white/25 shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.03))',
                backdropFilter: 'blur(14px)',
              }}
            />
            {/* Floating mini orb right */}
            <div
              className="hidden md:block absolute top-12 right-[6%] w-20 h-20 rounded-full border border-white/20 shadow-lg opacity-80"
              style={{
                background:
                  'linear-gradient(145deg, rgba(129,140,248,0.55), rgba(30,27,75,0.4))',
              }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAMPUS_BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="glass-morphism-card overflow-hidden p-6 flex flex-col justify-between min-h-[210px]"
                >
                  {/* Subtle Watermark Icon on Right (no stacked box) */}
                  <Icon
                    className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 w-28 h-28 text-white/[0.06]"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex flex-col h-full justify-between gap-5">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-3">{item.tag}</div>
                      <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#9AACFC]/85 max-w-[88%]">
                        {item.desc}
                      </p>
                    </div>

                    <div className="text-xs text-white/55">
                      <span className="text-white/90 font-medium">{item.footer.split(' / ')[0]}</span>
                      {item.footer.includes(' / ') && (
                        <span> / {item.footer.split(' / ')[1]}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
