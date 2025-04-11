'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
import MotoGLB from '../components/3d/MotoGLB';
import ConfigForm from '../components/ConfigForm';

// 🔥 Só carrega o MusicPlayer no client
const MusicPlayer = dynamic(() => import('../components/MusicPlayer'), { ssr: false });

export default function ConfigPage() {
  // 🎯 Estados Globais (pode virar um Context futuramente)
  const [nomeJogador, setNomeJogador] = useState('Maruk');
  const [modeloMoto, setModeloMoto] = useState('moto1');

  const [corBoneco, setCorBoneco] = useState('#ffffff');
  const [brilhoBoneco, setBrilhoBoneco] = useState(0.5);
  const [metalBoneco, setMetalBoneco] = useState(0.5);
  const [emissiveBoneco, setEmissiveBoneco] = useState('#000000');

  const [corCapacete, setCorCapacete] = useState('#ffffff');
  const [texturaCapacete, setTexturaCapacete] = useState<File | null>(null);
  const [brilhoCapacete, setBrilhoCapacete] = useState(0.5);
  const [metalCapacete, setMetalCapacete] = useState(0.5);
  const [emissiveCapacete, setEmissiveCapacete] = useState('#000000');
  const [tamanhoCapacete, setTamanhoCapacete] = useState('normal');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0c0f1a] text-white">

      {/* 🎨 Formulário Config */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center border-r border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6">🛠️ Personalizar Personagem</h1>

        <ConfigForm
          nomeJogador={nomeJogador}
          setNomeJogador={setNomeJogador}
          modeloMoto={modeloMoto}
          setModeloMoto={setModeloMoto}
          corBoneco={corBoneco}
          setCorBoneco={setCorBoneco}
          brilhoBoneco={brilhoBoneco}
          setBrilhoBoneco={setBrilhoBoneco}
          metalBoneco={metalBoneco}
          setMetalBoneco={setMetalBoneco}
          emissiveBoneco={emissiveBoneco}
          setEmissiveBoneco={setEmissiveBoneco}
          corCapacete={corCapacete}
          setCorCapacete={setCorCapacete}
          texturaCapacete={setTexturaCapacete}
          brilhoCapacete={brilhoCapacete}
          setBrilhoCapacete={setBrilhoCapacete}
          metalCapacete={metalCapacete}
          setMetalCapacete={setMetalCapacete}
          emissiveCapacete={emissiveCapacete}
          setEmissiveCapacete={setEmissiveCapacete}
          tamanhoCapacete={tamanhoCapacete}
          setTamanhoCapacete={setTamanhoCapacete}
        />
          <MusicPlayer />
      </div>

      {/* 🏍️ Visualização 3D */}
      <div className="w-full md:w-1/2 relative bg-gray">
        <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          
          {/* Modelo da Moto */}
          <MotoGLB
            corBoneco={corBoneco}
            corCapacete={corCapacete}
            texturaCapacete={texturaCapacete}
            brilhoCapacete={brilhoCapacete}
            metalCapacete={metalCapacete}
            emissiveCapacete={emissiveCapacete}
            brilhoBoneco={brilhoBoneco}
            metalBoneco={metalBoneco}
            emissiveBoneco={emissiveBoneco}
            tamanhoCapacete={tamanhoCapacete}
          />

          {/* Controles orbitais */}
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>

        {/* 🎵 MusicPlayer posicionado */}
        <div className="absolute bottom-4 right-4">
        
        </div>
      </div>

    </div>
  );
}
