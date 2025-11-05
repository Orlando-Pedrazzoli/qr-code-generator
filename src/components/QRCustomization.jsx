import React from 'react';
import { Palette, Maximize2, Shield, Square, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const QRCustomization = ({ options, setOptions, resetOption, resetAllOptions }) => {
  const handleChange = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Calculate contrast ratio between two colors
  const getContrastRatio = (color1, color2) => {
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastRatio = getContrastRatio(options.fgColor, options.bgColor);
  const contrastStatus = contrastRatio >= 4.5 ? 'good' : contrastRatio >= 3 ? 'warning' : 'poor';

  const contrastColors = {
    good: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600'
    },
    poor: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600'
    }
  };

  const contrastMessages = {
    good: 'Excelente contraste! QR Code fácil de escanear.',
    warning: 'Contraste aceitável, mas pode ter problemas em algumas condições.',
    poor: 'Contraste insuficiente! O QR Code pode não funcionar corretamente.'
  };

  // Expanded color presets - 12 professional combinations
  const colorPresets = [
    { fg: '#000000', bg: '#FFFFFF', name: 'Clássico', category: 'basic' },
    { fg: '#FFFFFF', bg: '#000000', name: 'Invertido', category: 'basic' },
    { fg: '#1e40af', bg: '#FFFFFF', name: 'Azul Royal', category: 'professional' },
    { fg: '#dc2626', bg: '#FFFFFF', name: 'Vermelho', category: 'professional' },
    { fg: '#16a34a', bg: '#FFFFFF', name: 'Verde', category: 'professional' },
    { fg: '#7c3aed', bg: '#FFFFFF', name: 'Roxo', category: 'professional' },
    { fg: '#ea580c', bg: '#FFFFFF', name: 'Laranja', category: 'modern' },
    { fg: '#0891b2', bg: '#FFFFFF', name: 'Ciano', category: 'modern' },
    { fg: '#be123c', bg: '#fff1f2', name: 'Rosa Elegante', category: 'modern' },
    { fg: '#1e293b', bg: '#f1f5f9', name: 'Cinza Moderno', category: 'modern' },
    { fg: '#374151', bg: '#fef3c7', name: 'Âmbar Suave', category: 'creative' },
    { fg: '#064e3b', bg: '#d1fae5', name: 'Verde Menta', category: 'creative' },
  ];

  const presetCategories = [
    { id: 'basic', label: 'Básicos' },
    { id: 'professional', label: 'Profissionais' },
    { id: 'modern', label: 'Modernos' },
    { id: 'creative', label: 'Criativos' }
  ];

  return (
    <div className="space-y-6">
      {/* Contrast Warning/Info */}
      <div className={clsx(
        'p-4 rounded-lg border-2 transition-all duration-300',
        contrastColors[contrastStatus].bg,
        contrastColors[contrastStatus].border
      )}>
        <div className="flex items-start gap-3">
          {contrastStatus === 'good' ? (
            <CheckCircle className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', contrastColors[contrastStatus].icon)} />
          ) : (
            <AlertTriangle className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', contrastColors[contrastStatus].icon)} />
          )}
          <div className="flex-1">
            <p className={clsx('font-semibold mb-1', contrastColors[contrastStatus].text)}>
              Contraste: {contrastRatio.toFixed(2)}:1
            </p>
            <p className={clsx('text-sm', contrastColors[contrastStatus].text)}>
              {contrastMessages[contrastStatus]}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Personalização</h3>
        <button
          onClick={resetAllOptions}
          className="text-sm text-gray-600 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Maximize2 className="w-4 h-4" />
              Tamanho ({options.size}px)
            </label>
            <button
              onClick={() => resetOption('size')}
              className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              title="Resetar tamanho"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Square className="w-4 h-4" />
              Margem ({options.margin})
            </label>
            <button
              onClick={() => resetOption('margin')}
              className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              title="Resetar margem"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Palette className="w-4 h-4" />
              Cor do QR Code
            </label>
            <button
              onClick={() => resetOption('fgColor')}
              className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              title="Resetar cor do QR"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="color"
                value={options.fgColor}
                onChange={(e) => handleChange('fgColor', e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={options.fgColor}
              onChange={(e) => handleChange('fgColor', e.target.value)}
              className="w-24 px-3 py-2 text-sm font-mono border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Palette className="w-4 h-4" />
              Cor do Fundo
            </label>
            <button
              onClick={() => resetOption('bgColor')}
              className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              title="Resetar cor do fundo"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="color"
                value={options.bgColor}
                onChange={(e) => handleChange('bgColor', e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={options.bgColor}
              onChange={(e) => handleChange('bgColor', e.target.value)}
              className="w-24 px-3 py-2 text-sm font-mono border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              placeholder="#FFFFFF"
              maxLength={7}
            />
          </div>
        </div>

        {/* Error Correction Level */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Shield className="w-4 h-4" />
              Nível de Correção de Erro
            </label>
            <button
              onClick={() => resetOption('errorCorrectionLevel')}
              className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              title="Resetar nível de correção"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <select
            value={options.errorCorrectionLevel}
            onChange={(e) => handleChange('errorCorrectionLevel', e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
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
      </div>

      {/* Color Presets - Organized by Category */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Predefinições de Cores</p>
        <div className="space-y-4">
          {presetCategories.map(category => (
            <div key={category.id}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category.label}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {colorPresets
                  .filter(preset => preset.category === category.id)
                  .map((preset) => {
                    const isActive = options.fgColor === preset.fg && options.bgColor === preset.bg;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          handleChange('fgColor', preset.fg);
                          handleChange('bgColor', preset.bg);
                        }}
                        className={clsx(
                          'relative px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-200',
                          'border-2 hover:scale-105 active:scale-95',
                          isActive
                            ? 'border-primary-500 shadow-md ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-primary-300'
                        )}
                        style={{
                          backgroundColor: preset.bg,
                          color: preset.fg,
                        }}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: preset.fg, borderColor: preset.bg }}
                          />
                          <span>{preset.name}</span>
                        </div>
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const temp = options.fgColor;
            handleChange('fgColor', options.bgColor);
            handleChange('bgColor', temp);
          }}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Inverter Cores
        </button>
      </div>
    </div>
  );
};

export default QRCustomization;