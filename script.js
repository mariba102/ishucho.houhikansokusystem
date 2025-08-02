const logBox = document.getElementById("log");

function log(msg) {
  const timestamp = new Date().toLocaleTimeString();
  logBox.innerText += `[${timestamp}] ${msg}\n`;
}

// サウンド検知開始
async function startFartDetection() {
  try {
    log("システム初期化中…");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    log("マイクアクセス許可👌　観測開始ッ！");

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detect() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        let value = dataArray[i] - 128;
        sum += value * value;
      }
      const volume = Math.sqrt(sum / dataArray.length);
      const db = Math.floor(volume * 100); // 擬似dB値
      log(`音量(dB): ${db}`);

      if (db > 60) { // この値はテストで調整可
        log("🚨 放屁らしき音を検知ッ！緊急放屁速報発令します！");
        setTimeout(() => {
          // window.location.href = "sokuhou.html";
        }, 1000);
      } else {
        requestAnimationFrame(detect);
      }
    }

    detect();
  } catch (err) {
    log("❌ マイクアクセス拒否されました or エラー: " + err.message);
  }
}

startFartDetection();
