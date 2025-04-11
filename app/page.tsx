import MenuOverlay from '../app/components/MenuOverlay';
import MusicPlayer from '../app/components/MusicPlayer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <MenuOverlay />
      <MusicPlayer />
      {/* Botão para iniciar o jogo */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/config">
          <button style={{ padding: '1rem 2rem', fontSize: '1.5rem' }}>Começar o Jogo</button>
        </Link>
      </div>
    </main>
  );
}
