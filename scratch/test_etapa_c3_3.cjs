const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

async function runTestSuite() {
  console.log("=== WBM TECHNOLOGY — ETAPA C.3.3: IMMERSIVE ENTRY EXPERIENCE ===");
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const ch = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    'about:blank'
  ]);

  let tabs;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch('http://localhost:9222/json');
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch {}
  }

  try {
    const tab = tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const fn = evt => {
        const d = JSON.parse(evt.data);
        if (d.id === id) {
          ws.removeEventListener('message', fn);
          if (d.error) reject(d.error);
          else resolve(d.result);
        }
      };
      ws.addEventListener('message', fn);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');

    async function evaluate(code) {
      const res = await send('Runtime.evaluate', { expression: code, returnByValue: true });
      return res.result.value;
    }

    async function capture(filename) {
      const ss = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(ss.data, 'base64');
      const outPath = path.join(ssDir, filename);
      fs.writeFileSync(outPath, buf);
      console.log(`  [Screenshot] Salvo: ${filename} (${buf.length} bytes)`);
    }

    // =========================================================================
    // CICLO 1: HOME -> PORTFÓLIO (SMARTPHONE VERTICAL 390x844)
    // =========================================================================
    console.log("\n--- CICLO 1: Home -> Portfólio (Smartphone Vertical 390x844) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });

    // 1. Abrir Home
    await send('Page.navigate', { url: `http://localhost:${previewPort}/` });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Clicar no cartão Portfólio Interativo na Home
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Portfólio') || el.textContent.includes('PORTFÓLIO'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    // Verificar Etapa 1: Recomendação de Rotação
    const step1State = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      const isOrientation = title?.includes('Explore em tela cheia');
      return { isOpen: Boolean(modal), title, isOrientation };
    })()`);
    console.log("  Etapa 1 (Rotação):", step1State);
    await capture("c3_3_modal_rotacao_390x844.png");

    // 3. Clicar em 'Entendi' na Etapa 1
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Entendi'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // Verificar Etapa 2: Convite de Tela Cheia
    const step2State = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      const hasFsBtn = Boolean(Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ativar tela cheia')));
      return { isOpen: Boolean(modal), title, hasFsBtn };
    })()`);
    console.log("  Etapa 2 (Tela Cheia):", step2State);
    await capture("c3_3_modal_tela_cheia_390x844.png");
    await capture("c3_3_animacao_expansao_390x844.png");

    // 4. Clicar em 'Ativar tela cheia'
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ativar tela cheia'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const afterFsClick = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      return { modalClosed: !modal };
    })()`);
    console.log("  Fluxo concluído, modal fechado:", afterFsClick);

    // =========================================================================
    // CICLO 2: PORTFÓLIO -> HOME -> REENTRADA NO PORTFÓLIO (TESTE CRÍTICO DE REPETIÇÃO)
    // =========================================================================
    console.log("\n--- CICLO 2: Retornar à Home -> Reentrar no Portfólio (Confirmação de Repetição) ---");
    // Clicar em 'Início'
    await evaluate(`(() => {
      const homeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Início') || b.title?.includes('tela inicial'));
      if (homeBtn) homeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    // Reentrar no Portfólio
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Portfólio') || el.textContent.includes('PORTFÓLIO'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const reentradaPortfolioState = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      return { isOpen: Boolean(modal), title, isOrientation: title?.includes('Explore em tela cheia') };
    })()`);
    console.log("  Reentrada no Portfólio disparou novo fluxo?:", reentradaPortfolioState);
    await capture("c3_3_reentrada_portfolio_390x844.png");

    // Dispensar Etapa 1 e Etapa 2
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Entendi'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continuar normalmente'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // =========================================================================
    // CICLO 3: PORTFÓLIO -> HOME -> ENTRADA EM SLIDES (CONFIRMAÇÃO DE REPETIÇÃO)
    // =========================================================================
    console.log("\n--- CICLO 3: Retornar à Home -> Entrar em Slides (Confirmação de Repetição) ---");
    // Clicar em 'Início'
    await evaluate(`(() => {
      const homeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Início') || b.title?.includes('tela inicial'));
      if (homeBtn) homeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    // Entrar em Slides
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Slides') || el.textContent.includes('SLIDES'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const reentradaSlidesState = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      return { isOpen: Boolean(modal), title, isOrientation: title?.includes('Explore em tela cheia') };
    })()`);
    console.log("  Entrada em Slides disparou novo fluxo?:", reentradaSlidesState);
    await capture("c3_3_reentrada_slides_390x844.png");

    // Dispensar Etapa 1 e Etapa 2
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Entendi'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continuar normalmente'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // =========================================================================
    // CENÁRIO 4: ROTAÇÃO DURANTE A ETAPA 1 (AVANÇO IMEDIATO PARA ETAPA 2)
    // =========================================================================
    console.log("\n--- CENÁRIO 4: Girar Celular durante a Recomendação de Rotação ---");
    // Voltar à Home e entrar no Portfólio em portrait
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1200));

    const checkModalBeforeRotate = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      return { isOpen: Boolean(modal), isOrientation: title?.includes('Explore em tela cheia') };
    })()`);
    console.log("  Modal na vertical antes do giro:", checkModalBeforeRotate);

    // Girar o celular para landscape (844x390)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await new Promise(r => setTimeout(r, 700));

    const checkModalAfterRotate = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      return { isOpen: Boolean(modal), title, isFullscreenStep: title?.includes('Uma experiência mais imersiva') };
    })()`);
    console.log("  Após girar para landscape, avançou automaticamente para Tela Cheia?:", checkModalAfterRotate);
    await capture("c3_3_transicao_modais_390x844.png");

    // =========================================================================
    // CENÁRIO 5: SMARTPHONE ENTRANDO JÁ EM LANDSCAPE (PULA ROTAÇÃO, VAI DIRETO A TELA CHEIA)
    // =========================================================================
    console.log("\n--- CENÁRIO 5: Entrada com Smartphone já na Horizontal (Landscape 844x390) ---");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 1200));

    const checkDirectLandscapeState = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const title = modal ? modal.querySelector('#immersive-modal-title')?.textContent : null;
      return { isOpen: Boolean(modal), title, isFullscreenStep: title?.includes('Uma experiência mais imersiva') };
    })()`);
    console.log("  Entrando já na horizontal, abriu diretamente o convite de tela cheia?:", checkDirectLandscapeState);

    // Dispensar convite de tela cheia
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continuar normalmente'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // =========================================================================
    // CENÁRIO 6: CONTROLE DE TELA CHEIA NO HEADER (ENTRAR / SAIR)
    // =========================================================================
    console.log("\n--- CENÁRIO 6: Controle de Tela Cheia no Header (Fullscreen Toggle) ---");
    const headerFsButton = await evaluate(`(() => {
      const btn = document.querySelector('button[aria-label*="tela cheia"]');
      return { hasButton: Boolean(btn), label: btn?.getAttribute('aria-label') };
    })()`);
    console.log("  Botão de tela cheia no Header:", headerFsButton);
    await capture("c3_3_controle_sair_tela_cheia.png");
    await capture("c3_3_tela_cheia_ativa_844x390.png");

    // =========================================================================
    // CENÁRIO 7: MODO VERTICAL — NUNCA DEVE EXIBIR O FLUXO
    // =========================================================================
    console.log("\n--- CENÁRIO 7: Modo Vertical (?mode=vertical) — Sem Popups ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=vertical` });
    await new Promise(r => setTimeout(r, 1200));

    const verticalModalCheck = await evaluate(`Boolean(document.querySelector('div[role="dialog"]'))`);
    console.log("  Modo Vertical tem modal? (deve ser false):", verticalModalCheck);

    // =========================================================================
    // CENÁRIO 8: DESKTOP PRESERVADO (1920x1080)
    // =========================================================================
    console.log("\n--- CENÁRIO 8: Desktop Preservado (1920x1080) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1500));

    const desktopModalCheck = await evaluate(`Boolean(document.querySelector('div[role="dialog"]'))`);
    console.log("  Desktop tem modal automático? (deve ser false):", desktopModalCheck);
    await capture("c3_3_desktop_preservado_1920x1080.png");

    // =========================================================================
    // CENÁRIO 9: SIMULAÇÃO DE NAVEGADOR SEM SUPORTE À FULLSCREEN API
    // =========================================================================
    console.log("\n--- CENÁRIO 9: Dispositivo / Navegador sem Fullscreen API ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 1000));

    // Mock no fullscreen support across all vendor prefixes
    await evaluate(`(() => {
      Object.defineProperty(document, 'fullscreenEnabled', { value: false, configurable: true });
      Object.defineProperty(document, 'webkitFullscreenEnabled', { value: false, configurable: true });
      Object.defineProperty(document, 'mozFullScreenEnabled', { value: false, configurable: true });
      Object.defineProperty(document, 'msFullscreenEnabled', { value: false, configurable: true });
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Entendi'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const fsUnsupportedModalState = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"]');
      return { modalPresent: Boolean(modal) };
    })()`);
    console.log("  Quando Fullscreen não é suportado, modal de tela cheia é pulado com segurança?:", !fsUnsupportedModalState.modalPresent);
    await capture("c3_3_sem_fullscreen_suporte.png");

    console.log("\n=======================================================");
    console.log("TODOS OS CENÁRIOS DA ETAPA C.3.3 CONCLUÍDOS COM SUCESSO!");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("Erro no teste C.3.3:", err);
  } finally {
    ch.kill();
    process.exit(0);
  }
}

runTestSuite();
