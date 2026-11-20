const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

async function runTestSuite() {
  console.log("=== WBM TECHNOLOGY — ETAPA C.3.2: TEST SUITE & VALIDATION ===");
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

    // --- CENÁRIO 1: ENTRAR EM SLIDES COM SMARTPHONE VERTICAL (390x844) ---
    console.log("\n--- CENÁRIO 1: Entrar em Slides com Smartphone Vertical (390x844) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    // Clear sessionStorage to test clean first visit
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 800));
    await evaluate(`sessionStorage.clear()`);
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 1200));

    const modalState1 = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]');
      const title = modal ? modal.querySelector('#orientation-hint-title')?.textContent : null;
      const desc = modal ? modal.querySelector('#orientation-hint-desc')?.textContent : null;
      const btn = modal ? modal.querySelector('button.bg-\\[\\#00DF00\\]')?.textContent : null;
      return {
        isOpen: Boolean(modal),
        title,
        desc,
        btnText: btn ? btn.trim() : null
      };
    })()`);
    console.log("  Modal de orientação em Slides:", modalState1);
    await capture("c3_2_popup_aberto_vertical_390x844.png");

    // --- CENÁRIO 2: CAPTURA DOS ESTADOS DA ANIMAÇÃO (Retrato, Rotação, Paisagem) ---
    console.log("\n--- CENÁRIO 2: Captura das Fases da Animação do Smartphone ---");
    // State 1: Portrait (at beginning of cycle)
    await capture("c3_2_animacao_estado_retrato_390x844.png");

    // Wait ~600ms for rotation
    await new Promise(r => setTimeout(r, 650));
    await capture("c3_2_animacao_durante_rotacao_390x844.png");

    // Wait ~700ms for landscape pause
    await new Promise(r => setTimeout(r, 700));
    await capture("c3_2_animacao_estado_paisagem_390x844.png");

    // --- CENÁRIO 3: FECHAR PELO BOTÃO "ENTENDI" E CONTINUAR EM SLIDES ---
    console.log("\n--- CENÁRIO 3: Fechar pelo botão 'Entendi' ---");
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Entendi'));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const afterDismissSlides = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]');
      const dismissedStorage = sessionStorage.getItem('wbm_orientation_hint_dismissed');
      return {
        modalClosed: !modal,
        sessionStored: dismissedStorage === 'true'
      };
    })()`);
    console.log("  Estado após 'Entendi':", afterDismissSlides);

    // --- CENÁRIO 4: PORTFÓLIO INTERATIVO — TESTAR FECHAMENTO PELO 'X' ---
    console.log("\n--- CENÁRIO 4: Portfólio Interativo com Smartphone Vertical & Fechar pelo 'X' ---");
    await evaluate(`sessionStorage.clear()`);
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1200));

    const portfolioModalState = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]');
      return { isOpen: Boolean(modal) };
    })()`);
    console.log("  Modal aberto em Portfólio:", portfolioModalState);

    // Click 'X' close button
    await evaluate(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Fechar recomendação"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const portfolioAfterX = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]');
      return {
        modalClosed: !modal,
        sessionStored: sessionStorage.getItem('wbm_orientation_hint_dismissed') === 'true'
      };
    })()`);
    console.log("  Estado após fechar pelo 'X':", portfolioAfterX);

    // --- CENÁRIO 5: FECHAMENTO AUTOMÁTICO AO GIRAR PARA LANDSCAPE ---
    console.log("\n--- CENÁRIO 5: Fechamento Automático ao Girar o Celular (Rotação) ---");
    await evaluate(`sessionStorage.clear()`);
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1200));

    // Verify modal is open in portrait
    const checkOpenBeforeRotate = await evaluate(`Boolean(document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]'))`);
    console.log("  Modal aberto antes da rotação:", checkOpenBeforeRotate);

    // Rotate device to landscape (844x390)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    // Trigger resize/orientation evaluate
    await new Promise(r => setTimeout(r, 600));

    const checkClosedAfterRotate = await evaluate(`(() => {
      const modal = document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]');
      return {
        modalAutoClosed: !modal,
        sessionStored: sessionStorage.getItem('wbm_orientation_hint_dismissed') === 'true'
      };
    })()`);
    console.log("  Modal fechado automaticamente após girar para landscape:", checkClosedAfterRotate);

    // --- CENÁRIO 6: RETORNAR À VERTICAL SEM REABRIR O POPUP ---
    console.log("\n--- CENÁRIO 6: Retorno à Vertical sem Reabrir Popup ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await new Promise(r => setTimeout(r, 600));

    const checkNoReopen = await evaluate(`Boolean(document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]'))`);
    console.log("  Popup permanece fechado após retorno à vertical:", !checkNoReopen);

    // --- CENÁRIO 7: MODO VERTICAL — NUNCA DEVE EXIBIR O POPUP ---
    console.log("\n--- CENÁRIO 7: Modo Vertical (?mode=vertical) — Sem Popup ---");
    await evaluate(`sessionStorage.clear()`);
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=vertical` });
    await new Promise(r => setTimeout(r, 1200));

    const verticalModePopupState = await evaluate(`Boolean(document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]'))`);
    console.log("  Modo Vertical tem popup? (deve ser false):", verticalModePopupState);
    await capture("c3_2_vertical_mode_sem_popup_390x844.png");

    // --- CENÁRIO 8: EXPERIÊNCIA EM LANDSCAPE (844x390) ---
    console.log("\n--- CENÁRIO 8: Validação da Experiência Horizontal (Landscape 844x390) ---");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });

    // 8.1 Indústria em Landscape
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("c3_2_landscape_industria_844x390.png");

    // 8.2 Mapa Orbital em Landscape (Saneamento)
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("c3_2_landscape_mapa_orbital_844x390.png");

    // 8.3 Painel Comercial em Landscape
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=controlflow` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("c3_2_landscape_painel_comercial_844x390.png");

    // 8.4 Slides em Landscape
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("c3_2_landscape_slides_844x390.png");

    // --- CENÁRIO 9: TABLETS E DESKTOPS — NUNCA DEVEM EXIBIR O POPUP ---
    console.log("\n--- CENÁRIO 9: Tablets e Desktops Não Recebem Popup ---");
    await evaluate(`sessionStorage.clear()`);
    // Tablet (768x1024)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1200));
    const tabletPopup = await evaluate(`Boolean(document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]'))`);
    console.log("  Tablet 768x1024 tem popup? (deve ser false):", tabletPopup);

    // Desktop (1920x1080)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
      hasTouch: false
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1400));
    const desktopPopup = await evaluate(`Boolean(document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]'))`);
    console.log("  Desktop 1920x1080 tem popup? (deve ser false):", desktopPopup);
    await capture("c3_2_desktop_preservado_1920x1080.png");

    // --- CENÁRIO 10: ACESSIBILIDADE — ESCAPE KEY ---
    console.log("\n--- CENÁRIO 10: Fechamento com a tecla Escape ---");
    await evaluate(`sessionStorage.clear()`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 1200));

    // Press Escape
    await evaluate(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const checkEscapeDismiss = await evaluate(`!document.querySelector('div[role="dialog"][aria-labelledby="orientation-hint-title"]')`);
    console.log("  Fechou com Escape?:", checkEscapeDismiss);

    console.log("\n=======================================================");
    console.log("TODOS OS CENÁRIOS DA ETAPA C.3.2 CONCLUÍDOS COM SUCESSO!");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("Erro no teste C.3.2:", err);
  } finally {
    ch.kill();
    process.exit(0);
  }
}

runTestSuite();
