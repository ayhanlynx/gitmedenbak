'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

// --- STATİK VERİLER (timeAgo eklendi) ---
const BIRA_LISTESI = [
  { rank: 1, name: 'YukarıOda', meta: 'Kadıköy · Bar', price: '60 ₺', confirmed: '12 dğr.', addedBy: 'Ayhan', timeAgo: '34dk' },
  { rank: 2, name: 'KarşıBar', meta: 'Beşiktaş · Bar', price: '80 ₺', confirmed: '8 dğr.', addedBy: 'Zeynep', timeAgo: '2sa' },
  { rank: 3, name: 'MorKahve', meta: 'Beyoğlu · Cafe', price: '95 ₺', confirmed: '21 dğr.', addedBy: 'Mert', timeAgo: '1g' },
  { rank: 4, name: 'SarıKöpük', meta: 'Karaköy · Bar', price: '110 ₺', confirmed: '5 dğr.', addedBy: 'Selin', timeAgo: '3g' },
];

const KAHVE_LISTESI = [
  { rank: 1, name: 'MorKahve', meta: 'Beyoğlu · Cafe', price: '45 ₺', confirmed: '17 dğr.', addedBy: 'Burak', timeAgo: '12dk' },
  { rank: 2, name: 'AkıncıKafe', meta: 'Şişli · Cafe', price: '55 ₺', confirmed: '9 dğr.', addedBy: 'Elif', timeAgo: '5sa' },
  { rank: 3, name: 'TaşFırın', meta: 'Karaköy · Cafe', price: '65 ₺', confirmed: '14 dğr.', addedBy: 'Can', timeAgo: '2g' },
  { rank: 4, name: 'BeyazMasa', meta: 'Nişantaşı · Cafe', price: '90 ₺', confirmed: '3 dğr.', addedBy: 'Ayşe', timeAgo: '1h' },
];

type Venue = {
  id: string
  name: string
  slug: string
  district: string
  side: string
  type: string
}

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [filter, setFilter] = useState('Tümü')
  const [side, setSide] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showContribute, setShowContribute] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVenues = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from('venues').select('*')
      if (filter === 'Bar') query = query.eq('type', 'bar')
      if (filter === 'Cafe') query = query.eq('type', 'cafe')
      if (side === 'avrupa') query = query.eq('side', 'avrupa')
      if (side === 'asya') query = query.eq('side', 'asya')
      if (searchQuery) query = query.ilike('name', `%${searchQuery}%`)

      const { data, error } = await query
      if (error) throw error
      setVenues(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filter, side, searchQuery])

  useEffect(() => {
    fetchVenues()
    const saved = localStorage.getItem('favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [fetchVenues])

  function toggleFavorite(id: string) {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  const favoriteVenues = useMemo(() => venues.filter((v) => favorites.includes(v.id)), [venues, favorites])

  const PriceCard = ({ v }: { v: any }) => (
    <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '12px 16px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#333' }}>{v.rank}</span>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{v.name}</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>{v.price}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '28px' }}>
        <span style={{ fontSize: '11px', color: '#444' }}>{v.meta}</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#4ade80' }}>● {v.addedBy}</span>
          <span style={{ fontSize: '10px', color: '#333' }}>{v.timeAgo} önce</span>
        </div>
      </div>
    </div>
  )

  return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', paddingBottom: '6rem' }}>
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', borderBottom: '1px solid #1e1e1e' }}>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>gitmedenbak<span style={{ color: '#4ade80' }}>.</span></span>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#555', cursor: 'pointer' }}>Mekân ekle</span>
          <button style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Giriş yap</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '4rem 5% 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          Gitmeden önce <span style={{ color: '#4ade80' }}>fiyatını</span> öğren
        </h1>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '2.5rem' }}>İstanbul'daki mekânların fiyatlarını karşılaştır</p>

        <div style={{ maxWidth: '600px', margin: '0 auto 1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Mekân adı veya semt ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px 20px', fontSize: '15px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} 
          />
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <button style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '12px', fontSize: '14px', color: '#555', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>📍</span> Yakınımdaki yerleri göster
            <span style={{ fontSize: '10px', background: '#1e1e1e', padding: '2px 6px', borderRadius: '4px' }}>YAKINDA</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Tümü', 'Bar', 'Cafe'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 18px', border: '1px solid #2a2a2a', borderRadius: '20px', fontSize: '13px', background: filter === f ? '#1e1e1e' : 'transparent', color: filter === f ? '#fff' : '#555', cursor: 'pointer' }}>{f}</button>
          ))}
          <div style={{ width: '1px', background: '#2a2a2a', margin: '0 4px' }} />
          {[{ label: 'Avrupa', val: 'avrupa' }, { label: 'Asya', val: 'asya' }].map((f) => (
            <button key={f.val} onClick={() => setSide(side === f.val ? '' : f.val)} style={{ padding: '8px 18px', border: '1px solid #2a2a2a', borderRadius: '20px', fontSize: '13px', background: side === f.val ? '#1e1e1e' : 'transparent', color: side === f.val ? '#fff' : '#555', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>
      </section>

      {/* Listeler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto', padding: '0 5% 2rem' }}>
        <div>
          <h3 style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>En ucuz biralar 🍺</h3>
          {BIRA_LISTESI.map((v) => <PriceCard key={v.name} v={v} />)}
        </div>
        <div>
          <h3 style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>En ucuz kahveler ☕</h3>
          {KAHVE_LISTESI.map((v) => <PriceCard key={v.name} v={v} />)}
        </div>
      </div>

      {/* Favoriler */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem', padding: '0 5%' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Favori Mekanlarım ❤️</h3>
        <p style={{ fontSize: '13px', color: '#555', marginBottom: '1.2rem' }}>Favori mekanlarının fiyatlarını buradan takip et</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {favoriteVenues.length === 0 ? (
            <div style={{ background: '#141414', padding: '15px', borderRadius: '10px', border: '1px dashed #2a2a2a', color: '#444', fontSize: '12px', textAlign: 'center' }}>
              Henüz favori eklemedin.
            </div>
          ) : (
            favoriteVenues.map(v => (
              <div key={v.id} style={{ background: '#141414', padding: '15px', borderRadius: '10px', border: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{v.name}</div>
                  <div style={{ fontSize: '11px', color: '#444' }}>{v.district}</div>
                </div>
                <button onClick={() => toggleFavorite(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>❤️</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tüm Mekanlar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        <h3 style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>Tüm Mekânlar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
          {loading ? <p style={{ color: '#444', fontSize: '13px' }}>Yükleniyor...</p> : venues.map((v) => (
            <div key={v.id} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{v.name}</div>
                <div style={{ fontSize: '11px', color: '#444' }}>{v.district} · {v.type === 'bar' ? 'Bar' : 'Cafe'}</div>
              </div>
              <button onClick={() => toggleFavorite(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                {favorites.includes(v.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Katkı Butonu */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100 }}>
        <button onClick={() => setShowContribute(true)} style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          + Katkıda bulun
        </button>
      </div>

      {showContribute && (
        <div onClick={() => setShowContribute(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '2rem', maxWidth: '400px', width: '100%' }}>
             <h2 style={{ marginBottom: '1rem' }}>Katkıda Bulun</h2>
             <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5' }}>Gittiğin mekanların güncel fiyatlarını ekleyerek topluluğa destek olabilirsin.</p>
             <button onClick={() => setShowContribute(false)} style={{ width: '100%', marginTop: '1.5rem', padding: '12px', background: '#4ade80', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Anladım</button>
          </div>
        </div>
      )}

    </main>
  )
}