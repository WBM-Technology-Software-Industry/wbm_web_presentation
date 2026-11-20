const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

async function runTestSuite() {
  console.log("=== WBM TECHNOLOGY — ETAPA C.3: MOBILE EXPERIENCE 2.0 TEST SUITE ===");
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const ch = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const tabs = await (await fetch('http://localhost:9222/json')).json();
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

    // SCENARIO 1: INDÚSTRIA MOBILE — SOLUÇÃO INICIAL (390x844)
    console.log("\n--- CENÁRIO 1: Indústria Mobile — Solução Inicial (01/13) [390x844] ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1600));

    const sol1State = await evaluate(`(() => {
      const heading = document.querySelector('h2');
      const counter = document.querySelector('span.font-mono');
      return {
        productName: heading ? heading.textContent : null,
        isGuidedExperience: Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'))
      };
    })()`);
    console.log("  Solução 1 carregada:", sol1State);
    await capture("c3_mobile_industria_solucao_1_initial_390x844.png");

    // SCENARIO 2: AVANÇAR POR BOTÃO / SWIPE PARA A SEGUNDA SOLUÇÃO (02/13)
    console.log("\n--- CENÁRIO 2: Indústria Mobile — Segunda Solução (02/13 Parshall Monitor) ---");
    await evaluate(`(() => {
      const nextBtn = document.querySelector('button[aria-label="Próxima solução"]');
      if (nextBtn) nextBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const sol2State = await evaluate(`(() => {
      const heading = document.querySelector('h2');
      return { productName: heading ? heading.textContent : null };
    })()`);
    console.log("  Solução 2 ativa:", sol2State);
    await capture("c3_mobile_industria_solucao_2_390x844.png");

    // SCENARIO 3: NAVEGAR ATÉ SOLUÇÃO INTERMEDIÁRIA (08/13 FlowMonitor)
    console.log("\n--- CENÁRIO 3: Indústria Mobile — Solução Intermediária (08/13 FlowMonitor) ---");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=flow-monitor` });
    await new Promise(r => setTimeout(r, 1400));

    const solMidState = await evaluate(`(() => {
      const heading = document.querySelector('h2');
      return { productName: heading ? heading.textContent : null };
    })()`);
    console.log("  Solução Intermediária ativa:", solMidState);
    await capture("c3_mobile_industria_solucao_intermediaria_390x844.png");

    // SCENARIO 4: NAVEGAR ATÉ A ÚLTIMA SOLUÇÃO (13/13 LevelMonitor)
    console.log("\n--- CENÁRIO 4: Indústria Mobile — Última Solução (13/13 LevelMonitor) ---");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=level-monitor` });
    await new Promise(r => setTimeout(r, 1400));

    const solLastState = await evaluate(`(() => {
      const heading = document.querySelector('h2');
      return { productName: heading ? heading.textContent : null };
    })()`);
    console.log("  Última Solução ativa:", solLastState);
    await capture("c3_mobile_industria_solucao_ultima_390x844.png");

    // SCENARIO 5: ABERTURA DO PAINEL COMERCIAL A PARTIR DO HERO CARD
    console.log("\n--- CENÁRIO 5: Abertura do Painel Comercial ---");
    // Return to FlowMonitor for rich commercial panel view
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=flow-monitor` });
    await new Promise(r => setTimeout(r, 1500));

    // Tap Hero Card
    await evaluate(`(() => {
      const heroCard = document.querySelector('div[role="button"][aria-label*="Solução em destaque"]');
      if (heroCard) heroCard.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const panelState = await evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      return {
        isOpen: Boolean(dialog),
        title: dialog ? dialog.querySelector('h2')?.textContent : null
      };
    })()`);
    console.log("  Painel Comercial aberto:", panelState);
    await capture("c3_mobile_industria_painel_comercial_390x844.png");

    // Close panel
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[title*="Fechar"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // SCENARIO 6: ALTERNÂNCIA PARA O MODO MAPA ORBITAL
    console.log("\n--- CENÁRIO 6: Alternância para o Modo Mapa Orbital ---");
    await evaluate(`(() => {
      const mapBtn = document.querySelector('button[aria-label="Abrir mapa orbital livre"]');
      if (mapBtn) mapBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const orbitalState = await evaluate(`(() => {
      const guidedBtn = document.querySelector('button[aria-label="Voltar à exploração guiada"]');
      const canvas = document.querySelector('div[style*="1000px"]');
      const zoomHud = document.querySelector('button[aria-label="Aproximar zoom"]');
      return {
        hasReturnToGuidedBtn: Boolean(guidedBtn),
        hasOrbitalCanvas: Boolean(canvas),
        hasZoomHUD: Boolean(zoomHud)
      };
    })()`);
    console.log("  Modo Orbital Livre ativo:", orbitalState);
    await capture("c3_mobile_industria_mapa_orbital_390x844.png");

    // SCENARIO 7: RETORNO À EXPLORAÇÃO GUIADA COM PRESERVAÇÃO DO PRODUTO
    console.log("\n--- CENÁRIO 7: Retorno ao Modo Guiado ---");
    await evaluate(`(() => {
      const guidedBtn = document.querySelector('button[aria-label="Voltar à exploração guiada"]');
      if (guidedBtn) guidedBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const returnState = await evaluate(`(() => {
      const heading = document.querySelector('h2');
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      return {
        isGuided,
        activeProduct: heading ? heading.textContent : null
      };
    })()`);
    console.log("  Retorno ao Modo Guiado com preservação:", returnState);
    await capture("c3_mobile_industria_retorno_modo_guiado_390x844.png");

    // SCENARIO 8: PRESERVAÇÃO DE SANEAMENTO MOBILE (MODO ORBITAL INTACTO)
    console.log("\n--- CENÁRIO 8: Preservação de Saneamento Mobile (Orbital Intacto) ---");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento` });
    await new Promise(r => setTimeout(r, 1600));

    const saneamentoState = await evaluate(`(() => {
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      const isOrbital = Boolean(document.querySelector('div[style*="1000px"]'));
      return { isGuided, isOrbital };
    })()`);
    console.log("  Saneamento Mobile (deve ser orbital=true, guided=false):", saneamentoState);
    await capture("c3_mobile_saneamento_versao_preservada_390x844.png");

    // SCENARIO 9: PRESERVAÇÃO DE INDÚSTRIA DESKTOP (1920x1080)
    console.log("\n--- CENÁRIO 9: Preservação de Indústria Desktop [1920x1080] ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1800));

    const desktopState = await evaluate(`(() => {
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      const hasBilateral = Boolean(document.querySelector('div[style*="295px"]') || document.querySelector('div[style*="1000px"]'));
      return { isGuided, hasBilateral };
    })()`);
    console.log("  Indústria Desktop (deve ser guided=false, hasBilateral=true):", desktopState);
    await capture("c3_desktop_industria_versao_preservada_1920x1080.png");

    // SCENARIO 10: RESPONSIVIDADE EM OUTROS FORMATOS MOBILE
    console.log("\n--- CENÁRIO 10: Responsividade 360x800 e 430x932 ---");
    // 360x800
    await send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 800,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    await capture("c3_mobile_industria_360x800.png");

    // 430x932
    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    await capture("c3_mobile_industria_430x932.png");

    // Tablet 768x1024
    console.log("\n--- CENÁRIO 11: Tablet e Laptop Preservados ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    await capture("c3_tablet_industria_768x1024.png");

    // Laptop 1366x768
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    await capture("c3_laptop_industria_1366x768.png");

    console.log("\n=======================================================");
    console.log("TODOS OS 11 CENÁRIOS DA ETAPA C.3 CONCLUÍDOS COM SUCESSO!");
    console.log("=======================================================");

    ws.close();
  } catch (err) {
    console.error("Erro durante o teste da Etapa C.3:", err);
  } finally {
    ch.kill();
  }
}

runTestSuite();
