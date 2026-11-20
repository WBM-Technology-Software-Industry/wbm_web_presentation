const http = require('http');
const { spawn } = require('child_process');

async function main() {
  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const ch = spawn(chrome, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "http://localhost:4173/?mode=portfolio"
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch("http://localhost:9222/json");
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes("portfolio"));
    if (!tab) {
      console.log("No tab found");
      return;
    }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Set device metrics override to 390x844 mobile!
    await sendCommand("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });

    // Wait a brief moment for resize to fire
    await new Promise(r => setTimeout(r, 500));

    const evalRes = await sendCommand("Runtime.evaluate", {
      expression: `(() => {
        const main = document.querySelector('main');
        const nucleus = document.querySelector('img[alt="WBM Technology"]').closest('div[style*="500px"]').getBoundingClientRect();
        return JSON.stringify({
          windowInnerWidth: window.innerWidth,
          mainWidth: main.clientWidth,
          nucleus: {
            left: nucleus.left,
            width: nucleus.width,
            center: nucleus.left + nucleus.width / 2
          }
        });
      })()`
    });

    console.log("With Emulation.setDeviceMetricsOverride(390, 844):");
    console.log(evalRes.result.value);

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    ch.kill();
  }
}

main();
