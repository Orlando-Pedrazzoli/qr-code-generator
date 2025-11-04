# QR Code Generator 🔲

Um gerador moderno e profissional de QR Codes desenvolvido com **React**, **Vite** e **Tailwind CSS**. Aplicação 100% client-side com interface intuitiva e recursos avançados de personalização.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.6-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Demonstração

- Interface moderna com gradientes e animações
- Geração instantânea de QR Codes
- Personalização completa em tempo real
- Histórico persistente com localStorage

## ✨ Funcionalidades

### 🔗 Geração de QR Code para Links
- Validação de URL em tempo real
- Suporte para qualquer URL válida
- Auto-complete com https:// quando necessário
- Feedback visual de erros

### ⭐ Geração de QR Code para Google Reviews
- Interface dedicada para Google Place ID
- Link direto para Google Place ID Finder
- URL formatada automaticamente para reviews
- Instruções passo a passo integradas

### 🎨 Personalização Completa
- **Tamanho ajustável**: 100px a 400px com slider interativo
- **Cores customizáveis**: Seletores de cor para QR e fundo
- **Presets de cores**: 6 combinações pré-definidas
- **Níveis de correção de erro**: L, M, Q, H
- **Margens configuráveis**: 0 a 10 unidades

### 💾 Opções de Download e Compartilhamento
- **Download PNG**: Formato raster de alta qualidade
- **Download SVG**: Formato vetorial escalável
- **Copiar URL**: Copia link para clipboard
- **Impressão**: Layout otimizado para impressão

### 📜 Sistema de Histórico
- Últimos 10 QR Codes gerados
- Persistência com localStorage
- Regeneração com um clique
- Timestamps com formatação inteligente
- Limpeza de histórico

### 🎯 Experiência do Usuário
- Design responsivo (mobile-first)
- Animações suaves e feedback visual
- Toast notifications para ações
- Scroll suave para resultados
- Interface em português

## 🛠️ Stack Tecnológica

### Core
- **React 18.2** - Biblioteca UI
- **Vite 5.0** - Build tool e dev server
- **Tailwind CSS 3.3** - Estilização utility-first

### Bibliotecas
- **qrcode** - Geração de QR Codes
- **lucide-react** - Ícones modernos
- **react-hot-toast** - Notificações toast
- **clsx** - Utility para classes condicionais

### Desenvolvimento
- **ESLint** - Linting
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Compatibilidade CSS

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 14+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/yourusername/qr-code-generator.git
cd qr-code-generator
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

### Build para Produção

```bash
npm run build
# ou
yarn build
```

Os arquivos otimizados estarão em `/dist`

### Preview da Build

```bash
npm run preview
# ou
yarn preview
```

## 📂 Estrutura do Projeto

```
qr-code-generator/
├── public/
│   └── qr-icon.svg           # Favicon do projeto
├── src/
│   ├── components/            # Componentes React
│   │   ├── Header.jsx         # Cabeçalho principal
│   │   ├── TabNavigation.jsx  # Navegação por abas
│   │   ├── LinkGenerator.jsx  # Gerador para links
│   │   ├── GoogleReviewGenerator.jsx # Gerador para reviews
│   │   ├── QRCustomization.jsx # Controles de personalização
│   │   ├── QRCodeDisplay.jsx  # Exibição do QR gerado
│   │   └── History.jsx        # Lista de histórico
│   ├── hooks/
│   │   └── useLocalStorage.js # Hook para persistência
│   ├── utils/
│   │   └── qrGenerator.js     # Funções de geração de QR
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Entry point
│   └── index.css              # Estilos globais e Tailwind
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Personalização do Tema

### Cores
Edite o arquivo `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Adicione suas cores personalizadas
        600: '#seu-hex-color',
        700: '#seu-hex-color-hover',
      }
    }
  }
}
```

### Componentes
Todos os componentes estão em `/src/components` e podem ser facilmente modificados.

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz:

```env
VITE_APP_TITLE=QR Code Generator
VITE_APP_VERSION=1.0.0
```

### Configuração do Vite
Edite `vite.config.js` para customizar:
- Porta do servidor
- Proxy para APIs
- Aliases de importação

## 🚀 Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
1. Build o projeto: `npm run build`
2. Faça upload da pasta `dist`

### GitHub Pages
```bash
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## 📱 PWA (Progressive Web App)

Para converter em PWA, adicione:

1. Service Worker
2. Manifest.json
3. Meta tags apropriadas

## 🧪 Desenvolvimento

### Estrutura de Componentes

Cada componente segue o padrão:
```jsx
import React from 'react';
// imports...

const ComponentName = ({ props }) => {
  // lógica...
  
  return (
    // JSX...
  );
};

export default ComponentName;
```

### Estado Global
O estado é gerenciado no componente `App.jsx` e passado via props.

### Hooks Customizados
- `useLocalStorage`: Persistência de dados com fallback

## 🐛 Troubleshooting

### Problema: QR Code não gera
**Solução**: Verifique o console para erros, confirme que a URL é válida.

### Problema: Histórico não salva
**Solução**: Verifique se o localStorage está habilitado no navegador.

### Problema: Cores não aplicam
**Solução**: Limpe o cache do navegador e recarregue.

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Orlando Pedrazzoli**
- Full Stack Developer & AI Engineer
- Especialista em React, Next.js e Node.js
- [Website](https://orlandopedrazzoli.com)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 🙏 Agradecimentos

- [QRCode.js](https://github.com/soldair/node-qrcode) - Biblioteca de QR Code
- [Lucide Icons](https://lucide.dev) - Ícones modernos
- [React Hot Toast](https://react-hot-toast.com) - Notificações
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS

## 📊 Roadmap

- [ ] Modo escuro
- [ ] Suporte para logos no centro do QR
- [ ] QR Code para WiFi
- [ ] QR Code para vCard
- [ ] Exportar histórico
- [ ] Integração com APIs de encurtamento
- [ ] Testes unitários
- [ ] Internacionalização (i18n)

---

Desenvolvido com ❤️ usando React + Vite + Tailwind CSS
