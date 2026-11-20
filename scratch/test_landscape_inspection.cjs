const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

async function inspectLandscape() {
  console.log("=== INSPECTING LANDSCAPE VIEWPORTS (844x390, 800x360) ===");
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

    // 1. Portfolio Overview in 844x390
    console.log("\n1. Portfolio Overview [844x390]");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("inspect_landscape_overview_844x390.png");

    // 2. Portfolio Indústria in 844x390
    console.log("\n2. Portfolio Indústria [844x390]");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("inspect_landscape_industria_844x390.png");

    // 3. Portfolio Saneamento in 844x390
    console.log("\n3. Portfolio Saneamento [844x390]");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("inspect_landscape_saneamento_844x390.png");

    // 4. Slides Mode in 844x390
    console.log("\n4. Slides Mode [844x390]");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=slides` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("inspect_landscape_slides_844x390.png");

    // 5. Solution Detail Panel in 844x390
    console.log("\n5. Detail Panel in 844x390");
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=controlflow` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("inspect_landscape_panel_844x390.png");

    // 6. Portfolio Indústria in extreme short landscape (800x360)
    console.log("\n6. Portfolio Indústria [800x360]");
    await send('Emulation.setDeviceMetricsOverride', {
      width: 800,
      height: 360,
      deviceScaleFactor: 1,
      mobile: true,
      hasTouch: true
    });
    await send('Page.navigate', { url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria` });
    await new Promise(r => setTimeout(r, 1600));
    await capture("inspect_landscape_industria_800x360.png");

    console.log("\nInspection complete!");

  } catch (err) {
    console.error("Erro na inspeção:", err);
  } finally {
    ch.kill();
    process.exit(0);
  }
}

inspectLandscape();
