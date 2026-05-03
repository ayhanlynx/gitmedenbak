"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';

type Mekan = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
};

export default function MekanHaritasi() {
  const [mekanlar, setMekanlar] = useState<Mekan[]>([]);

  useEffect(() => {
    async function mekanlariGetir() {
      // Şimdilik test amaçlı 100 mekan çekiyoruz
      const { data, error } = await supabase
        .from('mekanlar')
        .select('*')
        .limit(100);

      if (error) {
        console.error("Veri çekme hatası:", error.message);
      } else if (data) {
        setMekanlar(data);
      }
    }

    mekanlariGetir();
  }, []);

  return (
    <MapContainer center={[41.0082, 28.9784]} zoom={12} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {mekanlar.map((mekan) => (
        <Marker key={mekan.id} position={[mekan.lat, mekan.lng]}>
          <Popup>
            <strong>{mekan.name}</strong> <br />
            Kategori: {mekan.category}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}