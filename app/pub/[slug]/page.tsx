import Link from 'next/link';

// 1. Fonksiyonun başına 'async' ekliyoruz ve params'ı bir Promise (Söz) olarak tanımlıyoruz
export default async function MekanDetay({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Next.js 15'in yeni kuralı: Linkten gelen veriyi 'await' ile çözümlüyoruz
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 3. Artık güvenle split işlemini yapabiliriz
  const mekanIsmi = slug
    .split('-')
    .map(kelime => kelime.charAt(0).toUpperCase() + kelime.slice(1))
    .join(' ');

  return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
        
        {/* Geri Dön Butonu */}
        <Link href="/" style={{ color: '#4ade80', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginBottom: '2rem' }}>
          ← Haritaya Dön
        </Link>

        {/* Mekan Başlığı */}
        <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
            BAR / PUB
          </div>
          
          <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 1rem 0', letterSpacing: '-1px' }}>
            {mekanIsmi}
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '10px 20px', borderRadius: '12px' }}>
              <span style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '5px' }}>Ortalama 50cl</span>
              <span style={{ fontSize: '24px', color: '#4ade80', fontWeight: 'bold' }}>120 ₺</span>
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '10px 20px', borderRadius: '12px' }}>
              <span style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '5px' }}>Son Güncelleme</span>
              <span style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold', lineHeight: '1.5' }}>Bugün</span>
            </div>
          </div>

        </div>

        {/* Gelecek Özellikler İçin Placeholder */}
        <div style={{ marginTop: '2rem', padding: '2rem', border: '1px dashed #222', borderRadius: '16px', textAlign: 'center', color: '#444' }}>
          <p>Burası mekanın detay sayfası.</p>
          <p style={{ fontSize: '12px' }}>Yakında buraya kullanıcıların yüklediği adisyon fotoğrafları ve geçmiş fiyat grafikleri gelecek.</p>
        </div>

      </div>

    </main>
  );
}