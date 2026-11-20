const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testScreenshot() {
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const ch = spawn(chrome, [
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:4173/?mode=portfolio' });
    await new Promise(r => setTimeout(r, 1500));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(ss.result.data, 'base64');
    const outPath = path.join('C:\\Users\\venda\\.gemini\\antigravity\\brain\\2d4f1371-7e01-4742-ac9f-e589b2ae61e6\\screenshots', 'test_cdp_overview_390x844.png');
    fs.writeFileSync(outPath, buf);
    console.log(`Saved screenshot to ${outPath}, size: ${buf.length} bytes`);

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    ch.kill();
  }
}

testScreenshot();
