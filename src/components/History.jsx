import React from 'react';
import { Clock, Link2, Star, RefreshCw, Copy, Trash2, History as HistoryIcon, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const History = ({ history, onRegenerate, onClear }) => {
  const handleCopyURL = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(type === 'wifi' ? 'Configuração WiFi copiada!' : 'URL copiada!');
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'review':
        return Star;
      case 'wifi':
        return Wifi;
      default:
        return Link2;
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'review':
        return 'text-yellow-500';
      case 'wifi':
        return 'text-green-500';
      default:
        return 'text-primary-600';
    }
  };

  const getBackgroundColor = (type) => {
    switch(type) {
      case 'review':
        return 'bg-yellow-100';
      case 'wifi':
        return 'bg-green-100';
      default:
        return 'bg-blue-100';
    }
  };

  const formatWiFiInfo = (url) => {
    // Parse WiFi string to show readable info
    if (url.startsWith('WIFI:')) {
      const ssidMatch = url.match(/S:([^;]+);/);
      const typeMatch = url.match(/T:([^;]+);/);
      const ssid = ssidMatch ? ssidMatch[1] : 'Unknown';
      const type = typeMatch ? typeMatch[1] : 'WPA';
      return `${ssid} (${type})`;
    }
    return url;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HistoryIcon className="w-6 h-6" />
            Histórico Recente
          </h2>
          <button
            onClick={onClear}
            className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {history.map((item) => {
            const Icon = getIcon(item.type);
            const iconColor = getIconColor(item.type);
            const bgColor = getBackgroundColor(item.type);
            
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={clsx(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    bgColor
                  )}>
                    <Icon className={clsx('w-6 h-6', iconColor)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {item.type === 'wifi' ? formatWiFiInfo(item.url) : item.url}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onRegenerate(item)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Regenerar QR Code"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyURL(item.url, item.type)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title={item.type === 'wifi' ? 'Copiar configuração WiFi' : 'Copiar URL'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {history.length >= 10 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ O histórico mantém apenas os últimos 10 itens. 
              Itens mais antigos são removidos automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;