import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import {
  Wifi,
  WifiOff,
  Plus,
  X,
  Send,
  Trash2,
  Play,
  Square,
  Radio,
  Laptop,
  Server,
} from 'lucide-react';

const mqttLib = mqtt?.connect ? mqtt : mqtt?.default;

function topicMatchesPattern(pattern, topic) {
  if (pattern === '#') return true;
  const pSegs = pattern.split('/');
  const tSegs = topic.split('/');
  for (let i = 0; i < pSegs.length; i++) {
    if (pSegs[i] === '#') return true;
    if (i >= tSegs.length) return false;
    if (pSegs[i] !== '+' && pSegs[i] !== tSegs[i]) return false;
  }
  return pSegs.length === tSegs.length;
}

export default function MqttPlayground() {
  // Connection mode: 'sandbox' (offline/instant local) | 'live' (wss://mqtt.fiskomlab.com:443)
  const [connMode, setConnMode] = useState('sandbox');
  const [brokerUrl, setBrokerUrl] = useState('wss://mqtt.fiskomlab.com:443');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [statusNote, setStatusNote] = useState('Siap uji coba');

  // Custom Topics
  const [subInput, setSubInput] = useState('fiskomlab/iot/tugas1/#');
  const [activeSubs, setActiveSubs] = useState(['fiskomlab/iot/tugas1/#']);
  const [pubTopic, setPubTopic] = useState('fiskomlab/iot/tugas1/sensor');
  const [pubPayload, setPubPayload] = useState(
    JSON.stringify(
      {
        device: 'esp32_kelompok_01',
        suhu_c: 27.4,
        kelembaban: 63.1,
        status: 'OK',
      },
      null,
      2
    )
  );
  const [autoSend, setAutoSend] = useState(false);

  // Logs
  const [logs, setLogs] = useState([]);
  const clientRef = useRef(null);
  const channelRef = useRef(null);
  const subsRef = useRef(activeSubs);
  subsRef.current = activeSubs;

  const appendLog = (dir, topic, payload) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs((prev) => [
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        dir, // 'RX' | 'TX' | 'SYS'
        time,
        topic,
        payload,
      },
      ...prev.slice(0, 49),
    ]);
  };

  // Setup BroadcastChannel for Sandbox multi-tab test
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return undefined;
    const ch = new BroadcastChannel('fiskom_mqtt_playground');
    channelRef.current = ch;
    ch.onmessage = (ev) => {
      if (connMode !== 'sandbox' || status !== 'connected') return;
      const msg = ev.data;
      if (msg?.topic && msg?.payload !== undefined) {
        const matched = subsRef.current.some((pat) => topicMatchesPattern(pat, msg.topic));
        if (matched) appendLog('RX', msg.topic, msg.payload);
      }
    };
    return () => ch.close();
  }, [connMode, status]);

  // Auto-publish interval (every 2 seconds when enabled)
  useEffect(() => {
    if (!autoSend || status !== 'connected') return undefined;
    const timer = setInterval(() => {
      handlePublish(true);
    }, 2000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend, status, pubTopic, pubPayload, connMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) clientRef.current.end(true);
    };
  }, []);

  const handleConnect = () => {
    if (status === 'connected') return;

    if (connMode === 'sandbox') {
      setStatus('connected');
      setStatusNote('Terhubung ke Sandbox Lokal (tanpa akun)');
      appendLog('SYS', 'SANDBOX', 'Mode Sandbox aktif. Silakan buat topik sendiri, Subscribe & Publish.');
      return;
    }

    if (!mqttLib?.connect) {
      setStatus('error');
      setStatusNote('Library MQTT tidak tersedia.');
      return;
    }

    setStatus('connecting');
    setStatusNote(`Menghubungkan ke ${brokerUrl}...`);

    const clientId = `web_fiskom_${Math.random().toString(16).slice(2, 8)}`;
    const opts = {
      clientId,
      clean: true,
      keepalive: 60,
      connectTimeout: 8000,
      reconnectPeriod: 0,
    };
    if (username.trim()) opts.username = username.trim();
    if (password) opts.password = password;

    try {
      const client = mqttLib.connect(brokerUrl.trim(), opts);
      clientRef.current = client;

      client.on('connect', () => {
        setStatus('connected');
        setStatusNote(`Terhubung ke ${brokerUrl}`);
        appendLog('SYS', 'BROKER', `Terhubung sebagai ${clientId}`);
        subsRef.current.forEach((t) => client.subscribe(t));
      });

      client.on('message', (topic, buf) => {
        appendLog('RX', topic, buf.toString());
      });

      client.on('error', (err) => {
        setStatus('error');
        setStatusNote(err?.message || 'Autentikasi / koneksi gagal');
        appendLog('SYS', 'ERROR', err?.message || 'Gagal terhubung ke broker mqtt.fiskomlab.com');
        client.end(true);
      });

      client.on('close', () => {
        setAutoSend(false);
        setStatus((prev) => (prev === 'error' ? 'error' : 'disconnected'));
      });
    } catch (e) {
      setStatus('error');
      setStatusNote(e.message);
    }
  };

  const handleDisconnect = () => {
    setAutoSend(false);
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }
    setStatus('disconnected');
    setStatusNote('Koneksi diputuskan');
    appendLog('SYS', 'SYSTEM', 'Koneksi ditutup oleh pengguna.');
  };

  const handleAddSubscribe = (e) => {
    e.preventDefault();
    const t = subInput.trim();
    if (!t) return;
    if (!activeSubs.includes(t)) {
      setActiveSubs((prev) => [...prev, t]);
      if (connMode === 'live' && status === 'connected' && clientRef.current) {
        clientRef.current.subscribe(t);
      }
      appendLog('SYS', 'SUBSCRIBE', `Berlangganan topik baru: ${t}`);
    }
    setSubInput('');
  };

  const handleRemoveSub = (topic) => {
    setActiveSubs((prev) => prev.filter((item) => item !== topic));
    if (connMode === 'live' && status === 'connected' && clientRef.current) {
      clientRef.current.unsubscribe(topic);
    }
  };

  const handlePublish = (isAuto = false) => {
    const topic = pubTopic.trim();
    if (!topic) return;
    if (status !== 'connected') {
      appendLog('SYS', 'WARN', 'Klik "Hubungkan Sekarang" terlebih dahulu sebelum Publish.');
      return;
    }

    let outgoing = pubPayload;
    if (isAuto) {
      try {
        const parsed = JSON.parse(pubPayload);
        if (typeof parsed === 'object' && parsed !== null) {
          parsed.suhu_c = +(25 + Math.random() * 4).toFixed(1);
          parsed.kelembaban = +(58 + Math.random() * 12).toFixed(1);
          parsed.timestamp = new Date().toISOString();
          outgoing = JSON.stringify(parsed, null, 2);
        }
      } catch (_) {
        outgoing = `${pubPayload} [${new Date().toLocaleTimeString('id-ID')}]`;
      }
    }

    appendLog('TX', topic, outgoing);

    if (connMode === 'sandbox') {
      const matched = subsRef.current.some((pat) => topicMatchesPattern(pat, topic));
      if (matched) {
        setTimeout(() => appendLog('RX', topic, outgoing), 45);
      }
      channelRef.current?.postMessage({ topic, payload: outgoing });
    } else if (clientRef.current) {
      clientRef.current.publish(topic, outgoing);
    }
  };

  const loadPresetTopicAndPayload = (preset) => {
    if (preset === 'dht') {
      setPubTopic('fiskomlab/iot/tugas1/dht22');
      setPubPayload(JSON.stringify({ device: 'esp32_dht22', suhu: 28.2, kelembaban: 65.0 }, null, 2));
    } else if (preset === 'relay') {
      setPubTopic('fiskomlab/iot/tugas1/relay');
      setPubPayload(JSON.stringify({ lampu_lab: 'ON', pompa: 'OFF' }, null, 2));
    } else {
      setPubTopic('fiskomlab/iot/tugas1/catatan');
      setPubPayload('Halo dari uji coba MQTT Lab Fiskom!');
    }
  };

  return (
    <section id="mqtt-playground" className="relative py-20 md:py-28 px-4 md:px-8 bg-[#050612] border-t border-white/10 overflow-hidden">
      {/* Ambient Glassmorphism Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-24 -left-24 w-96 h-96 rounded-full opacity-55"
          style={{ background: 'radial-gradient(circle at 30% 30%, #f472b6 0%, #8b5cf6 50%, #22d3ee 100%)' }}
        />
        <div
          className="absolute bottom-12 -right-24 w-[450px] h-80 rounded-[46%] rotate-[-12deg] opacity-55"
          style={{ background: 'linear-gradient(135deg, #f472b6 0%, #c026d3 38%, #6366f1 75%, #2dd4bf 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="feature-fg text-xs text-[#9AACFC] uppercase mb-3">
            LIVE TEST BROKER &amp; CUSTOM TOPIC
          </div>
          <h2 className="text-3xl md:text-[42px] font-[500] bg-gradient-to-b from-white to-[#C1C1C1] bg-clip-text text-transparent md:leading-[50px] mb-4">
            Test MQTT dengan Topik Anda Sendiri
          </h2>
          <p className="text-[#B2B2B2] text-base md:text-lg leading-relaxed">
            Buat topik sendiri, lakukan <em>Subscribe</em>, dan uji pengiriman payload secara langsung. Gunakan <strong>Sandbox Kampus</strong> untuk coba instan tanpa login, atau hubungkan ke broker riil <span className="font-mono text-white">mqtt.fiskomlab.com</span> dengan akun dari Lab Fiskom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Connection & Topic Builder */}
          <div className="lg:col-span-6 space-y-5">
            {/* Connection Box */}
            <div className="card-gradient p-5 md:p-6">
              <div className="absolute inset-0 z-[2] rounded-[24px] pointer-events-none border-gradient" />
              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">1. Mode &amp; Koneksi Broker</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono ${
                      status === 'connected'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : status === 'error'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-white/5 text-[#B2B2B2] border border-[#2C2C35]'
                    }`}
                  >
                    {status === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {status === 'connected' ? 'TERHUBUNG' : status === 'connecting' ? 'MENGHUBUNGKAN' : status === 'error' ? 'ERROR' : 'TERPUTUS'}
                  </span>
                </div>

                {/* Mode Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-black/45 backdrop-blur-md p-1 rounded-2xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      if (status === 'connected') handleDisconnect();
                      setConnMode('sandbox');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition ${
                      connMode === 'sandbox'
                        ? 'default-gradient text-white'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Sandbox Lokal (Gratis)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (status === 'connected') handleDisconnect();
                      setConnMode('live');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition ${
                      connMode === 'live'
                        ? 'default-gradient text-white'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>Live mqtt.fiskomlab.com</span>
                  </button>
                </div>

                {connMode === 'live' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-white/75 mb-1">URL WebSockets</label>
                      <input
                        type="text"
                        value={brokerUrl}
                        onChange={(e) => setBrokerUrl(e.target.value)}
                        className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-white/75 mb-1">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="dari admin Lab"
                          className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-white/75 mb-1">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••"
                          className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-[#7D7D82] truncate">{statusNote}</span>
                  {status === 'connected' ? (
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="shrink-0 px-5 py-2.5 rounded-full text-xs font-medium bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 transition"
                    >
                      Putuskan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConnect}
                      className="shrink-0 px-5 py-2.5 rounded-full text-xs font-medium text-white default-gradient hover:opacity-90 transition"
                    >
                      Hubungkan Sekarang
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Subscribe & Publish Box */}
            <div className="card-gradient p-5 md:p-6">
              <div className="absolute inset-0 z-[2] rounded-[24px] pointer-events-none border-gradient" />
              <div className="relative z-10 space-y-5">
                {/* Subscribe Builder */}
                <div>
                  <span className="block text-sm font-semibold text-white mb-2">
                    2. Buat Topik Subscribe Sendiri
                  </span>
                  <form onSubmit={handleAddSubscribe} className="flex gap-2">
                    <input
                      type="text"
                      value={subInput}
                      onChange={(e) => setSubInput(e.target.value)}
                      placeholder="contoh: fiskomlab/iot/kelompok2/#"
                      className="flex-1 bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/35 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Subscribe
                    </button>
                  </form>

                  {/* Active Topic Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {activeSubs.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 font-mono text-[11px] text-[#9AACFC]"
                      >
                        <Radio className="w-3 h-3 text-emerald-400" />
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveSub(t)}
                          className="text-white/50 hover:text-rose-400"
                          title="Unsubscribe"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Publish Custom Topic */}
                <div className="pt-4 border-t border-white/15 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">3. Publish ke Topik Sendiri</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => loadPresetTopicAndPayload('dht')}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-[#9AACFC] hover:text-white"
                      >
                        Preset DHT22
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPresetTopicAndPayload('relay')}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-emerald-300 hover:text-white"
                      >
                        Preset Relay
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPresetTopicAndPayload('text')}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-white/75 hover:text-white"
                      >
                        Teks
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={pubTopic}
                    onChange={(e) => setPubTopic(e.target.value)}
                    placeholder="fiskomlab/iot/tugas1/sensor"
                    className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                  />

                  <textarea
                    rows={4}
                    value={pubPayload}
                    onChange={(e) => setPubPayload(e.target.value)}
                    className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none leading-relaxed"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePublish(false)}
                      className="flex-1 py-2.5 px-5 rounded-full text-xs md:text-sm font-medium text-white default-gradient hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Publish Sekarang
                    </button>

                    <button
                      type="button"
                      onClick={() => setAutoSend(!autoSend)}
                      disabled={status !== 'connected'}
                      className={`py-2.5 px-4 rounded-full text-xs font-medium border transition flex items-center gap-1.5 ${
                        autoSend
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-black text-[#B2B2B2] border-[#2C2C35] hover:text-white disabled:opacity-40'
                      }`}
                    >
                      {autoSend ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {autoSend ? 'Stop Auto' : 'Auto 2s'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Console RX/TX */}
          <div className="lg:col-span-6">
            <div className="card-gradient p-5 md:p-6 min-h-[540px] flex flex-col">
              <div className="absolute inset-0 z-[2] rounded-[24px] pointer-events-none border-gradient" />
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#2C2C3580]">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Monitor Trafik RX / TX Real-Time</h3>
                    <p className="text-[11px] text-[#7D7D82]">
                      Pesan yang cocok dengan topik Subscribe Anda tampil di sini
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogs([])}
                    className="px-3 py-1.5 rounded-full text-xs bg-white/[0.06] border border-white/15 text-white/75 hover:text-rose-300 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Bersihkan
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[460px] space-y-2.5 pt-4 pr-1 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="h-72 flex flex-col items-center justify-center text-center text-white/60 font-sans px-6">
                      <Radio className="w-8 h-8 mb-3 text-[#e8b4ff]/70" />
                      <p className="text-sm text-white/85 mb-1">Belum ada lalu lintas pesan MQTT</p>
                      <p className="text-xs">
                        Klik <strong>Hubungkan Sekarang</strong> lalu klik <strong>Publish Sekarang</strong> untuk menguji topik custom Anda.
                      </p>
                    </div>
                  ) : (
                    logs.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border backdrop-blur-md bg-black/40 ${
                          item.dir === 'RX'
                            ? 'border-emerald-400/35'
                            : item.dir === 'TX'
                            ? 'border-[#B181FF]/45'
                            : 'border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px]">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                item.dir === 'RX'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : item.dir === 'TX'
                                  ? 'bg-[#7D35F1]/20 text-[#B181FF]'
                                  : 'bg-white/10 text-[#B2B2B2]'
                              }`}
                            >
                              {item.dir}
                            </span>
                            <span className="text-white truncate">{item.topic}</span>
                          </div>
                          <span className="text-[#7D7D82] shrink-0">{item.time}</span>
                        </div>
                        <pre className="text-[11px] text-[#D1D5DB] whitespace-pre-wrap break-all leading-relaxed">
                          {item.payload}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
