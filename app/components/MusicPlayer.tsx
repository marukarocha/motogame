'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaForward } from 'react-icons/fa';

let Howl: any, Howler: any;

const musicas = [
  { nome: "Limmit", arquivo: "/audio/limmit.ogg" },
  { nome: "Outra Música", arquivo: "/audio/outra_musica.ogg" },
];

export default function MusicPlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [musicaAtual, setMusicaAtual] = useState(0);
  const [tocando, setTocando] = useState(true);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const iniciar = async () => {
      if (typeof window !== 'undefined') {
        const howler = await import('howler');
        Howl = howler.Howl;
        Howler = howler.Howler;

        const novoPlayer = new Howl({
          src: [musicas[musicaAtual].arquivo],
          loop: true,
          volume: 0.7,
          html5: true,
          onplay: () => setDuracao(novoPlayer.duration())
        });

        novoPlayer.play();
        setPlayer(novoPlayer);
        conectarAnalisador(novoPlayer);
        atualizarTempo(novoPlayer);
      }
    };

    iniciar();
    return () => player?.unload();
  }, [musicaAtual]);

  const conectarAnalisador = (playerInstance: any) => {
    const analyser = Howler.ctx.createAnalyser();
    analyser.fftSize = 256;

    if (playerInstance._sounds[0]?._node) {
      const source = Howler.ctx.createMediaElementSource(playerInstance._sounds[0]._node);
      source.connect(analyser);
      analyser.connect(Howler.ctx.destination);
    } else {
      Howler.masterGain.connect(analyser);
    }

    desenhar(analyser, playerInstance);
  };

  const atualizarTempo = (playerInstance: any) => {
    const update = () => {
      if (playerInstance.playing()) {
        setTempoAtual(playerInstance.seek() as number);
      }
      requestAnimationFrame(update);
    };
    update();
  };

  const desenhar = (analyser: AnalyserNode, playerInstance: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const desenharFrame = () => {
      requestAnimationFrame(desenharFrame);
      if (!canvasRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progresso = tempoAtual / duracao;
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🎯 Barra de progresso
      ctx.fillStyle = "#ffef00";
      ctx.fillRect(0, 0, canvas.width * progresso, 5); // mais fino!

      analyser.getByteTimeDomainData(dataArray);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#fff";

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (canvas.height / 2);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[360px] p-4 bg-black rounded-xl shadow-lg z-50 flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={360}
        height={60}
        onClick={pularPara}
        className="rounded-lg cursor-pointer"
      />

      <div className="flex items-center justify-between w-full mt-2">
        <button onClick={alternarPlayPause}>
          {tocando ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
        <button onClick={proximaMusica}>
          <FaForward size={24} />
        </button>
        <div className="flex items-center text-sm">
          <span className="text-purple-400 ml-2">
            🎵 {musicas[musicaAtual].nome} ({formatarTempo(tempoAtual)} / {formatarTempo(duracao)})
          </span>
        </div>
      </div>
    </div>
  );
}
