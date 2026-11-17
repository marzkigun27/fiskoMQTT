import React, { useState } from 'react';
import { MessageCircle, Instagram, Mail, Copy, Check, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah layanan broker mqtt.fiskomlab.com gratis untuk mahasiswa?',
    a: 'Ya, broker ini disediakan gratis oleh Laboratorium Fisika Komputasi (Lab Fiskom) untuk mendukung praktikum, tugas mata kuliah IoT, PKM, maupun skripsi/tugas akhir mahasiswa.',
  },
  {
    q: 'Bagaimana cara mendapatkan username & password untuk menambah user?',
    a: 'Karena akses broker menggunakan sistem autentikasi agar topik antar kelompok tidak bentrok, Anda cukup menghubungi admin atau akun media sosial resmi Lab Fiskom menggunakan format pesan di atas.',
  },
  {
    q: 'Port apa yang dipakai untuk ESP32 dan untuk Web Dashboard?',
    a: 'Untuk mikrokontroler seperti ESP32/ESP8266/Arduino gunakan domain mqtt.fiskomlab.com port TCP 1883. Untuk aplikasi Web (React, HTML/JS) gunakan protokol WebSockets TLS wss://mqtt.fiskomlab.com:443.',
  },
  {
    q: 'Apakah saya bebas membuat nama topik sendiri?',
    a: 'Ya! Setelah akun Anda aktif, Anda bebas membuat topik sesuai kebutuhan proyek. Kami sangat menyarankan format seperti fiskomlab/iot/[nim_atau_kelompok]/[nama_sensor].',
  },
];

