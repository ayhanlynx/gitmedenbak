'use client'

import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })
const Tooltip = dynamic(() => import('react-leaflet').then((mod) => mod.Tooltip), { ssr: false })
const MarkerClusterGroup = dynamic(() => import('react-leaflet-cluster'), { ssr: false })

const UCUZ_DATA = [
  { id: 1, name: 'YukarıOda', pos: [40.9901, 29.0232], price: '60', type: 'Bar', addedBy: 'Ayhan', timeAgo: '34dk' },
  { id: 2, name: 'Sokak Pub', pos: [40.9880, 29.0250], price: '75', type: 'Bar', addedBy: 'Zeynep', timeAgo: '2sa' },
  { id: 3, name: 'Kuytu Köşe', pos: [41.0428, 29.0075], price: '80', type: 'Bar', addedBy: 'Selin', timeAgo: '3g' },
];

const TREND_DATA = [
  { id: 4, name: 'Draft Beşiktaş', price: '120', type: 'Bar', addedBy: 'Ece', timeAgo: '1sa' },
  { id: 5, name: 'The Irish Pub', price: '150', type: 'Bar', addedBy: 'Kaan', timeAgo: '4sa' },
  { id: 6, name: 'Swissôtel The Roof', price: '250', type: 'Bar', addedBy: 'Mert', timeAgo: '15dk' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [L, setL] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [gercekMekanlar, setGercekMekanlar] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    import('leaflet').then((leaflet) => {
      setL(leaflet)
    })

    async function mekanlariGetir() {
      const { data, error } = await supabase
        .from('mekanlar')
        .select('*')
        .eq('category', 'Bar') 
        .limit(1500);

      if (data) {
        const gorselIcinHazirlanmisData = data.map(mekan => ({
          ...mekan,
          displayPrice: mekan.price || Math.floor(Math.random() * (200 - 60 + 1) + 60) 
        }));
        setGercekMekanlar(gorselIcinHazirlanmisData);
      }
    }

    mekanlariGetir();
  }, [])

  const getPriceColor = (price: number) => {
    if (price < 90) return '#d4e157';   
    if (price < 130) return '#ffca28';  
    if (price < 170) return '#fb8c00';  
    return '#ff1744';                   
  };

  const createPriceIcon = (price: number) => {
    if (!L) return null;
    const bgColor = getPriceColor(price);
    
    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div style="
          background: ${bgColor}; 
          color: #111; 
          font-family: 'Inter', sans-serif;
          font-weight: 700; 
          border-radius: 50%; 
          width: 28px; 
          height: 28px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 3px 8px rgba(0,0,0,0.5); 
          font-size: 11px;
          transition: transform 0.2s;
        ">
          ${price}₺
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  };

  const createClusterIcon = (cluster: any) => {
    if (!L) return null;
    
    const markers = cluster.getAllChildMarkers();
    let total = 0;
    
    markers.forEach((marker: any) => {
      total += Number(marker.options.alt || 0);
    });
    
    const avg = Math.round(total / markers.length);
    const bgColor = getPriceColor(avg); 
    
    return L.divIcon({
      className: 'custom-cluster-marker',
      html: `
        <div style="
          background: ${bgColor}; 
          color: #111; 
          font-family: 'Inter', sans-serif;
          font-weight: 900; 
          border-radius: 50%; 
          width: 58px; 
          height: 58px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 0 25px ${bgColor}80, 0 4px 14px rgba(0,0,0,0.8); 
          font-size: 18px;
          letter-spacing: -1px;
          border: 3.5px solid #111;
          transition: transform 0.2s;
        ">
          ${avg}₺
        </div>
      `,
      iconSize: [58, 58],
      iconAnchor: [29, 29]
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
      
      {/* BETA / UYARI ŞERİDİ EKLENDİ */}
      <div style={{ background: '#f59e0b', color: '#000', textAlign: 'center', padding: '10px 20px', fontSize: '13px', fontWeight: '900', letterSpacing: '0.5px', zIndex: 1000, position: 'relative' }}>
        ⚠️ DİKKAT: Bu site şu an geliştirme ve test aşamasındadır. Haritadaki fiyatlar ve puanlar rastgele oluşturulmuştur, gerçeği yansıtmamaktadır.
      </div>

      {/* HEADER */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '4rem 2rem 1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '64px', fontWeight: 200, letterSpacing: '-0.05em' }}>gitmeden</span>
            <span style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.05em', color: '#4ade80' }}>bak.</span>
          </div>
          <div style={{ marginTop: '0px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 600 }}>İstanbul Bira Endeksi.</h2>
            <p style={{ color: '#444', fontSize: '18px', fontStyle: 'italic', marginTop: '4px' }}>Semtlerin ortalamasını gör, mahallene yaklaş, fiyatı yakala.</p>
          </div>
        </div>

        <div style={{ width: '450px', marginTop: '10px' }}>
          <input 
            type="text" placeholder="Mekân veya semt ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px 24px', color: '#fff', fontSize: '16px', outline: 'none' }} 
          />
        </div>
      </div>

      {/* DASHBOARD (HARİTA + STATS) */}
      <div style={{ maxWidth: '1300px', margin: '2rem auto 0', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px' }}>
        
        {/* HARİTA KISMI */}
        <div style={{ height: '600px', borderRadius: '28px', overflow: 'hidden', border: '1px solid #1a1a1a', zIndex: 1 }}>
          {isClient && L && (
            <MapContainer center={[41.0350, 28.9850]} zoom={12} style={{ height: '100%', width: '100%', background: '#0a0a0a' }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              
              <MarkerClusterGroup 
                chunkedLoading 
                iconCreateFunction={createClusterIcon}
                maxClusterRadius={100}
                disableClusteringAtZoom={15}
                spiderfyOnMaxZoom={false}
                showCoverageOnHover={false}
              >
                {gercekMekanlar.map(loc => {
                  const mekanLink = loc.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

                  return (
                    <Marker 
                      key={loc.id} 
                      position={[loc.lat, loc.lng]} 
                      icon={createPriceIcon(loc.displayPrice)}
                      alt={loc.displayPrice.toString()} 
                      
                      eventHandlers={{
                        mouseover: (e) => {
                          e.target.setZIndexOffset(1000);
                        },
                        mouseout: (e) => {
                          e.target.setZIndexOffset(0);
                        }
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                        <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#000' }}>{loc.name}</span>
                      </Tooltip>

                      <Popup>
                        <div style={{ textAlign: 'center', minWidth: '170px', padding: '5px' }}>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#000', fontWeight: '900' }}>{loc.name}</h3>
                          <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>
                            ⭐ 4.3 <span style={{ color: '#666', fontSize: '11px', fontWeight: 'normal' }}>(Google)</span>
                          </div>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" style={{ display: 'block', background: '#4285F4', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                            🗺️ Haritalar'a Git
                          </a>
                          <a href={`/pub/${mekanLink}`} style={{ display: 'block', background: '#111', color: '#4ade80', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                            🍺 Fiyatları Gör
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>

        <aside>
          <StatsBox title="ORTALAMA 50CL" avg="115 ₺" icon="🍺" />
          <StatsBox title="EN UCUZ BÖLGE" avg="Kadıköy" icon="📍" />
          <div style={{ background: 'rgba(255, 99, 71, 0.02)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 99, 71, 0.12)', textAlign: 'center', marginTop: '20px' }}>
            <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '10px' }}>Hatalı Fiyat mı var?</h4>
            <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>Gördüğün hatalı ve eksik fiyatları bildirerek topluluğa destek ol.</p>
            <button onClick={() => setShowMenu(true)} style={{ width: '100%', padding: '16px', background: '#4ade80', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', fontSize: '15px' }}>Fiyat Gir</button>
          </div>
        </aside>
      </div>

      {/* ALT KISIM */}
      <div style={{ maxWidth: '1300px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '12px', color: '#333', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>EN UCUZ BİRALAR 🍺</h3>
            {UCUZ_DATA.map(v => <PriceCard key={v.id} v={v} />)}
          </div>
          <div>
            <h3 style={{ fontSize: '12px', color: '#333', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px' }}>TREND MEKANLAR 🔥</h3>
            {TREND_DATA.map(v => <PriceCard key={v.id} v={v} />)}
          </div>
        </div>
      </div>

      {/* BUTONLAR & MENÜ */}
      <button style={{ position: 'fixed', bottom: '25px', left: '25px', background: '#141414', border: '1px solid #222', color: '#444', fontSize: '12px', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', zIndex: 90 }}>⚠️ Hata Bildir</button>
      
      <button 
        onClick={() => setShowMenu(true)} 
        style={{ 
          position: 'fixed', bottom: '25px', right: '25px', 
          background: '#d4c5a0', color: '#000', fontSize: '14px', 
          padding: '14px 28px', borderRadius: '30px', cursor: 'pointer', 
          fontWeight: 'bold', boxShadow: '0 0 15px rgba(74, 222, 128, 0.4), 0 0 30px rgba(74, 222, 128, 0.2)', 
          zIndex: 90, display: 'flex', alignItems: 'center', gap: '8px' 
        }}>
        <span>+</span> Katkıda Bulun
      </button>

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
            <button onClick={() => setShowMenu(false)} style={{ width: '100%', marginTop: '1.5rem', color: '#333', background: 'transparent', border: 'none', cursor: 'pointer' }}>Kapat</button>
          </div>
        </div>
      )}
    </main>
  )
}