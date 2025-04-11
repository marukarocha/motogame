'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaForward } from 'react-icons/fa';

let Howl: any, Howler: any;

const musicas = [
  { nome: "No Limmit", arquivo: "/audio/limmit.ogg" },
  { nome: "Flash FM", arquivo: "/audio/Flash-fm.ogg" },
];

export default function MusicPlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [musicaAtual, setMusicaAtual] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const iniciar = async () => {
      if (typeof window !== 'undefined') {
        const howler = await import('howler');
        Howl = howler.Howl;
        Howler = howler.Howler;

        if (player) {
          player.unload();
        }

        const novoPlayer = new Howl({
          src: [musicas[musicaAtual].arquivo],
          html5: true,
          volume: 0.7,
          onload: () => {
            setDuracao(novoPlayer.duration());
            novoPlayer.seek(0);
            novoPlayer.play();
            setTocando(true);
          },
          onend: () => {
            proximaMusica();
          },
        });

        setPlayer(novoPlayer);
        conectarAnalisador(novoPlayer);
      }
    };

    iniciar();

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [musicaAtual]);

  const conectarAnalisador = (playerInstance: any) => {
    const analyser = Howler.ctx.createAnalyser();
    analyser.fftSize = 512;
    analyserRef.current = analyser;

    if (playerInstance._sounds[0]?._node) {
      const source = Howler.ctx.createMediaElementSource(playerInstance._sounds[0]._node);
      source.connect(analyser);
      analyser.connect(Howler.ctx.destination);
    } else {
      Howler.masterGain.connect(analyser);
    }

    desenhar(analyser, playerInstance);
  };

  const desenhar = (analyser: AnalyserNode, playerInstance: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradiente.addColorStop(0, "#00f0ff");
    gradiente.addColorStop(1, "#ff00e1");

    const desenharFrame = () => {
        frameIdRef.current = requestAnimationFrame(desenharFrame);
      
        if (!canvasRef.current || !analyserRef.current || !playerInstance) return;
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        const tempoAtual = playerInstance.seek() || 0;
        const progresso = tempoAtual / (playerInstance.duration() || 1);
      
        // Fundo cinza
      
        // Barra de progresso (gradiente) — apenas na base do canvas
        const barraAltura = 30; // altura da barrinha
        ctx.fillStyle = gradiente;
        ctx.fillRect(0, canvas.height - barraAltura, canvas.width * progresso, barraAltura);
      
        // Onda sonora acima da barra
        analyser.getByteTimeDomainData(dataArray);
      
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = gradiente;
      
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
      
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * (canvas.height - barraAltura)) / 2; // ✨ IMPORTANTE: usa apenas espaço acima da barra
          const boost = 1.8;
          const boostedY = (canvas.height - barraAltura) / 2 + (y - (canvas.height - barraAltura) / 2) * boost;
      
          if (i === 0) ctx.moveTo(x, boostedY);
          else ctx.lineTo(x, boostedY);
      
          x += sliceWidth;
        }
      
        ctx.lineTo(canvas.width, (canvas.height - barraAltura) / 2);
        ctx.stroke();
      };
      
      desenharFrame();
  };      

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60) || 0;
    const sec = Math.floor(segundos % 60) || 0;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const pularPara = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !player) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const novaPosicao = (x / canvas.width) * duracao;
    player.seek(novaPosicao);
  };

  const alternarPlayPause = () => {
    if (!player) return;
    if (player.playing()) {
      player.pause();
      setTocando(false);
    } else {
      player.play();
      setTocando(true);
    }
  };

  const proximaMusica = () => {
    setMusicaAtual((musicaAtual + 1) % musicas.length);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[400px] p-4  rounded-xl shadow-lg z-50 flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={120}
        onClick={pularPara}
        className="cursor-pointer"
      />

      <div className="flex items-center justify-between w-full mt-2">
        <div className="flex gap-4">
          <button onClick={alternarPlayPause}>
            {tocando ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <button onClick={proximaMusica}>
            <FaForward size={24} />
          </button>
        </div>

        <div className="text-sm text-purple-400 font-semibold">
          🎵 {musicas[musicaAtual].nome} ({formatarTempo(tempoAtual)} / {formatarTempo(duracao)})
        </div>
      </div>
    </div>
  );
}
