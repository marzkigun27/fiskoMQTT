import React, { useState } from 'react';
import { Cpu, Server, MonitorSmartphone, Send, CheckCircle2 } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'dht22',
    label: 'Tugas Sensor Suhu (DHT22)',
    topic: 'fiskomlab/iot/210501/dht22',
    payload: '{"suhu": 28.4, "kelembaban": 64.2, "status": "AMAN"}',
    subMatch: 'fiskomlab/iot/210501/#',
    actionText: 'Dashboard Web menampilkan grafik suhu 28.4°C secara real-time!',
  },
  {
    id: 'relay',
    label: 'Kontrol Lampu / Pompa Kampus',
    topic: 'fiskomlab/iot/kelompok3/pompa',
    payload: '{"perintah": "ON", "durasi_dtk": 10}',
    subMatch: 'fiskomlab/iot/kelompok3/pompa',
    actionText: 'ESP32 menyalakan relay pompa air dalam hitungan milidetik!',
  },
  {
    id: 'viskosimeter',
    label: 'Alat Lab Viskosimeter',
    topic: 'fiskomlab/viskosimeter/telemetry',
    payload: '{"rpm": 300.0, "ina289_ma": 128.4, "viskositas_cp": 60.1}',
    subMatch: 'fiskomlab/viskosimeter/#',
    actionText: 'Subscriber Lab mengonversi arus menjadi nilai viskositas 60.1 cP!',
  },
];

