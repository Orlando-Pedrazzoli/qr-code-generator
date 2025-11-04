import React from 'react';
import { Palette, Maximize2, Shield, Square } from 'lucide-react';

const QRCustomization = ({ options, setOptions }) => {
  const handleChange = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Maximize2 className="w-4 h-4" />
          Tamanho ({options.size}px)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="100"
            max="400"
            value={options.size}
            onChange={(e) => handleChange('size', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <span className="text-sm font-semibold text-primary-600 w-12 text-center">
            {options.size}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>100px</span>
          <span>400px</span>
        </div>
      </div>

      {/* Margin */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Square className="w-4 h-4" />
          Margem ({options.margin})
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="10"
            value={options.margin}
            onChange={(e) => handleChange('margin', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <span className="text-sm font-semibold text-primary-600 w-8 text-center">
            {options.margin}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      {/* Foreground Color */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Palette className="w-4 h-4" />
          Cor do QR Code
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={options.fgColor}
            onChange={(e) => handleChange('fgColor', e.target.value)}
            className="w-full h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={options.fgColor}
            onChange={(e) => handleChange('fgColor', e.target.value)}
            className="w-24 px-2 py-1 text-sm font-mono border-2 border-gray-200 rounded"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Palette className="w-4 h-4" />
          Cor do Fundo
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={options.bgColor}
            onChange={(e) => handleChange('bgColor', e.target.value)}
            className="w-full h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={options.bgColor}
            onChange={(e) => handleChange('bgColor', e.target.value)}
            className="w-24 px-2 py-1 text-sm font-mono border-2 border-gray-200 rounded"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Error Correction Level */}
      <div className="md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Shield className="w-4 h-4" />
          Nível de Correção de Erro
        </label>
        <select
          value={options.errorCorrectionLevel}
          onChange={(e) => handleChange('errorCorrectionLevel', e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        >
          <option value="L">Baixa (7% - Maior densidade de dados)</option>
          <option value="M">Média (15% - Recomendado)</option>
          <option value="Q">Alta (25% - Boa resistência a danos)</option>
          <option value="H">Muito Alta (30% - Máxima resistência)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Níveis mais altos permitem que o QR Code funcione mesmo com danos parciais
        </p>
      </div>

      {/* Color Presets */}
      <div className="md:col-span-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Predefinições de Cores</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { fg: '#000000', bg: '#FFFFFF', name: 'Clássico' },
            { fg: '#FFFFFF', bg: '#000000', name: 'Invertido' },
            { fg: '#2563eb', bg: '#FFFFFF', name: 'Azul' },
            { fg: '#dc2626', bg: '#FFFFFF', name: 'Vermelho' },
            { fg: '#16a34a', bg: '#FFFFFF', name: 'Verde' },
            { fg: '#7c3aed', bg: '#FFFFFF', name: 'Roxo' },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                handleChange('fgColor', preset.fg);
                handleChange('bgColor', preset.bg);
              }}
              className="px-3 py-1.5 text-xs font-medium border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
              style={{
                backgroundColor: preset.bg,
                color: preset.fg,
                borderColor: options.fgColor === preset.fg && options.bgColor === preset.bg 
                  ? '#2563eb' 
                  : undefined
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCustomization;
