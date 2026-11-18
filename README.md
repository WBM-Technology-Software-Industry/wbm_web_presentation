# WBM Technology — Apresentação Digital Responsiva

Experiência web institucional interativa desenvolvida para a **WBM Technology**, adaptada fielmente a partir da apresentação corporativa em PowerPoint.

O projeto foi projetado **mobile-first** para compartilhamento rápido via **WhatsApp** e **QR Code**, mantendo ao mesmo tempo uma experiência de alto padrão widescreen para desktops, notebooks e tablets.

---

## 🚀 Dois Modos de Visualização

O projeto possui dois modos integrados, acessíveis por um seletor no topo da tela:

### 1. Modo A — Apresentação Interativa em Slides
- **Navegação por slides**: Botões estilizados de avançar e retroceder.
- **Gestos touch no celular**: Suporte nativo a *swipe* (deslizar para a esquerda ou direita).
- **Controle por teclado**:
  - `→` ou `Espaço`: Próximo slide
  - `←`: Slide anterior
  - `Home` / `End`: Ir para o primeiro ou último slide
  - `F`: Ativar/desativar modo Tela Cheia (*Fullscreen*)
- **Indicador de progresso**: Barra contínua de gradiente neon no topo e bullets numerados interativos no rodapé.
- **Responsividade widescreen**: No computador preserva a composição horizontal imersiva original; no celular organiza os elementos verticalmente com tipografia otimizada.

### 2. Modo B — Apresentação Vertical (One-Page Scroll)
- **Rolagem contínua**: Página única com as 5 seções integradas.
- **Navegação lateral**: Indicador de dots com scroll suave para cada seção.
- **Botão flutuante de WhatsApp**: Acesso direto com um clique a `+55 31 99566 0752` com mensagem institucional pronta.
- **Design de alto impacto**: Fundo preto profundo, verde neon `#00DF00`, malha de nós cibernéticos e alto contraste visual.

---

## 🎨 Identidade Visual e Conteúdo

- **Cores Oficiais**: Preto puro (`#000000`), Verde Neon WBM (`#00DF00`), Branco (`#FFFFFF`) e Cinza (`#9ca3af`).
- **Geometria**: Hexágonos tecnológicos com bordas verdes brilhantes e malhas de redes neurais/telemetria.
- **Conteúdo dos 5 Slides Originais**:
  1. **Cenário**: Estatísticas de Mão de Obra (62,3% - FGV IBRE), Decisões sem Dados (53% - AVEVA) e Integração (48% - IoT Analytics).
  2. **Como Superar Esses Desafios**: Ciclo integrado de 4 etapas (Coleta de Dados, Análise com IA, Controle de Processo, Tomada de Decisão).
  3. **WBM Technology**: Posicionamento institucional, conceitos da Indústria 4.0 e fotografia real da equipe técnica em laboratório.
  4. **Clientes e Parceiros**: 14 instituições clientes (ArcelorMittal, UFMG, Maringá, 3D Aqua, Ceva, INCT, UFRJ, UFPR, VEOLIA, COPASA, UFPE, IGUÁ, UnB, LabLAAE) e parceiros de tecnologia (AQUALABO e TESTARI com GWF, KELLER e GUTERMANN).
  5. **Vamos Conversar?**: Canais diretos de contato e diagrama oficial da solução integrada VCR (Virtual Control Room), Deni AI e IoT Control LINetwork.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **Vite 6** (Build ultrarrápido)
- **Tailwind CSS 3** (Design system com utilitários customizados)
- **Lucide React** (Ícones vetoriais modernos)
- **OpenGraph & Twitter Cards** (Otimização para prévias ricas no WhatsApp)

---

## 💻 Instruções para Execução Local

### Pré-requisitos
- Node.js (v18+) e npm instalados.

### Passo a Passo

1. **Instalar dependências** (caso ainda não tenha feito):
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`.

3. **Acessar pelo Celular na mesma rede Wi-Fi**:
   O Vite exibirá no terminal o endereço de rede local (por exemplo, `http://192.168.0.67:3000`). Basta abrir essa URL no navegador do celular ou gerar um QR Code com essa URL para testar a experiência mobile real!

4. **Gerar versão de produção (Build otimizado)**:
   ```bash
   npm run build
   ```
   Os arquivos finais prontos para hospedagem estática serão gerados na pasta `dist/`.
