import React, { useState } from 'react';
import { Globe, QrCode, Settings } from 'lucide-react';
import QRCustomization from './QRCustomization';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const LinkGenerator = ({ 
  onGenerate, 
  isGenerating, 
  qrOptions, 
  setQrOptions, 
  showCustomization,
  hasQrCode,
  resetOption,
  resetAllOptions 
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [showCustomizationToggle, setShowCustomizationToggle] = useState(false);

  const validateURL = (value) => {
    if (!value) {
      setError('');
      return false;
    }

    try {
      new URL(value);
      setError('');
      return true;
    } catch {
      // Try with https://
      try {
        new URL(`https://${value}`);
        setError('');
        return true;
      } catch {
        setError('Por favor, insira uma URL válida');
        return false;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Por favor, insira uma URL');
      return;
    }

    let finalUrl = url.trim();
    
    // Add https:// if no protocol is specified
    if (!finalUrl.match(/^https?:\/\//)) {
      finalUrl = `https://${finalUrl}`;
    }

    if (!validateURL(finalUrl)) {
      toast.error('URL inválida');
      return;
    }

    onGenerate(finalUrl, 'link');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-7 h-7 text-primary-600" />
          Gerar QR Code para Link
        </h2>
        <p className="text-gray-600">
          Insira qualquer URL para gerar um QR Code personalizado
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            URL do Link
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) validateURL(e.target.value);
              }}
              onBlur={(e) => validateURL(e.target.value)}
              placeholder="https://exemplo.com ou exemplo.com"
              className={clsx(
                'input-field pl-10',
                error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              )}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600 animate-slide-up">{error}</p>
          )}
        </div>

        {/* Show customization toggle only before first generation */}
        {!hasQrCode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setShowCustomizationToggle(!showCustomizationToggle)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2 text-blue-900 font-medium">
                <Settings className="w-5 h-5" />
                Personalização do QR Code
              </div>
              <svg
                className={`w-5 h-5 text-blue-900 transition-transform ${
                  showCustomizationToggle ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showCustomizationToggle && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <QRCustomization 
                  options={qrOptions} 
                  setOptions={setQrOptions}
                  resetOption={resetOption}
                  resetAllOptions={resetAllOptions}
                />
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className={clsx(
            'w-full btn-primary flex items-center justify-center gap-2',
            isGenerating && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isGenerating ? (
            <>
              <div className="spinner w-5 h-5" />
              Gerando...
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              Gerar QR Code
            </>
          )}
        </button>
      </form>

      {/* Customization always visible after generation */}
      {hasQrCode && showCustomization && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary-200 rounded-xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Personalização em Tempo Real
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            ✨ Ajuste as opções abaixo e veja as mudanças instantaneamente!
          </p>
          <QRCustomization 
            options={qrOptions} 
            setOptions={setQrOptions}
            resetOption={resetOption}
            resetAllOptions={resetAllOptions}
          />
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Dicas:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Você pode inserir links com ou sem "https://"</li>
          <li>• Use links curtos para QR Codes mais simples</li>
          <li>• Teste sempre o QR Code antes de imprimir</li>
          <li>• Personalize as cores após gerar o QR Code</li>
        </ul>
      </div>
    </div>
  );
};

export default LinkGenerator;