const { spawn } = require('child_process');

async function test() {
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const ch = spawn(chrome, ['--headless=new', '--remote-debugging-port=9222', 'http://localhost:4173/?mode=portfolio']);
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await (await fetch('http://localhost:9222/json')).json();
  const tab = tabs.find(t => t.url.includes('portfolio'));
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

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await new Promise(r => setTimeout(r, 500));
  const r = await send('Runtime.evaluate', { 
    expression: `(() => {
      const main = document.querySelector('main');
      const nucleus = document.querySelector('span.tracking-widest')?.closest('div.absolute');
      const nRect = nucleus ? nucleus.getBoundingClientRect() : null;
      return JSON.stringify({
        innerWidth: window.innerWidth,
        mainClientW: main ? main.clientWidth : null,
        nucleus: nRect ? {
          left: nRect.left,
          right: nRect.right,
          width: nRect.width,
          center: nRect.left + nRect.width / 2
        } : null
      }, null, 2);
    })()` 
  });
  console.log('Full r:', JSON.stringify(r));
  ws.close();
  ch.kill();
}
test();
