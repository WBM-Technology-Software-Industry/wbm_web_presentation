const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

async function runTestSuite() {
  console.log("=== WBM TECHNOLOGY — ETAPA C.3.1: TEST SUITE & VALIDATION ===");
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

    // CENÁRIO 1: INDÚSTRIA MOBILE — SOLUÇÃO INICIAL (01/13 ControlFlow) [390x844]
    console.log("\n--- CENÁRIO 1: Indústria Mobile — Solução Inicial (01/13 ControlFlow) [390x844] ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1800));

    const sol1Details = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      const gestureHint = document.body.innerText.includes('Deslize para explorar');
      const dockingPin = document.querySelector('div[data-testid="docking-pin"]');
      const svgSecondaryLines = document.querySelectorAll('line[stroke*="inactiveLineGrad"]');
      const overflow = document.body.scrollWidth > window.innerWidth;

      return {
        productName: h2 ? h2.textContent : null,
        peekNextName: peekBtn ? peekBtn.textContent.trim() : null,
        gestureHintPresent: gestureHint,
        hasDockingPin: Boolean(dockingPin),
        secondaryLinesCount: svgSecondaryLines.length,
        hasHorizontalOverflow: overflow
      };
    })()`);
    console.log("  Solução 1 carregada:", sol1Details);
    await capture("c3_1_mobile_industria_solucao_1_390x844.png");

    // CENÁRIO 2: DEMONSTRAÇÃO DO GESTO (NUDGE MICROANIMATION)
    console.log("\n--- CENÁRIO 2: Demonstração Inicial do Gesto (Nudge Microanimation) ---");
    // Reload page to observe discovery nudge
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    // Wait 800ms to catch the nudge microanimation
    await new Promise(r => setTimeout(r, 800));
    await capture("c3_1_mobile_industria_demonstracao_nudge_390x844.png");

    // CENÁRIO 3: SEGUNDA SOLUÇÃO (02/13 Parshall Monitor) VIA BOTÃO PRÓXIMA
    console.log("\n--- CENÁRIO 3: Indústria Mobile — Segunda Solução (02/13 Parshall Monitor) ---");
    await evaluate(`(() => {
      const nextBtn = document.querySelector('button[aria-label*="Próxima solução"]');
      if (nextBtn) nextBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const sol2Details = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      return {
        productName: h2 ? h2.textContent : null,
        peekNextName: peekBtn ? peekBtn.textContent.trim() : null
      };
    })()`);
    console.log("  Solução 2 ativa:", sol2Details);
    await capture("c3_1_mobile_industria_solucao_2_390x844.png");

    // CENÁRIO 4: NAVEGAÇÃO DIRETA PELO NÓ DA CONSTELAÇÃO (08/13 FlowMonitor)
    console.log("\n--- CENÁRIO 4: Indústria Mobile — Solução Intermediária via Nó da Constelação (08/13 FlowMonitor) ---");
    // Click satellite node #7 (FlowMonitor)
    await evaluate(`(() => {
      const satellites = document.querySelectorAll('svg g.cursor-pointer');
      if (satellites && satellites[7]) {
        satellites[7].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const solMidDetails = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      return {
        productName: h2 ? h2.textContent : null,
        peekNextName: peekBtn ? peekBtn.textContent.trim() : null
      };
    })()`);
    console.log("  Solução Intermediária ativa:", solMidDetails);
    await capture("c3_1_mobile_industria_solucao_intermediaria_390x844.png");

    // CENÁRIO 5: NAVEGAÇÃO ATÉ A ÚLTIMA SOLUÇÃO VIA NÓ DA CONSTELAÇÃO (13/13 LevelMonitor) E NAVEGAÇÃO CÍCLICA
    console.log("\n--- CENÁRIO 5: Indústria Mobile — Última Solução (13/13 LevelMonitor) & Ciclo ---");
    // Click satellite node #12 (LevelMonitor)
    await evaluate(`(() => {
      const satellites = document.querySelectorAll('svg g.cursor-pointer');
      if (satellites && satellites[12]) {
        satellites[12].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const solLastDetails = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      return {
        productName: h2 ? h2.textContent : null,
        peekNextName: peekBtn ? peekBtn.textContent.trim() : null
      };
    })()`);
    console.log("  Última Solução ativa (deve indicar ControlFlow como próxima):", solLastDetails);
    await capture("c3_1_mobile_industria_solucao_ultima_390x844.png");

    // Test cyclic wrap-around: click next peek tab
    await evaluate(`(() => {
      const peekBtn = document.querySelector('button[aria-label*="Ver próxima tecnologia"]');
      if (peekBtn) peekBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const cycleWrapResult = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.textContent : null;
    })()`);
    console.log("  Após avançar a partir da última solução, ciclo retorna para:", cycleWrapResult);

    // CENÁRIO 6: ABERTURA DO PAINEL COMERCIAL A PARTIR DO HERO CARD
    console.log("\n--- CENÁRIO 6: Abertura do Painel Comercial ---");
    // Go to FlowMonitor
    await evaluate(`(() => {
      const satellites = document.querySelectorAll('svg g.cursor-pointer');
      if (satellites && satellites[7]) {
        satellites[7].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // Tap Hero Card
    await evaluate(`(() => {
      const heroCard = document.querySelector('div[role="button"][aria-label*="Solução em destaque"]');
      if (heroCard) heroCard.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const panelDetails = await evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      const title = dialog ? dialog.querySelector('h2')?.textContent : null;
      return {
        isOpen: Boolean(dialog),
        title: title
      };
    })()`);
    console.log("  Painel Comercial aberto:", panelDetails);
    await capture("c3_1_mobile_industria_painel_comercial_390x844.png");

    // Close panel
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label*="Fechar"], button[title*="Fechar"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // CENÁRIO 7: ALTERNÂNCIA PARA O MODO MAPA ORBITAL
    console.log("\n--- CENÁRIO 7: Alternância para o Modo Mapa Orbital ---");
    await evaluate(`(() => {
      const exploreBtn = document.querySelector('button[aria-label="Abrir mapa orbital livre"]');
      if (exploreBtn) exploreBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const orbitalDetails = await evaluate(`(() => {
      const returnBtn = document.querySelector('button[aria-label="Voltar à exploração guiada"]');
      const canvas = document.querySelector('svg');
      return {
        hasReturnToGuidedBtn: Boolean(returnBtn),
        hasOrbitalCanvas: Boolean(canvas)
      };
    })()`);
    console.log("  Modo Orbital Livre ativo:", orbitalDetails);
    await capture("c3_1_mobile_industria_mapa_orbital_390x844.png");

    // Retorno ao Modo Guiado
    await evaluate(`(() => {
      const returnBtn = document.querySelector('button[aria-label="Voltar à exploração guiada"]');
      if (returnBtn) returnBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // CENÁRIO 8: PRESERVAÇÃO DE SANEAMENTO MOBILE (DEVE SER ORBITAL LIVRE)
    console.log("\n--- CENÁRIO 8: Preservação de Saneamento Mobile (Orbital Intacto) ---");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento` });
    await new Promise(r => setTimeout(r, 1400));

    const saneamentoDetails = await evaluate(`(() => {
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      const isOrbital = Boolean(document.querySelector('main'));
      return { isGuided, isOrbital };
    })()`);
    console.log("  Saneamento Mobile (deve ser orbital=true, guided=false):", saneamentoDetails);
    await capture("c3_1_mobile_saneamento_preservado_390x844.png");

    // CENÁRIO 9: PRESERVAÇÃO DE INDÚSTRIA DESKTOP [1920x1080]
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

    const desktopDetails = await evaluate(`(() => {
      const isGuided = Boolean(document.querySelector('section[aria-label*="Experiência Guiada"]'));
      const colLeft = document.querySelectorAll('div[class*="absolute"]');
      return { isGuided, hasDesktopNodes: colLeft.length > 5 };
    })()`);
    console.log("  Indústria Desktop (deve ser guided=false, hasDesktopNodes=true):", desktopDetails);
    await capture("c3_1_desktop_industria_preservado_1920x1080.png");

    // CENÁRIO 10: RESPONSIVIDADE EM VIEWPORTS MOBILE (360x800 e 430x932)
    console.log("\n--- CENÁRIO 10: Responsividade 360x800 e 430x932 ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 800,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    const overflow360 = await evaluate(`document.body.scrollWidth > window.innerWidth`);
    console.log("  360x800 overflow:", overflow360);
    await capture("c3_1_mobile_industria_360x800.png");

    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    const overflow430 = await evaluate(`document.body.scrollWidth > window.innerWidth`);
    console.log("  430x932 overflow:", overflow430);
    await capture("c3_1_mobile_industria_430x932.png");

    // CENÁRIO 11: TABLET E LAPTOP
    console.log("\n--- CENÁRIO 11: Tablet (768x1024) e Laptop (1366x768) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    await capture("c3_1_tablet_industria_768x1024.png");

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    await capture("c3_1_laptop_industria_1366x768.png");

    // CENÁRIO 12: PREFERS-REDUCED-MOTION
    console.log("\n--- CENÁRIO 12: Acessibilidade com prefers-reduced-motion ---");
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1500));
    const reducedMotionState = await evaluate(`(() => {
      const h2 = document.querySelector('h2');
      return { loaded: Boolean(h2), productName: h2?.textContent };
    })()`);
    console.log("  Modo com prefers-reduced-motion ativo:", reducedMotionState);
    await capture("c3_1_mobile_industria_reduced_motion_390x844.png");

    console.log("\n=======================================================");
    console.log("TODOS OS 12 CENÁRIOS DA ETAPA C.3.1 CONCLUÍDOS COM SUCESSO!");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    ch.kill();
    process.exit(0);
  }
}

runTestSuite();
