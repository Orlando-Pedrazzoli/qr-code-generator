import React, { useState } from 'react';
import { Download, Copy, RefreshCw, Check, FileText, Image, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadQRCode } from '../utils/qrGenerator';
import clsx from 'clsx';

const QRCodeDisplay = ({ qrData, onReset, isUpdating }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(qrData.url);
      setCopied(true);
      toast.success('URL copiada para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar URL');
    }
  };

  const handleDownloadPNG = () => {
    downloadQRCode(qrData.dataUrl, 'png', qrData.name);
    toast.success('Download iniciado!');
  };

  const handleDownloadSVG = async () => {
    try {
      // For SVG, we need to regenerate as SVG format
      const { generateQRCodeSVG } = await import('../utils/qrGenerator');
      const svgString = await generateQRCodeSVG(qrData.url, {
        width: qrData.options.size,
        color: {
          dark: qrData.options.fgColor,
          light: qrData.options.bgColor,
        },
        errorCorrectionLevel: qrData.options.errorCorrectionLevel,
        margin: qrData.options.margin,
      });
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_${qrData.name.replace(/\s+/g, '_')}_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('SVG baixado com sucesso!');
    } catch (error) {
      console.error('Error downloading SVG:', error);
      toast.error('Erro ao baixar SVG');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${qrData.name}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              color: #666;
              margin-bottom: 20px;
              font-size: 14px;
            }
            img {
              max-width: 400px;
              border: 1px solid #ddd;
              padding: 20px;
              background: white;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${qrData.name}</h1>
            <p>${qrData.url}</p>
            <img src="${qrData.dataUrl}" alt="QR Code" />
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">QR Code Gerado com Sucesso!</h2>
          {isUpdating && (
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Atualizando...</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8">
        <div className="text-center mb-6">
          <div className={clsx(
            "inline-block p-6 bg-white rounded-xl shadow-lg transition-opacity duration-300",
            isUpdating && "opacity-50"
          )}>
            <img 
              src={qrData.dataUrl} 
              alt="QR Code" 
              className="max-w-full"
              style={{ width: `${qrData.options.size}px`, height: `${qrData.options.size}px` }}
            />
          </div>
          {isUpdating && (
            <p className="mt-3 text-sm text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Regenerando com novas configurações...
            </p>
          )}
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Tipo:</span> {qrData.type === 'review' ? 'Google Review' : 'Link'}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Nome:</span> {qrData.name}
          </p>
          <p className="text-sm text-gray-600 break-all">
            <span className="font-semibold">URL:</span> 
            <a 
              href={qrData.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline ml-1"
            >
              {qrData.url}
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleDownloadPNG}
            disabled={isUpdating}
            className={clsx(
              "flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors",
              isUpdating 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            )}
          >
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">PNG</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            disabled={isUpdating}
            className={clsx(
              "flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors",
              isUpdating 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            )}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">SVG</span>
          </button>

          <button
            onClick={handleCopyURL}
            disabled={isUpdating}
            className={clsx(
              'flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all',
              isUpdating && 'cursor-not-allowed opacity-50',
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Copiar</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Novo</span>
          </button>
        </div>

        <button
          onClick={handlePrint}
          disabled={isUpdating}
          className={clsx(
            "w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors",
            isUpdating 
              ? "border-2 border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className="text-sm font-medium">Imprimir QR Code</span>
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-1">💡 Dica:</p>
          <p className="text-sm text-blue-700">
            Teste o QR Code com seu celular antes de usar em materiais impressos.
            {qrData.type === 'review' && ' Certifique-se de que o link direciona corretamente para a página de avaliação.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;