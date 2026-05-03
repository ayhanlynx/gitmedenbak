import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykoinlcqripdyouuckkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2lubGNxcmlwZHlvdXVja2tuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc2MzM1NywiZXhwIjoyMDkyMzM5MzU3fQ.QT42s4GBbpXjk_Cg0--q_SgCE-y7FMQVLbwcJ4iST7c';
const supabase = createClient(supabaseUrl, supabaseKey);

const query = `
  [out:json][timeout:90];
  area["name"="İstanbul"]->.searchArea;
  (
    node["amenity"="bar"](area.searchArea);
    node["amenity"="pub"](area.searchArea);
    node["amenity"="cafe"](area.searchArea);
  );
  out body;
`;

async function fetchAndSeed() {
  console.log("📍 İstanbul mekanları aranıyor... (Bu işlem 1-2 dakika sürebilir, bekle lütfen)");

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'GitmedenBakApp/1.0 (bilgi@gitmedenbak.com)'
      },
      body: query
    });
    
    if (!response.ok) throw new Error("Overpass API'ye bağlanılamadı.");
    
    const data = await response.json();

    const mekanlar = data.elements
      .filter(el => el.tags && el.tags.name)
      .map(el => {
        const isBar = el.tags.amenity === 'bar' || el.tags.amenity === 'pub';
        return {
          name: el.tags.name,
          lat: el.lat,
          lng: el.lon,
          category: isBar ? 'Bar' : 'Cafe',
          price: null, 
          status: 'onaylandi', 
          added_by: 'Sistem'
        };
      });

    console.log(`✅ ${mekanlar.length} adet mekan bulundu. Supabase'e yükleniyor...`);

    const { error } = await supabase.from('mekanlar').insert(mekanlar);

    if (error) {
      console.error("❌ Veritabanına yazılırken hata oluştu:", error.message);
    } else {
      console.log("🎉 HARİKA! Tüm mekanlar başarıyla veritabanına eklendi.");
    }

  } catch (error) {
    console.error("❌ Bir hata oluştu:", error.message);
  }
}

fetchAndSeed();