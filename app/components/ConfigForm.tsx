'use client';

interface ConfigFormProps {
  nomeJogador: string;
  setNomeJogador: (value: string) => void;
  modeloMoto: string;
  setModeloMoto: (value: string) => void;
  corBoneco: string;
  setCorBoneco: (value: string) => void;
  brilhoBoneco: number;
  setBrilhoBoneco: (value: number) => void;
  metalBoneco: number;
  setMetalBoneco: (value: number) => void;
  emissiveBoneco: string;
  setEmissiveBoneco: (value: string) => void;
  corCapacete: string;
  setCorCapacete: (value: string) => void;
  texturaCapacete: (value: File | null) => void;
  brilhoCapacete: number;
  setBrilhoCapacete: (value: number) => void;
  metalCapacete: number;
  setMetalCapacete: (value: number) => void;
  emissiveCapacete: string;
  setEmissiveCapacete: (value: string) => void;
  tamanhoCapacete: string;
  setTamanhoCapacete: (value: string) => void;
}

export default function ConfigForm(props: ConfigFormProps) {
  return (
    <div className="bg-[#111] p-8 rounded-md shadow-lg text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🚀 Configurar Personagem</h1>

      {/* 🔥 Layout em 2 Colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Coluna 1 - Usuário e Roupa */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2">👤 Usuário</h2>

          <input
            type="text"
            placeholder="Nome do Jogador"
            value={props.nomeJogador}
            onChange={(e) => props.setNomeJogador(e.target.value)}
            className="p-2 rounded bg-gray-800"
          />

          <select
            value={props.modeloMoto}
            onChange={(e) => props.setModeloMoto(e.target.value)}
            className="p-2 rounded bg-gray-800"
          >
            <option value="moto1">Moto 1</option>
            <option value="moto2">Moto 2</option>
          </select>

          <h2 className="text-2xl font-semibold mt-6 mb-2">👕 Roupa</h2>

          <label>Cor da Roupa:</label>
          <input
            type="color"
            value={props.corBoneco}
            onChange={(e) => props.setCorBoneco(e.target.value)}
            className="p-2"
          />

          <label>Brilho (Roughness):</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={props.brilhoBoneco}
            onChange={(e) => props.setBrilhoBoneco(Number(e.target.value))}
          />

          <label>Metallicidade:</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={props.metalBoneco}
            onChange={(e) => props.setMetalBoneco(Number(e.target.value))}
          />

          <label>Emissão:</label>
          <input
            type="color"
            value={props.emissiveBoneco}
            onChange={(e) => props.setEmissiveBoneco(e.target.value)}
            className="p-2"
          />
        </div>

        {/* Coluna 2 - Capacete */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2">🪖 Capacete</h2>

          <label>Tamanho do Capacete:</label>
          <select
            value={props.tamanhoCapacete}
            onChange={(e) => props.setTamanhoCapacete(e.target.value)}
            className="p-2 rounded bg-gray-800"
          >
            <option value="pequeno">Pequeno</option>
            <option value="normal">Normal</option>
            <option value="grande">Grande</option>
            <option value="gigante">Gigante</option>
          </select>

          <label>Cor:</label>
          <input
            type="color"
            value={props.corCapacete}
            onChange={(e) => props.setCorCapacete(e.target.value)}
            className="p-2"
          />

          <label>Textura (upload imagem):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => props.texturaCapacete(e.target.files?.[0] || null)}
            className="p-2 bg-gray-800 rounded"
          />

          <label>Brilho (Roughness):</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={props.brilhoCapacete}
            onChange={(e) => props.setBrilhoCapacete(Number(e.target.value))}
          />

          <label>Metallicidade:</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={props.metalCapacete}
            onChange={(e) => props.setMetalCapacete(Number(e.target.value))}
          />

          <label>Emissão:</label>
          <input
            type="color"
            value={props.emissiveCapacete}
            onChange={(e) => props.setEmissiveCapacete(e.target.value)}
            className="p-2"
          />
        </div>
      </div>

      {/* Botão Iniciar Jogo */}
      <div className="text-center mt-8">
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-full shadow-lg transition">
          🚀 Iniciar Jogo
        </button>
      </div>
    </div>
  );
}
