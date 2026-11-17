import React, { useState } from 'react';
import { Copy, Check, Download, Code2, Terminal, Cpu } from 'lucide-react';

export default function Esp32GuideSection() {
  const [activeTab, setActiveTab] = useState('publish');
  const [customTopic, setCustomTopic] = useState('fiskomlab/iot/210501/sensor');
  const [customUser, setCustomUser] = useState('user_nim_kamu');
  const [copied, setCopied] = useState(false);

  const safeTopic = customTopic.trim() || 'fiskomlab/iot/210501/sensor';
  const safeUser = customUser.trim() || 'user_nim_kamu';

  const codePublish = `#include <WiFi.h>
#include <PubSubClient.h>

// 1. Konfigurasi WiFi Kampus / Hotspot
const char* ssid       = "NAMA_WIFI_KAMU";
const char* password   = "PASSWORD_WIFI";

// 2. Konfigurasi Broker FiskomLab
const char* mqtt_server = "mqtt.fiskomlab.com";
const int   mqtt_port   = 1883;
const char* mqtt_user   = "${safeUser}"; // Minta ke Lab Fiskom
const char* mqtt_pass   = "PASSWORD_MQTT_DARI_LAB";
const char* mqtt_topic  = "${safeTopic}";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi terhubung! IP: " + WiFi.localIP().toString());
}

void reconnect() {
  while (!client.connected()) {
    String clientId = "ESP32-${safeUser}-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("Terhubung ke broker mqtt.fiskomlab.com!");
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(client.state());
      Serial.println(" coba lagi 3 detik...");
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (millis() - lastMsg > 2000) { // Kirim tiap 2 detik
    lastMsg = millis();
    float suhu = 26.5 + random(0, 30) / 10.0;
    String payload = "{\\"nim\\":\\"${safeUser}\\",\\"suhu\\":" + String(suhu, 1) + "}";
    client.publish(mqtt_topic, payload.c_str());
    Serial.println("Publish [" + String(mqtt_topic) + "]: " + payload);
  }
}`;

  const codeSubscribe = `#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid        = "NAMA_WIFI_KAMU";
const char* password    = "PASSWORD_WIFI";
const char* mqtt_server = "mqtt.fiskomlab.com";
const int   mqtt_port   = 1883;
const char* mqtt_user   = "${safeUser}";
const char* mqtt_pass   = "PASSWORD_MQTT_DARI_LAB";
const char* sub_topic   = "${safeTopic}/perintah";

const int LED_PIN = 2; // LED internal ESP32 / Pin Relay
WiFiClient espClient;
PubSubClient client(espClient);

// Fungsi otomatis dipanggil saat ada pesan masuk di topik
void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.println("Pesan masuk [" + String(topic) + "]: " + msg);

  if (msg == "ON")  digitalWrite(LED_PIN, HIGH);
  if (msg == "OFF") digitalWrite(LED_PIN, LOW);
}

void reconnect() {
  while (!client.connected()) {
    String clientId = "ESP32-SUB-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      client.subscribe(sub_topic); // Subscribe topik perintah
      Serial.println("Subscribed ke: " + String(sub_topic));
    } else {
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
}`;

  const codeWeb = `import mqtt from 'mqtt'; // atau gunakan CDN mqtt.min.js

const client = mqtt.connect('wss://mqtt.fiskomlab.com:443', {
  username: '${safeUser}',
  password: 'PASSWORD_MQTT_DARI_LAB',
  clientId: 'web_tugas_' + Math.random().toString(16).slice(2, 8),
});

client.on('connect', () => {
  console.log('Terhubung ke broker mqtt.fiskomlab.com!');
  client.subscribe('${safeTopic}');
});

client.on('message', (topic, message) => {
  console.log('Data masuk:', topic, message.toString());
});`;

  const currentCode =
    activeTab === 'publish' ? codePublish : activeTab === 'subscribe' ? codeSubscribe : codeWeb;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadIno = () => {
    const ext = activeTab === 'web' ? 'js' : 'ino';
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiskomlab_mqtt_${activeTab}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="esp32-guide" className="relative py-20 md:py-28 px-4 md:px-8 bg-[#03040d] overflow-hidden">
      {/* Ambient Glassmorphism Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-16 -right-16 w-96 h-96 rounded-full opacity-55"
          style={{ background: 'radial-gradient(circle at 30% 30%, #f472b6 0%, #8b5cf6 50%, #22d3ee 100%)' }}
        />
        <div
          className="absolute bottom-10 -left-24 w-80 h-80 rounded-full opacity-45 blur-xl"
          style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #4452db 55%, #c026d3 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Explanation & Customizer */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="feature-fg text-xs text-[#9AACFC] uppercase mb-3">
                PENERAPAN HARDWARE &amp; KAMPUS
              </div>
              <h2 className="text-3xl md:text-[40px] font-[500] bg-gradient-to-b from-white to-[#C1C1C1] bg-clip-text text-transparent md:leading-[48px] mb-4">
                Cara Pakai di ESP32 dalam 3 Menit
              </h2>
              <p className="text-[#B2B2B2] text-base leading-relaxed">
                Cukup pasang library <code className="text-white font-mono">PubSubClient</code> oleh Nick O&apos;Leary di Arduino IDE, isi kredensial dari Lab Fiskom, dan ESP32 Anda siap mengirim data ke <span className="font-mono text-[#9AACFC]">mqtt.fiskomlab.com</span>.
              </p>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-3">
              {[
                {
                  num: '01',
                  title: 'Install Library PubSubClient',
                  desc: 'Buka Arduino IDE -> Sketch -> Include Library -> Manage Libraries -> cari "PubSubClient".',
                },
                {
                  num: '02',
                  title: 'Minta Username & Password ke Lab Fiskom',
                  desc: 'Hubungi admin / sosial media Lab Fiskom untuk memperoleh akun user tugas IoT Anda.',
                },
                {
                  num: '03',
                  title: 'Tentukan Topik & Upload ke ESP32',
                  desc: 'Sesuaikan topik unik kelompok/NIM Anda di bawah ini agar kode langsung siap upload.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="glass-morphism-card !rounded-2xl overflow-hidden p-4 relative"
                >
                  <span
                    className="pointer-events-none select-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-5xl font-bold text-white/[0.06]"
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>
                  <div className="relative z-10 pr-12">
                    <div className="text-[11px] font-medium text-white/65 mb-1">Langkah {step.num}</div>
                    <h4 className="text-base font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-[#9AACFC]/85 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Code Customizer */}
            <div className="glass-morphism-card p-5 space-y-3.5">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9AACFC]">
                  <Cpu className="w-4 h-4" />
                  <span>Sesuaikan Kode Otomatis</span>
                </div>
                <div>
                  <label className="block text-[11px] text-white/75 mb-1">
                    Topik Tugas / NIM Anda
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="fiskomlab/iot/210501/sensor"
                    className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/75 mb-1">
                    Username MQTT (dari Lab Fiskom)
                  </label>
                  <input
                    type="text"
                    value={customUser}
                    onChange={(e) => setCustomUser(e.target.value)}
                    placeholder="user_nim_kamu"
                    className="w-full bg-black/45 backdrop-blur-md border border-white/15 focus:border-[#7D35F1] rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Code Viewer */}
          <div className="lg:col-span-7">
            <div className="card-gradient overflow-hidden">
              <div className="absolute inset-0 z-[2] rounded-[24px] pointer-events-none border-gradient" />
              <div className="relative z-10">
                {/* Code Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/15 bg-white/[0.04]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'publish', label: 'ESP32 Publish Sensor', icon: Code2 },
                      { id: 'subscribe', label: 'ESP32 Subscribe LED/Relay', icon: Terminal },
                      { id: 'web', label: 'Web React (WSS)', icon: Code2 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          activeTab === tab.id
                            ? 'default-gradient text-white'
                            : 'bg-white/[0.06] text-white/75 hover:text-white border border-white/15'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/15 text-white border border-white/20 transition flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Disalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#9AACFC]" /> Salin
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadIno}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/15 text-white border border-white/20 transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#B181FF]" />
                      {activeTab === 'web' ? '.js' : '.ino'}
                    </button>
                  </div>
                </div>

                {/* Code Block */}
                <pre className="p-5 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed max-h-[520px] bg-black/45">
                  <code>{currentCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
