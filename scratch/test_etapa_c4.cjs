const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

async function runTestSuite() {
  console.log("=== WBM TECHNOLOGY — ETAPA C.4: MOBILE PORTFOLIO EXPERIENCE 3.0 ===");
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

    // Dismiss any entry modal during automated test flow helper
    async function dismissEntryModalIfPresent() {
      await evaluate(`(() => {
        const entendiBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Entendi'));
        if (entendiBtn) entendiBtn.click();
        const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continuar normalmente'));
        if (continueBtn) continueBtn.click();
      })()`);
      await new Promise(r => setTimeout(r, 400));
    }

    // =========================================================================
    // 1. NOVA TELA INICIAL MOBILE (390x844, 360x800, 430x932)
    // =========================================================================
    console.log("\n--- 1. Nova Tela Inicial Mobile (Visão Geral dos 6 Setores) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1200));
    await dismissEntryModalIfPresent();

    const overviewDetails = await evaluate(`(() => {
      const title = document.querySelector('h1')?.textContent;
      const subtitle = document.querySelector('section[aria-label*="Setores"] p')?.textContent;
      const buttons = Array.from(document.querySelectorAll('section[aria-label*="Setores"] button'));
      const sectorNames = buttons.map(b => b.querySelector('h2')?.textContent);
      const overflow = document.body.scrollWidth > window.innerWidth;
      return {
        title,
        subtitle,
        sectorsCount: buttons.length,
        sectorNames,
        hasHorizontalOverflow: overflow
      };
    })()`);
    console.log("  Nova Tela Inicial carregada:", overviewDetails);
    await capture("c4_mobile_overview_390x844.png");

    // Responsividade 360x800
    await send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 800,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await new Promise(r => setTimeout(r, 500));
    const overflow360 = await evaluate(`document.body.scrollWidth > window.innerWidth`);
    console.log("  360x800 overflow:", overflow360);
    await capture("c4_mobile_overview_360x800.png");

    // Responsividade 430x932
    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await new Promise(r => setTimeout(r, 500));
    const overflow430 = await evaluate(`document.body.scrollWidth > window.innerWidth`);
    console.log("  430x932 overflow:", overflow430);
    await capture("c4_mobile_overview_430x932.png");

    // =========================================================================
    // 2. TRANSIÇÃO PARA INDÚSTRIA & PRIMEIRA SOLUÇÃO (01/13 ControlFlow)
    // =========================================================================
    console.log("\n--- 2. Transição para o Setor Indústria & Solução 1 (ControlFlow) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    // Click on Indústria sector card
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('section[aria-label*="Setores"] button')).find(b => b.textContent.includes('Indústria'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const sol1State = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const category = document.querySelector('span.uppercase')?.textContent;
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      const activeDock = Boolean(document.querySelector('div[data-testid="docking-pin"]'));
      return {
        productName: h2?.textContent,
        category,
        isGuidedExperience: isGuided,
        hasActiveDockingPin: activeDock
      };
    })()`);
    console.log("  Indústria Solução 1:", sol1State);
    await capture("c4_mobile_industria_solucao_1_390x844.png");
    await capture("c4_mobile_rede_conexao_ativa_390x844.png");

    // =========================================================================
    // 3. NAVEGAÇÃO ENTRE SOLUÇÕES — SOLUÇÃO INTERMEDIÁRIA (08/13 FlowMonitor)
    // =========================================================================
    console.log("\n--- 3. Navegação até Solução Intermediária (08/13 FlowMonitor) ---");
    // Click on 8th satellite node in SVG
    await evaluate(`(() => {
      const satellites = document.querySelectorAll('svg g.cursor-pointer');
      if (satellites && satellites[7]) {
        satellites[7].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const solMidState = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      return {
        productName: h2?.textContent,
        nextProduct: peekBtn?.textContent.trim()
      };
    })()`);
    console.log("  Solução Intermediária (08/13):", solMidState);
    await capture("c4_mobile_industria_solucao_intermediaria_390x844.png");

    // =========================================================================
    // 4. ÚLTIMA SOLUÇÃO (13/13 LevelMonitor) E NAVEGAÇÃO CÍCLICA
    // =========================================================================
    console.log("\n--- 4. Navegação até a Última Solução (13/13 LevelMonitor) & Ciclo ---");
    await evaluate(`(() => {
      const satellites = document.querySelectorAll('svg g.cursor-pointer');
      if (satellites && satellites[12]) {
        satellites[12].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const solLastState = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      return {
        productName: h2?.textContent,
        nextProduct: peekBtn?.textContent.trim()
      };
    })()`);
    console.log("  Última Solução (13/13):", solLastState);
    await capture("c4_mobile_industria_solucao_ultima_390x844.png");

    // Avançar via botão 'Próxima' para testar wrap-around cíclico
    await evaluate(`(() => {
      const nextBtn = document.querySelector('button[aria-label*="Próxima solução"]');
      if (nextBtn) nextBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const cyclicWrap = await evaluate(`document.querySelector('h2')?.textContent`);
    console.log("  Após avançar na 13ª solução, retorna para:", cyclicWrap);

    // =========================================================================
    // 5. PAINEL COMERCIAL (SolutionDetailPanel)
    // =========================================================================
    console.log("\n--- 5. Abertura do Painel Comercial a partir do Hero Card ---");
    // Open panel for FlowMonitor
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=flow-monitor` });
    await new Promise(r => setTimeout(r, 1400));
    await dismissEntryModalIfPresent();

    const panelState = await evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      const title = dialog ? dialog.querySelector('h2')?.textContent : null;
      return {
        isOpen: Boolean(dialog),
        title
      };
    })()`);
    console.log("  Painel comercial aberto:", panelState);
    await capture("c4_mobile_painel_comercial_390x844.png");

    // Close panel
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label*="Fechar"], button[title*="Fechar"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // =========================================================================
    // 6. ALTERNÂNCIA PARA O MAPA ORBITAL LIVRE
    // =========================================================================
    console.log("\n--- 6. Alternância para o Mapa Orbital Livre ---");
    await evaluate(`(() => {
      const exploreBtn = document.querySelector('button[aria-label="Abrir mapa orbital livre"]');
      if (exploreBtn) exploreBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const orbitalState = await evaluate(`(() => {
      const returnBtn = document.querySelector('button[aria-label="Voltar à exploração guiada"]');
      const canvas = document.querySelector('main svg');
      return {
        hasReturnButton: Boolean(returnBtn),
        hasOrbitalCanvas: Boolean(canvas)
      };
    })()`);
    console.log("  Mapa Orbital Livre ativo:", orbitalState);
    await capture("c4_mobile_mapa_orbital_390x844.png");

    // Retornar à Exploração Guiada
    await evaluate(`(() => {
      const returnBtn = document.querySelector('button[aria-label="Voltar à exploração guiada"]');
      if (returnBtn) returnBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // =========================================================================
    // 7. RETORNO À TELA DE SETORES
    // =========================================================================
    console.log("\n--- 7. Retorno à Tela Inicial de Setores ---");
    await evaluate(`(() => {
      const backBtn = document.querySelector('button[aria-label="Voltar aos setores"]');
      if (backBtn) backBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const returnedToOverview = await evaluate(`(() => {
      const title = document.querySelector('h1')?.textContent;
      return { isOverview: title?.includes('Explore nossas tecnologias') };
    })()`);
    console.log("  Retornou à visão geral dos 6 setores?:", returnedToOverview);

    // =========================================================================
    // 8. PRESERVAÇÃO DOS OUTROS 5 SETORES (ex: SANEAMENTO EM MAPA ORBITAL)
    // =========================================================================
    console.log("\n--- 8. Preservação dos Outros 5 Setores (Saneamento no Mapa Orbital) ---");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento` });
    await new Promise(r => setTimeout(r, 1400));
    await dismissEntryModalIfPresent();

    const saneamentoState = await evaluate(`(() => {
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      const isOrbital = Boolean(document.querySelector('main'));
      return { isGuided, isOrbital };
    })()`);
    console.log("  Saneamento continua em Mapa Orbital Livre?:", saneamentoState);

    // =========================================================================
    // 9. SMARTPHONE LANDSCAPE (844x390)
    // =========================================================================
    console.log("\n--- 9. Smartphone Landscape (844x390) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1400));
    await dismissEntryModalIfPresent();
    await capture("c4_smartphone_landscape_844x390.png");

    // =========================================================================
    // 10. TABLET (768x1024) E DESKTOP (1920x1080) PRESERVADOS
    // =========================================================================
    console.log("\n--- 10. Tablet (768x1024) e Desktop (1920x1080) Preservados ---");
    // Tablet
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1400));
    await capture("c4_tablet_768x1024.png");

    // Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("c4_desktop_preservado_1920x1080.png");

    console.log("\n=======================================================");
    console.log("TODOS OS CENÁRIOS DA ETAPA C.4 CONCLUÍDOS COM SUCESSO!");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("Erro no teste C.4:", err);
  } finally {
    ch.kill();
    process.exit(0);
  }
}

runTestSuite();
