import React, { useState } from 'react';
import { Wifi, Settings, Lock, Eye, EyeOff, Info, Shield, Router } from 'lucide-react';
import QRCustomization from './QRCustomization';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const WiFiGenerator = ({ 
  onGenerate, 
  isGenerating, 
  qrOptions, 
  setQrOptions,
  showCustomization,
  hasQrCode,
  resetOption,
  resetAllOptions
}) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [securityType, setSecurityType] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomizationToggle, setShowCustomizationToggle] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!ssid.trim()) {
      newErrors.ssid = 'Nome da rede é obrigatório';
    }
    
    if (securityType !== 'nopass' && !password.trim()) {
      newErrors.password = 'Senha é obrigatória para redes protegidas';
    }
    
    if (securityType !== 'nopass' && password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    // Generate WiFi QR Code string format
    // Format: WIFI:T:<security>;S:<ssid>;P:<password>;H:<hidden>;;
    let wifiString = `WIFI:T:${securityType};S:${ssid};`;
    
    if (securityType !== 'nopass') {
      // Escape special characters in password
      const escapedPassword = password
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/:/g, '\\:');
      wifiString += `P:${escapedPassword};`;
    }
    
    if (hidden) {
      wifiString += 'H:true;';
    }
    
    wifiString += ';';
    
    const name = `WiFi: ${ssid}`;
    onGenerate(wifiString, 'wifi', name);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wifi className="w-7 h-7 text-green-600" />
          Gerar QR Code para WiFi
        </h2>
        <p className="text-gray-600">
          Crie um QR Code para compartilhar facilmente sua rede WiFi
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-2 mb-3">
          <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-green-900">Como funciona:</p>
            <ul className="space-y-1 text-green-800">
              <li>• Os dispositivos se conectam automaticamente ao escanear</li>
              <li>• Compatível com Android e iOS (iOS 11+)</li>
              <li>• Não é necessário digitar a senha manualmente</li>
              <li>• Perfeito para locais comerciais, eventos ou casa</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ssid" className="block text-sm font-medium text-gray-700 mb-2">
            <Router className="inline w-4 h-4 mr-1" />
            Nome da Rede (SSID) *
          </label>
          <input
            type="text"
            id="ssid"
            value={ssid}
            onChange={(e) => {
              setSsid(e.target.value);
              if (errors.ssid) {
                setErrors({ ...errors, ssid: undefined });
              }
            }}
            placeholder="Ex: MinhaRedeWiFi"
            className={clsx(
              'input-field',
              errors.ssid && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            )}
            maxLength={32}
          />
          {errors.ssid && (
            <p className="mt-1 text-sm text-red-600 animate-slide-up">{errors.ssid}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Digite exatamente como aparece nas configurações do dispositivo
          </p>
        </div>

        <div>
          <label htmlFor="securityType" className="block text-sm font-medium text-gray-700 mb-2">
            <Shield className="inline w-4 h-4 mr-1" />
            Tipo de Segurança
          </label>
          <select
            id="securityType"
            value={securityType}
            onChange={(e) => {
              setSecurityType(e.target.value);
              if (e.target.value === 'nopass') {
                setPassword('');
                setErrors({ ...errors, password: undefined });
              }
            }}
            className="input-field"
          >
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP (Não recomendado)</option>
            <option value="nopass">Sem Senha (Rede Aberta)</option>
          </select>
          {securityType === 'WEP' && (
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ WEP é considerado inseguro. Use WPA quando possível.
            </p>
          )}
          {securityType === 'nopass' && (
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ Redes sem senha são públicas e menos seguras.
            </p>
          )}
        </div>

        {securityType !== 'nopass' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Senha da Rede *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                placeholder="Digite a senha do WiFi"
                className={clsx(
                  'input-field pr-12',
                  errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
                minLength={securityType === 'WEP' ? 5 : 8}
                maxLength={63}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 animate-slide-up">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {securityType === 'WEP' ? 'Mínimo 5 caracteres' : 'Mínimo 8 caracteres'}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hidden"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="hidden" className="text-sm font-medium text-gray-700 cursor-pointer">
            Rede oculta (SSID não visível)
          </label>
        </div>

        {/* Show customization toggle only before first generation */}
        {!hasQrCode && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setShowCustomizationToggle(!showCustomizationToggle)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2 text-green-900 font-medium">
                <Settings className="w-5 h-5" />
                Personalização do QR Code
              </div>
              <svg
                className={`w-5 h-5 text-green-900 transition-transform ${
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
              <div className="mt-4 pt-4 border-t border-green-200">
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
            'w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg',
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
              <Wifi className="w-5 h-5" />
              Gerar QR Code WiFi
            </>
          )}
        </button>
      </form>

      {/* Customization always visible after generation */}
      {hasQrCode && showCustomization && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-6 h-6 text-green-600" />
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
        <h3 className="font-semibold text-gray-900 mb-2">📱 Compatibilidade:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Android: Suporte nativo desde Android 10</li>
          <li>• iOS: Suporte desde iOS 11 (usando a câmera)</li>
          <li>• Windows/Mac: Aplicativos de QR Code</li>
          <li>• Câmeras de smartphones reconhecem automaticamente</li>
        </ul>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Dicas de Segurança:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Use sempre WPA2 ou WPA3 para máxima segurança</li>
          <li>• Evite senhas simples ou padrões óbvios</li>
          <li>• Considere criar uma rede de convidados separada</li>
          <li>• Atualize o QR Code se mudar a senha do WiFi</li>
        </ul>
      </div>
    </div>
  );
};

export default WiFiGenerator;