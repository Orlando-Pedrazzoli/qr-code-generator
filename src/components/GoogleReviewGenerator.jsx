import React, { useState } from 'react';
import { Star, MapPin, Building, Settings, ExternalLink, Info } from 'lucide-react';
import QRCustomization from './QRCustomization';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const GoogleReviewGenerator = ({ 
  onGenerate, 
  isGenerating, 
  qrOptions, 
  setQrOptions,
  showCustomization,
  hasQrCode,
  resetOption,
  resetAllOptions
}) => {
  const [placeId, setPlaceId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [showCustomizationToggle, setShowCustomizationToggle] = useState(false);

  const validatePlaceId = (value) => {
    if (!value) {
      setError('');
      return false;
    }

    // Google Place IDs are typically 27+ characters and alphanumeric with underscores/hyphens
    const placeIdPattern = /^[A-Za-z0-9_-]{20,}$/;
    
    if (placeIdPattern.test(value)) {
      setError('');
      return true;
    } else {
      setError('Place ID inválido. Verifique o formato.');
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedPlaceId = placeId.trim();
    
    if (!trimmedPlaceId) {
      toast.error('Por favor, insira um Place ID');
      return;
    }

    if (!validatePlaceId(trimmedPlaceId)) {
      toast.error('Place ID inválido');
      return;
    }

    const reviewUrl = `https://search.google.com/local/writereview?placeid=${trimmedPlaceId}`;
    const name = businessName.trim() || 'Google Review';
    
    onGenerate(reviewUrl, 'review', name);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-7 h-7 text-yellow-500" />
          Gerar QR Code para Google Review
        </h2>
        <p className="text-gray-600">
          Facilite as avaliações do seu negócio no Google
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2 mb-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-blue-900">Como obter o Place ID:</p>
            <ol className="space-y-1 text-blue-800">
              <li>
                1. Acesse o{' '}
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-blue-600 inline-flex items-center gap-1"
                >
                  Google Place ID Finder
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>2. Procure seu negócio no mapa</li>
              <li>3. Copie o Place ID que aparecerá</li>
            </ol>
            <p className="text-blue-700 italic">
              Exemplo: ChIJN1t_tDeuEmsRUsoyG83frY4
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="placeId" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Google Place ID
          </label>
          <input
            type="text"
            id="placeId"
            value={placeId}
            onChange={(e) => {
              setPlaceId(e.target.value);
              if (error) validatePlaceId(e.target.value);
            }}
            onBlur={(e) => validatePlaceId(e.target.value)}
            placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
            className={clsx(
              'input-field font-mono',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            )}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 animate-slide-up">{error}</p>
          )}
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline w-4 h-4 mr-1" />
            Nome do Negócio (Opcional)
          </label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nome para identificação no histórico"
            className="input-field"
          />
          <p className="mt-1 text-xs text-gray-500">
            Este nome é apenas para sua organização, não afeta o QR Code
          </p>
        </div>

        {/* Show customization toggle only before first generation */}
        {!hasQrCode && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setShowCustomizationToggle(!showCustomizationToggle)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Settings className="w-5 h-5" />
                Personalização do QR Code
              </div>
              <svg
                className={`w-5 h-5 text-amber-900 transition-transform ${
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
              <div className="mt-4 pt-4 border-t border-amber-200">
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
            'w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg',
            'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
            'shadow-lg hover:shadow-xl flex items-center justify-center gap-2',
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
              <Star className="w-5 h-5" />
              Gerar QR Code para Review
            </>
          )}
        </button>
      </form>

      {/* Customization always visible after generation */}
      {hasQrCode && showCustomization && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-yellow-300 rounded-xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-6 h-6 text-yellow-600" />
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
        <h3 className="font-semibold text-gray-900 mb-2">⭐ Benefícios:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Aumenta o número de avaliações do seu negócio</li>
          <li>• Melhora sua presença online e SEO local</li>
          <li>• Facilita o processo para seus clientes</li>
          <li>• Direciona direto para a página de avaliação</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleReviewGenerator;