'use client'

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

// SSR Güvenli Harita Yükleme
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })

// --- TÜM VERİ SETLERİ ---
const BIRA_DATA = [
  { id: 1, name: 'YukarıOda', pos: [40.9901, 29.0232], price: '60', type: 'Bar', addedBy: 'Ayhan', timeAgo: '34dk' },
  { id: 2, name: 'KarşıBar', pos: [41.0428, 29.0075], price: '80', type: 'Bar', addedBy: 'Zeynep', timeAgo: '2sa' },
  { id: 3, name: 'SarıKöpük', pos: [41.0250, 28.9850], price: '110', type: 'Bar', addedBy: 'Selin', timeAgo: '3g' },
];

const KAHVE_DATA = [
  { id: 4, name: 'MorKahve', pos: [41.0350, 28.9780], price: '45', type: 'Cafe', addedBy: 'Burak', timeAgo: '12dk' },
  { id: 5, name: 'AkıncıKafe', pos: [41.0600, 28.9870], price: '55', type: 'Cafe', addedBy: 'Elif', timeAgo: '5sa' },
  { id: 6, name: 'TaşFırın', pos: [41.0220, 28.9820], price: '65', type: 'Cafe', addedBy: 'Can', timeAgo: '2g' },
];

const TREND_DATA = [
  { id: 7, name: 'Draft Beşiktaş', price: '120', type: 'Bar', addedBy: 'Ece', timeAgo: '1sa' },
  { id: 8, name: 'MOC Bomonti', price: '75', type: 'Cafe', addedBy: 'Kaan', timeAgo: '4sa' },
  { id: 9, name: 'Swissôtel The Roof', price: '250', type: 'Bar', addedBy: 'Mert', timeAgo: '15dk' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'Bar' | 'Cafe'>('Bar')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [L, setL] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    import('leaflet').then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setL(leaflet)
    })
  }, [])

  const currentMarkers = activeTab === 'Bar' ? BIRA_DATA : KAHVE_DATA;

  const createPriceIcon = (price: string) => {
    if (!L) return null;
    return L.divIcon({
      className: 'custom-price-marker',
      html: `<div style="background: #4ade80; color: #000; font-weight: 800; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 2px solid #000; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 11px;">${price}₺</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  const PriceCard = ({ v }: { v: any }) => (
    <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px 20px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: 600 }}>{v.name}</span>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{v.price} ₺</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#444' }}>{v.type} • {v.timeAgo}</span>
        <span style={{ fontSize: '10px', color: '#4ade80' }}>● {v.addedBy}</span>
      </div>
    </div>
  )

  const StatsBox = ({ title, avg, icon }: { title: string, avg: string, icon: string }) => (
    <div style={{ background: '#141414', padding: '20px', borderRadius: '16px', border: '1px solid #1e1e1e', marginBottom: '15px' }}>
      <div style={{ fontSize: '9px', color: '#333', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>{avg} <span style={{ fontSize: '14px' }}>{icon}</span></div>
      {[85, 40, 100, 65, 30].map((w, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <div style={{ fontSize: '8px', color: '#222', width: '20px' }}>{120 - (i*20)}₺</div>
          <div style={{ height: '4px', background: i === 2 ? '#4ade80' : '#1a1a1a', width: `${w}%`, borderRadius: '2px' }} />
        </div>
      ))}
    </div>
  )

  return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingBottom: '8rem' }}>
      
      {/* HEADER - LOGO VE ARAMA YAN YANA */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '4rem 2rem 1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '64px', fontWeight: 200, letterSpacing: '-0.05em' }}>gitmeden</span>
            <span style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.05em', color: '#4ade80' }}>bak.</span>
          </div>
          <div style={{ marginTop: '0px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 600 }}>İstanbul'un fiyat endeksi.</h2>
            <p style={{ color: '#444', fontSize: '18px', fontStyle: 'italic', marginTop: '4px' }}>İstanbul'daki mekânların içki ve kahve fiyatlarını karşılaştır.</p>
          </div>
        </div>

        <div style={{ width: '450px', marginTop: '10px' }}>
          <input 
            type="text" placeholder="Mekân veya semt ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px 24px', color: '#fff', fontSize: '16px', outline: 'none' }} 
          />
        </div>
      </div>

      {/* HARİTA ÜZERİNDEKİ SWITCH BUTONLARI */}
      <div style={{ maxWidth: '1300px', margin: '1rem auto 1.5rem', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#141414', padding: '6px', borderRadius: '40px', border: '1px solid #222', display: 'flex', gap: '5px' }}>
            <button onClick={() => setActiveTab('Bar')} style={{ padding: '12px 40px', borderRadius: '30px', border: 'none', background: activeTab === 'Bar' ? '#fff' : 'transparent', color: activeTab === 'Bar' ? '#000' : '#555', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Bar</button>
            <button onClick={() => setActiveTab('Cafe')} style={{ padding: '12px 40px', borderRadius: '30px', border: 'none', background: activeTab === 'Cafe' ? '#fff' : 'transparent', color: activeTab === 'Cafe' ? '#000' : '#555', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Cafe</button>
          </div>
        </div>
        <div></div>
      </div>

      {/* DASHBOARD (HARİTA + STATS) */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px' }}>
        <div style={{ height: '600px', borderRadius: '28px', overflow: 'hidden', border: '1px solid #1a1a1a', zIndex: 1 }}>
          {isClient && L && (
            <MapContainer key={activeTab} center={[41.0350, 28.9850] as any} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {currentMarkers.map(loc => (
                <Marker key={loc.id} position={loc.pos as any} icon={createPriceIcon(loc.price)}>
                  <Popup>
                    <div style={{ color: '#000', fontWeight: 'bold' }}>{loc.name}</div>
                    <div style={{ color: '#4ade80' }}>{loc.price} ₺</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <aside>
          <StatsBox title="ORTALAMA BİRA" avg="95 ₺" icon="🍺" />
          <StatsBox title="ORTALAMA KAHVE" avg="65 ₺" icon="☕" />
          <div style={{ background: 'rgba(255, 99, 71, 0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 99, 71, 0.12)', textAlign: 'center', marginTop: '20px' }}>
            <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '10px' }}>Hatalı Fiyat mı var?</h4>
            <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>Gördüğün hatalı ve eksik fiyatları bildirerek topluluğa destek ol.</p>
            <button onClick={() => setShowMenu(true)} style={{ width: '100%', padding: '16px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', fontSize: '15px' }}>Fiyat Gir</button>
          </div>
        </aside>
      </div>

      {/* ALT KISIM - TÜM LİSTELER (ÜÇ SÜTUNLU) */}
      <div style={{ maxWidth: '1300px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
          
          {/* SÜTUN 1: EN UCUZ BİRALAR */}
          <div>
            <h3 style={{ fontSize: '12px', color: '#333', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>EN UCUZ BİRALAR 🍺</h3>
            {BIRA_DATA.map(v => <PriceCard key={v.id} v={v} />)}
          </div>

          {/* SÜTUN 2: EN UCUZ KAHVELER */}
          <div>
            <h3 style={{ fontSize: '12px', color: '#333', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>EN UCUZ KAHVELER ☕</h3>
            {KAHVE_DATA.map(v => <PriceCard key={v.id} v={v} />)}
          </div>

          {/* SÜTUN 3: TRENDLER */}
          <div>
            <h3 style={{ fontSize: '12px', color: '#333', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>TREND MEKANLAR 🔥</h3>
            {TREND_DATA.map(v => <PriceCard key={v.id} v={v} />)}
          </div>

        </div>
      </div>

      {/* FIXED BUTONLAR */}
      <button style={{ position: 'fixed', bottom: '25px', left: '25px', background: '#141414', border: '1px solid #222', color: '#444', fontSize: '12px', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', zIndex: 90 }}>⚠️ Hata Bildir</button>
      
      {/* NEON KREM PAYLAŞ/KATKI BUTONU */}
      <button 
        onClick={() => setShowMenu(true)} 
        style={{ 
          position: 'fixed', bottom: '25px', right: '25px', 
          background: '#d4c5a0', color: '#000', fontSize: '14px', 
          padding: '14px 28px', borderRadius: '30px', cursor: 'pointer', 
          fontWeight: 'bold', boxShadow: '0 0 15px rgba(74, 222, 128, 0.4), 0 0 30px rgba(74, 222, 128, 0.2)', 
          zIndex: 90, display: 'flex', alignItems: 'center', gap: '8px' 
        }}>
        <span>+</span> Katkıda Bulun, Paylaş
      </button>

      {/* MENÜ POPUP */}
      {showMenu && (
        <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0a0a0a', padding: '2.5rem', borderRadius: '28px', maxWidth: '450px', width: '90%', border: '1px solid #1a1a1a' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '2rem', textAlign: 'center' }}>Katkı Sağla</h2>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #252525', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '24px' }}>🔗</div>
              <div style={{ textAlign: 'left' }}><div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>GitmedenBak'ı Paylaş</div><div style={{ fontSize: '12px', color: '#555' }}>Arkadaşlarına bizden bahset.</div></div>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #252525', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '24px' }}>💰</div>
              <div style={{ textAlign: 'left' }}><div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Fiyat Gir</div><div style={{ fontSize: '12px', color: '#555' }}>Bize ne ödediğini bildir.</div></div>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #252525', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '24px' }}>📸</div>
              <div style={{ textAlign: 'left' }}><div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Fotoğraf Paylaş</div><div style={{ fontSize: '12px', color: '#555' }}>Adisyon veya menü fotoğrafı yükle.</div></div>
            </div>
            <button onClick={() => setShowMenu(false)} style={{ width: '100%', marginTop: '1.5rem', color: '#333', background: 'transparent', border: 'none', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}
    </main>
  )
}