export default function ContactAndFaq() {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [keperluan, setKeperluan] = useState('Tugas Mata Kuliah IoT / Praktikum');
  const [reqUser, setReqUser] = useState('');
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const generatedMessage = `Halo Admin Lab Fiskom, saya ingin mengajukan pembuatan user baru untuk broker mqtt.fiskomlab.com:\n- Nama: ${
    nama || '[Nama Lengkap]'
  }\n- NIM / Prodi: ${nim || '[NIM / Program Studi]'}\n- Keperluan: ${keperluan}\n- Usulan Username: ${
    reqUser || '[username_diinginkan]'
  }\nTerima kasih!`;

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(generatedMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 1800);
  };

  return (
    <>
      {/* SECTION KONTAK LAB FISKOM (TAMBAH USER) */}
      <section id="contact-lab" className="relative py-20 md:py-28 px-4 md:px-8 bg-[#03040d] border-t border-white/10 overflow-hidden">
        {/* Ambient Glassmorphism Gradient Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-20 -right-16 w-96 h-96 rounded-full opacity-55"
            style={{ background: 'radial-gradient(circle at 30% 30%, #f472b6 0%, #7d35f1 50%, #22d3ee 100%)' }}
          />
          <div
            className="absolute -bottom-20 left-8 w-80 h-64 rounded-[46%] rotate-[12deg] opacity-45"
            style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #4452db 50%, #e879f9 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Info & Social Channels */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="feature-fg text-xs text-[#B181FF] uppercase mb-3">
                  PENAMBAHAN USER BROKER
                </div>
                <h2 className="text-3xl md:text-[42px] font-[500] bg-gradient-to-b from-white to-[#C1C1C1] bg-clip-text text-transparent md:leading-[50px] mb-4">
                  Butuh Akun User MQTT Baru? Hubungi Lab Fiskom
                </h2>
                <p className="text-[#B2B2B2] text-base md:text-lg leading-relaxed">
                  Layanan ini tidak menggunakan form registrasi otomatis agar server tetap aman dan terdata untuk mahasiswa kampus. Untuk menambahkan user baru, hubungi langsung kontak atau media sosial Lab Fiskom.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(generatedMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-morphism-card overflow-hidden p-5 block min-h-[155px] flex flex-col justify-between"
                >
                  <MessageCircle
                    className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 w-24 h-24 text-white/[0.06]"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <div className="text-[11px] font-medium text-white/70 mb-2">Kontak Langsung</div>
                    <div className="text-lg font-semibold text-white">WhatsApp</div>
                    <div className="text-xs text-[#9AACFC]/85 mt-1">Kirim format pengajuan</div>
                  </div>
                  <div className="relative z-10 text-xs text-emerald-300 font-medium mt-4">
                    Chat Admin &rarr;
                  </div>
                </a>

                <a
                  href="https://instagram.com/fiskomlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-morphism-card overflow-hidden p-5 block min-h-[155px] flex flex-col justify-between"
                >
                  <Instagram
                    className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 w-24 h-24 text-white/[0.06]"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <div className="text-[11px] font-medium text-white/70 mb-2">Sosial Media</div>
                    <div className="text-lg font-semibold text-white">Instagram</div>
                    <div className="text-xs text-[#9AACFC]/85 mt-1">DM akun resmi Lab</div>
                  </div>
                  <div className="relative z-10 text-xs text-white/90 font-mono mt-4">
                    @fiskomlab
                  </div>
                </a>

                <a
                  href={`mailto:lab@fiskomlab.com?subject=${encodeURIComponent(
                    'Permintaan User Broker MQTT FiskomLab'
                  )}&body=${encodeURIComponent(generatedMessage)}`}
                  className="glass-morphism-card overflow-hidden p-5 block min-h-[155px] flex flex-col justify-between"
                >
                  <Mail
                    className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 w-24 h-24 text-white/[0.06]"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <div className="text-[11px] font-medium text-white/70 mb-2">Surat Resmi</div>
                    <div className="text-lg font-semibold text-white">Email Lab</div>
                    <div className="text-xs text-[#9AACFC]/85 mt-1">Request user kelompok</div>
                  </div>
                  <div className="relative z-10 text-xs text-white/90 font-mono truncate mt-4">
                    lab@fiskomlab.com
                  </div>
                </a>
              </div>
            </div>

            {/* Right Message Template Generator */}
            <div className="lg:col-span-6">
              <div className="glass-morphism-card p-6 md:p-7">
                <div className="relative z-10 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Generator Pesan Request User</h3>
                    <p className="text-xs text-white/75 mt-0.5">
                      Isi data singkat di bawah ini lalu salin atau kirim langsung ke DM Instagram / WhatsApp Lab Fiskom.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-white/75 mb-1">Nama Mahasiswa</label>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="contoh: Budi Santoso"
                        className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/75 mb-1">NIM / Program Studi</label>
                      <input
                        type="text"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        placeholder="contoh: 210501 / Fisika"
                        className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/75 mb-1">Keperluan</label>
                      <select
                        value={keperluan}
                        onChange={(e) => setKeperluan(e.target.value)}
                        className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs text-white outline-none"
                      >
                        <option className="bg-[#0b0c1a]">Tugas Mata Kuliah IoT / Praktikum</option>
                        <option className="bg-[#0b0c1a]">Skripsi / Tugas Akhir</option>
                        <option className="bg-[#0b0c1a]">Riset Lab / PKM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-white/75 mb-1">Usulan Username</label>
                      <input
                        type="text"
                        value={reqUser}
                        onChange={(e) => setReqUser(e.target.value)}
                        placeholder="contoh: budi_iot21"
                        className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                    </div>
                  </div>

                  <pre className="bg-black/45 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-xs font-mono text-white/90 whitespace-pre-wrap leading-relaxed">
                    {generatedMessage}
                  </pre>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="w-full py-3 px-6 rounded-full text-sm font-medium text-white default-gradient hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    {copiedMsg ? (
                      <>
                        <Check className="w-4 h-4" /> Format Pesan Berhasil Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Salin Format Pengajuan User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FAQ (Glassmorphism Cards) */}
      <section className="relative py-20 px-4 md:px-8 bg-[#050612] border-t border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -bottom-24 left-1/3 w-96 h-72 rounded-full opacity-35 blur-xl"
            style={{ background: 'linear-gradient(135deg, #7d35f1 0%, #f472b6 50%, #22d3ee 100%)' }}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-[40px] text-center font-[500] bg-gradient-to-b from-white to-[#C1C1C1] bg-clip-text text-transparent mb-10">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="glass-morphism-card px-6 md:px-8 py-2">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className={idx < FAQS.length - 1 ? 'border-b border-white/15' : ''}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex justify-between items-center text-[17px] md:text-[21px] text-left font-medium py-6 group"
                    aria-expanded={isOpen}
                  >
                    <span className="transition-colors duration-200 group-hover:text-white pr-4 text-white/95">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#9AACFC] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-white/75 pb-6 text-[15px] md:text-[17px] leading-relaxed pr-6">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-[#2C2C3580] py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-[24px] font-[500] tracking-[-1.2px] text-white mb-2">
              FiskomMQTT!
            </h3>
            <p className="text-sm text-[#7D7D82] max-w-md">
              Layanan Broker MQTT Kampus (<span className="font-mono text-[#B2B2B2]">mqtt.fiskomlab.com</span>) oleh Laboratorium Fisika Komputasi untuk keperluan praktikum, tugas kuliah, dan riset IoT.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-[#B2B2B2]">
            <a href="#broker-info" className="hover:text-white transition">Endpoint Broker</a>
            <a href="#mqtt-flow" className="hover:text-white transition">Alur MQTT</a>
            <a href="#esp32-guide" className="hover:text-white transition">Kode ESP32</a>
            <a href="#mqtt-playground" className="hover:text-white transition">Test MQTT</a>
            <a href="#contact-lab" className="hover:text-white transition">Kontak Lab</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#2C2C3560] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7D7D82]">
          <span>&copy; {new Date().getFullYear()} FiskomLab IoT Infrastructure.</span>
          <span className="font-mono">Broker Domain: mqtt.fiskomlab.com</span>
        </div>
      </footer>
    </>
  );
}
