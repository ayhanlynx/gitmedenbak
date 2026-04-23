'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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

  useEffect(() => {
    fetchVenues()
  }, [filter, side])

  async function fetchVenues() {
    let query = supabase.from('venues').select('*')
    if (filter === 'Bar') query = query.eq('type', 'bar')
    if (filter === 'Cafe') query = query.eq('type', 'cafe')
    if (side === 'avrupa') query = query.eq('side', 'avrupa')
    if (side === 'asya') query = query.eq('side', 'asya')
    const { data } = await query
    setVenues(data || [])
  }

  return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #1e1e1e' }}>
        <span style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '-0.02em' }}>
          gitmedenbak<span style={{ color: '#4ade80' }}>.</span>
        </span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#555', cursor: 'pointer' }}>Mekân ekle</span>
          <button style={{ fontSize: '13px', color: '#fff', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>Giriş yap</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Gitmeden önce <span style={{ color: '#4ade80' }}>fiyatını</span> öğren
        </h1>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '2rem' }}>
          İstanbul'daki mekânların içki fiyatlarını karşılaştır
        </p>

        {/* Arama */}
        <div style={{ maxWidth: '600px', margin: '0 auto 1.25rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Mekân adı veya semt ara..."
            style={{ width: '100%', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 50px 12px 16px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Filtreler */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Tümü', 'Bar', 'Cafe'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', border: '1px solid #2a2a2a', borderRadius: '20px', fontSize: '12px', background: filter === f ? '#1e1e1e' : 'transparent', color: filter === f ? '#fff' : '#555', cursor: 'pointer' }}>
              {f}
            </button>
          ))}
          <div style={{ width: '1px', background: '#2a2a2a', margin: '2px 4px' }} />
          {[{ label: 'Avrupa Yakası', val: 'avrupa' }, { label: 'Asya Yakası', val: 'asya' }].map((f) => (
            <button key={f.val} onClick={() => setSide(side === f.val ? '' : f.val)} style={{ padding: '6px 14px', border: '1px solid #2a2a2a', borderRadius: '20px', fontSize: '12px', background: side === f.val ? '#1e1e1e' : 'transparent', color: side === f.val ? '#fff' : '#555', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 1.5rem' }}>
        {[
          { val: venues.length.toString(), label: 'Mekân' },
          { val: '8.500', label: 'Fiyat kaydı' },
          { val: '340', label: 'Bu hafta güncellendi' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 500 }}>{s.val}</div>
            <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mekân Listesi */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <div style={{ fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Mekânlar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {venues.map((v) => (
            <div key={v.id} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1rem 1.25rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>{v.name}</div>
              <div style={{ fontSize: '12px', color: '#444' }}>{v.district} · {v.type === 'bar' ? 'Bar' : 'Cafe'}</div>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}