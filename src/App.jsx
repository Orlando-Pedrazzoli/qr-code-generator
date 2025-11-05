import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import LinkGenerator from './components/LinkGenerator';
import GoogleReviewGenerator from './components/GoogleReviewGenerator';
import QRCodeDisplay from './components/QRCodeDisplay';
import History from './components/History';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateQRCode } from './utils/qrGenerator';
import toast from 'react-hot-toast';

function App() {
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
  });

  // Debounce timer for real-time preview
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Auto-regenerate QR Code when options change (with debounce)
  useEffect(() => {
    if (qrData && currentUrl) {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        handleRegenerateQR();
      }, 300); // 300ms debounce

      setDebounceTimer(timer);

      // Cleanup
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [qrOptions.size, qrOptions.fgColor, qrOptions.bgColor, qrOptions.errorCorrectionLevel, qrOptions.margin]);

  const handleRegenerateQR = async () => {
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
      });

      const newQRData = {
        url: currentUrl,
        type: currentType,
        name: currentName || (currentType === 'link' ? new URL(currentUrl).hostname : 'Google Review'),
        dataUrl: qrCode,
        options: { ...qrOptions },
        timestamp: new Date().toISOString(),
      };

      setQrData(newQRData);
      
    } catch (error) {
      console.error('Error regenerating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQR = async (url, type, name = '') => {
    try {
      setIsGenerating(true);
      
      const qrCode = await generateQRCode(url, {
        width: qrOptions.size,
        color: {
          dark: qrOptions.fgColor,
          light: qrOptions.bgColor,
        },
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        margin: qrOptions.margin,
      });

      const newQRData = {
        url,
        type,
        name: name || (type === 'link' ? new URL(url).hostname : 'Google Review'),
        dataUrl: qrCode,
        options: { ...qrOptions },
        timestamp: new Date().toISOString(),
      };

      setQrData(newQRData);
      setCurrentUrl(url);
      setCurrentType(type);
      setCurrentName(name || newQRData.name);
      setShowCustomization(true); // Show customization after first generation
      
      // Add to history
      const newHistory = [
        {
          id: Date.now(),
          ...newQRData,
        },
        ...history.slice(0, 9), // Keep only last 10 items
      ];
      setHistory(newHistory);

      toast.success('QR Code gerado com sucesso!');
      
      // Scroll to QR display
      setTimeout(() => {
        document.getElementById('qr-display')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Erro ao gerar QR Code. Por favor, tente novamente.');
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
    
    // Set active tab based on type
    setActiveTab(item.type === 'review' ? 'review' : 'link');
    
    toast.success('QR Code regenerado!');
    
    // Scroll to QR display
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
    };
    
    setQrOptions(prev => ({
      ...prev,
      [optionKey]: defaults[optionKey]
    }));
    
    toast.success(`${optionKey === 'fgColor' ? 'Cor do QR' : optionKey === 'bgColor' ? 'Cor do fundo' : optionKey.charAt(0).toUpperCase() + optionKey.slice(1)} resetado!`);
  };

  const resetAllOptions = () => {
    setQrOptions({
      size: 250,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      errorCorrectionLevel: 'M',
      margin: 4,
    });
    toast.success('Todas as opções resetadas!');
  };

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
              ) : (
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
            © 2024 QR Code Generator • Desenvolvido com{' '}
            <span className="text-red-500">❤️</span> por Orlando Pedrazzoli
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;