export default function MqttVisualFlow() {
  const [selectedId, setSelectedId] = useState('dht22');
  const [pulsePhase, setPulsePhase] = useState('idle'); // 'idle' | 'toBroker' | 'toSub' | 'done'

  const activeScenario = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  const triggerPacketSimulation = () => {
    if (pulsePhase === 'toBroker' || pulsePhase === 'toSub') return;
    setPulsePhase('toBroker');
    setTimeout(() => setPulsePhase('toSub'), 750);
    setTimeout(() => setPulsePhase('done'), 1550);
    setTimeout(() => setPulsePhase('idle'), 3600);
  };

  return (
    <section id="mqtt-flow" className="relative py-20 md:py-28 px-4 md:px-8 bg-[#050612] border-y border-white/10 overflow-hidden">
      {/* Ambient Glassmorphism Gradient Shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/3 -left-20 w-80 h-80 rounded-full opacity-55"
          style={{ background: 'radial-gradient(circle at 30% 30%, #f472b6 0%, #7d35f1 55%, #06b6d4 100%)' }}
        />
        <div
          className="absolute bottom-8 -right-24 w-[420px] h-72 rounded-[45%] rotate-[-15deg] opacity-50"
          style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #4452db 45%, #e879f9 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="feature-fg text-xs text-[#9AACFC] uppercase mb-3">
            CARA KERJA PROTOKOL MQTT
          </div>
          <h2 className="text-3xl md:text-[42px] font-[500] bg-gradient-to-b from-white to-[#C1C1C1] bg-clip-text text-transparent md:leading-[50px] mb-4">
            Apa Itu MQTT &amp; Bagaimana Alurnya?
          </h2>
          <p className="text-[#B2B2B2] text-base md:text-lg leading-relaxed">
            <strong className="text-white">MQTT (Message Queuing Telemetry Transport)</strong> adalah protokol komunikasi IoT yang sangat ringan berbasis pola <span className="text-[#9AACFC]">Publish / Subscribe</span>. Alat sensor tidak perlu saling tahu alamat IP satu sama lain — cukup kirim ke topik di Broker <span className="font-mono text-white">mqtt.fiskomlab.com</span>.
          </p>
        </div>

        {/* Interactive Scenario Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setSelectedId(sc.id);
                setPulsePhase('idle');
              }}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition border ${
                selectedId === sc.id
                  ? 'default-gradient text-white border-transparent shadow-lg'
                  : 'bg-[#131318] text-[#B2B2B2] border-[#2C2C35] hover:text-white'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Visual Diagram Card */}
        <div className="card-gradient p-6 md:p-10">
          <div className="absolute inset-0 z-[2] rounded-[24px] pointer-events-none border-gradient" />
          <div className="relative z-10">
            {/* 3 Nodes + Animated Connectors */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
              {/* NODE 1: PUBLISHER */}
              <div
                className={`lg:col-span-3 relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  pulsePhase === 'toBroker'
                    ? 'glass-subpanel border-[#B181FF] shadow-[0_0_25px_rgba(125,53,241,0.3)]'
                    : 'glass-subpanel'
                }`}
              >
                <Cpu
                  className="pointer-events-none absolute -right-3 top-4 w-20 h-20 text-white/[0.06]"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="text-[11px] font-medium text-white/65 mb-1.5">Langkah 01</div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">Publisher (ESP32)</h3>
                  <p className="text-xs text-[#9AACFC]/85 mb-3.5 leading-relaxed">
                    Mikrokontroler membaca sensor lalu mengirim (<em>Publish</em>) data ke topik tertentu.
                  </p>
                  <div className="bg-black/45 backdrop-blur-md border border-white/15 rounded-xl p-2.5 font-mono text-[11px]">
                    <div className="text-white/50">Topik Publish:</div>
                    <div className="text-[#9AACFC] truncate">{activeScenario.topic}</div>
                    <div className="text-white/50 mt-1.5">Payload:</div>
                    <div className="text-emerald-300 break-all">{activeScenario.payload}</div>
                  </div>
                </div>
              </div>

              {/* CONNECTOR 1 -> 2 */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="w-full h-1.5 lg:h-1 bg-white/15 rounded-full relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${
                      pulsePhase === 'toBroker'
                        ? 'w-full bg-gradient-to-r from-[#7D35F1] to-[#38BDF8]'
                        : pulsePhase === 'toSub' || pulsePhase === 'done'
                        ? 'w-full bg-[#7D35F1]/50'
                        : 'w-0'
                    }`}
                  />
                </div>
                <span className="feature-fg text-[10px] text-[#9AACFC] mt-2 text-center">
                  PUBLISH &rarr;
                </span>
              </div>

              {/* NODE 2: BROKER */}
              <div
                className={`lg:col-span-3 relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  pulsePhase === 'toBroker' || pulsePhase === 'toSub'
                    ? 'glass-subpanel border-[#7481FF] shadow-[0_0_30px_rgba(46,60,237,0.35)]'
                    : 'glass-subpanel'
                }`}
              >
                <Server
                  className="pointer-events-none absolute -right-3 top-4 w-20 h-20 text-white/[0.06]"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="text-[11px] font-medium text-[#9AACFC] mb-1.5">Langkah 02</div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">Broker MQTT</h3>
                  <p className="text-xs text-[#9AACFC]/85 mb-3.5 leading-relaxed">
                    Server pusat Lab Fiskom menerima pesan dan mencocokkan topik untuk diteruskan ke subscriber.
                  </p>
                  <div className="bg-black/45 backdrop-blur-md border border-white/20 rounded-xl p-2.5 font-mono text-[11px] text-center">
                    <div className="text-[#e8b4ff] font-semibold">mqtt.fiskomlab.com</div>
                    <div className="text-white/55 mt-1">Routing Topic Matcher</div>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {pulsePhase === 'toBroker'
                        ? 'Menerima Publish...'
                        : pulsePhase === 'toSub'
                        ? 'Meneruskan ke Subscriber...'
                        : 'Siap Merutekan Pesan'}
                    </div>
                  </div>
                </div>
              </div>

              {/* CONNECTOR 2 -> 3 */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="w-full h-1.5 lg:h-1 bg-white/15 rounded-full relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${
                      pulsePhase === 'toSub'
                        ? 'w-full bg-gradient-to-r from-[#38BDF8] to-[#10B981]'
                        : pulsePhase === 'done'
                        ? 'w-full bg-emerald-500/60'
                        : 'w-0'
                    }`}
                  />
                </div>
                <span className="feature-fg text-[10px] text-emerald-400 mt-2 text-center">
                  DELIVER &rarr;
                </span>
              </div>

              {/* NODE 3: SUBSCRIBER */}
              <div
                className={`lg:col-span-3 relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  pulsePhase === 'done'
                    ? 'glass-subpanel border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.28)]'
                    : 'glass-subpanel'
                }`}
              >
                <MonitorSmartphone
                  className="pointer-events-none absolute -right-3 top-4 w-20 h-20 text-white/[0.06]"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="text-[11px] font-medium text-emerald-300 mb-1.5">Langkah 03</div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">Subscriber (Web / HP)</h3>
                  <p className="text-xs text-[#9AACFC]/85 mb-3.5 leading-relaxed">
                    Dashboard web, aplikasi mobile, atau ESP32 lain yang <em>Subscribe</em> ke topik menerima data secara instan.
                  </p>
                  <div className="bg-black/45 backdrop-blur-md border border-white/15 rounded-xl p-2.5 font-mono text-[11px]">
                    <div className="text-white/50">Subscribe Pattern:</div>
                    <div className="text-emerald-300 truncate">{activeScenario.subMatch}</div>
                    <div className="text-white/75 mt-1.5 font-sans text-[11px] flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pulsePhase === 'done' ? activeScenario.actionText : 'Menunggu paket masuk...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Action Footer */}
            <div className="mt-8 pt-6 border-t border-[#2C2C3580] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs md:text-sm text-[#B2B2B2] text-center md:text-left">
                <strong className="text-white">Tips Penamaan Topik Kampus:</strong> Gunakan format{' '}
                <code className="px-2 py-0.5 rounded bg-black border border-[#2C2C35] text-[#9AACFC] font-mono">
                  fiskomlab/iot/[nim_atau_kelompok]/[sensor]
                </code>{' '}
                agar data antar kelompok praktikum tetap rapi.
              </div>
              <button
                type="button"
                onClick={triggerPacketSimulation}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white default-gradient hover:opacity-90 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Simulasikan Kirim Paket Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
