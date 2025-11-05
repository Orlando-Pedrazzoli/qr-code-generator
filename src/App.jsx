import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import LinkGenerator from './components/LinkGenerator';
import GoogleReviewGenerator from './components/GoogleReviewGenerator';
import WiFiGenerator from './components/WiFiGenerator';
import QRCodeDisplay from './components/QRCodeDisplay';
import History from './components/History';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateQRCode } from './utils/qrGenerator';
import toast from 'react-hot-toast';

function App() {
  // Estado de erro para fallback básico
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('link');
  const [qrData, setQrData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useLocalStorage('qr_history', []);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentType, setCurrentType] = useState('link');
  const [currentName, setCurrentName] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  
  // QR Code customization options
  const [qrOptions, setQrOptions] = useState({
    size: 250,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
    margin: 4,
    logoDataUrl: null,
    logoSize: 20,
  });

  // ✅ FIX: Regenerar QR Code com useCallback para evitar re-criações
  const handleRegenerateQR = useCallback(async () => {
    if (!currentUrl) return;

    try {
      setIsGenerating(true);
      
      const qrCode = await generateQRCode(currentUrl, {
        width: qrOptions.size,
        color: {
          dark: qrOptions.fgColor,
          light: qrOptions.bgColor,
        },
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        margin: qrOptions.margin,
        logoDataUrl: qrOptions.logoDataUrl,
        logoSize: qrOptions.logoSize,
      });

      const newQRData = {
        url: currentUrl,
        type: currentType,
        name: currentName || (currentType === 'link' ? new URL(currentUrl).hostname : currentType === 'wifi' ? 'WiFi QR Code' : 'Google Review'),
        dataUrl: qrCode,
        options: { ...qrOptions },
        timestamp: new Date().toISOString(),
      };

      setQrData(newQRData);
      
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      toast.error('Erro ao regenerar QR Code');
    } finally {
      setIsGenerating(false);
    }
  }, [currentUrl, currentType, currentName, qrOptions]);

  // ✅ FIX: Debounce com cleanup correto para evitar memory leaks
  useEffect(() => {
    if (!qrData || !currentUrl) return;

    const timer = setTimeout(() => {
      handleRegenerateQR();
    }, 300);

    // ✅ Cleanup adequado
    return () => clearTimeout(timer);
  }, [qrOptions.size, qrOptions.fgColor, qrOptions.bgColor, qrOptions.errorCorrectionLevel, qrOptions.margin, qrOptions.logoDataUrl, qrOptions.logoSize]);

  const handleGenerateQR = async (url, type, name = '') => {
    try {
      setIsGenerating(true);
      
      // Para WiFi QR codes, garantir alta correção de erro se houver logo
      const qrOptionsToUse = { ...qrOptions };
      if (qrOptions.logoDataUrl) {
        qrOptionsToUse.errorCorrectionLevel = 'H';
      }
      
      const qrCode = await generateQRCode(url, {
        width: qrOptionsToUse.size,
        color: {
          dark: qrOptionsToUse.fgColor,
          light: qrOptionsToUse.bgColor,
        },
        errorCorrectionLevel: qrOptionsToUse.errorCorrectionLevel,
        margin: qrOptionsToUse.margin,
        logoDataUrl: qrOptionsToUse.logoDataUrl,
        logoSize: qrOptionsToUse.logoSize,
      });

      const newQRData = {
        url,
        type,
        name: name || (type === 'link' ? 
          (url.startsWith('http') ? new URL(url).hostname : url) : 
          type === 'wifi' ? 'WiFi QR Code' : 'Google Review'),
        dataUrl: qrCode,
        options: { ...qrOptionsToUse },
        timestamp: new Date().toISOString(),
      };

      setQrData(newQRData);
      setCurrentUrl(url);
      setCurrentType(type);
      setCurrentName(name || newQRData.name);
      setShowCustomization(true);
      
      // Adicionar ao histórico
      const newHistory = [
        {
          id: Date.now(),
          ...newQRData,
        },
        ...history.slice(0, 9), // Manter apenas últimos 10 itens
      ];
      setHistory(newHistory);

      toast.success('QR Code gerado com sucesso!');
      
      // Scroll para o QR display
      setTimeout(() => {
        document.getElementById('qr-display')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Erro ao gerar QR Code. Por favor, tente novamente.');
      // ✅ Capturar erro crítico
      setError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateFromHistory = (item) => {
    setQrOptions(item.options);
    setCurrentUrl(item.url);
    setCurrentType(item.type);
    setCurrentName(item.name);
    setQrData({
      url: item.url,
      type: item.type,
      name: item.name,
      dataUrl: item.dataUrl,
      options: item.options,
      timestamp: item.timestamp,
    });
    setShowCustomization(true);
    
    // Definir tab ativa baseada no tipo
    setActiveTab(item.type === 'review' ? 'review' : item.type === 'wifi' ? 'wifi' : 'link');
    
    toast.success('QR Code regenerado!');
    
    // Scroll para o QR display
    setTimeout(() => {
      document.getElementById('qr-display')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
      toast.success('Histórico limpo com sucesso!');
    }
  };

  const handleResetQR = () => {
    setQrData(null);
    setCurrentUrl('');
    setCurrentType('link');
    setCurrentName('');
    setShowCustomization(false);
  };

  const resetOption = (optionKey) => {
    const defaults = {
      size: 250,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      errorCorrectionLevel: 'M',
      margin: 4,
      logoDataUrl: null,
      logoSize: 20,
    };
    
    setQrOptions(prev => ({
      ...prev,
      [optionKey]: defaults[optionKey]
    }));
    
    const optionNames = {
      fgColor: 'Cor do QR',
      bgColor: 'Cor do fundo',
      size: 'Tamanho',
      margin: 'Margem',
      errorCorrectionLevel: 'Nível de correção',
      logoDataUrl: 'Logo',
      logoSize: 'Tamanho do logo'
    };
    
    toast.success(`${optionNames[optionKey] || optionKey} resetado!`);
  };

  const resetAllOptions = () => {
    setQrOptions({
      size: 250,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      errorCorrectionLevel: 'M',
      margin: 4,
      logoDataUrl: null,
      logoSize: 20,
    });
    toast.success('Todas as opções resetadas!');
  };

  // ✅ Error Fallback UI simples
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
          <p className="text-gray-600 mb-6">
            Não se preocupe, isso pode acontecer. Tente recarregar a página.
          </p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }} 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Recarregar Página
          </button>
          <button 
            onClick={() => setError(null)} 
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-all duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ✅ Renderização principal com try-catch
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
          }}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Header />
          
          <main className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="p-8">
                {activeTab === 'link' ? (
                  <LinkGenerator 
                    onGenerate={handleGenerateQR}
                    isGenerating={isGenerating}
                    qrOptions={qrOptions}
                    setQrOptions={setQrOptions}
                    showCustomization={showCustomization}
                    hasQrCode={!!qrData}
                    resetOption={resetOption}
                    resetAllOptions={resetAllOptions}
                  />
                ) : activeTab === 'review' ? (
                  <GoogleReviewGenerator 
                    onGenerate={handleGenerateQR}
                    isGenerating={isGenerating}
                    qrOptions={qrOptions}
                    setQrOptions={setQrOptions}
                    showCustomization={showCustomization}
                    hasQrCode={!!qrData}
                    resetOption={resetOption}
                    resetAllOptions={resetAllOptions}
                  />
                ) : (
                  <WiFiGenerator 
                    onGenerate={handleGenerateQR}
                    isGenerating={isGenerating}
                    qrOptions={qrOptions}
                    setQrOptions={setQrOptions}
                    showCustomization={showCustomization}
                    hasQrCode={!!qrData}
                    resetOption={resetOption}
                    resetAllOptions={resetAllOptions}
                  />
                )}
              </div>
            </div>

            {qrData && (
              <div id="qr-display" className="mt-8">
                <QRCodeDisplay 
                  qrData={qrData}
                  onReset={handleResetQR}
                  isUpdating={isGenerating}
                />
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-8">
                <History 
                  history={history}
                  onRegenerate={handleRegenerateFromHistory}
                  onClear={handleClearHistory}
                />
              </div>
            )}
          </main>

          <footer className="mt-16 text-center text-gray-600 text-sm pb-8">
            <p>
              © 2025 QR Code Generator • Desenvolvido por{' '}
              <a 
                href="https://www.orlandopedrazzoli.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-all"
              >
                Orlando Pedrazzoli
              </a>
            </p>
          </footer>
        </div>
      </div>
    );
  } catch (err) {
    // ✅ Capturar qualquer erro de renderização
    console.error('Render error:', err);
    setError(err);
    return null;
  }
}

export default App;