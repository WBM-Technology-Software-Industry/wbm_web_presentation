const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewPort = 4173;
const ssDir = "C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots";

const testCases = [
  {
    filename: "mobile_overview_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_overview_360x800.png",
    url: `http://localhost:${previewPort}/?mode=portfolio`,
    width: 360,
    height: 800,
    mobile: true
  },
  {
    filename: "mobile_overview_430x932.png",
    url: `http://localhost:${previewPort}/?mode=portfolio`,
    width: 430,
    height: 932,
    mobile: true
  },
  {
    filename: "mobile_industria_initial_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_industria_panned_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&panY=-190`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_industria_focus_flowmonitor_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&hover=flow-monitor`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_saneamento_initial_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_energia_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=energia`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_pesquisa_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=pesquisa-laboratorios`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "mobile_panel_flowmonitor_390x844.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=industria&product=flow-monitor`,
    width: 390,
    height: 844,
    mobile: true
  },
  {
    filename: "tablet_saneamento_768x1024.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento`,
    width: 768,
    height: 1024,
    mobile: false
  },
  {
    filename: "laptop_saneamento_1366x768.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento`,
    width: 1366,
    height: 768,
    mobile: false
  },
  {
    filename: "desktop_saneamento_1920x1080.png",
    url: `http://localhost:${previewPort}/?mode=portfolio&sector=saneamento`,
    width: 1920,
    height: 1080,
    mobile: false
  }
];

async function run() {
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
    const send = (method, params = {}) => new Promise(res => {
      const id = msgId++;
      const fn = evt => {
        const d = JSON.parse(evt.data);
        if (d.id === id) { ws.removeEventListener('message', fn); res(d); }
      };
      ws.addEventListener('message', fn);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');

    for (const tc of testCases) {
      console.log(`Setting device metrics to ${tc.width}x${tc.height} (mobile=${tc.mobile})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: tc.width,
        height: tc.height,
        deviceScaleFactor: 1,
        mobile: tc.mobile
      });

      console.log(`Navigating to ${tc.url}...`);
      await send('Page.navigate', { url: tc.url });
      
      // Wait for layout and animations to settle
      await new Promise(r => setTimeout(r, 1600));

      const ss = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(ss.result.data, 'base64');
      const outPath = path.join(ssDir, tc.filename);
      fs.writeFileSync(outPath, buf);
      console.log(`Saved ${tc.filename} (${buf.length} bytes)`);
    }

    console.log("All screenshots captured successfully via CDP Emulation!");
    ws.close();
  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    ch.kill();
  }
}

run();
