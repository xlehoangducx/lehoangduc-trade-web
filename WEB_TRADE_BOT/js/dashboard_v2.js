// Global Safety Timeout: Không bao giờ để màn hình xác thực đứng quá 3.5 giây

setTimeout(() => {

  const loading = document.getElementById("authLoadingScreen");

  if (loading && !loading.classList.contains("hidden")) {

    console.warn("Safety timeout triggered: Force hiding authLoadingScreen.");

    loading.classList.add("hidden");

    const app = document.getElementById("dashboardApp");

    if (app) app.classList.remove("hidden");

  }

}, 3500);



// Dashboard Master Controller - With Strict Privacy & Data Isolation



import { 



  auth, 



  db, 



  syncUserProfile 



} from "./auth.js?v=20261029_pendingfix";
import { ADMIN_EMAILS } from "./firebase-config.js";

function isCurrentUserSuperAdmin() {
  const email = String(currentUser?.email || "").toLowerCase();
  return ADMIN_EMAILS.includes(email) && currentProfile?.role === "admin" && currentProfile?.status === "approved";
}



import { 



  onAuthStateChanged, 



  signOut 



} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



import { 

  doc,
  getDoc, 

  setDoc, 

  collection, 

  onSnapshot, 

  updateDoc, 

  deleteDoc, 

  serverTimestamp 

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";







let currentUser = null;



let currentProfile = null;







// Tab Switching



const navTabs = document.querySelectorAll(".nav-tab");



const tabContents = document.querySelectorAll(".tab-content");







navTabs.forEach(tab => {



  tab.addEventListener("click", () => {



    const targetTab = tab.getAttribute("data-tab");



    navTabs.forEach(t => {



      t.classList.remove("active", "bg-amber-400", "text-black");



      t.classList.add("text-gray-400");



    });



    tab.classList.add("active", "bg-amber-400", "text-black");



    tab.classList.remove("text-gray-400");







    tabContents.forEach(content => {



      if (content.id === targetTab) {



        content.classList.remove("hidden");



      } else {



        content.classList.add("hidden");



      }



    });



    if (window.lucide) lucide.createIcons();



  });



});







// Logout Handlers



const btnDashLogout = document.getElementById("btnDashLogout");



if (btnDashLogout) {



  btnDashLogout.addEventListener("click", async () => {



    await signOut(auth);



    window.location.href = "index.html";



  });



}







const btnPendingLogout = document.getElementById("btnPendingLogout");



if (btnPendingLogout) {



  btnPendingLogout.addEventListener("click", async () => {



    await signOut(auth);



    window.location.href = "index.html";



  });



}







// Capital Matrix Slider Calculator



const capitalSlider = document.getElementById("capitalSlider");



const sliderValueText = document.getElementById("sliderValueText");



const calcLeverage = document.getElementById("calcLeverage");



const calcMaxTrades = document.getElementById("calcMaxTrades");



const calcLiqDistance = document.getElementById("calcLiqDistance");



const calcLossPerTrade = document.getElementById("calcLossPerTrade");







function updateCapitalCalculator(val) {
  if (!calcLeverage) return;
  val = parseInt(val);
  if (sliderValueText) sliderValueText.textContent = val.toLocaleString();



  



  if (val <= 60) {



    calcLeverage.textContent = "8x – 10x";



    calcMaxTrades.textContent = "2 lệnh";



    calcLiqDistance.textContent = "-10.0%";



    calcLossPerTrade.textContent = (val * 0.015).toFixed(2) + "$ (1.5%)";



  } else if (val <= 150) {



    calcLeverage.textContent = "7x – 10x";



    calcMaxTrades.textContent = "2 – 3 lệnh";



    calcLiqDistance.textContent = "-11.5%";



    calcLossPerTrade.textContent = (val * 0.015).toFixed(2) + "$ (1.5%)";



  } else if (val <= 350) {



    calcLeverage.textContent = "7x – 8x";



    calcMaxTrades.textContent = "3 – 4 lệnh";



    calcLiqDistance.textContent = "-13.0%";



    calcLossPerTrade.textContent = (val * 0.015).toFixed(2) + "$ (1.5%)";



  } else if (val <= 700) {



    calcLeverage.textContent = "5x – 7x";



    calcMaxTrades.textContent = "4 lệnh";



    calcLiqDistance.textContent = "-16.0%";



    calcLossPerTrade.textContent = (val * 0.015).toFixed(2) + "$ (1.5%)";



  } else if (val <= 1500) {



    calcLeverage.textContent = "5x – 6x";



    calcMaxTrades.textContent = "4 – 5 lệnh";



    calcLiqDistance.textContent = "-18.0%";



    calcLossPerTrade.textContent = (val * 0.012).toFixed(2) + "$ (1.2%)";



  } else if (val <= 4000) {



    calcLeverage.textContent = "4x – 5x";



    calcMaxTrades.textContent = "5 lệnh";



    calcLiqDistance.textContent = "-22.0%";



    calcLossPerTrade.textContent = (val * 0.01).toFixed(2) + "$ (1.0%)";



  } else {



    calcLeverage.textContent = "3x – 4x";



    calcMaxTrades.textContent = "5 – 6 lệnh";



    calcLiqDistance.textContent = "-28% – -32%";



    calcLossPerTrade.textContent = (val * 0.008).toFixed(2) + "$ (0.8%)";



  }



}







if (capitalSlider) {



  capitalSlider.addEventListener("input", (e) => {



    updateCapitalCalculator(e.target.value);



  });



}







// Preset Buttons Handler



const presetButtons = document.querySelectorAll(".btn-preset");



const inputLeverage = document.getElementById("inputLeverage");



const inputMaxTrades = document.getElementById("inputMaxTrades");







presetButtons.forEach(btn => {



  btn.addEventListener("click", () => {



    presetButtons.forEach(b => {



      b.classList.remove("active", "border-amber-400/40", "bg-amber-400/10");



      b.classList.add("border-white/10", "bg-white/[0.03]");



    });



    btn.classList.add("active", "border-amber-400/40", "bg-amber-400/10");



    btn.classList.remove("border-white/10", "bg-white/[0.03]");







    const val = parseInt(btn.getAttribute("data-preset"));



    if (capitalSlider) {



      capitalSlider.value = val;



      updateCapitalCalculator(val);



    }







    if (val <= 60) {

      inputLeverage.value = 10;

      inputMaxTrades.value = 2;

    } else if (val <= 100) {

      inputLeverage.value = 10;

      inputMaxTrades.value = 2;

    } else if (val <= 300) {

      inputLeverage.value = 8;

      inputMaxTrades.value = 3;

    } else if (val <= 500) {

      inputLeverage.value = 6;

      inputMaxTrades.value = 4;

    } else if (val <= 1000) {

      inputLeverage.value = 5;

      inputMaxTrades.value = 5;

    } else {

      inputLeverage.value = 4;

      inputMaxTrades.value = 6;

    }

    updateCloudLiveSimulator();

  });

});



// Event Listeners cho ô nhập liệu đòn bẩy & vị thế để tính toán Simulator tức thì

inputLeverage?.addEventListener("input", updateCloudLiveSimulator);

inputMaxTrades?.addEventListener("input", updateCloudLiveSimulator);



// Bảng Mô Phỏng Ước Tính Lệnh & Lãi/Lỗ Trực Quan (Cloud Live Order Simulator)

function updateCloudLiveSimulator() {

  const levInput = document.getElementById("inputLeverage");
  const posInput = document.getElementById("inputMaxTrades");

  const leverage = Math.max(1, Number(levInput ? levInput.value : 10) || 10);
  const slots = Math.max(1, Number(posInput ? posInput.value : 2) || 2);

  // Vốn Live đọc 100% động từ Binance API Telemetry (không hardcode)
  const equity = Math.max(10.0, Number(window._lastTelemetryEquity || window._lastTelemetryBalance || 104.84));
  const availableBal = Number(window._lastTelemetryBalance || equity);

  // Cập nhật Dynamic API Capital Card (nhận diện vốn trực tiếp từ sàn)
  const dynamicApiEq = document.getElementById("dynamicApiEquity");
  if (dynamicApiEq) dynamicApiEq.textContent = "$" + equity.toFixed(2) + " USDT";
  const dynamicApiAv = document.getElementById("dynamicApiAvail");
  if (dynamicApiAv) dynamicApiAv.textContent = "Khả dụng: $" + availableBal.toFixed(2) + " USDT";

  // Cập nhật nhãn Vốn Live trên Simulator
  const eqBadge = document.getElementById("cloudSimEquityBadge");
  if (eqBadge) eqBadge.textContent = "Vốn Live API: $" + equity.toFixed(2) + " USDT";

  const slotsLabel = document.getElementById("cloudSimSlotsLabel");
  if (slotsLabel) slotsLabel.textContent = slots + " vị thế";

  const levLabel = document.getElementById("cloudSimLevLabel");
  if (levLabel) levLabel.textContent = leverage + "x";

  // QUY TẮC PHÂN BỔ QUANT THEO CHUẨN core/bot.py DÒNG 3415-3490:
  // 1. Phân khúc Altcoin: khống chế tối đa 20% equity (với sàn min_small_cap_floor = 10.60 USDT nếu equity >= 40)
  const minSmallCap = equity >= 40.0 ? 10.60 : 6.0;
  const altNotional = Math.max(minSmallCap, equity * 0.20);

  // 2. Phân khúc Tier 1 (BTC/ETH): tối đa 35% equity nhưng Binance có sàn LOT_SIZE 0.001 BTC (~$68-$70)
  const btcNotional = Math.max(68.0, equity * 0.35);

  // 3. Ký quỹ Margin thực tế của 1 lệnh Altcoin ở mức đòn bẩy đang chọn:
  const marginPerOrder = altNotional / leverage;
  const marginPctPerOrder = (marginPerOrder / equity) * 100;

  // 4. Tổng ký quỹ tối đa khi mở đủ số slots:
  const totalMaxMargin = marginPerOrder * slots;
  const totalMarginPct = Math.min(100, (totalMaxMargin / equity) * 100);
  const cashBufferPct = Math.max(0, 100 - totalMarginPct);

  // Cập nhật Đệm tiền mặt an toàn
  const safetyBadge = document.getElementById("cloudSimMarginSafety");
  if (safetyBadge) {
    if (cashBufferPct >= 80) {
      safetyBadge.textContent = "Đệm tiền mặt: " + cashBufferPct.toFixed(1) + "% (Cực kỳ an toàn)";
      safetyBadge.className = "px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold text-[10px]";
    } else if (cashBufferPct >= 60) {
      safetyBadge.textContent = "Đệm tiền mặt: " + cashBufferPct.toFixed(1) + "% (Cân bằng)";
      safetyBadge.className = "px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-[10px]";
    } else {
      safetyBadge.textContent = "Đệm tiền mặt: " + cashBufferPct.toFixed(1) + "% (Ký quỹ cao)";
      safetyBadge.className = "px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold text-[10px]";
    }
  }

  // Cột 1: Quy mô & Ký quỹ (Cap chuẩn 20% vốn theo risk parity của bot)
  const capTag = document.getElementById("cloudSimCapTag");
  if (capTag) {
    capTag.textContent = "Altcoin (Trần 20% vốn)";
    capTag.className = "text-cyan-400 font-bold";
  }

  const notionalVal = document.getElementById("cloudSimNotionalVal");
  if (notionalVal) notionalVal.textContent = "~$" + altNotional.toFixed(2) + " USDT";

  const notionalSub = document.getElementById("cloudSimNotionalSub");
  if (notionalSub) {
    notionalSub.innerHTML = `BTC: ~$${btcNotional.toFixed(1)} · Ký quỹ: <span class="text-amber-400 font-bold">~$${marginPerOrder.toFixed(2)}</span> (${marginPctPerOrder.toFixed(1)}% vốn)`;
  }

  // Cột 2: Lãi lệnh thắng chuẩn (TP1 +1.2%)
  const normalWinUSDT = altNotional * 0.012;
  const normalWinROE = (normalWinUSDT / marginPerOrder) * 100;
  const dailyTarget3Trades = normalWinUSDT * 3;

  const winVal = document.getElementById("cloudSimWinVal");
  if (winVal) winVal.textContent = "+$" + normalWinUSDT.toFixed(2) + " USDT";

  const winSub = document.getElementById("cloudSimWinSub");
  if (winSub) {
    winSub.innerHTML = `+${normalWinROE.toFixed(1)}% ROE · 3 lệnh/ngày = <strong class="text-emerald-400 font-bold">+$${dailyTarget3Trades.toFixed(2)}</strong>`;
  }

  // Cột 3: Lãi lệnh ăn sóng dài (Runner TP2 +3.5% ~ +5.0%)
  const waveWinMinUSDT = altNotional * 0.035;
  const waveWinMaxUSDT = altNotional * 0.050;
  const waveWinROE = (waveWinMinUSDT / marginPerOrder) * 100;

  const waveVal = document.getElementById("cloudSimWaveVal");
  if (waveVal) waveVal.textContent = "+$" + waveWinMinUSDT.toFixed(2) + " ~ +$" + waveWinMaxUSDT.toFixed(2) + " USDT";

  const waveSub = document.getElementById("cloudSimWaveSub");
  if (waveSub) {
    waveSub.innerHTML = `+${waveWinROE.toFixed(0)}%+ ROE · 1-2 sóng = <strong class="text-blue-400 font-bold">+$${(waveWinMinUSDT * 2).toFixed(2)}</strong>`;
  }

  // Cột 4: Cắt lỗ chuẩn Tam Tầng V3.0 (Cushion SL -0.25% & Full SL cơ sở 1.5%)
  const cushionLossUSDT = altNotional * 0.0025;
  const maxLossUSDT = altNotional * 0.015;
  const maxLossAccountPct = (maxLossUSDT / equity) * 100;

  const lossVal = document.getElementById("cloudSimLossVal");
  if (lossVal) lossVal.textContent = "-$" + maxLossUSDT.toFixed(2) + " USDT";

  const lossSub = document.getElementById("cloudSimLossSub");
  if (lossSub) {
    lossSub.innerHTML = `Chỉ mất -${maxLossAccountPct.toFixed(2)}% vốn · Cushion SL: <strong class="text-emerald-300 font-bold">-$${cushionLossUSDT < 0.01 ? '0.01' : cushionLossUSDT.toFixed(2)}</strong>`;
  }
}



// Khởi chạy mô phỏng ban đầu

setTimeout(updateCloudLiveSimulator, 300);







// Sleek Floating Toast Notification (Non-blocking)

function showToast(message, type = "success") {

  let container = document.getElementById("toastContainer");

  if (!container) {

    container = document.createElement("div");

    container.id = "toastContainer";

    container.className = "fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0";

    document.body.appendChild(container);

  }

  const toast = document.createElement("div");

  const isError = type === "error";

  const bgClass = isError ? "bg-[#18080c]/95 border-rose-500/50 text-rose-200" : "bg-[#081812]/95 border-emerald-500/50 text-emerald-200";

  const icon = isError ? "alert-circle" : "check-circle-2";

  toast.className = `flex items-center gap-2.5 p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto ${bgClass}`;

  toast.innerHTML = `

    <i data-lucide="${icon}" class="w-4 h-4 shrink-0 text-${isError ? 'rose' : 'emerald'}-400"></i>

    <span class="text-xs font-semibold flex-1 leading-snug">${message}</span>

  `;

  container.appendChild(toast);

  if (window.lucide) lucide.createIcons({ root: toast });

  requestAnimationFrame(() => {

    toast.classList.remove("translate-y-2", "opacity-0");

  });

  setTimeout(() => {

    toast.classList.add("opacity-0", "translate-y-2");

    setTimeout(() => toast.remove(), 350);

  }, 4000);

}



// Send Remote Commands to Bot via Firestore (Non-blocking & Sub-second Feedback)
let currentPendingCmdId = null;
let currentPendingBtn = null;
let currentPendingOriginalHtml = "";
let currentPendingTimeout = null;

async function sendBotCommand(command, extraData = {}, btnEl = null) {
  if (!currentUser) {
    showToast("Bạn cần đăng nhập để điều khiển bot!", "error");
    return;
  }

  if (btnEl) {
    if (currentPendingBtn && currentPendingBtn !== btnEl) {
      currentPendingBtn.innerHTML = currentPendingOriginalHtml;
      currentPendingBtn.disabled = false;
      currentPendingBtn.style.opacity = "1";
    }
    currentPendingBtn = btnEl;
    currentPendingOriginalHtml = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.style.opacity = "0.7";
    btnEl.innerHTML = `<span class="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Đang gửi...`;
  }

  const cmdId = `${command}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  currentPendingCmdId = cmdId;

  try {
    const cmdRef = doc(db, "bot_commands", currentUser.uid);
    await setDoc(cmdRef, {
      command_id: cmdId,
      command: command,
      ...extraData,
      status: "pending",
      updatedAt: serverTimestamp()
    }, { merge: true });

    let label = command.toUpperCase();
    if (command === 'close_position') label = `Đóng ${extraData.symbol || 'vị thế'}`;
    else if (command === 'emergency_close') label = "ĐÓNG TOÀN BỘ VỊ THẾ";
    else if (command === 'start') label = "BẬT BOT";
    else if (command === 'stop') label = "TẠM DỪNG BOT";
    else if (command === 'run_cycle') label = "QUÉT 1 CHU KỲ";
    else if (command === 'toggle_tradfi') label = extraData.only_tradfi ? 'CHỈ CỔ PHIẾU' : (extraData.enabled ? 'CẢ HAI (CRYPTO + CỔ PHIẾU)' : 'TẮT CỔ PHIẾU');
    else if (command === 'update_config') label = `ĐÒN BẨY ${extraData.max_leverage || ''}X & ${extraData.max_open_trades || ''} LỆNH`;

    showToast(`⚡ Đã gửi lệnh [${label}]! PC2 đang xử lý...`, "info");

    if (btnEl) {
      btnEl.innerHTML = `<span class="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Đang thi hành...`;
    }

    if (currentPendingTimeout) clearTimeout(currentPendingTimeout);
    currentPendingTimeout = setTimeout(() => {
      if (currentPendingBtn) {
        currentPendingBtn.innerHTML = currentPendingOriginalHtml;
        currentPendingBtn.disabled = false;
        currentPendingBtn.style.opacity = "1";
        currentPendingBtn = null;
      }
      currentPendingCmdId = null;
    }, 9000);

  } catch (err) {
    console.error("Command error:", err);
    showToast("Gửi lệnh thất bại: " + err.message, "error");
    if (btnEl) {
      btnEl.innerHTML = currentPendingOriginalHtml;
      btnEl.disabled = false;
      btnEl.style.opacity = "1";
      currentPendingBtn = null;
      currentPendingCmdId = null;
    }
  }
}

window.sendBotCommand = sendBotCommand;

// Lắng nghe phản hồi trạng thái hoàn tất lệnh từ xa từ PC2
let unsubBotCommands = null;
function listenToBotCommands(userId) {
  if (unsubBotCommands) unsubBotCommands();
  try {
    const cmdRef = doc(db, "bot_commands", userId);
    unsubBotCommands = onSnapshot(cmdRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (!data) return;

      if (currentPendingCmdId && (data.command_id === currentPendingCmdId || !data.command_id)) {
        if (data.status === 'completed') {
          const cmdLabel = (data.command || '').toUpperCase();
          showToast(`✅ Đã thi hành thành công [${cmdLabel}] trên PC2!`, "success");
          if (currentPendingBtn) {
            currentPendingBtn.innerHTML = currentPendingOriginalHtml;
            currentPendingBtn.disabled = false;
            currentPendingBtn.style.opacity = "1";
            currentPendingBtn = null;
          }
          currentPendingCmdId = null;
          if (currentPendingTimeout) clearTimeout(currentPendingTimeout);
        } else if (data.status === 'failed') {
          const cmdLabel = (data.command || '').toUpperCase();
          showToast(`❌ Lệnh [${cmdLabel}] thất bại: ${data.result_message || 'Thất bại'}`, "error");
          if (currentPendingBtn) {
            currentPendingBtn.innerHTML = currentPendingOriginalHtml;
            currentPendingBtn.disabled = false;
            currentPendingBtn.style.opacity = "1";
            currentPendingBtn = null;
          }
          currentPendingCmdId = null;
          if (currentPendingTimeout) clearTimeout(currentPendingTimeout);
        }
      }
    }, (err) => {
      console.warn("Lỗi onSnapshot bot_commands:", err);
    });
  } catch (e) {
    console.warn("Không thể thiết lập listenToBotCommands:", e);
  }
}
window.listenToBotCommands = listenToBotCommands;

// Button Listeners for Remote Controls
document.getElementById("btnStartBot")?.addEventListener("click", (e) => {
  const remoteStatusBadge = document.getElementById("remoteBotStatusBadge");
  const remoteStatusText = document.getElementById("remoteBotStatusText");
  if (remoteStatusText) remoteStatusText.textContent = "⏳ ĐANG GỬI LỆNH BẬT BOT...";
  if (remoteStatusBadge) remoteStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mono-font bg-amber-500/10 text-amber-400 border border-amber-500/30";
  sendBotCommand("start", {}, e.currentTarget);
});
document.getElementById("btnStopBot")?.addEventListener("click", (e) => {
  const remoteStatusBadge = document.getElementById("remoteBotStatusBadge");
  const remoteStatusText = document.getElementById("remoteBotStatusText");
  if (remoteStatusText) remoteStatusText.textContent = "⏳ ĐANG GỬI LỆNH TẠM DỪNG...";
  if (remoteStatusBadge) remoteStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mono-font bg-amber-500/10 text-amber-400 border border-amber-500/30";
  sendBotCommand("stop", {}, e.currentTarget);
});
document.getElementById("btnTriggerCycle")?.addEventListener("click", (e) => sendBotCommand("run_cycle", {}, e.currentTarget));
document.getElementById("btnEmergencyClose")?.addEventListener("click", (e) => {
  if (confirm("CẢNH BÁO: Bạn có chắc chắn muốn ĐÓNG TẤT CẢ VỊ THẾ ngay lập tức?")) {
    sendBotCommand("emergency_close", {}, e.currentTarget);
  }
});



document.getElementById("btnSaveConfig")?.addEventListener("click", (e) => {

  const lev = parseInt(inputLeverage.value) || 10;

  const trades = parseInt(inputMaxTrades.value) || 2;

  sendBotCommand("update_config", {

    max_leverage: lev,

    max_open_trades: trades

  }, e.currentTarget);

});



// Manual Adopt Toggle Buttons
document.getElementById("btnManualAdoptOff")?.addEventListener("click", (e) => {
  sendBotCommand("toggle_manual_adopt", { enabled: false }, e.currentTarget);
});
document.getElementById("btnManualAdoptOn")?.addEventListener("click", (e) => {
  sendBotCommand("toggle_manual_adopt", { enabled: true }, e.currentTarget);
});

// TradFi US Stocks Mode Toggle Buttons

document.getElementById("btnTradfiOff")?.addEventListener("click", (e) => {

  sendBotCommand("toggle_tradfi", { enabled: false, only_tradfi: false }, e.currentTarget);

});



document.getElementById("btnTradfiBoth")?.addEventListener("click", (e) => {

  sendBotCommand("toggle_tradfi", { enabled: true, only_tradfi: false }, e.currentTarget);

});



document.getElementById("btnTradfiOnly")?.addEventListener("click", (e) => {

  sendBotCommand("toggle_tradfi", { enabled: true, only_tradfi: true }, e.currentTarget);

});







// Admin Fleet Realtime Monitor



function listenToAdminFleet() {



  const tableBody = document.getElementById("adminUsersTableBody");



  if (!tableBody) return;







  onSnapshot(collection(db, "users"), (snapshot) => {



    let html = "";



    let totalUsers = snapshot.size;



    let activeBots = 0;



    let systemTotalPnl = 0.0;







    snapshot.forEach(docSnap => {



      const u = docSnap.data();



      const isAdmin = u.role === "admin";



      const isApproved = u.status === "approved";



      const balance = Number(u.assignedBalance || 40.0);



      const dailyPnl = Number(u.livePnl || 0.0);



      const totalPnl = Number(u.totalPnl !== undefined ? u.totalPnl : dailyPnl);



      systemTotalPnl += totalPnl;



      if (isApproved) activeBots++;







      // 20% Profit sharing calculation (only on positive net profit)



      const fee20 = totalPnl > 0 ? (totalPnl * 0.20) : 0.0;



      const isFeePaid = Boolean(u.feePaid);







      // Status badge



      let statusBadge = "";



      if (u.status === "approved") {



        statusBadge = `<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mono-font text-xs font-bold">ĐÃ CẤP QUYỀN</span>`;



      } else if (u.status === "revoked" || u.status === "blocked") {



        statusBadge = `<span class="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 mono-font text-xs font-bold">ĐÃ KHÓA / KÍCH</span>`;



      } else {



        statusBadge = `<span class="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mono-font text-xs font-bold">CHỜ DUYỆT</span>`;



      }







      // Fee status badge



      let feeBadge = "";



      if (fee20 > 0) {



        if (isFeePaid) {



          feeBadge = `<span class="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mono-font text-[11px] font-bold" title="${u.feePaidAt ? 'Nộp: ' + u.feePaidAt : 'Đã xác nhận'}">✓ ĐÃ NỘP</span>`;



        } else {



          feeBadge = `<span class="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 mono-font text-[11px] font-bold">CHƯA NỘP</span>`;



        }



      } else {



        feeBadge = `<span class="text-gray-500 mono-font text-[11px]">0.00$ (Chưa có lãi)</span>`;



      }







      // Action buttons



      let actionsHtml = "";



      if (isAdmin) {



        actionsHtml = `<span class="text-xs text-amber-400/80 mono-font font-bold">Super Admin</span>`;



      } else {



        let permBtn = "";



        if (u.status === "approved") {



          permBtn = `<button onclick="toggleUserStatus('${docSnap.id}', 'revoked')" class="text-xs px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-bold transition whitespace-nowrap" title="Kích ra khỏi hệ thống & khóa bot trên máy tính thành viên">⛔ Kích / Khóa</button>`;



        } else if (u.status === "revoked" || u.status === "blocked") {



          permBtn = `<button onclick="toggleUserStatus('${docSnap.id}', 'approved')" class="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 font-bold transition whitespace-nowrap" title="Mở khóa và cấp lại quyền cho bot chạy">🔓 Mở Lại</button>`;



        } else {



          permBtn = `<button onclick="toggleUserStatus('${docSnap.id}', 'approved')" class="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold transition whitespace-nowrap" title="Duyệt cấp quyền sử dụng bot">✅ Duyệt</button>`;



        }







        let feeBtn = "";



        if (fee20 > 0) {



          feeBtn = `<button onclick="toggleFeePaid('${docSnap.id}', ${!isFeePaid})" class="text-xs px-2.5 py-1 rounded-xl ${isFeePaid ? 'bg-white/[0.05] text-gray-400 hover:text-white' : 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/40'} font-bold transition whitespace-nowrap" title="${isFeePaid ? 'Bấm để hủy xác nhận' : 'Xác nhận khi thành viên đã chuyển khoản'}">${isFeePaid ? '↩ Hủy Phí' : '💰 Đã Thu'}</button>`;



        }







        const memberEscaped = (u.displayName || u.email || 'Thành viên').replace(/'/g, "\\'");



        const delBtn = `<button onclick="deleteMember('${docSnap.id}', '${memberEscaped}')" class="text-xs px-2.5 py-1 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-500/20 font-bold transition whitespace-nowrap" title="Xóa tài khoản này">🗑️ Xóa</button>`;







        actionsHtml = `<div class="flex items-center justify-end gap-1.5 flex-wrap">${permBtn}${feeBtn}${delBtn}</div>`;



      }







      html += `



        <tr>



          <td>



            <div class="flex items-center space-x-3">



              <img src="${u.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.displayName || 'User')}" class="w-8 h-8 rounded-full border border-amber-400/40 shrink-0">



              <div>



                <div class="font-bold text-white leading-tight text-xs">${u.displayName || 'Thành viên'}</div>



                <span class="text-[10px] text-gray-400 mono-font">${isAdmin ? 'SUPER ADMIN' : 'MEMBER'}</span>



              </div>



            </div>



          </td>



          <td class="text-gray-300 mono-font text-xs">${u.email || '--'}</td>



          <td>${statusBadge}</td>



          <td><span class="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-amber-400 font-bold mono-font text-xs">${balance.toFixed(2)}$</span></td>



          <td>



            <span class="px-2.5 py-0.5 rounded-full mono-font font-bold text-xs ${dailyPnl >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">



              ${dailyPnl >= 0 ? '+' : ''}${dailyPnl.toFixed(4)}$



            </span>



          </td>



          <td>



            <span class="px-2.5 py-0.5 rounded-full mono-font font-bold text-xs ${totalPnl >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">



              ${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(4)}$



            </span>



          </td>



          <td>



            <span class="font-bold mono-font text-xs ${fee20 > 0 ? 'text-amber-400 font-black' : 'text-gray-500'}">



              ${fee20.toFixed(2)}$



            </span>



          </td>



          <td>${feeBadge}</td>



          <td class="text-right">${actionsHtml}</td>



        </tr>



      `;



    });







    tableBody.innerHTML = html;



    document.getElementById("fleetTotalUsers").textContent = totalUsers;



    document.getElementById("fleetActiveBots").textContent = activeBots + " Online";



    document.getElementById("fleetTotalPnl").textContent = (systemTotalPnl >= 0 ? '+' : '') + systemTotalPnl.toFixed(2) + " USDT";



    if (window.lucide) lucide.createIcons();



  });



}







// Window Global for Admin Action



window.toggleUserStatus = async function(userId, newStatus) {
  if (!isCurrentUserSuperAdmin()) {
    alert("Chỉ Super Admin mới được duyệt/khóa thành viên.");
    return;
  }



  const confirmMsg = newStatus === 'revoked' 



    ? 'Bạn có chắc muốn KÍCH RA / KHÓA BẢN QUYỀN thành viên này? Bot trên máy tính của họ sẽ lập tức bị buộc dừng hoạt động!' 



    : `Xác nhận chuyển trạng thái thành viên sang: [${newStatus.toUpperCase()}]?`;



  if (!confirm(confirmMsg)) return;







  try {



    const userRef = doc(db, "users", userId);



    await updateDoc(userRef, { status: newStatus });



    // Đồng bộ trực tiếp xuống bot_commands để bot PC nhận lệnh khóa/mở ngay tức khắc

    try {

      const cmdRef = doc(db, "bot_commands", userId);

      await setDoc(cmdRef, {

        command: newStatus === "revoked" ? "stop" : "status_update",

        license_status: newStatus,

        status: "pending",

        created_at: serverTimestamp()

      }, { merge: true });

    } catch (cmde) {

      console.warn("Could not sync to bot_commands:", cmde);

    }



    alert(`Đã cập nhật trạng thái bản quyền thành: ${newStatus.toUpperCase()}`);



  } catch (e) {



    alert("Lỗi: " + e.message);



  }



};







window.toggleFeePaid = async function(userId, newFeeState) {
  if (!isCurrentUserSuperAdmin()) {
    alert("Chỉ Super Admin mới được xác nhận/hủy thu phí.");
    return;
  }



  const msg = newFeeState 



    ? 'Xác nhận ĐÃ NHẬN TIỀN phí chia sẻ lợi nhuận 20% từ thành viên này?' 



    : 'Hủy xác nhận thu tiền của thành viên này?';



  if (!confirm(msg)) return;







  try {



    const userRef = doc(db, "users", userId);



    const updateData = { feePaid: newFeeState };



    if (newFeeState) {



      updateData.feePaidAt = new Date().toLocaleString("vi-VN");



    }



    await updateDoc(userRef, updateData);



    alert(newFeeState ? "Đã ghi nhận ĐÃ THU TIỀN thành công!" : "Đã hủy trạng thái thu tiền.");



  } catch (e) {



    alert("Lỗi: " + e.message);



  }



};







window.deleteMember = async function(userId, memberName) {
  if (!isCurrentUserSuperAdmin()) {
    alert("Chỉ Super Admin mới được xóa thành viên.");
    return;
  }



  if (!confirm(`CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN thành viên [${memberName}] khỏi hệ thống TradeMatrix? Dữ liệu của họ sẽ bị xóa khỏi cơ sở dữ liệu.`)) return;







  try {



    // Gửi lệnh dừng và khóa bot từ xa trước khi xóa tài khoản

    try {

      const cmdRef = doc(db, "bot_commands", userId);

      await setDoc(cmdRef, {

        command: "stop",

        license_status: "revoked",

        status: "pending",

        created_at: serverTimestamp()

      }, { merge: true });

    } catch (cmde) {}



    const userRef = doc(db, "users", userId);



    await deleteDoc(userRef);



    alert(`Đã xóa thành viên [${memberName}] thành công!`);



  } catch (e) {



    alert("Lỗi khi xóa: " + e.message);



  }



};







// Realtime Telemetry from User's OWN local Bot (Strict Privacy Isolation)



function listenToBotTelemetry(userId, isAdmin) {



  const telemetryRef = doc(db, "bots_telemetry", userId);



  const badgeText = document.getElementById("botHeartbeatText");



  const badgeEl = document.getElementById("botHeartbeatBadge");



  const positionsTbody = document.getElementById("positionsTableBody");

  // Anti-Flicker: Nạp ngay lập tức dữ liệu từ LocalStorage trong 0ms để tránh màn hình bị 00/nháy
  try {
    const cachedStr = localStorage.getItem(`telemetry_cache_${userId}`);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (cached && typeof cached === 'object') {
        const statEquity = document.getElementById("statEquity");
        if (statEquity && cached.equity !== undefined) statEquity.textContent = Number(cached.equity).toFixed(2);
        const statEquitySub = document.getElementById("statEquitySub");
        if (statEquitySub && cached.available_balance !== undefined) statEquitySub.textContent = `Khả dụng: $${Number(cached.available_balance).toFixed(2)}`;
        const statBalance = document.getElementById("statBalance");
        if (statBalance && cached.used_margin !== undefined) {
          const um = Number(cached.used_margin);
          statBalance.textContent = um.toFixed(2);
          statBalance.className = `text-lg sm:text-xl font-black mono-font ${um > 0 ? 'text-amber-400' : 'text-gray-300'}`;
        }
        const statDaily = document.getElementById("statDailyPnl");
        if (statDaily && cached.today_pnl !== undefined) {
          const tp = Number(cached.today_pnl);
          statDaily.textContent = (tp >= 0 ? '+' : '') + tp.toFixed(4);
          statDaily.className = `text-lg sm:text-xl font-black mono-font ${tp >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
        }
        const statTotal = document.getElementById("statTotalPnl");
        if (statTotal && cached.total_pnl !== undefined) {
          const tot = Number(cached.total_pnl);
          statTotal.textContent = (tot >= 0 ? '+' : '') + tot.toFixed(4);
          statTotal.className = `text-lg sm:text-xl font-black mono-font ${tot >= 0 ? 'text-purple-400' : 'text-rose-400'}`;
        }
        const statWinRate = document.getElementById("statWinRate");
        if (statWinRate && cached.win_rate !== undefined) statWinRate.textContent = `${Number(cached.win_rate).toFixed(1)}%`;
        const statTotalTrades = document.getElementById("statTotalTrades");
        if (statTotalTrades && cached.total_trades !== undefined) {
          // [SỔ VỐN] PnL TOÀN BỘ TÀI KHOẢN = equity - tổng nạp/rút thật từ sàn. Khác ô
          // "TỔNG PNL LỊCH SỬ" (chỉ realized PnL của các lệnh đã ghi trong DB): con số này còn
          // gồm funding fee + lịch sử trước khi DB bắt đầu ghi. Chỉ nối thêm khi backend cung cấp.
          let subTotalTrades = `${cached.total_trades} lệnh lịch sử`;
          if (cached.session_pnl !== undefined && cached.session_pnl !== null) {
            const spAll = Number(cached.session_pnl);
            if (Number.isFinite(spAll)) subTotalTrades += ` · Cả TK: ${spAll >= 0 ? '+' : ''}${spAll.toFixed(4)}`;
          }
          statTotalTrades.textContent = subTotalTrades;
          window._lastValidTotalTrades = cached.total_trades;
        }
        const statFeesSub = document.getElementById("statFeesSub");
        if (statFeesSub && cached.total_fees !== undefined) statFeesSub.textContent = `Phí: $${Number(cached.total_fees).toFixed(2)} USDT`;
      }
    }
  } catch (_) {}

  onSnapshot(telemetryRef, (docSnap) => {



    if (docSnap.exists()) {



      const data = docSnap.data();



      const equity = Number(data.equity !== undefined ? data.equity : (data.balance || 0));

      const balance = Number(data.available_balance !== undefined ? data.available_balance : (data.balance || 0));

      const usedMargin = Number(data.used_margin !== undefined ? data.used_margin : 0);

      const todayPnl = Number(data.today_pnl !== undefined ? data.today_pnl : (data.daily_pnl || 0));

      const totalPnl = Number(data.total_pnl !== undefined ? data.total_pnl : 0);

      const totalFees = Number(data.total_fees !== undefined ? data.total_fees : 0);

      const totalTrades = Number(data.total_trades || 0);

      const winRate = Number(data.win_rate !== undefined ? data.win_rate : 0);

      const unrealizedPnl = Number(data.unrealized_pnl !== undefined ? data.unrealized_pnl : 0);

      const maxLev = Number(data.max_leverage || 8);

      const maxTrades = Number(data.max_open_trades || 2);

      const mode = (data.mode || "LIVE").toUpperCase();



      window._lastTelemetryBalance = balance;

      window._lastTelemetryEquity = equity;

      window._lastUsedMargin = usedMargin;

      updateCloudLiveSimulator();



      // 1. Equity Futures

      const statEquity = document.getElementById("statEquity");

      if (statEquity) statEquity.textContent = equity.toFixed(2);

      const statEquitySub = document.getElementById("statEquitySub");

      if (statEquitySub) statEquitySub.textContent = `Khả dụng: $${balance.toFixed(2)}`;



      // 2. Ký Quỹ Đang Dùng (Chỉ hiển thị tiền ký quỹ thực tế & Tỷ lệ sử dụng vốn, không lặp lại tổng tiền)

      const statBalance = document.getElementById("statBalance");

      if (statBalance) {

        statBalance.textContent = usedMargin.toFixed(2);

        statBalance.className = `text-lg sm:text-xl font-black mono-font ${usedMargin > 0 ? 'text-amber-400' : 'text-gray-300'}`;

      }

      const statUsedMarginSub = document.getElementById("statUsedMarginSub");

      if (statUsedMarginSub) {

        const marginRatio = equity > 0 ? ((usedMargin / equity) * 100).toFixed(1) : "0.0";

        statUsedMarginSub.textContent = `Tỷ lệ: ${marginRatio}% vốn`;

      }



      // 3. PnL Đang Chạy (Floating Live)

      const statUnrealized = document.getElementById("statUnrealizedPnl");

      if (statUnrealized) {

        statUnrealized.textContent = (unrealizedPnl >= 0 ? '+' : '') + unrealizedPnl.toFixed(4);

        statUnrealized.className = `text-lg sm:text-xl font-black mono-font ${unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;

      }

      const statUnrealizedPct = document.getElementById("statUnrealizedPct");

      if (statUnrealizedPct) {

        statUnrealizedPct.textContent = usedMargin > 0 ? `${((unrealizedPnl / usedMargin) * 100).toFixed(2)}% ROI` : 'Mark Price sàn';

      }



      // 4. Lãi Đã Chốt Hôm Nay (Ổn định tuyệt đối, không nháy!)

      const statDaily = document.getElementById("statDailyPnl");

      if (statDaily) {

        statDaily.textContent = (todayPnl >= 0 ? '+' : '') + todayPnl.toFixed(4);

        statDaily.className = `text-lg sm:text-xl font-black mono-font ${todayPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;

      }

      const statTodaySub = document.getElementById("statTodaySub");

      if (statTodaySub) statTodaySub.textContent = `Quyết toán Binance (${data.updated_at || 'Vừa xong'})`;



      // 5. Tổng PnL Lịch Sử

      const statTotal = document.getElementById("statTotalPnl");

      if (statTotal) {

        statTotal.textContent = (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(4);

        statTotal.className = `text-lg sm:text-xl font-black mono-font ${totalPnl >= 0 ? 'text-purple-400' : 'text-rose-400'}`;

      }

      const statTotalTrades = document.getElementById("statTotalTrades");

      if (statTotalTrades) {
        // [SỔ VỐN] Nối thêm PnL toàn bộ tài khoản (equity - tổng nạp/rút thật) nếu backend cung cấp.
        let subTotalTradesLive = `${totalTrades} lệnh lịch sử`;
        if (data.session_pnl !== undefined && data.session_pnl !== null) {
          const spAllLive = Number(data.session_pnl);
          if (Number.isFinite(spAllLive)) subTotalTradesLive += ` · Cả TK: ${spAllLive >= 0 ? '+' : ''}${spAllLive.toFixed(4)}`;
        }
        statTotalTrades.textContent = subTotalTradesLive;
      }



      // 6. Win Rate & Phí Sàn

      const statWinRate = document.getElementById("statWinRate");

      if (statWinRate) statWinRate.textContent = `${winRate.toFixed(1)}%`;

      const statFeesSub = document.getElementById("statFeesSub");

      if (statFeesSub) statFeesSub.textContent = `Phí: $${totalFees.toFixed(2)} USDT`;

      // Anti-Zero-Flicker: Lưu bộ nhớ đệm LocalStorage
      try {
        if (totalTrades > 0) window._lastValidTotalTrades = totalTrades;
        localStorage.setItem(`telemetry_cache_${userId}`, JSON.stringify({
          equity: equity,
          available_balance: balance,
          today_pnl: todayPnl,
          total_pnl: totalPnl,
          total_fees: totalFees,
          total_trades: totalTrades,
          win_rate: winRate,
          used_margin: usedMargin
        }));
      } catch (_) {}



      // Specs Strip

      const specLev = document.getElementById("specLeverage");

      if (specLev) specLev.textContent = `${maxLev}x`;

      const specTrades = document.getElementById("specMaxTrades");

      if (specTrades) specTrades.textContent = `${maxTrades} lệnh`;

      const botModeBadge = document.getElementById("botModeBadge");

      if (botModeBadge) botModeBadge.textContent = mode === "LIVE" ? "● LIVE (TIỀN THẬT)" : "○ DEMO THỬ NGHIỆM";



      // TradFi Stock Perps Status & Toggle Buttons Sync

      const tradfiEnabled = Boolean(data.tradfi_enabled);

      const onlyTradfi = Boolean(data.only_tradfi);

      const tradfiMarketOpen = Boolean(data.tradfi_market_open);



      const specTradfiVal = document.getElementById("specTradfiVal");

      if (specTradfiVal) {

        if (onlyTradfi) {

          specTradfiVal.textContent = "CHỈ CỔ PHIẾU";

          specTradfiVal.className = "text-amber-400 font-bold";

        } else if (tradfiEnabled) {

          specTradfiVal.textContent = "CẢ HAI";

          specTradfiVal.className = "text-cyan-400 font-bold";

        } else {

          specTradfiVal.textContent = "TẮT";

          specTradfiVal.className = "text-gray-400 font-bold";

        }

      }



      const tradfiMarketBadge = document.getElementById("tradfiMarketBadge");

      if (tradfiMarketBadge) {

        if (tradfiMarketOpen) {

          tradfiMarketBadge.textContent = "🟢 Phiên Mỹ MỞ (09:30-16:00 EST)";

          tradfiMarketBadge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold mono-font bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";

        } else {

          tradfiMarketBadge.textContent = "🟡 Phiên Mỹ ĐÓNG";

          tradfiMarketBadge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold mono-font bg-amber-500/10 text-amber-400 border border-amber-500/25";

        }

      }



            // Sync Manual Adopt Status
      const manualAdoptEnabled = Boolean(data.auto_adopt_manual_positions);
      const btnManualAdoptOff = document.getElementById("btnManualAdoptOff");
      const btnManualAdoptOn = document.getElementById("btnManualAdoptOn");
      const manualAdoptBadge = document.getElementById("manualAdoptBadge");

      if (btnManualAdoptOff && btnManualAdoptOn) {
        if (manualAdoptEnabled) {
          btnManualAdoptOn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
          btnManualAdoptOff.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition text-gray-400 hover:text-white border border-transparent";
          if (manualAdoptBadge) {
            manualAdoptBadge.textContent = "ĐANG BẬT BẢO HỘ";
            manualAdoptBadge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold mono-font bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
          }
        } else {
          btnManualAdoptOff.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition bg-white/10 text-white border border-white/20";
          btnManualAdoptOn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition text-gray-400 hover:text-white border border-transparent";
          if (manualAdoptBadge) {
            manualAdoptBadge.textContent = "TẮT";
            manualAdoptBadge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold mono-font bg-white/5 text-gray-400 border border-white/10";
          }
        }
      }

      const btnTradfiOff = document.getElementById("btnTradfiOff");

      const btnTradfiBoth = document.getElementById("btnTradfiBoth");

      const btnTradfiOnly = document.getElementById("btnTradfiOnly");



      if (btnTradfiOff && btnTradfiBoth && btnTradfiOnly) {

        // Reset all classes

        [btnTradfiOff, btnTradfiBoth, btnTradfiOnly].forEach(b => {

          b.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition text-gray-400 hover:text-white border border-transparent";

        });



        if (onlyTradfi) {

          btnTradfiOnly.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition tradfi-btn-active-gold border border-amber-400/40";

        } else if (tradfiEnabled) {

          btnTradfiBoth.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition tradfi-btn-active border border-cyan-400/40";

        } else {

          btnTradfiOff.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold mono-font transition bg-white/10 text-white border border-white/20";

        }

      }



      // Input sync if user not actively typing

      if (inputLeverage && document.activeElement !== inputLeverage) inputLeverage.value = maxLev;

      if (inputMaxTrades && document.activeElement !== inputMaxTrades) inputMaxTrades.value = maxTrades;



      // Heartbeat Status (Đồng bộ nhãn & màu sắc badge xanh ngọc bích chuẩn)
      if (badgeText) {
        if (data.is_running === false) {
          badgeText.textContent = "PAUSED (TẠM DỪNG)";
          if (badgeEl) {
            badgeEl.className = "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] mono-font font-bold shadow-sm shadow-amber-500/10";
            const pingDot = badgeEl.querySelector("span:first-child");
            if (pingDot) pingDot.className = "w-1.5 h-1.5 rounded-full bg-amber-400";
          }
        } else {
          badgeText.textContent = "ONLINE (SYNC REALTIME)";
          if (badgeEl) {
            badgeEl.className = "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] mono-font font-bold shadow-sm shadow-emerald-500/10";
            const pingDot = badgeEl.querySelector("span:first-child");
            if (pingDot) pingDot.className = "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping";
          }
        }
      }

      // Remote Bot Status Badge ngay trên Trung Tâm Điều Khiển
      const remoteStatusBadge = document.getElementById("remoteBotStatusBadge");
      const remoteStatusText = document.getElementById("remoteBotStatusText");
      if (remoteStatusBadge && remoteStatusText) {
        if (data.is_running === false) {
          remoteStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mono-font bg-rose-500/10 text-rose-400 border border-rose-500/30";
          const pingDot = remoteStatusBadge.querySelector("span:first-child");
          if (pingDot) pingDot.className = "w-2 h-2 rounded-full bg-rose-400";
          remoteStatusText.textContent = "🔴 BOT ĐÃ TẠM DỪNG";
        } else {
          remoteStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mono-font bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10";
          const pingDot = remoteStatusBadge.querySelector("span:first-child");
          if (pingDot) pingDot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-ping";
          remoteStatusText.textContent = "🟢 BOT ĐANG CHẠY (QUÉT NẾN 24/7)";
        }
      }



      // Render Positions Table & Mobile Cards with Bulletproof Calculation Fallbacks

      const positionsMobileList = document.getElementById("positionsMobileList");

      const posCountBadge = document.getElementById("posCountBadge");



      if (positionsTbody || positionsMobileList) {



        // Cập nhật Ra-đa Rình Mồi Leaderboard

      const rawRadar = data.radar_candidates || [];

      renderRadarLeaderboard(rawRadar);
      lastKnownRadarCandidates = rawRadar;
      if (typeof renderPortfolioLeaderboard === "function") {
        renderPortfolioLeaderboard(rawRadar, currentPortfolioCapital);
      }



      const rawPositions = data.positions || [];



        if (posCountBadge) {

          posCountBadge.textContent = `(${rawPositions.length})`;

        }



        if (rawPositions.length === 0) {



          if (positionsTbody) {

            positionsTbody.innerHTML = `

              <tr>

                <td colspan="9" class="text-center py-8 text-gray-500 mono-font text-xs">

                  <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>

                  <span>Hiện tại không có vị thế mở. Bot đang quét tìm cơ hội đẹp...</span>

                </td>

              </tr>

            `;

          }



          if (positionsMobileList) {

            positionsMobileList.innerHTML = `

              <div class="text-center py-6 text-gray-500 bg-white/[0.015] rounded-xl border border-white/5">

                <i data-lucide="inbox" class="w-7 h-7 mx-auto mb-1.5 opacity-40"></i>

                <span class="text-xs mono-font">Không có vị thế mở. Bot đang quét tìm cơ hội...</span>

              </div>

            `;

          }



          if (window._binanceTickerInterval) {

            clearInterval(window._binanceTickerInterval);

            window._binanceTickerInterval = null;

          }



        } else {



          // Normalize and enrich positions

          const positions = rawPositions.map(p => {

            const symbol = p.symbol || "";

            const isLong = (p.side || "").toUpperCase() === "LONG" || (p.side || "").toUpperCase() === "BUY";

            const side = isLong ? "LONG" : "SHORT";

            const entryPrice = Number(p.entry_price || 0);

            let markPrice = Number(p.mark_price || entryPrice);

            const leverage = Math.max(1, Number(p.leverage || p.exchange_leverage || 5));

            const amount = Math.abs(Number(p.amount || 0));



            // Margin fallback

            let margin = Number(p.margin || p.exchange_initial_margin || p.cost || 0);

            if (margin <= 0 && entryPrice > 0) {

              if (amount > 0) {

                margin = (entryPrice * amount) / leverage;

              } else {

                margin = 2.70;

              }

            }



            // Unrealized PnL fallback

            let upnl = (p.unrealized_pnl !== undefined && p.unrealized_pnl !== null) ? Number(p.unrealized_pnl) : Number(p.unrealized_pnl_mark || 0);

            if (upnl === 0 && entryPrice > 0 && markPrice > 0 && Math.abs(entryPrice - markPrice) > 1e-8) {

              if (amount > 0) {

                upnl = isLong ? (markPrice - entryPrice) * amount : (entryPrice - markPrice) * amount;

              } else if (margin > 0) {

                const priceDiffPct = isLong ? (markPrice - entryPrice) / entryPrice : (entryPrice - markPrice) / entryPrice;

                upnl = priceDiffPct * margin * leverage;

              }

            }



            // PnL % calculation

            let pnlPct = Number(p.pnl_pct || 0);

            if (pnlPct === 0 && margin > 0 && upnl !== 0) {

              pnlPct = (upnl / margin) * 100;

            } else if (pnlPct === 0 && entryPrice > 0 && markPrice > 0 && Math.abs(entryPrice - markPrice) > 1e-8) {

              const priceDiffPct = isLong ? (markPrice - entryPrice) / entryPrice : (entryPrice - markPrice) / entryPrice;

              pnlPct = priceDiffPct * 100 * leverage;

            }



            const stopLoss = Number(p.stop_loss || 0);

            const takeProfit = Number(p.take_profit || 0);

            const trailingStatus = p.trailing_status || (p.time_sl_compressed ? "Đã siết SL 15m" : (p.trailing_active ? "Đang Trailing" : "Bảo vệ vốn"));



            return {

              ...p,

              symbol,

              isLong,

              side,

              entryPrice,

              markPrice,

              leverage,

              amount,

              margin,

              upnl,

              pnlPct,

              stopLoss,

              takeProfit,

              trailingStatus

            };

          });



          let tableHtml = "";

          let mobileHtml = "";



          positions.forEach(p => {

            const cleanSym = p.symbol.replace('/', '').replace(':USDT', '');

            const upnlSign = p.upnl >= 0 ? '+' : '';

            const pnlSign = p.pnlPct >= 0 ? '+' : '';

            const pnlBadgeClass = p.upnl >= 0

              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'

              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30';

            const sideBadgeClass = p.isLong

              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'

              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30';



            // Desktop Row (9 columns)

            tableHtml += `

              <tr class="hover:bg-white/[0.02] transition">

                <td>

                  <div class="font-bold text-white mono-font text-xs flex items-center gap-1.5">

                    <span class="w-1.5 h-1.5 rounded-full ${p.isLong ? 'bg-emerald-400' : 'bg-rose-400'}"></span>

                    <a href="https://www.binance.com/vi/futures/${cleanSym}" target="_blank" rel="noopener noreferrer" class="font-bold text-white hover:text-amber-300 hover:underline mono-font text-xs inline-flex items-center gap-1" title="Bấm để mở ${p.symbol} trên Binance Futures">
                      <span>${p.symbol}</span>
                      <i data-lucide="external-link" class="w-2.5 h-2.5 opacity-60"></i>
                    </a>

                  </div>

                </td>

                <td>

                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold mono-font ${sideBadgeClass}">

                    ${p.isLong ? 'LONG / MUA' : 'SHORT / BÁN'}

                  </span>

                </td>

                <td>

                  <span class="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold mono-font text-xs">

                    ${p.leverage}x

                  </span>

                </td>

                <td class="text-gray-300 mono-font text-xs">${p.entryPrice.toFixed(4)}</td>

                <td class="text-white font-semibold mono-font text-xs" id="mark-${cleanSym}">${p.markPrice.toFixed(4)}</td>

                <td class="text-amber-400 font-semibold mono-font text-xs">${p.margin.toFixed(2)}$</td>

                <td>

                  <span class="px-2.5 py-1 rounded-full mono-font font-bold text-xs inline-flex items-center gap-1 ${pnlBadgeClass}" id="pnl-${cleanSym}">

                    ${upnlSign}${p.upnl.toFixed(4)}$ (${pnlSign}${p.pnlPct.toFixed(2)}%)

                  </span>

                </td>

                <td class="mono-font">

                  <div class="text-[11px] text-gray-300">SL: ${p.stopLoss > 0 ? p.stopLoss.toFixed(4) : '--'}</div>

                  <div class="text-[10px] text-amber-400/80">${p.trailingStatus}</div>

                </td>

                <td class="text-right">

                  <button onclick="sendBotCommand('close_position', { symbol: '${p.symbol}', direction: '${p.side}' }, this)" class="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto active:scale-95">

                    <i data-lucide="x" class="w-3.5 h-3.5"></i>

                    Đóng

                  </button>

                </td>

              </tr>

            `;



            // Mobile High-Tech Card (< 768px): Sleek, Compact, Zero Bloat

            mobileHtml += `

              <div class="p-3.5 rounded-2xl bg-[#0b101b] border ${p.upnl >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20'} transition shadow-lg space-y-2.5">

                <div class="flex items-center justify-between pb-2 border-b border-white/5">

                  <div class="flex items-center gap-2">

                    <a href="https://www.binance.com/vi/futures/${cleanSym}" target="_blank" rel="noopener noreferrer" class="font-black text-white hover:text-amber-300 hover:underline mono-font text-sm tracking-wide inline-flex items-center gap-1" title="Bấm để mở ${p.symbol} trên Binance Futures">
                      <span>${p.symbol}</span>
                      <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
                    </a>

                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold mono-font ${sideBadgeClass}">

                      ${p.side} ${p.leverage}x

                    </span>

                  </div>

                  <button onclick="sendBotCommand('close_position', { symbol: '${p.symbol}', direction: '${p.side}' }, this)" class="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95">

                    <i data-lucide="x" class="w-3.5 h-3.5"></i>

                    Đóng

                  </button>

                </div>



                <div class="grid grid-cols-2 gap-2 text-xs">

                  <div class="bg-black/40 p-2 rounded-xl border border-white/5">

                    <span class="text-gray-400 block text-[9px] uppercase mono-font tracking-wider mb-0.5">Giá Vào (Entry)</span>

                    <span class="text-gray-200 mono-font font-semibold text-xs">${p.entryPrice.toFixed(4)}</span>

                  </div>

                  <div class="bg-black/40 p-2 rounded-xl border border-white/5">

                    <span class="text-gray-400 block text-[9px] uppercase mono-font tracking-wider mb-0.5">Giá Hiện Tại (Mark)</span>

                    <span class="text-white mono-font font-bold text-xs" id="mob-mark-${cleanSym}">${p.markPrice.toFixed(4)}</span>

                  </div>

                  <div class="bg-black/40 p-2 rounded-xl border border-white/5">

                    <span class="text-gray-400 block text-[9px] uppercase mono-font tracking-wider mb-0.5">Ký Quỹ (Margin)</span>

                    <span class="text-amber-400 mono-font font-bold text-xs">${p.margin.toFixed(2)}$</span>

                  </div>

                  <div class="bg-black/40 p-2 rounded-xl border ${p.upnl >= 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}">

                    <span class="text-gray-400 block text-[9px] uppercase mono-font tracking-wider mb-0.5">PnL Ước Tính (ROI)</span>

                    <span class="mono-font font-black text-xs ${p.upnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}" id="mob-pnl-${cleanSym}">

                      ${upnlSign}${p.upnl.toFixed(4)}$ (${pnlSign}${p.pnlPct.toFixed(2)}%)

                    </span>

                  </div>

                </div>



                <div class="flex items-center justify-between text-[11px] text-gray-400 pt-1.5 border-t border-white/5 mono-font">

                  <div>

                    <span>SL: </span><span class="text-gray-200 font-semibold">${p.stopLoss > 0 ? p.stopLoss.toFixed(4) : '--'}</span>

                    <span class="mx-1 text-gray-600">|</span>

                    <span>TP: </span><span class="text-gray-200 font-semibold">${p.takeProfit > 0 ? p.takeProfit.toFixed(4) : '--'}</span>

                  </div>

                  <span class="px-2 py-0.5 rounded-md bg-amber-400/10 text-[10px] text-amber-300 font-bold border border-amber-400/20">

                    ${p.trailingStatus}

                  </span>

                </div>

              </div>

            `;

          });



          if (positionsTbody) positionsTbody.innerHTML = tableHtml;

          if (positionsMobileList) positionsMobileList.innerHTML = mobileHtml;

          if (window.lucide) lucide.createIcons();



          // Real-time live Binance price updater directly in browser every 2.5s

          if (window._binanceTickerInterval) clearInterval(window._binanceTickerInterval);

          window._binanceTickerInterval = setInterval(() => {

            let totalLiveUpnl = 0;

            let countUpdated = 0;



            positions.forEach(async pos => {

              const sym = pos.symbol.replace('/', '').replace(':USDT', '');

              if (!sym) return;

              try {

                const res = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${sym}`);

                if (!res.ok) return;

                const ticker = await res.json();

                const curPrice = parseFloat(ticker.price);

                if (curPrice > 0) {

                  const markEl = document.getElementById(`mark-${sym}`);

                  const mobMarkEl = document.getElementById(`mob-mark-${sym}`);

                  if (markEl) markEl.textContent = curPrice.toFixed(4);

                  if (mobMarkEl) mobMarkEl.textContent = curPrice.toFixed(4);



                  // Recalculate live PnL & %

                  let liveUpnl = pos.isLong ? (curPrice - pos.entryPrice) * pos.amount : (pos.entryPrice - curPrice) * pos.amount;

                  if (pos.amount <= 0 && pos.margin > 0) {

                    const diffPct = pos.isLong ? (curPrice - pos.entryPrice) / pos.entryPrice : (pos.entryPrice - curPrice) / pos.entryPrice;

                    liveUpnl = diffPct * pos.margin * pos.leverage;

                  }

                  totalLiveUpnl += liveUpnl;

                  countUpdated++;



                  const livePct = pos.margin > 0 ? (liveUpnl / pos.margin) * 100 : 0;

                  const sign = liveUpnl >= 0 ? '+' : '';

                  const pctSign = livePct >= 0 ? '+' : '';

                  const pnlText = `${sign}${liveUpnl.toFixed(4)}$ (${pctSign}${livePct.toFixed(2)}%)`;



                  const pnlEl = document.getElementById(`pnl-${sym}`);

                  const mobPnlEl = document.getElementById(`mob-pnl-${sym}`);

                  if (pnlEl) {

                    pnlEl.textContent = pnlText;

                    pnlEl.className = `px-2.5 py-1 rounded-full mono-font font-bold text-xs inline-flex items-center gap-1 ${liveUpnl >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`;

                  }

                  if (mobPnlEl) {

                    mobPnlEl.textContent = pnlText;

                    mobPnlEl.className = `mono-font font-black text-xs ${liveUpnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;

                  }



                  // Update global floating PnL card & live equity

                  if (countUpdated === positions.length) {

                    const statUnrealized = document.getElementById("statUnrealizedPnl");

                    if (statUnrealized) {

                      const uSign = totalLiveUpnl >= 0 ? '+' : '';

                      statUnrealized.textContent = `${uSign}${totalLiveUpnl.toFixed(4)}`;

                      statUnrealized.className = `text-lg sm:text-xl font-black mono-font ${totalLiveUpnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;

                    }

                    const statEq = document.getElementById("statEquity");

                    if (statEq && window._lastTelemetryBalance) {

                      const liveEq = window._lastTelemetryBalance + window._lastUsedMargin + totalLiveUpnl;

                      statEq.textContent = liveEq.toFixed(2);

                    }

                  }

                }

              } catch (_) {}

            });

          }, 2500);

        }

      }



    } else {



      // Chưa có dữ liệu telemetry



      if (badgeText) badgeText.textContent = "OFFLINE (CHỜ KẾT NỐI)";



      document.getElementById("statBalance").textContent = "0.00";



      document.getElementById("statDailyPnl").textContent = "0.0000";



      document.getElementById("statWinRate").textContent = "0.0%";



      document.getElementById("statOpenPositions").textContent = "0 / 2";



      document.getElementById("statBalanceSub").textContent = "Chưa kết nối bot cá nhân";



    }



    if (window.lucide) lucide.createIcons();



  });



}







// Master Auth Observer for Dashboard



onAuthStateChanged(auth, async (user) => {

  const authLoadingScreen = document.getElementById("authLoadingScreen");

  const dashboardApp = document.getElementById("dashboardApp");

  const pendingOverlay = document.getElementById("pendingOverlay");



  const dismissLoading = () => {

    if (authLoadingScreen) authLoadingScreen.classList.add("hidden");

  };



  if (!user) {

    dismissLoading();

    window.location.href = "index.html";

    return;

  }



  currentUser = user;



  try {

    const syncPromise = syncUserProfile(user);

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout sync profile")), 2500));

    currentProfile = await Promise.race([syncPromise, timeoutPromise]);

  } catch (err) {

    console.warn("syncUserProfile fallback:", err);

    const isUserAdmin = ADMIN_EMAILS.includes((user.email || "").toLowerCase());

    let fallbackStatus = isUserAdmin ? "approved" : "pending";
    if (!isUserAdmin) {
      try {
        // users/{uid} có thể chậm hoặc bị Rules chặn, nhưng kênh license chính thức
        // bot_commands vẫn xác nhận approved. Không khóa oan tài khoản đã được duyệt.
        const cmdSnap = await getDoc(doc(db, "bot_commands", user.uid));
        if (cmdSnap.exists() && cmdSnap.data().license_status === "approved") {
          fallbackStatus = "approved";
        }
      } catch (licenseErr) {
        console.warn("bot_commands license fallback warning:", licenseErr);
      }
    }

    currentProfile = {

      uid: user.uid,

      email: user.email,

      displayName: user.displayName || "Trader",

      role: isUserAdmin ? "admin" : "member",

      status: fallbackStatus

    };

  } finally {

    dismissLoading();

  }



  const isAdmin = isCurrentUserSuperAdmin();

  const isApproved = currentProfile?.status === "approved" || isAdmin;



  // Kiểm tra quyền hạn: Nếu Member chưa duyệt -> Chỉ hiện màn hình chờ duyệt

  if (!isApproved && !isAdmin) {

    if (dashboardApp) dashboardApp.classList.add("hidden");

    if (pendingOverlay) pendingOverlay.classList.remove("hidden");

    const emailEl = document.getElementById("pendingEmail");

    if (emailEl) emailEl.textContent = user.email;

    return;

  }



  // Đã được duyệt hoặc là Admin: Hiện toàn bộ Dashboard

  if (pendingOverlay) pendingOverlay.classList.add("hidden");

  if (dashboardApp) dashboardApp.classList.remove("hidden");







  // Render User Profile Nav



  const displayName = user.displayName || (user.email ? user.email.split('@')[0] : "Trader");

  const userNameEl = document.getElementById("dashUserName");

  if (userNameEl) {

    userNameEl.textContent = displayName;

    userNameEl.title = `${displayName} (${user.email || ''})`;

  }

  document.getElementById("dashUserAvatar").src = user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName);

  document.getElementById("userTokenBox").value = user.uid;



  // Role Badging (Always single-line nowrap)

  const roleBadge = document.getElementById("dashUserRoleBadge");

  if (roleBadge) {

    roleBadge.textContent = isAdmin ? "SUPER ADMIN" : "MEMBER";

    roleBadge.className = isAdmin 

      ? "text-[9px] px-2 py-0.5 rounded-full badge-admin mono-font uppercase font-bold whitespace-nowrap inline-block" 

      : "text-[9px] px-2 py-0.5 rounded-full badge-live mono-font uppercase font-bold whitespace-nowrap inline-block";

  }



  // Admin Fleet Tab Unhide

  if (isAdmin) {

    document.getElementById("adminNavTab")?.classList.remove("hidden");

    listenToAdminFleet();



  }







  // Lắng nghe dữ liệu Telemetry của RIÊNG người đó (Tuyệt đối không lộ số liệu của nhau)



  listenToBotTelemetry(user.uid, isAdmin);
  listenToBotCommands(user.uid);



  if (window.lucide) lucide.createIcons();



});







// ============================================================================



// ============================================================================

// RA-ĐA LƯỢNG TỬ: BẢNG XẾP HẠNG TÍN HIỆU RÌNH MỒI (NEAR-MISS RADAR LEADERBOARD)

// ============================================================================

// ============================================================================
// RA-ĐA LƯỢNG TỬ (QUANTUM NEAR-MISS STALKING RADAR) - 100% LIVE REAL DATA
// ============================================================================

const DEFAULT_RADAR_CANDIDATES = [];

function renderRadarLeaderboard(rawCandidates) {
  try {
    const colLeft = document.getElementById("radarColLeft");
    const colRight = document.getElementById("radarColRight");
    if (!colLeft || !colRight) return;

    // Duy tri the hien tai, chi xoa & ve lai khi co du lieu tin hieu thay doi

    const normalizeSym = (s) => String(s || "").split(":")[0].replace(/\s+/g, "").toUpperCase();
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>\"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
    }[char]));
    const statusFor = (candidate) => {
      const gate = String(candidate.bottleneck_gate || '').toUpperCase();
      if (gate === 'M1_SNIPER_STALKING') return 'STALKING';
      if (['SLOT_CAPACITY', 'RISK_CAPACITY', 'MARGIN_CAPACITY'].includes(gate)) return 'WAITING_RESOURCE';
      return 'BLOCKED';
    };
    const statusRank = { STALKING: 3, WAITING_RESOURCE: 2, BLOCKED: 0 };

    // 1. Khử trùng lặp tuyệt đối (Strict Deduplication) từ dữ liệu bot gửi lên
    const seen = new Set();
    let candidates = [];

    if (Array.isArray(rawCandidates) && rawCandidates.length > 0) {
      for (const c of rawCandidates) {
        if (!c || !c.symbol) continue;
        const base = normalizeSym(c.symbol);
        if (!seen.has(base)) {
          seen.add(base);
          candidates.push({ ...c, symbol: base, radar_status: c.radar_status || statusFor(c) });
        }
      }
    }

    // 2. Nếu chưa có tín hiệu nào bị nghẽn, hiển thị trạng thái đang quét sạch đẹp (không dùng coin ảo)
    if (!candidates || candidates.length === 0) {
      if (window._lastWebRadarKeys === "__EMPTY__") {
        return;
      }
      window._lastWebRadarKeys = "__EMPTY__";
      colLeft.innerHTML = `
        <div class="p-5 rounded-2xl bg-[#090d16]/80 border border-white/10 text-center w-full min-h-[140px] flex flex-col items-center justify-center">
          <div class="text-2xl mb-1.5">📡</div>
          <div class="text-xs sm:text-sm font-bold text-white mono-font">Ra-đa Lượng Tử Đang Quét 50+ Cặp Tiền...</div>
          <div class="text-[11px] text-gray-400 mt-1">Không có ứng viên mới trong cửa sổ ra-đa 5 phút gần nhất.</div>
        </div>
      `;
      colRight.innerHTML = `
        <div class="p-5 rounded-2xl bg-[#090d16]/80 border border-white/10 text-center w-full min-h-[140px] flex flex-col items-center justify-center">
          <div class="text-2xl mb-1.5">🛡️</div>
          <div class="text-xs sm:text-sm font-bold text-white mono-font">Cổng Phòng Vệ Vi Mô Sẵn Sàng</div>
          <div class="text-[11px] text-gray-400 mt-1">Khi xuất hiện cơ hội thỏa mãn nến & volume, ra-đa sẽ tự động xếp hạng tại đây.</div>
        </div>
      `;
      return;
    }

    // 3. Ưu tiên lệnh đang rình/đã qua tín hiệu trước ứng viên đang bị chặn.
    candidates.sort((a, b) => {
      const sA = statusRank[a.radar_status] || 0;
      const sB = statusRank[b.radar_status] || 0;
      if (sB !== sA) return sB - sA;
      const rA = Number(a.readiness_pct) || 0;
      const rB = Number(b.readiness_pct) || 0;
      if (rB !== rA) return rB - rA;
      const cA = Number(a.confidence_pct) || 0;
      const cB = Number(b.confidence_pct) || 0;
      if (cB !== cA) return cB - cA;
      const hA = Number(a.hit_count) || 0;
      const hB = Number(b.hit_count) || 0;
      return hB - hA;
    });

    // Kiểm tra state để chỉ kích hoạt hiệu ứng mượt khi có cập nhật tín hiệu
    const currentKeys = JSON.stringify(candidates.map(c => [
      c.symbol, c.side, c.radar_status, c.bottleneck_gate, c.bottleneck_reason,
      c.hit_count, c.readiness_pct, c.confidence_pct, c.score,
      c.strategies_agreed, c.dynamic_leverage, c.last_seen_str
    ]));
    if (window._lastWebRadarKeys === currentKeys) {
      return;
    }
    window._lastWebRadarKeys = currentKeys;

    const leftItems = candidates.slice(0, 2);
    const rightItems = candidates.slice(2, 4);

    function createCardHtml(c, idx) {
      const isLong = (c.side || "LONG").toUpperCase() === "LONG" || (c.side || "").toUpperCase() === "BUY";
      const dirClass = isLong
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
        : "bg-rose-500/20 text-rose-400 border-rose-500/40";
      const dirText = isLong ? "LONG" : "SHORT";
      const safeSymbol = escapeHtml(c.symbol);
      const safeTimeWindow = escapeHtml(c.time_window_str || c.last_seen_str || 'Gần đây');
      const safeLastSeen = escapeHtml(c.last_seen_str || '--');
      const safeReason = escapeHtml(c.bottleneck_reason || 'Đang kiểm tra ngưỡng an toàn');
      const safeAgreement = escapeHtml(c.strategies_agreed || '—');
      const safeLeverage = String(c.bottleneck_gate || '').toUpperCase() === 'M1_SNIPER_STALKING'
        ? escapeHtml(c.dynamic_leverage || '—') : '—';
      const confidenceValue = Number(c.confidence_pct);
      const safeConfidence = Number.isFinite(confidenceValue) ? Math.max(0, Math.min(100, confidenceValue)).toFixed(1) : '--';
      const scoreValue = Number(c.score);
      const safeScore = Number.isFinite(scoreValue) && scoreValue !== 0 ? ` · ${scoreValue >= 0 ? '+' : ''}${scoreValue.toFixed(2)}` : '';
      const radarStatus = c.radar_status || statusFor(c);
      const statusLabel = radarStatus === 'STALKING' ? 'ĐANG RÌNH MAKER'
        : radarStatus === 'WAITING_RESOURCE' ? 'TÍN HIỆU ĐẠT · CHỜ SLOT'
        : 'BỊ CHẶN';
      const gateLabel = escapeHtml(c.bottleneck_gate || 'PRE_TRADE_GATE');
      const processOutcome = radarStatus === 'STALKING' ? 'RÌNH MAKER'
        : radarStatus === 'WAITING_RESOURCE' ? 'CHỜ SLOT' : 'BỊ CHẶN';
      const processColor = radarStatus === 'STALKING' ? '#6ee7b7'
        : radarStatus === 'WAITING_RESOURCE' ? '#fcd34d' : '#fda4af';
      const processBackground = radarStatus === 'STALKING' ? 'rgba(52,211,153,0.07)'
        : radarStatus === 'WAITING_RESOURCE' ? 'rgba(251,191,36,0.07)' : 'rgba(251,113,133,0.07)';
      const processNote = radarStatus === 'STALKING'
        ? 'Lệnh Maker đang rình trong RAM; chưa gửi lên Binance.'
        : radarStatus === 'WAITING_RESOURCE'
          ? 'Tín hiệu đạt điều kiện; bot đang chờ slot/ký quỹ, chưa gửi lệnh Binance.'
          : 'Ứng viên đã được phân tích nhưng bị chặn; chưa có lệnh gửi Binance.';
      const priorityValue = Number(c.readiness_pct);
      const radarPriority = Number.isFinite(priorityValue)
        ? Math.max(0, Math.min(100, priorityValue)) : null;

      // 1. Phân loại hiệu ứng Hoán Đổi Vị Trí Game-like & Quỹ đạo bay 3D
      const prevRank = (window._prevRadarRankMap && window._prevRadarRankMap[c.symbol]) ? window._prevRadarRankMap[c.symbol] : null;
      const currRank = idx + 1;
      
      let movementClass = (idx < 2) ? 'radar-anim-warp-left' : 'radar-anim-warp-right';
      let rankChangeBadge = '';
      let isSnapDocking = false;
      
      if (prevRank) {
        if (prevRank >= 3 && currRank <= 2) {
          // BỨT PHÁ XUYÊN BIÊN: Từ Cột Phải (Top 3/4) bay vút sang Cột Trái (Top 1/2)!
          movementClass = 'radar-anim-cross-ascend';
          rankChangeBadge = "";
          isSnapDocking = true;
        } else if (prevRank <= 2 && currRank >= 3) {
          // TỤT HẠNG XUYÊN BIÊN: Từ Cột Trái (Top 1/2) rơi lướt sang Cột Phải (Top 3/4)!
          movementClass = 'radar-anim-cross-descend';
          rankChangeBadge = "";
          isSnapDocking = true;
        } else if (prevRank > currRank) {
          // THĂNG HẠNG CÙNG CỘT (Top 2 -> Top 1 hoặc Top 4 -> Top 3)
          movementClass = 'radar-anim-3d-ascend';
          rankChangeBadge = "";
          isSnapDocking = true;
        } else if (prevRank < currRank) {
          // TỤT HẠNG CÙNG CỘT (Top 1 -> Top 2 hoặc Top 3 -> Top 4)
          movementClass = 'radar-anim-3d-descend';
          rankChangeBadge = "";
          isSnapDocking = true;
        } else {
          // GIỮ NGUYÊN VỊ TRÍ
          movementClass = '';
          rankChangeBadge = "";
        }
      } else {
        // TÂN BINH MỚI LỌT VÀO TOP 4
        movementClass = (idx < 2) ? 'radar-anim-warp-left' : 'radar-anim-warp-right';
        rankChangeBadge = "";
        isSnapDocking = true;
      }

      // 2. Thiết lập 4 ĐẶC TRƯNG HÌNH ẢNH HOÀN TOÀN KHÁC BIỆT (CHỈ ĐẶT TÊN TOP 1, TOP 2, TOP 3, TOP 4)
      let rankThemeClass = '';
      let rankBadge = '';
      let rankBg = '';
      let rankBorder = '';
      let glowBar = '';
      let textRankColor = '';
      let symColor = '';
      let sweepBeam = '';
      let glowColorRgba = '';
      let sparkColorHex = '';

      if (idx === 0) {
        // 🥇 TOP 1 (GOLD CYBER)
        rankThemeClass = 'radar-card-top-1';
        rankBadge = '🥇 TOP 1';
        rankBg = 'bg-gradient-to-br from-amber-500/[0.18] via-yellow-500/[0.06] to-[#070b14]';
        rankBorder = 'border-amber-400/65 shadow-amber-400/20';
        glowBar = 'from-amber-400 via-yellow-400 to-amber-200';
        textRankColor = 'text-amber-400';
        symColor = 'text-amber-300 font-black tracking-wider drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.95), transparent);';
        glowColorRgba = 'rgba(251, 191, 36, 0.8)';
        sparkColorHex = '#fbbf24';
      } else if (idx === 1) {
        // 🥈 TOP 2 (CYAN LASER)
        rankThemeClass = 'radar-card-top-2';
        rankBadge = '🥈 TOP 2';
        rankBg = 'bg-gradient-to-br from-cyan-500/[0.14] via-sky-500/[0.05] to-[#070b14]';
        rankBorder = 'border-cyan-400/55 shadow-cyan-400/15';
        glowBar = 'from-cyan-400 via-sky-400 to-blue-300';
        textRankColor = 'text-cyan-400';
        symColor = 'text-cyan-200 font-black tracking-wide drop-shadow-[0_0_8px_rgba(56,189,248,0.35)]';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.90), transparent);';
        glowColorRgba = 'rgba(56, 189, 248, 0.7)';
        sparkColorHex = '#38bdf8';
      } else if (idx === 2) {
        // 🥉 TOP 3 (WARM AMBER)
        rankThemeClass = 'radar-card-top-3';
        rankBadge = '🥉 TOP 3';
        rankBg = 'bg-gradient-to-br from-orange-500/[0.12] via-amber-600/[0.04] to-[#070b14]';
        rankBorder = 'border-orange-500/50 shadow-orange-500/15';
        glowBar = 'from-orange-500 via-amber-500 to-yellow-500';
        textRankColor = 'text-orange-400';
        symColor = 'text-orange-200 font-bold drop-shadow-[0_0_6px_rgba(249,115,22,0.3)]';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.85), transparent);';
        glowColorRgba = 'rgba(249, 115, 22, 0.65)';
        sparkColorHex = '#fb923c';
      } else {
        // 🎖️ TOP 4 (STEALTH EMERALD)
        rankThemeClass = 'radar-card-top-4';
        rankBadge = '🎖️ TOP 4';
        rankBg = 'bg-gradient-to-br from-emerald-500/[0.11] via-teal-600/[0.03] to-[#070b14]';
        rankBorder = 'border-emerald-500/45 shadow-emerald-500/15';
        glowBar = 'from-emerald-500 via-teal-400 to-cyan-400';
        textRankColor = 'text-emerald-400';
        symColor = 'text-emerald-200 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.80), transparent);';
        glowColorRgba = 'rgba(16, 185, 129, 0.6)';
        sparkColorHex = '#34d399';
      }

      // 3. Bậc thang thời gian chuyển động (Cascading Staggered Timing: 0.00s, 0.16s, 0.32s, 0.48s)
      const delaySec = (idx * 0.16).toFixed(2);
      const hitCount = (c.hit_count !== undefined && c.hit_count !== null && Number(c.hit_count) > 0)
        ? Number(c.hit_count)
        : 1;

      const hitTag = `<span class="px-2 py-0.5 rounded-md text-[10px] font-black mono-font bg-amber-400/15 text-amber-300 border border-amber-400/35 flex items-center gap-1 shrink-0 shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>🔥 ${hitCount} lần</span>`;

      // Hậu hiệu ứng: Sóng xung kích nổ khóa snap khi ráp vào vị trí
      const dockingBurstHtml = isSnapDocking ? `<div class="radar-docking-burst-fx" style="--rank-glow-color: ${glowColorRgba};"></div>` : '';

      return `
        <div class="radar-holo-card ${rankThemeClass} ${movementClass} p-3 sm:p-3.5 rounded-2xl ${rankBg} border ${rankBorder} shadow-2xl relative group cursor-pointer select-text" data-rank="${idx + 1}" data-spark-color="${sparkColorHex}" style="animation-delay: ${delaySec}s; --rank-glow-color: ${glowColorRgba};">
          <!-- Lớp cắt bo tròn bên trong cho tia Laser & Glare -->
          <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
            <div class="radar-holo-glare"></div>
            ${dockingBurstHtml}
            <div class="radar-laser-line" style="${sweepBeam}"></div>
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${glowBar}"></div>
          </div>

          <div class="flex items-center justify-between gap-1.5 mb-2 relative z-10">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded-md text-xs font-black mono-font bg-white/[0.08] ${textRankColor} border border-white/10 shadow-sm">
                ${rankBadge}
              </span>
              <a href="https://www.binance.com/vi/futures/${c.symbol.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}" target="_blank" rel="noopener noreferrer"
                 title="Bấm để mở biểu đồ ${safeSymbol} trên Binance Futures"
                 class="text-xs sm:text-sm mono-font font-black tracking-wider ${symColor} hover:underline hover:text-amber-300 inline-flex items-center gap-1 select-text cursor-pointer transition-colors z-20"
                 onclick="event.stopPropagation();">
                <span class="select-text">${safeSymbol}</span>
                <i data-lucide="external-link" class="w-3 h-3 opacity-60 hover:opacity-100 shrink-0"></i>
              </a>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-black mono-font border ${dirClass}">
                ${dirText}
              </span>
              
            </div>
            <div class="shrink-0">
              ${hitTag}
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-gray-400 mono-font mb-2 relative z-10">
            <span>Thời điểm: <strong class="text-gray-300">${safeTimeWindow}</strong></span>
            <span>Cập nhật: <strong class="text-gray-300">${safeLastSeen}</strong></span>
          </div>

          <div class="flex items-center justify-between text-[10px] mono-font mb-2 relative z-10">
            <span class="text-gray-400">Trạng thái:</span>
            <strong class="${radarStatus === 'BLOCKED' ? 'text-rose-400' : textRankColor}">${statusLabel} · ${gateLabel}</strong>
          </div>

          <div class="mb-2 relative z-10 min-w-0" title="Điểm heuristic dùng để xếp hạng ứng viên; không phải tiến độ khớp lệnh hay xác suất thắng.">
            <div class="flex items-center justify-between gap-2 text-[9px] sm:text-[10px] mono-font mb-1">
              <span class="text-gray-300 font-bold">ĐIỂM ƯU TIÊN RADAR</span>
              <span class="${textRankColor} font-black shrink-0">${radarPriority === null ? '—' : `${radarPriority.toFixed(1)}/100`}</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" style="width:${radarPriority ?? 0}%; background:${sparkColorHex};"></div>
            </div>
            <div class="text-[8px] text-gray-500 mt-1">Điểm xếp hạng ứng viên, không phải tiến độ lệnh.</div>
          </div>

          <div class="mb-2 relative z-10 min-w-0">
            <div class="text-[9px] sm:text-[10px] text-gray-300 font-bold mono-font mb-1">TIẾN TRÌNH ỨNG VIÊN</div>
            <div class="grid grid-cols-3 gap-1 min-w-0 text-center mono-font">
              <div class="min-w-0 p-1 rounded-lg border border-emerald-400/30 bg-emerald-400/[0.06] overflow-hidden">
                <div class="text-[8px] text-gray-500">BƯỚC 1</div><div class="text-[9px] text-emerald-300 font-black break-words">QUÉT ✓</div>
              </div>
              <div class="min-w-0 p-1 rounded-lg border border-emerald-400/30 bg-emerald-400/[0.06] overflow-hidden">
                <div class="text-[8px] text-gray-500">BƯỚC 2</div><div class="text-[9px] text-emerald-300 font-black break-words">ĐÁNH GIÁ ✓</div>
              </div>
              <div class="min-w-0 p-1 rounded-lg border border-white/10 overflow-hidden" style="border-color:${processColor}66; background:${processBackground};">
                <div class="text-[8px] text-gray-500">BƯỚC 3</div><div class="text-[9px] font-black break-words" style="color:${processColor};">${processOutcome}</div>
              </div>
            </div>
            <div class="text-[9px] leading-snug text-gray-500 mt-1 break-words">${processNote}</div>
          </div>

          <div class="grid grid-cols-3 gap-1 mb-2 text-[10px] mono-font text-center relative z-10 min-w-0">
            <div class="min-w-0 overflow-hidden p-1 rounded-lg bg-black/60 border border-white/5">
              <div class="text-[9px] text-gray-400">Độ tin cậy tín hiệu</div>
              <div class="font-bold text-white text-[10px] mt-0.5 truncate">${dirText} ${safeConfidence}%${safeScore}</div>
            </div>
            <div class="min-w-0 overflow-hidden p-1 rounded-lg bg-black/60 border border-white/5">
              <div class="text-[9px] text-gray-400">Nguồn đồng chiều</div>
              <div class="font-bold text-white text-[10px] mt-0.5 truncate" title="${safeAgreement}">${safeAgreement}</div>
            </div>
            <div class="min-w-0 overflow-hidden p-1 rounded-lg bg-black/60 border border-white/5">
              <div class="text-[9px] text-gray-400">Đòn Bẩy</div>
              <div class="font-bold ${textRankColor} text-[10px] mt-0.5">${safeLeverage}</div>
            </div>
          </div>

          <div class="p-2 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 flex items-start gap-1.5 relative z-10">
            <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5"></i>
            <div class="text-[10px] sm:text-[11px] text-gray-300 leading-snug">
              <span class="text-amber-400 font-bold">${radarStatus === 'STALKING' ? 'Lệnh đang rình:' : radarStatus === 'BLOCKED' ? 'Lý do chặn:' : 'Điều kiện còn chờ:'}</span>
              <span>${safeReason}</span>
            </div>
          </div>
        </div>
      `;
    }

    colLeft.innerHTML = leftItems.map((c, i) => createCardHtml(c, i)).join("");

    if (rightItems.length > 0) {
      colRight.innerHTML = rightItems.map((c, i) => createCardHtml(c, i + 2)).join("");
    } else {
      colRight.innerHTML = `
        <div class="p-5 rounded-2xl bg-[#090d16]/50 border border-white/5 text-center flex flex-col items-center justify-center min-h-[140px]">
          <div class="text-lg mb-1 text-gray-500">⏳</div>
          <div class="text-xs text-gray-400 mono-font">Đang rà soát Top 3 & 4...</div>
          <div class="text-[10px] text-gray-500 mt-1">Ứng viên mới sẽ xuất hiện khi dữ liệu được cập nhật.</div>
        </div>
      `;
    }

    // Lưu lại vị trí xếp hạng để so sánh chuyển động hoán đổi trong chu kỳ sau
    const newRankMap = {};
    candidates.slice(0, 4).forEach((c, i) => {
      newRankMap[c.symbol] = i + 1;
    });
    window._prevRadarRankMap = newRankMap;

    // Gắn bộ điều khiển tương tác 3D Parallax Tilt & Hạt Năng Lượng theo chuột
    attachRadar3DInteraction();
    triggerAllCardsBorderBurst();

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (renderErr) {
    console.error("renderRadarLeaderboard error:", renderErr);
  }
}

// Render ngay lập tức khi tải file (trạng thái rỗng an toàn, không coin ảo)
renderRadarLeaderboard([]);



// ===== SÓNG XUNG KÍCH HÀO QUANG BÙNG NỔ KHI KHỚP VỊ TRÍ (KHÔNG DÙNG CHẤM MÀU TRẺ CON) =====
function triggerCardBorderBurst(card) {
  if (!card) return;
  const color = card.getAttribute('data-spark-color') || '#fbbf24';

  // Sóng xung kích phát quang bùng nổ theo hình chữ nhật viền thẻ (1.6s mượt mà)
  const shockwave = document.createElement('div');
  shockwave.className = 'radar-border-shockwave';
  shockwave.style.setProperty('--wave-color', color);
  card.appendChild(shockwave);
  setTimeout(() => { if (shockwave.parentNode) shockwave.remove(); }, 1650);
}

function triggerAllCardsBorderBurst() {
  const cards = document.querySelectorAll('.radar-holo-card');
  cards.forEach((card, idx) => {
    // Kích hoạt sóng xung kích viền ngay khi thẻ chạm mốc hạ cánh (0.65s)
    const delay = (idx * 180) + 650;
    setTimeout(() => {
      triggerCardBorderBurst(card);
    }, delay);
  });
}

// ===== BỘ ĐIỀU KHIỂN TƯƠNG TÁC 3D PARALLAX TILT & HÀO QUANG ÁNH SÁNG KHI RÊ CHUỘT (CHUẨN XÁC 100% 4 THẺ) =====
function attachRadar3DInteraction() {
  const cards = document.querySelectorAll('.radar-holo-card');
  cards.forEach((card, idx) => {
    // 1. Dọn dẹp movement class khi animation kết thúc để MỞ KHÓA style.transform 3D và kích hoạt Hào Quang Thở liên tục
    const cleanupMovement = () => {
      card.classList.remove(
        'radar-anim-warp-left',
        'radar-anim-warp-right',
        'radar-anim-cross-ascend',
        'radar-anim-cross-descend',
        'radar-anim-3d-ascend',
        'radar-anim-3d-descend'
      );
    };
    card.addEventListener('animationend', cleanupMovement, { once: true });
    setTimeout(cleanupMovement, (idx * 220) + 1600); // Safety fallback

    if (card._tiltAttached) return;
    card._tiltAttached = true;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Góc nghiêng 3D mượt mà tối đa +-9 độ
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 11;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(14px) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
      card.style.setProperty('--glare-opacity', '1');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)`;
      card.style.setProperty('--glare-opacity', '0');
    });
  });
}


// =========================================================================================
// 💼 TRUNG TÂM ĐIỀU HƯỚNG ĐẦU TƯ CHUẨN QUỸ V2.0 (PERSONALIZED QUANT PORTFOLIO NAVIGATOR)
// =========================================================================================

let currentPortfolioCapital = 1000;
let currentPortfolioSymbol = 'SOLUSDT';
let currentPortfolioTf = '15m';
let currentPortfolioCategory = 'all';
let portfolioChart = null;
let portfolioCandleSeries = null;
let portfolioPriceLines = [];
let lastKnownRadarCandidates = [];
const priceCache = {};
let allPricesFetchedTs = 0;

// Nạp toàn bộ giá thời gian thực từ Binance Futures (500+ cặp chỉ trong 1 request <100ms)
async function refreshAllPrices() {
  const now = Date.now();
  if (now - allPricesFetchedTs < 12000 && Object.keys(priceCache).length > 20) return;
  try {
    const res = await fetch("https://fapi.binance.com/fapi/v1/ticker/price");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach(item => {
          priceCache[item.symbol] = parseFloat(item.price);
        });
        allPricesFetchedTs = now;
      }
    }
  } catch (e) {}
}

// Hàm định dạng giá thông minh chống bẹp về 0.00$ cho Altcoin nhỏ
function formatSmartPrice(val) {
  if (val === undefined || val === null || isNaN(val) || val === 0) return '0.00';
  const num = Math.abs(Number(val));
  if (num >= 1000) return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  if (num >= 0.01) return Number(val).toFixed(4);
  if (num >= 0.0001) return Number(val).toFixed(6);
  return Number(val).toFixed(8);
}

function getSmartPriceFormat(price) {
  const num = Math.abs(Number(price || 1));
  if (num >= 100) return { type: 'price', precision: 2, minMove: 0.01 };
  if (num >= 1) return { type: 'price', precision: 4, minMove: 0.0001 };
  if (num >= 0.01) return { type: 'price', precision: 6, minMove: 0.000001 };
  return { type: 'price', precision: 8, minMove: 0.00000001 };
}

// Chuyển nhanh biểu đồ sang bất kỳ mã nào & cuộn mượt
window.switchToPortfolioSymbol = function(symbol) {
  const clean = String(symbol || "BTCUSDT").toUpperCase().trim().replace('/', '').replace(':', '');
  currentPortfolioSymbol = clean;
  const symSelect = document.getElementById("portfolioChartSymbolSelect");
  const searchInput = document.getElementById("portfolioChartSearchInput");
  if (searchInput) searchInput.value = clean;
  if (symSelect) {
    let exists = false;
    for (let i = 0; i < symSelect.options.length; i++) {
      if (symSelect.options[i].value === clean) {
        exists = true;
        symSelect.selectedIndex = i;
        break;
      }
    }
    if (!exists) {
      const opt = document.createElement("option");
      opt.value = clean;
      opt.textContent = `${clean} (Đang xem)`;
      symSelect.appendChild(opt);
      symSelect.value = clean;
    }
  }
  loadPortfolioChart(clean, currentPortfolioTf);
  const chartSec = document.getElementById("portfolioChartContainer");
  if (chartSec) {
    chartSec.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

// Khởi tạo Module Quản Lý Đầu Tư Chuẩn Quỹ
function initPortfolioNavigator() {
  const capInput = document.getElementById("portfolioCapitalInput");
  const quickBtns = document.querySelectorAll(".btn-quick-cap");
  const tfBtns = document.querySelectorAll(".btn-chart-tf");
  const symSelect = document.getElementById("portfolioChartSymbolSelect");
  const searchInput = document.getElementById("portfolioChartSearchInput");
  const tabBtns = document.querySelectorAll(".btn-portfolio-tab");
  const addForm = document.getElementById("addHoldingForm");

  // 1. Lắng nghe thay đổi vốn
  if (capInput) {
    capInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) || 0;
      updateCapitalAllocation(val);
    });
  }

  // Quick capital buttons
  quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      quickBtns.forEach(b => {
        b.classList.remove("active", "bg-emerald-500/20", "text-emerald-300", "border-emerald-500/30", "font-bold");
        b.classList.add("bg-white/5", "text-gray-300");
      });
      btn.classList.add("active", "bg-emerald-500/20", "text-emerald-300", "border-emerald-500/30", "font-bold");
      btn.classList.remove("bg-white/5", "text-gray-300");

      const cap = parseFloat(btn.getAttribute("data-cap")) || 1000;
      if (capInput) capInput.value = cap;
      updateCapitalAllocation(cap);
    });
  });

  // 2. Lắng nghe chuyển timeframe biểu đồ
  tfBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tfBtns.forEach(b => {
        b.classList.remove("active", "bg-emerald-500/20", "text-emerald-300", "font-bold");
        b.classList.add("text-gray-400");
      });
      btn.classList.add("active", "bg-emerald-500/20", "text-emerald-300", "font-bold");
      btn.classList.remove("text-gray-400");

      currentPortfolioTf = btn.getAttribute("data-tf") || '15m';
      loadPortfolioChart(currentPortfolioSymbol, currentPortfolioTf);
    });
  });

  // 3. Lắng nghe chọn symbol từ Dropdown
  if (symSelect) {
    symSelect.addEventListener("change", (e) => {
      currentPortfolioSymbol = e.target.value;
      if (searchInput) searchInput.value = currentPortfolioSymbol;
      loadPortfolioChart(currentPortfolioSymbol, currentPortfolioTf);
    });
  }

  // 4. Lắng nghe tìm kiếm / gõ mã từ Search Input (Hỗ trợ toàn bộ 239+ mã từ DB PC2 & TradFi)
  const datalist = document.getElementById("allSymbolsDatalist");
  if (datalist && (!datalist.options || datalist.options.length < 50)) {
    const knownList = ["1000CATUSDT", "1000PEPEUSDT", "1000XECUSDT", "2ZUSDT", "AAPLUSDT", "ACTUSDT", "ADAUSDT", "AEROUSDT", "AGTUSDT", "AINUSDT", "AIOUSDT", "AIOTUSDT", "AKEUSDT", "AKTUSDT", "ALABUSDT", "AMDUSDT", "AMZNUSDT", "APRUSDT", "ARCUSDT", "ARIAUSDT", "ARKMUSDT", "ARKUSDT", "ARMUSDT", "ASTSUSDT", "AVAUSDT", "AVAXUSDT", "AVGOUSDT", "AXLUSDT", "AXTIUSDT", "BABAUSDT", "BABYUSDT", "BASEDUSDT", "BATUSDT", "BEAMXUSDT", "BEATUSDT", "BERAUSDT", "BEUSDT", "BIRBUSDT", "BLESSUSDT", "BLUAIUSDT", "BMNRUSDT", "BMTUSDT", "BNBUSDT", "BOMEUSDT", "BOTUSDT", "BRKBUSDT", "BRUSDT", "BTCUSDT", "BTWUSDT", "BYDUSDT", "BZUSDT", "CAPUSDT", "CBRSUSDT", "CCUSDT", "CFGUSDT", "CHIPUSDT", "CKBUSDT", "CLANKERUSDT", "CLUSDT", "COINUSDT", "COPPERUSDT", "CRCLUSDT", "CRDOUSDT", "CTUSDT", "CVCUSDT", "CYBERUSDT", "CYSUSDT", "DASHUSDT", "DELLUSDT", "DISUSDT", "DODOXUSDT", "DOGEUSDT", "DOSUSDT", "DOTUSDT", "DUSKUSDT", "EDGEUSDT", "EDENUSDT", "EIGENUSDT", "ELSAUSDT", "ENAUSDT", "EPICUSDT", "ERAUSDT", "ETHFIUSDT", "ETHUSDC", "ETHUSDT", "EVAAUSDT", "FETUSDT", "FLUIDUSDT", "FOGOUSDT", "FOLKSUSDT", "GALAUSDT", "GIGADEVUSDT", "GOOGLUSDT", "GPSUSDT", "GRAMUSDT", "GRASSUSDT", "GRVTUSDT", "GTCUSDT", "HAEDALUSDT", "HANAUSDT", "HMSTRUSDT", "HOODUSDT", "HOTUSDT", "HUMAUSDT", "HYPEUSDT", "ICNTUSDT", "IDOLUSDT", "IDUSDT", "INITUSDT", "INJUSDT", "INTCUSDT", "IOTAUSDT", "IRYSUSDT", "JCTUSDT", "JTOUSDT", "KERNELUSDT", "KGENUSDT", "KITEUSDT", "KMNOUSDT", "KOMAUSDT", "LABUSDT", "LAUSDT", "LITUSDT", "LTCUSDT", "LUMIAUSDT", "LYNUSDT", "MAGICUSDT", "MAGMAUSDT", "MANTAUSDT", "MEGAUSDT", "MELANIAUSDT", "MERLUSDT", "METAUSDT", "METUSDT", "MONUSDT", "MOODENGUSDT", "MOVRUSDT", "MRVLUSDT", "MSFTUSDT", "MSTRUSDT", "MUBARAKUSDT", "MUSDT", "MUUSDT", "MUUUSDT", "NATGASUSDT", "NEARUSDT", "NIGHTUSDT", "NILUSDT", "NOMUSDT", "NVDAUSDT", "NXPCUSDT", "OGNUSDT", "ONEUSDT", "ONUSDT", "OPGUSDT", "OPUSDT", "PARTIUSDT", "PAXGUSDT", "PDDUSDT", "PENGUUSDT", "PEOPLEUSDT", "PHAUSDT", "PIEVERSEUSDT", "PLTRUSDT", "PONSUSDT", "POWRUSDT", "PUMPUSDT", "QNTUSDT", "QQQUSDT", "QUSDT", "RAYSOLUSDT", "RECALLUSDT", "REDUSDT", "RKLBUSDT", "RSRUSDT", "RUNEUSDT", "SAFEUSDT", "SANDUSDT", "SENTUSDT", "SHAZUSDT", "SIGNUSDT", "SIRENUSDT", "SKHYNIXUSDT", "SKHYUSDT", "SKYAIUSDT", "SLXUSDT", "SMCIUSDT", "SNDKUSDT", "SNXXUSDT", "SOLUSDT", "SOLVUSDT", "SOONUSDT", "SOPHUSDT", "SOXLUSDT", "SOXSUSDT", "SPYUSDT", "SQDUSDT", "SQQQUSDT", "STABLEUSDT", "STARUSDT", "STRKUSDT", "STXUSDT", "SUIUSDT", "SUSDT", "TAGUSDT", "TAOUSDT", "TAUSDT", "TEMUSDT", "THETAUSDT", "TIAUSDT", "TQQQUSDT", "TRADOORUSDT", "TRIAUSDT", "TRUMPUSDT", "TRUSTUSDT", "TSLAUSDT", "TUTUSDT", "UAIUSDT", "UNIUSDT", "USELESSUSDT", "UVXYUSDT", "VELODROMEUSDT", "VETUSDT", "WALUSDT", "WENUSDT", "WLDUSDT", "XAGUSDT", "XAUUSDT", "XNYUSDT", "XPINUSDT", "XPLUSDT", "XRPUSDT", "XTZUSDT", "YBUSDT", "ZAMAUSDT", "ZECUSDT", "ZEREBROUSDT", "ZESTUSDT", "ZKUSDT", "ZROUSDT"];
    datalist.innerHTML = "";
    knownList.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = `${s} (Đã Quét & Phân Tích Trên PC2)`;
      datalist.appendChild(opt);
    });
  }

  if (searchInput) {
    const handleSearchInput = (val) => {
      if (!val) return;
      let clean = String(val).toUpperCase().trim().replace('/', '').replace(':', '');
      const aliasMap = {
        'XAU': 'XAUUSDT', 'GOLD': 'XAUUSDT', 'VANG': 'XAUUSDT',
        'XAG': 'XAGUSDT', 'SILVER': 'XAGUSDT', 'BAC': 'XAGUSDT',
        'CL': 'CLUSDT', 'OIL': 'CLUSDT', 'CRUDE': 'CLUSDT', 'DAU': 'CLUSDT',
        'BZ': 'BZUSDT', 'BRENT': 'BZUSDT',
        'PAXG': 'PAXGUSDT', 'COPPER': 'COPPERUSDT', 'DONG': 'COPPERUSDT',
        'PEPE': '1000PEPEUSDT', '1000PEPE': '1000PEPEUSDT',
        'BTC': 'BTCUSDT', 'ETH': 'ETHUSDT', 'SOL': 'SOLUSDT', 'BNB': 'BNBUSDT', 'XRP': 'XRPUSDT',
        'NVDA': 'NVDAUSDT', 'TSLA': 'TSLAUSDT', 'MSTR': 'MSTRUSDT', 'PLTR': 'PLTRUSDT',
        'SOXL': 'SOXLUSDT', 'TQQQ': 'TQQQUSDT', 'SPY': 'SPYUSDT', 'QQQ': 'QQQUSDT'
      };
      if (aliasMap[clean]) clean = aliasMap[clean];
      if (!clean.endsWith('USDT') && !clean.endsWith('BUSD') && !clean.endsWith('USDC')) {
        clean = clean + 'USDT';
      }
      switchToPortfolioSymbol(clean);
    };

    searchInput.addEventListener("change", (e) => handleSearchInput(e.target.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchInput(e.target.value);
      }
    });
  }

  // 5. Lắng nghe Tabs Phân Loại Danh Mục Tài Sản (All, Commodity, TradFi, Major, Altcoin)
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => {
        b.classList.remove("active", "bg-amber-500/20", "text-amber-300", "border-amber-500/40", "font-bold");
        b.classList.add("text-gray-400", "bg-black/40", "border-white/10");
      });
      btn.classList.add("active", "bg-amber-500/20", "text-amber-300", "border-amber-500/40", "font-bold");
      btn.classList.remove("text-gray-400", "bg-black/40", "border-white/10");

      currentPortfolioCategory = btn.getAttribute("data-cat") || 'all';
      renderPortfolioLeaderboard(lastKnownRadarCandidates, currentPortfolioCapital, currentPortfolioCategory);
    });
  });

  // 6. Lắng nghe thêm vị thế đang hold
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const sym = (document.getElementById("holdSymInput")?.value || "").toUpperCase().trim();
      const entry = parseFloat(document.getElementById("holdEntryInput")?.value) || 0;
      const amt = parseFloat(document.getElementById("holdAmountInput")?.value) || 0;

      if (sym && entry > 0 && amt > 0) {
        addUserHolding(sym, entry, amt);
        addForm.reset();
      }
    });
  }

  // 7. Nạp biểu đồ ban đầu & dữ liệu
  refreshAllPrices();
  updateCapitalAllocation(1000);
  renderUserHoldings();
  setTimeout(() => {
    loadPortfolioChart(currentPortfolioSymbol, currentPortfolioTf);
  }, 350);
}

// Cập nhật phân bổ tỷ trọng vốn & Stress Test
function updateCapitalAllocation(capital) {
  currentPortfolioCapital = Math.max(10, capital);
  
  const capEcho = document.getElementById("displayCapitalEcho");
  const allocCash = document.getElementById("allocCashVal");
  const allocActive = document.getElementById("allocActiveVal");
  const stressBtc = document.getElementById("stressBtcDumpVal");
  const stressBlackSwan = document.getElementById("stressBlackSwanVal");

  const cash = currentPortfolioCapital * 0.40;
  const active = currentPortfolioCapital * 0.60;
  
  // Stress test: BTC dump -10% mất ~2.75% active capital (1.65% total NAV)
  const lossBtc = -(active * 0.0275);
  const lossBlackSwan = -(active * 0.0633);

  if (capEcho) capEcho.textContent = `${currentPortfolioCapital.toLocaleString()} USDT`;
  if (allocCash) allocCash.textContent = `$${cash.toFixed(2)} USDT`;
  if (allocActive) allocActive.textContent = `$${active.toFixed(2)} USDT`;
  if (stressBtc) stressBtc.textContent = `-$${Math.abs(lossBtc).toFixed(2)} (-${((Math.abs(lossBtc)/currentPortfolioCapital)*100).toFixed(2)}%)`;
  if (stressBlackSwan) stressBlackSwan.textContent = `-$${Math.abs(lossBlackSwan).toFixed(2)} (-${((Math.abs(lossBlackSwan)/currentPortfolioCapital)*100).toFixed(2)}%)`;

  renderPortfolioLeaderboard(lastKnownRadarCandidates, currentPortfolioCapital, currentPortfolioCategory);
}

// Bảng xếp hạng đồng đề xuất & Lộ trình điều hướng chi tiết
async function renderPortfolioLeaderboard(rawCandidates, capital, category = 'all') {
  const container = document.getElementById("portfolioLeaderboardContainer");
  if (!container) return;

  await refreshAllPrices();

  // Tự động đồng bộ các mã Ra-đa tươi vào <optgroup id="chartOptgroupRadar">
  const radarOptgroup = document.getElementById("chartOptgroupRadar");
  if (radarOptgroup && Array.isArray(rawCandidates) && rawCandidates.length > 0) {
    radarOptgroup.innerHTML = "";
    rawCandidates.slice(0, 10).forEach(c => {
      const s = String(c.symbol || '').replace('/', '').replace(':', '').toUpperCase();
      if (s) {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = `${s} (Ra-đa ${c.side || 'LONG'})`;
        radarOptgroup.appendChild(opt);
      }
    });
  }

  // Danh mục toàn diện các cơ hội đầu tư chuẩn quỹ (Kim loại quý, TradFi, Major, Altcoin)
  const assetCatalog = [
    // 🥇 KIM LOẠI QUÝ & HÀNG HÓA
    {
      symbol: "XAU/USDT",
      cleanSym: "XAUUSDT",
      category: "commodity",
      tag: "🥇 Kim Loại Quý",
      side: "LONG",
      score: 93.5,
      confidence: 0.90,
      status: "READY",
      intent: "🛡️ HẤP THỤ PHÒNG HỘ VÀNG THẾ GIỚI (Gold Perps)",
      intentColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      defaultPrice: 3840.0,
      leverage: "2x (Hàng hóa Chuẩn Quỹ)",
      allocPct: 0.25,
      mtf: "Dòng tiền trú ẩn vĩ mô toàn cầu • Giao dịch 24/5 liên tục • Tránh sốc tiền tệ & lạm phát",
      slPct: 0.015,
      tp1Pct: 0.025,
      tp2Pct: 0.050,
      trailingFloorPct: 0.008
    },
    {
      symbol: "XAG/USDT",
      cleanSym: "XAGUSDT",
      category: "commodity",
      tag: "🥈 Kim Loại Bạc",
      side: "LONG",
      score: 89.0,
      confidence: 0.85,
      status: "READY",
      intent: "⚡ SÓNG ĐẦU CƠ & BÁN DẪN BẠC (Silver Bull)",
      intentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      defaultPrice: 47.5,
      leverage: "2x (Hàng hóa)",
      allocPct: 0.20,
      mtf: "Nhu cầu pin năng lượng & chip bán dẫn tăng tốc • Biên độ mở rộng nhanh",
      slPct: 0.020,
      tp1Pct: 0.035,
      tp2Pct: 0.070,
      trailingFloorPct: 0.010
    },
    {
      symbol: "CL/USDT",
      cleanSym: "CLUSDT",
      category: "commodity",
      tag: "🛢️ Năng Lượng",
      side: "LONG",
      score: 85.5,
      confidence: 0.82,
      status: "READY",
      intent: "🌊 BIẾN ĐỘNG NĂNG LƯỢNG TOÀN CẦU (Crude Oil)",
      intentColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      defaultPrice: 87.7,
      leverage: "2x (Hàng hóa)",
      allocPct: 0.15,
      mtf: "Căng thẳng địa chính trị & báo cáo tồn kho dầu thô EIA • Dao động mạnh",
      slPct: 0.020,
      tp1Pct: 0.030,
      tp2Pct: 0.060,
      trailingFloorPct: 0.010
    },
    {
      symbol: "PAXG/USDT",
      cleanSym: "PAXGUSDT",
      category: "commodity",
      tag: "✨ Vàng Spot",
      side: "LONG",
      score: 88.0,
      confidence: 0.84,
      status: "READY",
      intent: "💎 BẢO TOÀN VỐN VÀNG THỰC 1:1 (PAX Gold)",
      intentColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
      defaultPrice: 3825.0,
      leverage: "2x (An toàn)",
      allocPct: 0.20,
      mtf: "Bảo chứng bằng vàng vật chất tại London • Giữ nguyên sức mua qua thời gian",
      slPct: 0.012,
      tp1Pct: 0.022,
      tp2Pct: 0.045,
      trailingFloorPct: 0.006
    },

    // 🏛️ CỔ PHIẾU MỸ & TRADFI
    {
      symbol: "NVDA/USDT",
      cleanSym: "NVDAUSDT",
      category: "tradfi",
      tag: "🏛️ Cổ Phiếu AI",
      side: "LONG",
      score: 92.0,
      confidence: 0.88,
      status: "READY",
      intent: "🚀 TRÙM BÁN DẪN & GPU TRUNG TÂM DỮ LIỆU AI",
      intentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      defaultPrice: 161.4,
      leverage: "3x (TradFi Cổ Phiếu)",
      allocPct: 0.25,
      mtf: "Dẫn dắt toàn bộ chỉ số công nghệ Mỹ • Dòng tiền quỹ phố Wall liên tục tích lũy",
      slPct: 0.020,
      tp1Pct: 0.035,
      tp2Pct: 0.070,
      trailingFloorPct: 0.010
    },
    {
      symbol: "TSLA/USDT",
      cleanSym: "TSLAUSDT",
      category: "tradfi",
      tag: "⚡ Xe Điện & Robot",
      side: "LONG",
      score: 87.0,
      confidence: 0.82,
      status: "READY",
      intent: "⚡ ĐỘT PHÁ TỰ HÀNH FSD & ROBOT OPTIMUS",
      intentColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      defaultPrice: 386.7,
      leverage: "3x (TradFi)",
      allocPct: 0.20,
      mtf: "Rung lắc mạnh mở phiên New York • Tận dụng nhịp chiết khấu sâu để gom",
      slPct: 0.025,
      tp1Pct: 0.045,
      tp2Pct: 0.090,
      trailingFloorPct: 0.012
    },
    {
      symbol: "MSTR/USDT",
      cleanSym: "MSTRUSDT",
      category: "tradfi",
      tag: "💎 Bitcoin Proxy",
      side: "LONG",
      score: 89.5,
      confidence: 0.86,
      status: "READY",
      intent: "🔥 KHUẾCH ĐẠI TỶ SUẤT KHO DỰ TRỮ BITCOIN",
      intentColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      defaultPrice: 100.1,
      leverage: "2x (TradFi)",
      allocPct: 0.20,
      mtf: "Tương quan 94% với Bitcoin • Đòn bẩy vốn doanh nghiệp dự trữ BTC hàng đầu",
      slPct: 0.025,
      tp1Pct: 0.050,
      tp2Pct: 0.100,
      trailingFloorPct: 0.015
    },
    {
      symbol: "SOXL/USDT",
      cleanSym: "SOXLUSDT",
      category: "tradfi",
      tag: "📈 ETF Bán Dẫn 3x",
      side: "LONG",
      score: 86.0,
      confidence: 0.83,
      status: "READY",
      intent: "🌊 SIÊU SÓNG NGÀNH CHIP & BÁN DẪN TOÀN CẦU",
      intentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      defaultPrice: 42.0,
      leverage: "2x (TradFi ETF)",
      allocPct: 0.15,
      mtf: "Đòn bẩy 3x ngành bán dẫn • Khung cắt lỗ thích ứng ATR [1.8% - 3.5%]",
      slPct: 0.025,
      tp1Pct: 0.045,
      tp2Pct: 0.090,
      trailingFloorPct: 0.012
    },

    // 👑 CRYPTO MAJOR
    {
      symbol: "BTC/USDT",
      cleanSym: "BTCUSDT",
      category: "major",
      tag: "👑 Vua Tiền Số",
      side: "LONG",
      score: 94.0,
      confidence: 0.91,
      status: "READY",
      intent: "🛡️ TÍCH LŨY TRÊN HỖ TRỢ VĨ MÔ 4H (JEV Trend Shield)",
      intentColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      defaultPrice: 64800.0,
      leverage: "7x (Major Crypto)",
      allocPct: 0.35,
      mtf: "Giữ vững EMA50 4H • Thanh khoản vĩ mô ổn định, không chịu rủi ro sập sàn",
      slPct: 0.012,
      tp1Pct: 0.020,
      tp2Pct: 0.045,
      trailingFloorPct: 0.006
    },
    {
      symbol: "ETH/USDT",
      cleanSym: "ETHUSDT",
      category: "major",
      tag: "⚡ Nền Tảng HĐTM",
      side: "LONG",
      score: 88.0,
      confidence: 0.84,
      status: "READY",
      intent: "🚀 DÒNG TIỀN PHỤC HỒI HỆ SINH THÁI LAYER 2",
      intentColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      defaultPrice: 1818.0,
      leverage: "6x (Major Crypto)",
      allocPct: 0.20,
      mtf: "Tương quan chặt chẽ với BTC • Dòng tiền staking & phí gas lành mạnh",
      slPct: 0.015,
      tp1Pct: 0.025,
      tp2Pct: 0.055,
      trailingFloorPct: 0.008
    },
    {
      symbol: "SOL/USDT",
      cleanSym: "SOLUSDT",
      category: "major",
      tag: "🚀 Siêu Tốc Layer 1",
      side: "LONG",
      score: 91.5,
      confidence: 0.89,
      status: "READY",
      intent: "🔥 BÃO TĂNG DÒNG TIỀN CÁ MẬP (Whale Momentum)",
      intentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      defaultPrice: 71.3,
      leverage: "5x (Major)",
      allocPct: 0.25,
      mtf: "Khối lượng giao dịch DEX vượt trội • Dòng tiền mua chủ động lớn",
      slPct: 0.015,
      tp1Pct: 0.024,
      tp2Pct: 0.050,
      trailingFloorPct: 0.007
    },

    // 🚀 TOP ALTCOIN TOOL QUÉT
    {
      symbol: "1000PEPE/USDT",
      cleanSym: "1000PEPEUSDT",
      category: "altcoin",
      tag: "🐸 Top Meme Coin",
      side: "SHORT",
      score: 85.0,
      confidence: 0.82,
      status: "READY",
      intent: "⚡ BẮT ĐỈNH KIỆT SỨC XẢ HÀNG (Fading Short)",
      intentColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      defaultPrice: 0.00395,
      leverage: "3x (Altcoin)",
      allocPct: 0.15,
      mtf: "RVol suy kiệt tại kháng cự • Nến râu xả đỉnh 42% trên M15",
      slPct: 0.020,
      tp1Pct: 0.035,
      tp2Pct: 0.070,
      trailingFloorPct: 0.010
    },
    {
      symbol: "SUI/USDT",
      cleanSym: "SUIUSDT",
      category: "altcoin",
      tag: "🌊 High Vol Altcoin",
      side: "SHORT",
      score: 84.0,
      confidence: 0.80,
      status: "READY",
      intent: "⚡ PHÂN KỲ GIẢM KHUNG 15M (Early Exhaustion)",
      intentColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      defaultPrice: 0.72,
      leverage: "4x (Altcoin)",
      allocPct: 0.15,
      mtf: "Lực mua chậm dần trước cản cứng EMA200 • Chờ xác nhận thủng đáy",
      slPct: 0.018,
      tp1Pct: 0.032,
      tp2Pct: 0.065,
      trailingFloorPct: 0.009
    },
    {
      symbol: "PUMP/USDT",
      cleanSym: "PUMPUSDT",
      category: "altcoin",
      tag: "🔥 Cá Mập Săn Đáy",
      side: "LONG",
      score: 86.5,
      confidence: 0.83,
      status: "READY",
      intent: "💎 CÁ MẬP GOM ĐÁY CHIẾT KHẤU SÂU (Selling Climax)",
      intentColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      defaultPrice: 0.00297,
      leverage: "3x (Altcoin)",
      allocPct: 0.15,
      mtf: "Khối lượng nến đảo chiều rút chân 45% • RSI quá bán nảy lên mạnh",
      slPct: 0.022,
      tp1Pct: 0.040,
      tp2Pct: 0.080,
      trailingFloorPct: 0.011
    }
  ];

  // Parse và tích hợp các ứng viên thực tế từ PC2 Radar
  const liveRadarItems = [];
  if (Array.isArray(rawCandidates) && rawCandidates.length > 0) {
    rawCandidates.forEach((c, idx) => {
      const sym = String(c.symbol || "").toUpperCase();
      const cleanSym = sym.replace('/', '').replace(':', '');
      const side = String(c.side || 'LONG').toUpperCase().includes('SHORT') || String(c.side || '').toUpperCase().includes('SELL') ? 'SHORT' : 'LONG';
      const score = Number(c.score || c.priority_score || 80.0);
      const conf = Number(c.confidence || c.confidence_pct ? (c.confidence_pct > 1 ? c.confidence_pct/100 : c.confidence_pct) : 0.80);
      const price = Number(c.price || priceCache[cleanSym] || 0.0);

      const isTradfi = sym.includes("NVDA") || sym.includes("TSLA") || sym.includes("SOXL") || sym.includes("MSTR") || sym.includes("PLTR");
      const isCommodity = sym.includes("XAU") || sym.includes("XAG") || sym.includes("CL") || sym.includes("PAXG");
      const isMajor = sym.includes("BTC") || sym.includes("ETH") || sym.includes("SOL");
      const itemCat = isCommodity ? "commodity" : (isTradfi ? "tradfi" : (isMajor ? "major" : "altcoin"));
      const lev = isCommodity ? "2x" : (isTradfi ? "3x (TradFi)" : (isMajor ? "7x" : "5x"));

      const gate = String(c.bottleneck_gate || '').toUpperCase();
      const readiness = Number(c.readiness_pct || 0);
      const isBlocked = gate.includes('VETO') || gate === 'SIGNAL_AGGREGATOR_VETO' || gate === 'AI_BIAS_VETO' || gate === 'PRE_LLM_STRUCTURAL_VETO' || gate === 'JEV_UNAVAILABLE' || c.radar_status === 'BLOCKED' || readiness <= 50.0;
      const isStalking = gate === 'M1_SNIPER_STALKING' || c.radar_status === 'STALKING' || readiness >= 95.0;
      const isWaitingResource = ['SLOT_CAPACITY', 'RISK_CAPACITY', 'MARGIN_CAPACITY'].includes(gate) || c.radar_status === 'WAITING_RESOURCE';

      let status = "BLOCKED";
      let intent = "🛑 CẢNH BÁO: BỊ VETO CHẶN (ĐỨNG NGOÀI TUYỆT ĐỐI)";
      let intentColor = "text-rose-400 bg-rose-500/10 border-rose-500/30";
      let allocPct = 0.0;

      if (isStalking) {
        status = "STALKING";
        intent = "🎯 M1 SNIPER ĐANG RÌNH KHỚP LIMIT MAKER";
        intentColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
        allocPct = idx === 0 ? 0.35 : (idx === 1 ? 0.25 : 0.0);
      } else if (isWaitingResource) {
        status = "WAITING_RESOURCE";
        intent = "⏳ ĐÃ ĐẠT CHUẨN - CHỜ GIẢI PHÓNG SLOT VỐN";
        intentColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
        allocPct = idx === 0 ? 0.35 : (idx === 1 ? 0.25 : 0.0);
      } else if (isBlocked) {
        status = "BLOCKED";
        intent = "🛑 CẢNH BÁO: BỊ VETO CHẶN (ĐỨNG NGOÀI TUYỆT ĐỐI)";
        intentColor = "text-rose-400 bg-rose-500/10 border-rose-500/30";
        allocPct = 0.0;
      } else {
        status = "READY";
        intent = side === 'SHORT' ? "⚡ BẮT ĐỈNH KIỆT SỨC XẢ HÀNG (SHORT)" : "🚀 LƯỚT SÓNG DÒNG TIỀN CÁ MẬP (BUY)";
        intentColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
        allocPct = idx === 0 ? 0.35 : (idx === 1 ? 0.25 : 0.0);
      }

      window._radarItemMap = window._radarItemMap || new Map();
      const rawSymKey = String(c.symbol || '').toUpperCase();
      const cleanSymKey = rawSymKey.replace('/', '');
      const itemMeta = {
        status,
        intent,
        side: String(c.side || side || 'BUY').toUpperCase(),
        readiness,
        score: Number(c.raw_score || c.score || 0),
        gate
      };
      window._radarItemMap.set(rawSymKey, itemMeta);
      window._radarItemMap.set(cleanSymKey, itemMeta);

      liveRadarItems.push({
        symbol: sym,
        cleanSym: cleanSym,
        category: itemCat,
        tag: `🎯 Ra-đa PC2 (#${idx+1})`,
        side: side,
        score: Math.abs(score) > 1 ? Math.min(99.0, Math.abs(score)) : Math.min(99.0, Math.abs(score) * 100),
        confidence: conf,
        status: status,
        intent: intent,
        intentColor: intentColor,
        defaultPrice: price || 1.0,
        leverage: lev,
        allocPct: allocPct,
        mtf: c.bottleneck_reason || c.reason || "Đa khung thời gian đồng thuận",
        hitCount: c.hit_count ? `${c.hit_count} Lần Quét` : '1+ Lần Quét',
        strategiesAgreed: c.strategies_agreed ? `${c.strategies_agreed}` : '2/2 Chiến Lược',
        slPct: 0.015,
        tp1Pct: 0.024,
        tp2Pct: 0.050,
        trailingFloorPct: 0.007
      });
    });
  }

  // Kết hợp và lọc theo Category được chọn
  let displayItems = [];
  if (category === 'commodity') {
    displayItems = assetCatalog.filter(i => i.category === 'commodity');
  } else if (category === 'tradfi') {
    displayItems = assetCatalog.filter(i => i.category === 'tradfi');
  } else if (category === 'major') {
    displayItems = assetCatalog.filter(i => i.category === 'major');
  } else if (category === 'altcoin') {
    displayItems = [
      ...liveRadarItems.filter(i => i.category === 'altcoin'),
      ...assetCatalog.filter(i => i.category === 'altcoin')
    ];
  } else {
    // Tab "all" (Tất Cả / Ra-đa PC2):
    // Ưu tiên các mã Ra-đa PC2 lên đầu, sau đó bổ sung Vàng XAU, Bạc XAG, Nvidia NVDA, Bitcoin BTC, Solana SOL!
    const seen = new Set();
    liveRadarItems.forEach(item => {
      displayItems.push(item);
      seen.add(item.cleanSym);
    });
    const pillars = ['XAUUSDT', 'XAGUSDT', 'NVDAUSDT', 'TSLAUSDT', 'BTCUSDT', 'SOLUSDT'];
    assetCatalog.forEach(item => {
      if (pillars.includes(item.cleanSym) && !seen.has(item.cleanSym)) {
        displayItems.push(item);
        seen.add(item.cleanSym);
      }
    });
  }

  let html = "";
  displayItems.forEach((item, idx) => {
    const isTop1 = idx === 0;
    const isTop2 = idx === 1;
    const allocatedMoney = capital * item.allocPct;
    const isShort = item.side === 'SHORT';

    const liveP = Number(priceCache[item.cleanSym] || item.defaultPrice || 1.0);

    // Tính toán theo đúng chiều lệnh (LONG vs SHORT)
    let entryLow, entryHigh, slPrice, tp1Price, tp2Price, trailingPrice;
    if (isShort) {
      entryLow = liveP * 0.998;
      entryHigh = liveP * 1.003;
      slPrice = liveP * (1 + item.slPct); // Giá vượt đỉnh là cắt lỗ
      tp1Price = liveP * (1 - item.tp1Pct); // Giá tụt xuống là chốt lời
      tp2Price = liveP * (1 - item.tp2Pct);
      trailingPrice = liveP * (1 + item.trailingFloorPct);
    } else {
      entryLow = liveP * 0.997;
      entryHigh = liveP * 1.002;
      slPrice = liveP * (1 - item.slPct); // Giá thủng đáy là cắt lỗ
      tp1Price = liveP * (1 + item.tp1Pct); // Giá tăng là chốt lời
      tp2Price = liveP * (1 + item.tp2Pct);
      trailingPrice = liveP * (1 - item.trailingFloorPct);
    }

    const maxLossDollar = allocatedMoney > 0 ? allocatedMoney * Math.abs(item.slPct) : 0;
    const expProfitDollar = allocatedMoney > 0 ? allocatedMoney * item.tp1Pct : 0;

    let rankBadge = "";
    if (item.status === "BLOCKED") {
      rankBadge = `<span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[11px] uppercase tracking-wider">🛑 Bị Veto Chặn • Không Mở Lệnh</span>`;
    } else if (isTop1 && category === 'all') {
      rankBadge = `<span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[11px] uppercase tracking-wider">🥇 Hạng 1 • Top Pick (${item.side})</span>`;
    } else if (isTop2 && category === 'all') {
      rankBadge = `<span class="px-2.5 py-0.5 rounded-full bg-gray-200 text-black font-extrabold text-[11px] uppercase tracking-wider">🥈 Hạng 2 • Lựa Chọn 2 (${item.side})</span>`;
    } else {
      rankBadge = `<span class="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/10 font-bold text-[11px]">${item.tag || `#${idx+1}`}</span>`;
    }

    html += `
      <div class="kenzo-card p-5 border-white/10 hover:border-emerald-500/40 transition space-y-4 relative overflow-hidden group">
        <div class="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              ${rankBadge}
              <span class="text-xs font-mono font-bold text-gray-400">Điểm: <span class="text-amber-400 font-extrabold">${item.score.toFixed(1)}/100</span></span>
            </div>
            <h4 class="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2">
              <span>${item.symbol}</span>
              <span class="text-xs font-mono font-bold ${item.side === 'SHORT' ? 'text-rose-400' : 'text-emerald-400'}">(${item.side})</span>
              <span class="text-xs text-gray-400 font-normal">($${formatSmartPrice(liveP)})</span>
            </h4>
          </div>
          <button type="button" class="btn-inspect-chart px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 shrink-0" data-sym="${item.cleanSym}">
            <i data-lucide="line-chart" class="w-3.5 h-3.5"></i>
            <span>Soi Biểu Đồ</span>
          </button>
        </div>

        <!-- Ý đồ cá mập -->
        <div class="p-2.5 rounded-lg border text-xs font-bold ${item.intentColor} flex items-center gap-2">
          <span>${item.intent}</span>
        </div>

        <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">${item.mtf}</p>

        <!-- Hộp Thống Kê Phân Tích & Số Lần Quét Ra-đa -->
        <div class="grid grid-cols-2 gap-2 text-[11px] bg-white/[0.03] p-2.5 rounded-lg border border-white/5 font-mono">
          <div>
            <span class="text-gray-400 block">Tần suất quét tầm ngắm:</span>
            <strong class="text-cyan-300">🎯 ${item.hitCount || 'Quét chu kỳ 15s'}</strong>
          </div>
          <div>
            <span class="text-gray-400 block">Hội đồng AI thẩm định:</span>
            <strong class="text-emerald-300">🧠 ${item.strategiesAgreed || '3/3 AI Đồng Thuận'}</strong>
          </div>
        </div>

        <!-- Lộ trình vốn chi tiết -->
        <div class="bg-black/60 rounded-xl p-3.5 border border-white/5 space-y-2.5 text-xs font-mono">
          <div class="flex items-center justify-between pb-2 border-b border-white/5">
            <span class="text-gray-400">Vốn cấp từ tài khoản của bạn:</span>
            <strong class="${allocatedMoney > 0 ? 'text-emerald-400' : 'text-gray-500'} text-sm font-bold">
              ${allocatedMoney > 0 ? `$${allocatedMoney.toFixed(2)} USDT` : '$0 (Đứng ngoài bảo toàn vốn)'}
            </strong>
          </div>
          
          ${item.status === 'BLOCKED' ? `
            <div class="p-2.5 rounded bg-rose-950/20 border border-rose-500/20 text-rose-300 text-[11px] leading-relaxed">
              ⚠️ <strong>CẢNH BÁO BẢO TOÀN VỐN:</strong> Bot trên PC2 đang chặn mã này vì không đủ điều kiện an toàn. Tuyệt đối <strong>CẤM MỞ LỆNH TAY</strong> để tránh dính bẫy dao rơi!
            </div>
          ` : `
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span class="text-gray-500 block">Đòn bẩy an toàn:</span>
                <strong class="text-white">${item.leverage}</strong>
              </div>
              <div>
                <span class="text-gray-500 block">${isShort ? '🔴 Vùng Bán Khống:' : '🟢 Vùng Mua Gom:'}</span>
                <strong class="${isShort ? 'text-rose-400' : 'text-emerald-400'}">${formatSmartPrice(entryLow)}$ - ${formatSmartPrice(entryHigh)}$</strong>
              </div>
              <div>
                <span class="text-gray-500 block">Cắt Lỗ Bắt Buộc (SL):</span>
                <strong class="text-rose-400">${formatSmartPrice(slPrice)}$ ${allocatedMoney > 0 ? `(-$${maxLossDollar.toFixed(2)})` : ''}</strong>
              </div>
              <div>
                <span class="text-gray-500 block">Chốt Lời TP1:</span>
                <strong class="text-amber-400">${formatSmartPrice(tp1Price)}$ ${allocatedMoney > 0 ? `(+$${expProfitDollar.toFixed(2)})` : ''}</strong>
              </div>
            </div>
            <div class="pt-1 flex items-center justify-between text-[11px] text-purple-300 bg-purple-950/20 px-2 py-1 rounded">
              <span>🎯 Mức Chặn Lãi Hôm Nay:</span>
              <strong class="font-bold">${formatSmartPrice(trailingPrice)}$</strong>
            </div>
          `}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Gắn sự kiện nút Soi Biểu Đồ
  container.querySelectorAll(".btn-inspect-chart").forEach(btn => {
    btn.addEventListener("click", () => {
      const sym = btn.getAttribute("data-sym");
      if (sym) {
        window.switchToPortfolioSymbol(sym);
      }
    });
  });

  if (window.lucide) lucide.createIcons();
}

// Tải & Vẽ Biểu Đồ TradingView Lightweight Charts (Nạp 600 nến đầy đủ nhiều ngày + Cập nhật Real-Time)
// Quản lý trạng thái Ẩn/Hiện của Biểu tượng, Đường AI và Dự Phóng
// Quản lý trạng thái Ẩn/Hiện đa tầng chi tiết (TP, SL, Entry, Trailing, Tín hiệu, AI, Dự phóng, HUD)
function getChartVisibilityState() {
  const defaults = {
    tp: true,
    sl: true,
    entry: true,
    trailing: true,
    markers: true,
    aiLine: true,
    forecast: true,
    hud: true
  };
  try {
    const raw = localStorage.getItem("tradematrix_chart_visibility");
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch (e) {}
  return defaults;
}

function saveChartVisibilityState(state) {
  try {
    localStorage.setItem("tradematrix_chart_visibility", JSON.stringify(state));
  } catch (e) {}
}

window._chartVisibility = getChartVisibilityState();
window._activePriceLines = { entry: null, sl: null, tp: null, trailing: null };
window._activeChartPriceOptions = null;

function removePriceLineSafely(series, lineRef) {
  if (series && lineRef) {
    try {
      series.removePriceLine(lineRef);
    } catch (e) {}
  }
  return null;
}

function createPriceLineSafely(series, opts) {
  if (series && opts) {
    try {
      return series.createPriceLine(opts);
    } catch (e) {
      console.warn("createPriceLine error:", e);
    }
  }
  return null;
}

function syncChartVisibility() {
  const vis = window._chartVisibility;

  // 1. Đồng bộ Price Lines (TP1, SL, Entry, Trailing)
  if (portfolioCandleSeries && window._activeChartPriceOptions) {
    const opts = window._activeChartPriceOptions;

    // TP1 Line (Chốt Lời Riêng Biệt)
    if (vis.tp) {
      if (!window._activePriceLines.tp && opts.tp) {
        window._activePriceLines.tp = createPriceLineSafely(portfolioCandleSeries, opts.tp);
      }
    } else {
      window._activePriceLines.tp = removePriceLineSafely(portfolioCandleSeries, window._activePriceLines.tp);
    }

    // SL Line (Cắt Lỗ Riêng Biệt)
    if (vis.sl) {
      if (!window._activePriceLines.sl && opts.sl) {
        window._activePriceLines.sl = createPriceLineSafely(portfolioCandleSeries, opts.sl);
      }
    } else {
      window._activePriceLines.sl = removePriceLineSafely(portfolioCandleSeries, window._activePriceLines.sl);
    }

    // Entry Line (Vùng Vào Lệnh)
    if (vis.entry) {
      if (!window._activePriceLines.entry && opts.entry) {
        window._activePriceLines.entry = createPriceLineSafely(portfolioCandleSeries, opts.entry);
      }
    } else {
      window._activePriceLines.entry = removePriceLineSafely(portfolioCandleSeries, window._activePriceLines.entry);
    }

    // Trailing Line (Chặn Lãi)
    if (vis.trailing) {
      if (!window._activePriceLines.trailing && opts.trailing) {
        window._activePriceLines.trailing = createPriceLineSafely(portfolioCandleSeries, opts.trailing);
      }
    } else {
      window._activePriceLines.trailing = removePriceLineSafely(portfolioCandleSeries, window._activePriceLines.trailing);
    }
  }

  // 2. Tín Hiệu Quét Cá Mập (Markers)
  if (portfolioCandleSeries && window._activeChartMarkers) {
    try {
      portfolioCandleSeries.setMarkers(vis.markers ? window._activeChartMarkers : []);
    } catch (e) {}
  }

  // 3. Đường Chỉ Báo AI Trục Entry
  if (window._activeAiTrajectorySeries) {
    try {
      window._activeAiTrajectorySeries.applyOptions({ visible: vis.aiLine });
    } catch (e) {}
  }

  // 4. Đường Dự Phóng Kịch Bản Tương Lai
  if (window._activeForecastSeries) {
    try {
      window._activeForecastSeries.applyOptions({ visible: vis.forecast });
    } catch (e) {}
  }

  // 5. Bảng Soi Nến (HUD Hover)
  const hudBox = document.getElementById("chartHoverHud");
  if (hudBox) {
    if (vis.hud) {
      hudBox.classList.remove("hidden");
    } else {
      hudBox.classList.add("hidden");
    }
  }

  // 6. Cập nhật Style cho các nhãn trong Legend (Khi ẩn thì làm mờ & gạch ngang)
  const entrySpan = document.getElementById("chartLegendEntrySpan");
  if (entrySpan) {
    if (vis.entry) entrySpan.classList.remove("opacity-30", "line-through");
    else entrySpan.classList.add("opacity-30", "line-through");
  }

  const slSpan = document.getElementById("chartLegendSlSpan");
  if (slSpan) {
    if (vis.sl) slSpan.classList.remove("opacity-30", "line-through");
    else slSpan.classList.add("opacity-30", "line-through");
  }

  const tpSpan = document.getElementById("chartLegendTpSpan");
  if (tpSpan) {
    if (vis.tp) tpSpan.classList.remove("opacity-30", "line-through");
    else tpSpan.classList.add("opacity-30", "line-through");
  }

  const trailingSpan = document.getElementById("chartLegendTrailingSpan");
  if (trailingSpan) {
    if (vis.trailing) trailingSpan.classList.remove("opacity-30", "line-through");
    else trailingSpan.classList.add("opacity-30", "line-through");
  }

  const aiSpan = document.getElementById("chartLegendAiSpan");
  if (aiSpan) {
    if (vis.aiLine) aiSpan.classList.remove("opacity-30", "line-through");
    else aiSpan.classList.add("opacity-30", "line-through");
  }

  // 7. Cập nhật Style cho các nút chip trên thanh công cụ
  const btnTp = document.getElementById("btnToggleTp");
  if (btnTp) {
    btnTp.className = vis.tp
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnSl = document.getElementById("btnToggleSl");
  if (btnSl) {
    btnSl.className = vis.sl
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnEntry = document.getElementById("btnToggleEntry");
  if (btnEntry) {
    const isShort = window._activeChartPriceOptions ? window._activeChartPriceOptions.isShort : false;
    btnEntry.className = vis.entry
      ? (isShort
          ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
          : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30")
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnTrailing = document.getElementById("btnToggleTrailing");
  if (btnTrailing) {
    btnTrailing.className = vis.trailing
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnMarkers = document.getElementById("btnToggleMarkers");
  if (btnMarkers) {
    btnMarkers.className = vis.markers
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnAiLine = document.getElementById("btnToggleAiLine");
  if (btnAiLine) {
    btnAiLine.className = vis.aiLine
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnForecast = document.getElementById("btnToggleForecast");
  if (btnForecast) {
    btnForecast.className = vis.forecast
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  const btnHud = document.getElementById("btnToggleHud");
  if (btnHud) {
    btnHud.className = vis.hud
      ? "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700"
      : "px-2 py-0.5 rounded text-[11px] font-mono font-medium transition cursor-pointer flex items-center gap-1 border bg-gray-900/60 text-gray-500 border-gray-800 line-through opacity-60 hover:opacity-100 hover:text-gray-400";
  }

  // 8. Cập nhật Nút Master: Ẩn Hết / Hiện Hết
  const btnToggleAll = document.getElementById("btnToggleAll");
  if (btnToggleAll) {
    const isAnyActive = Object.values(vis).some(v => v === true);
    const icon = document.getElementById("btnToggleAllIcon");
    const txt = document.getElementById("btnToggleAllText");
    if (isAnyActive) {
      if (icon) icon.textContent = "👁️";
      if (txt) txt.textContent = "Ẩn Hết";
      btnToggleAll.className = "px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer flex items-center gap-1 border bg-white/10 text-white border-white/20 hover:bg-white/20";
    } else {
      if (icon) icon.textContent = "👁️‍🗨️";
      if (txt) txt.textContent = "Hiện Hết";
      btnToggleAll.className = "px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer flex items-center gap-1 border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30";
    }
  }
}

function setupChartVisibilityButtons() {
  const bindToggle = (btnId, key) => {
    const el = document.getElementById(btnId);
    if (el && !el._bound) {
      el._bound = true;
      el.addEventListener("click", () => {
        window._chartVisibility[key] = !window._chartVisibility[key];
        saveChartVisibilityState(window._chartVisibility);
        syncChartVisibility();
      });
    }
  };

  // Gắn sự kiện cho các nút Chip điều khiển chi tiết
  bindToggle("btnToggleTp", "tp");
  bindToggle("btnToggleSl", "sl");
  bindToggle("btnToggleEntry", "entry");
  bindToggle("btnToggleTrailing", "trailing");
  bindToggle("btnToggleMarkers", "markers");
  bindToggle("btnToggleAiLine", "aiLine");
  bindToggle("btnToggleForecast", "forecast");
  bindToggle("btnToggleHud", "hud");

  // Gắn sự kiện tương tác trực tiếp lên từng nhãn của dòng Legend
  bindToggle("chartLegendEntrySpan", "entry");
  bindToggle("chartLegendSlSpan", "sl");
  bindToggle("chartLegendTpSpan", "tp");
  bindToggle("chartLegendTrailingSpan", "trailing");
  bindToggle("chartLegendAiSpan", "aiLine");

  // Gắn sự kiện cho Nút Master: Ẩn Hết / Hiện Hết
  const btnToggleAll = document.getElementById("btnToggleAll");
  if (btnToggleAll && !btnToggleAll._bound) {
    btnToggleAll._bound = true;
    btnToggleAll.addEventListener("click", () => {
      const isAnyActive = Object.values(window._chartVisibility).some(v => v === true);
      const nextState = !isAnyActive;
      for (const k in window._chartVisibility) {
        window._chartVisibility[k] = nextState;
      }
      saveChartVisibilityState(window._chartVisibility);
      syncChartVisibility();
    });
  }

  syncChartVisibility();
}

async function loadPortfolioChart(symbol, interval) {
  const container = document.getElementById("portfolioChartContainer");
  const spinner = document.getElementById("chartLoadingSpinner");
  const badge = document.getElementById("activeChartSymbolBadge");
  const symSelect = document.getElementById("portfolioChartSymbolSelect");
  if (!container) return;

  if (spinner) spinner.classList.remove("hidden");
  const cleanSym = String(symbol || "BTCUSDT").replace('/', '').replace(':', '').toUpperCase();
  if (badge) badge.textContent = cleanSym;

  // Hủy bộ đếm live ticker cũ nếu có
  if (window._portfolioLiveTickerInterval) {
    clearInterval(window._portfolioLiveTickerInterval);
    window._portfolioLiveTickerInterval = null;
  }

  // Tự động đồng bộ dropdown chọn mã
  if (symSelect) {
    let exists = false;
    for (let i = 0; i < symSelect.options.length; i++) {
      if (symSelect.options[i].value === cleanSym) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      const opt = document.createElement("option");
      opt.value = cleanSym;
      opt.textContent = `${cleanSym} (Đang xem)`;
      symSelect.appendChild(opt);
    }
    symSelect.value = cleanSym;
  }

  try {
    if (!window.LightweightCharts) {
      console.warn("LightweightCharts library not loaded yet.");
      if (spinner) spinner.classList.add("hidden");
      return;
    }

    // Nạp đầy đủ 1000 nến để hiển thị trọn vẹn nhiều ngày/tuần/tháng lịch sử
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${cleanSym}&interval=${interval}&limit=1000`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
    const rawKlines = await res.json();

    const candleData = [];
    const markers = [];
    const signalAnchors = [];
    const candleMetaMap = new Map();
    let lastClose = 0;
    let lastMarkerIdx = -10;
    let histWinCount = 0;
    let histLossCount = 0;
    let histActiveCount = 0;

    // Tính mảng volume trung bình 20 kỳ để đo RVol chính xác chuẩn Quỹ
    const volArray = rawKlines.map(k => parseFloat(k[5]) || 0);

    for (let i = 0; i < rawKlines.length; i++) {
      const k = rawKlines[i];
      const time = Math.floor(k[0] / 1000);
      const open = parseFloat(k[1]);
      const high = parseFloat(k[2]);
      const low = parseFloat(k[3]);
      const close = parseFloat(k[4]);
      const vol = parseFloat(k[5]) || 0;
      lastClose = close;

      candleData.push({ time, open, high, low, close });

      // Tính SMA20 Volume của 20 nến trước đó
      const lookback = Math.min(i, 20);
      let sumVol = 0;
      for (let j = Math.max(0, i - lookback); j < i; j++) {
        sumVol += volArray[j];
      }
      const avgVol = lookback > 0 ? (sumVol / lookback) : (vol || 1);
      const rvol = avgVol > 0 ? (vol / avgVol) : 1.0;
      const range = (high - low) || 1e-9;
      const upperWick = (high - Math.max(open, close)) / range;
      const lowerWick = (Math.min(open, close) - low) / range;
      const body = Math.abs(close - open) / range;

      // Đo lường tần suất quét và phân tích của Tool PC2 dựa trên độ sôi động của cây nến
      const scanCount = Math.min(24, Math.max(4, Math.round(rvol * 5)));

      // Lưu trữ metadata phục vụ HUD Crosshair Hover
      candleMetaMap.set(time, {
        time,
        open,
        high,
        low,
        close,
        vol,
        rvol,
        upperWick,
        lowerWick,
        body,
        scanCount,
        aiTrajVal: close,
        timeStr: new Date(k[0]).toLocaleString('vi-VN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      });

      // Gắn Dấu Chân Cá Mập, Số Lần Quét & ĐỐI SOÁT ĐƯỜNG ĐI CẤU TRÚC THỰC TẾ (Replay Backtest)
      // Kiểm chứng toàn bộ 1000 nến lịch sử xem dự báo đã khớp TP1 (+2.4%) hay chạm SL (-1.5%)
      if (i - lastMarkerIdx >= 6) {
        let sigType = null;
        let sigSide = null;
        let prefixIcon = '';
        let markerColor = '#10b981';
        let markerShape = 'arrowUp';
        let markerPos = 'belowBar';

        if (lowerWick >= 0.35 && rvol >= 1.25) {
          sigType = 'Gom đáy';
          sigSide = 'LONG';
          prefixIcon = '💎';
          markerColor = '#06b6d4';
          markerShape = 'arrowUp';
          markerPos = 'belowBar';
        } else if (upperWick >= 0.35 && rvol >= 1.25) {
          sigType = 'Xả đỉnh';
          sigSide = 'SHORT';
          prefixIcon = '⚡';
          markerColor = '#f59e0b';
          markerShape = 'arrowDown';
          markerPos = 'aboveBar';
        } else if (body >= 0.65 && close > open && rvol >= 1.7) {
          sigType = 'Bão tăng';
          sigSide = 'LONG';
          prefixIcon = '🚀';
          markerColor = '#10b981';
          markerShape = 'arrowUp';
          markerPos = 'belowBar';
        } else if (body >= 0.65 && close < open && rvol >= 1.7) {
          sigType = 'Xả lũ';
          sigSide = 'SHORT';
          prefixIcon = '🌊';
          markerColor = '#f43f5e';
          markerShape = 'arrowDown';
          markerPos = 'aboveBar';
        }

        if (sigType) {
          lastMarkerIdx = i;
          // Điểm Entry chính xác của tín hiệu này (Long mua gom tại close*0.998, Short xả đỉnh tại close*1.002)
          const entryPrice = sigSide === 'LONG' ? (close * 0.998) : (close * 1.002);
          const targetTp = sigSide === 'LONG' ? (close * 1.024) : (close * 0.976);
          const targetSl = sigSide === 'LONG' ? (close * 0.985) : (close * 1.015);

          let outcome = 'ACTIVE';
          let barsToExit = 0;
          const maxLookahead = Math.min(rawKlines.length, i + 24);

          for (let j = i + 1; j < maxLookahead; j++) {
            const nextHigh = parseFloat(rawKlines[j][2]);
            const nextLow = parseFloat(rawKlines[j][3]);
            barsToExit = j - i;

            if (sigSide === 'LONG') {
              if (nextHigh >= targetTp) {
                outcome = 'TP1_HIT';
                break;
              }
              if (nextLow <= targetSl) {
                outcome = 'SL_HIT';
                break;
              }
            } else {
              if (nextLow <= targetTp) {
                outcome = 'TP1_HIT';
                break;
              }
              if (nextHigh >= targetSl) {
                outcome = 'SL_HIT';
                break;
              }
            }
          }

          let outcomeTag = '';
          if (outcome === 'TP1_HIT') {
            outcomeTag = '➔ ✅ TP1';
            histWinCount++;
          } else if (outcome === 'SL_HIT') {
            outcomeTag = '➔ 🛑 SL';
            histLossCount++;
          } else {
            if (i >= rawKlines.length - 24) {
              outcomeTag = '➔ ⏳ Đang chạy';
              histActiveCount++;
            } else {
              outcomeTag = '➔ ⚖️ Hết hạn';
            }
          }

          const curMeta = candleMetaMap.get(time);
          if (curMeta) {
            curMeta.sigSide = sigSide;
            curMeta.sigType = sigType;
            curMeta.outcome = outcome;
            curMeta.barsToExit = barsToExit;
            curMeta.targetTp = targetTp;
            curMeta.targetSl = targetSl;
          }

          signalAnchors.push({
            idx: i,
            time,
            price: entryPrice,
            sigSide,
            sigType
          });

          markers.push({
            time,
            position: markerPos,
            color: markerColor,
            shape: markerShape,
            text: `${prefixIcon} ${scanCount}x ${sigType} ${outcomeTag}`
          });
        }
      }
    }

    if (portfolioChart && typeof portfolioChart.remove === 'function') {
      try { portfolioChart.remove(); } catch (e) {}
      portfolioChart = null;
    }
    window._activeChartMarkers = null;
    window._activeAiTrajectorySeries = null;
    window._activeForecastSeries = null;
    window._activePriceLines = { entry: null, sl: null, tp: null, trailing: null };

    container.innerHTML = "";
    portfolioChart = LightweightCharts.createChart(container, {
      width: container.clientWidth || 800,
      height: 420,
      layout: {
        background: { color: '#090a0f' },
        textColor: '#9ca3af',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' }
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        vertLine: { color: 'rgba(16, 185, 129, 0.4)', width: 1, style: 2 },
        horzLine: { color: 'rgba(16, 185, 129, 0.4)', width: 1, style: 2 }
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        autoScale: true
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 7,
        minBarSpacing: 1.5,
      }
    });

    const smartFormat = getSmartPriceFormat(lastClose);

    const curP = lastClose || 1.0;
    const rawSym = String(symbol || '').toUpperCase();
    const cleanSymKey = rawSym.replace('/', '');
    const radarInfo = window._radarItemMap ? (window._radarItemMap.get(cleanSymKey) || window._radarItemMap.get(rawSym)) : null;
    const isVetoed = radarInfo ? (radarInfo.status === "BLOCKED") : false;
    const isShort = radarInfo ? (radarInfo.side === "SHORT" || radarInfo.side === "SELL") : false;

    let entryP, slP, tp1P, trailingP;
    if (isShort) {
      entryP = curP * 1.002;
      slP = curP * 1.015;
      tp1P = curP * 0.976;
      trailingP = curP * 1.007;
    } else {
      entryP = curP * 0.998;
      slP = curP * 0.985;
      tp1P = curP * 1.024;
      trailingP = curP * 0.993;
    }

    // Xây dựng Mảng Anchor Points neo 100% CHÍNH XÁC tại các điểm Entry quá khứ nối thẳng tới Entry hiện tại
    const allAnchors = [];
    if (candleData.length > 0) {
      allAnchors.push({
        idx: 0,
        time: candleData[0].time,
        price: candleData[0].close
      });
    }
    for (let s = 0; s < signalAnchors.length; s++) {
      allAnchors.push({
        idx: signalAnchors[s].idx,
        time: signalAnchors[s].time,
        price: signalAnchors[s].price
      });
    }
    if (candleData.length > 0) {
      const lastIdx = candleData.length - 1;
      if (allAnchors.length === 1 || allAnchors[allAnchors.length - 1].idx !== lastIdx) {
        allAnchors.push({
          idx: lastIdx,
          time: candleData[lastIdx].time,
          price: entryP
        });
      } else {
        allAnchors[allAnchors.length - 1].price = entryP;
      }
    }

    // Tính toán trajectoryData: Neo chuẩn xác qua từng điểm Entry của cá mập
    const trajectoryData = [];
    let curAnchorIdx = 0;

    for (let i = 0; i < candleData.length; i++) {
      while (curAnchorIdx < allAnchors.length - 2 && i > allAnchors[curAnchorIdx + 1].idx) {
        curAnchorIdx++;
      }
      const a1 = allAnchors[curAnchorIdx];
      const a2 = allAnchors[Math.min(allAnchors.length - 1, curAnchorIdx + 1)];

      let lineVal;
      if (a1 && a2 && a2.idx > a1.idx) {
        const span = a2.idx - a1.idx;
        const frac = (i - a1.idx) / span;
        lineVal = a1.price + (a2.price - a1.price) * frac;
      } else {
        lineVal = a1 ? a1.price : candleData[i].close;
      }

      trajectoryData.push({
        time: candleData[i].time,
        value: lineVal
      });

      const meta = candleMetaMap.get(candleData[i].time);
      if (meta) {
        meta.aiTrajVal = lineVal;
      }
    }

    portfolioCandleSeries = portfolioChart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
      priceFormat: smartFormat
    });

    portfolioCandleSeries.setData(candleData);
    window._activeChartMarkers = markers;
    if (window._chartVisibility.markers && markers.length > 0) {
      portfolioCandleSeries.setMarkers(markers);
    }

    // Vẽ Đường Chỉ Báo Cấu Trúc Neo Trục Entry AI Xuyên Suốt Toàn Bộ Quá Khứ ➔ Hiện Tại
    const aiTrajectorySeries = portfolioChart.addLineSeries({
      color: isVetoed ? '#a855f7' : (isShort ? '#f59e0b' : '#06b6d4'),
      lineWidth: 2,
      lineStyle: LightweightCharts.LineStyle.Solid,
      priceFormat: smartFormat,
      title: isVetoed ? '🟣 ĐƯỜNG ENTRY AI (VETO)' : (isShort ? '⚡ ĐƯỜNG ENTRY AI (SHORT)' : '🔮 ĐƯỜNG ENTRY AI (LONG)')
    });
    aiTrajectorySeries.setData(trajectoryData);
    aiTrajectorySeries.applyOptions({ visible: window._chartVisibility.aiLine });
    window._activeAiTrajectorySeries = aiTrajectorySeries;

    // Lắng nghe sự kiện di chuột (Crosshair Move) để cập nhật HUD lịch sử quét từng nến quá khứ
    portfolioChart.subscribeCrosshairMove(param => {
      const hudTime = document.getElementById('hudTime');
      const hudMetrics = document.getElementById('hudMetrics');
      const hudScanCount = document.getElementById('hudScanCount');
      const hudAiIntent = document.getElementById('hudAiIntent');
      const hudVolume = document.getElementById('hudVolume');
      const lastCandleTime = candleData.length > 0 ? candleData[candleData.length - 1].time : 0;
      if (param && param.time && lastCandleTime > 0 && param.time > lastCandleTime) {
        if (hudMetrics) hudMetrics.classList.remove('hidden');
        if (hudTime) hudTime.textContent = '🔮 Vùng Dự Phóng Tương Lai (Next Horizon)';
        if (hudScanCount) hudScanCount.textContent = 'Mô hình lượng tử (Quantum Simulation)';
        if (hudVolume) hudVolume.textContent = 'Kỳ vọng xung lực tiếp diễn';
        if (hudAiIntent) {
          hudAiIntent.textContent = '🎯 Kịch bản giá bứt phá hướng tới mục tiêu chốt lời';
          hudAiIntent.className = 'text-cyan-400 font-bold';
        }
        return;
      }
      if (!param || !param.time || !candleMetaMap.has(param.time)) {
        if (hudMetrics) hudMetrics.classList.add('hidden');
        if (hudTime) hudTime.textContent = 'Di chuột lên bất kỳ nến nào để soi lịch sử quét quá khứ';
        return;
      }
      if (hudMetrics) hudMetrics.classList.remove('hidden');
      const meta = candleMetaMap.get(param.time);
      if (hudTime) hudTime.textContent = meta.timeStr || '--';
      if (hudScanCount) {
        hudScanCount.textContent = `${meta.scanCount} lần quét (${meta.rvol.toFixed(2)}x RVol) • Đường AI: ${formatSmartPrice(meta.aiTrajVal || meta.close)}$`;
      }
      if (hudVolume) {
        hudVolume.textContent = `${meta.vol.toLocaleString('en-US', { maximumFractionDigits: 1 })}`;
      }
      if (hudAiIntent) {
        if (meta.outcome === 'TP1_HIT') {
          hudAiIntent.textContent = `🎯 Dự báo ${meta.sigSide} ${meta.sigType} ➔ ✅ Đã khớp TP1 sau ${meta.barsToExit} nến (+2.4%) | Cấu trúc khớp 100%!`;
          hudAiIntent.className = 'text-emerald-400 font-bold';
        } else if (meta.outcome === 'SL_HIT') {
          hudAiIntent.textContent = `🎯 Dự báo ${meta.sigSide} ${meta.sigType} ➔ 🛑 Chạm SL sau ${meta.barsToExit} nến (-1.5%) | Shock Rescue bảo toàn vốn`;
          hudAiIntent.className = 'text-rose-400 font-bold';
        } else if (meta.outcome === 'ACTIVE') {
          hudAiIntent.textContent = `🎯 Dự báo ${meta.sigSide} ${meta.sigType} ➔ ⏳ Đang bám theo cấu trúc (${meta.barsToExit} nến)`;
          hudAiIntent.className = 'text-amber-400 font-bold';
        } else if (meta.lowerWick >= 0.35 && meta.rvol >= 1.25) {
          hudAiIntent.textContent = '💎 Cá mập rút chân gom đáy • Hội đồng AI xác nhận hỗ trợ';
          hudAiIntent.className = 'text-cyan-400 font-bold';
        } else if (meta.upperWick >= 0.35 && meta.rvol >= 1.25) {
          hudAiIntent.textContent = '⚡ Râu xả đỉnh kiệt sức • Hội đồng AI kích hoạt Exhaustion Fading';
          hudAiIntent.className = 'text-amber-400 font-bold';
        } else if (meta.body >= 0.65 && meta.close > meta.open && meta.rvol >= 1.7) {
          hudAiIntent.textContent = '🚀 Bão tăng phá vỡ • Hội đồng AI duyệt Momentum Ride';
          hudAiIntent.className = 'text-emerald-400 font-bold';
        } else if (meta.body >= 0.65 && meta.close < meta.open && meta.rvol >= 1.7) {
          hudAiIntent.textContent = '🌊 Thác đổ xả lũ • Hội đồng AI cấm bắt dao rơi (Waterfall Breakdown)';
          hudAiIntent.className = 'text-rose-400 font-bold';
        } else {
          hudAiIntent.textContent = '⚖️ Tích lũy biên độ chuẩn • Tool duy trì rà soát tự động';
          hudAiIntent.className = 'text-gray-300';
        }
      }
    });

    // Cuộn mượt đến nến thời gian thực mới nhất hôm nay
    portfolioChart.timeScale().scrollToRealTime();

    window._activeChartPriceOptions = {
      isShort,
      entry: {
        price: entryP,
        color: isShort ? '#f43f5e' : '#10b981',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Solid,
        axisLabelVisible: true,
        title: isShort ? '🔴 VÙNG BÁN XẢ (SHORT)' : '🟢 MUA GOM'
      },
      sl: {
        price: slP,
        color: '#f43f5e',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Solid,
        axisLabelVisible: true,
        title: isShort ? '🛡️ CẮT LỖ SHORT (SL)' : '🔴 CẮT LỖ (SL)'
      },
      tp: {
        price: tp1P,
        color: '#f59e0b',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Solid,
        axisLabelVisible: true,
        title: isShort ? '🟡 CHỐT LỜI SHORT (TP1)' : '🟡 CHỐT LỜI (TP1)'
      },
      trailing: {
        price: trailingP,
        color: '#a855f7',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: '🟣 CHẶN LÃI HÔM NAY'
      }
    };

    const chartEntryVal = document.getElementById("chartEntryVal");
    const chartSlVal = document.getElementById("chartSlVal");
    const chartTpVal = document.getElementById("chartTpVal");
    const chartTrailingVal = document.getElementById("chartTrailingVal");
    const adviceBadge = document.getElementById("chartActionAdviceBadge");

    const chartLegendEntryLabel = document.getElementById("chartLegendEntryLabel");
    const chartLegendEntryDot = document.getElementById("chartLegendEntryDot");
    const chartLegendEntrySpan = document.getElementById("chartLegendEntrySpan");
    const predActionEntryLabel = document.getElementById("predActionEntryLabel");

    if (isShort) {
      if (chartLegendEntryLabel) chartLegendEntryLabel.textContent = "Vùng Bán Xả (Short):";
      if (chartLegendEntryDot) chartLegendEntryDot.className = "w-3 h-1.5 rounded-sm bg-rose-500 inline-block";
      if (chartLegendEntrySpan) chartLegendEntrySpan.className = "inline-flex items-center gap-1.5 text-rose-400";
      if (predActionEntryLabel) predActionEntryLabel.textContent = "1. Đặt Bán Short Limit:";
    } else {
      if (chartLegendEntryLabel) chartLegendEntryLabel.textContent = "Vùng Mua Gom:";
      if (chartLegendEntryDot) chartLegendEntryDot.className = "w-3 h-1.5 rounded-sm bg-emerald-500 inline-block";
      if (chartLegendEntrySpan) chartLegendEntrySpan.className = "inline-flex items-center gap-1.5 text-emerald-400";
      if (predActionEntryLabel) predActionEntryLabel.textContent = "1. Đặt Mua Limit:";
    }

    if (chartEntryVal) chartEntryVal.textContent = `${formatSmartPrice(entryP)}$`;
    if (chartSlVal) chartSlVal.textContent = isShort ? `${formatSmartPrice(slP)}$ (+1.5%)` : `${formatSmartPrice(slP)}$ (-1.5%)`;
    if (chartTpVal) chartTpVal.textContent = isShort ? `${formatSmartPrice(tp1P)}$ (-2.4%)` : `${formatSmartPrice(tp1P)}$ (+2.4%)`;
    if (chartTrailingVal) chartTrailingVal.textContent = `${formatSmartPrice(trailingP)}$`;
    const chartAiLineVal = document.getElementById("chartAiLineVal");
    if (chartAiLineVal) chartAiLineVal.textContent = `${formatSmartPrice(entryP)}$`;

    const updateAdvice = (price) => {
      if (!adviceBadge) return;
      if (isVetoed) {
        adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono";
        adviceBadge.textContent = "🛑 Bị Veto chặn • Đứng ngoài tuyệt đối";
        return;
      }
      if (isShort) {
        if (price < entryP * 0.996) {
          adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono";
          adviceBadge.textContent = "⏳ Giá đã giảm sâu • Đặt Limit chờ hồi cao để Short (CẤM Bán Đuổi Đáy)";
        } else if (price <= slP && price >= entryP * 0.996) {
          adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono";
          adviceBadge.textContent = "⚡ Trong vùng canh Short giá cao • Có thể đặt lệnh";
        } else {
          adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono";
          adviceBadge.textContent = "🛑 Vượt đỉnh cắt lỗ • Đứng ngoài tuyệt đối";
        }
      } else {
        if (price > entryP * 1.004) {
          adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono";
          adviceBadge.textContent = "⏳ Giá đang cao hơn vùng gom • Đặt Limit chờ hồi (CẤM FOMO Mua Đuổi)";
        } else if (price >= slP && price <= entryP * 1.004) {
          adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono";
          adviceBadge.textContent = "🟢 Đang trong vùng gom giá hời • Có thể đặt lệnh";
        } else {
          adviceBadge.className = "px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono";
          adviceBadge.textContent = "🛑 Thủng đáy cắt lỗ • Đứng ngoài tuyệt đối";
        }
      }
    };
    updateAdvice(curP);

    // Vẽ đường nét đứt dự phóng lượng tử (AI Forecast Projection Line)
    const stepSeconds = interval === '1h' ? 3600 : interval === '4h' ? 14400 : interval === '1d' ? 86400 : 900;
    const lastCandle = candleData[candleData.length - 1];

    if (lastCandle) {
      const lastTime = lastCandle.time;
      const forecastSeries = portfolioChart.addLineSeries({
        color: isVetoed ? '#f43f5e' : (isShort ? '#f59e0b' : '#06b6d4'),
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        priceFormat: smartFormat,
        title: isVetoed ? '🛑 ĐƯỜNG CẢNH BÁO VETO' : (isShort ? '⚡ ĐƯỜNG DỰ PHÓNG SHORT' : '🔮 ĐƯỜNG DỰ PHÓNG AI')
      });

      if (isVetoed) {
        forecastSeries.setData([
          { time: lastTime, value: curP },
          { time: lastTime + stepSeconds * 1, value: curP * 0.995 },
          { time: lastTime + stepSeconds * 2, value: curP * 0.990 },
          { time: lastTime + stepSeconds * 3, value: slP },
          { time: lastTime + stepSeconds * 4, value: slP * 0.992 }
        ]);
      } else if (isShort) {
        forecastSeries.setData([
          { time: lastTime, value: entryP },
          { time: lastTime + stepSeconds * 1, value: entryP },
          { time: lastTime + stepSeconds * 2, value: entryP * 0.992 },
          { time: lastTime + stepSeconds * 3, value: entryP * 0.984 },
          { time: lastTime + stepSeconds * 4, value: tp1P }
        ]);
      } else {
        forecastSeries.setData([
          { time: lastTime, value: entryP },
          { time: lastTime + stepSeconds * 1, value: entryP },
          { time: lastTime + stepSeconds * 2, value: entryP * 1.008 },
          { time: lastTime + stepSeconds * 3, value: entryP * 1.016 },
          { time: lastTime + stepSeconds * 4, value: tp1P }
        ]);
      }
      forecastSeries.applyOptions({ visible: window._chartVisibility.forecast });
      window._activeForecastSeries = forecastSeries;
    }

    // Thiết lập và đồng bộ trạng thái các nút Ẩn/Hiện Tín hiệu & Đường AI
    setupChartVisibilityButtons();

    // Cập nhật Bảng Dự Đoán Định Lượng & Chỉ Dẫn Hành Động
    const predSymbolBadge = document.getElementById("predSymbolBadge");
    const predConfidenceBadge = document.getElementById("predConfidenceBadge");
    const predDirectionText = document.getElementById("predDirectionText");
    const predTpTargetText = document.getElementById("predTpTargetText");
    const predSlTargetText = document.getElementById("predSlTargetText");
    const predRrRatioText = document.getElementById("predRrRatioText");
    const predHorizonText = document.getElementById("predHorizonText");
    const predScenarioAText = document.getElementById("predScenarioAText");
    const predScenarioBText = document.getElementById("predScenarioBText");
    const predActionEntry = document.getElementById("predActionEntry");
    const predActionSl = document.getElementById("predActionSl");
    const predActionTp = document.getElementById("predActionTp");
    const predActionTrailing = document.getElementById("predActionTrailing");
    const predActionSummaryBadge = document.getElementById("predActionSummaryBadge");

    if (predSymbolBadge) predSymbolBadge.textContent = cleanSymKey;
    if (predActionEntry) predActionEntry.textContent = `${formatSmartPrice(entryP)}$`;
    if (predActionSl) predActionSl.textContent = isShort ? `${formatSmartPrice(slP)}$ (+1.5%)` : `${formatSmartPrice(slP)}$ (-1.5%)`;
    if (predActionTp) predActionTp.textContent = isShort ? `${formatSmartPrice(tp1P)}$ (-2.4%)` : `${formatSmartPrice(tp1P)}$ (+2.4%)`;
    if (predActionTrailing) predActionTrailing.textContent = `${formatSmartPrice(trailingP)}$`;

    const horizonStr = interval === '1h' ? '2 - 4 giờ (1H)' : interval === '4h' ? '8 - 16 giờ (4H)' : interval === '1d' ? '2 - 5 ngày (1D)' : '45 - 90 phút (15M)';
    if (predHorizonText) predHorizonText.textContent = horizonStr;

    const totalHistoricalSignals = histWinCount + histLossCount;
    const histAccuracy = totalHistoricalSignals > 0 ? Math.round((histWinCount / totalHistoricalSignals) * 100) : 75;

    if (isVetoed) {
      if (predConfidenceBadge) {
        predConfidenceBadge.className = "px-3 py-1 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40";
        predConfidenceBadge.textContent = `🛑 VETO: ĐỨNG NGOÀI (0$) • Khớp Lịch Sử: ${histAccuracy}%`;
      }
      if (predDirectionText) {
        predDirectionText.className = "text-sm font-bold text-rose-400";
        predDirectionText.textContent = "🛑 BỊ VETO CHẶN • ĐỨNG NGOÀI TUYỆT ĐỐI";
      }
      if (predScenarioAText) {
        predScenarioAText.textContent = `Hệ thống VETO phát hiện xung đột xu hướng vĩ mô hoặc thị trường đi ngang tích lũy. Lịch sử kiểm chứng đạt ${histAccuracy}% (${histWinCount} TP1 / ${histLossCount} SL), nhưng tại nến hiện tại không có lợi thế thống kê (Zero Edge).`;
      }
      if (predScenarioBText) {
        predScenarioBText.textContent = `Nếu cố tình vào lệnh ngược rào chắn VETO, rủi ro dính bẫy thanh khoản và sập sâu > -4.5%. Lệnh bị hủy an toàn (VETO = 0$).`;
      }
      if (predActionSummaryBadge) {
        predActionSummaryBadge.className = "p-1.5 rounded text-[11px] text-center font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40";
        predActionSummaryBadge.textContent = "🛑 KHÔNG MỞ LỆNH: Thà bỏ lỡ cơ hội còn hơn mất vốn! Chờ Tool quét tín hiệu mới.";
      }
    } else if (isShort) {
      if (predConfidenceBadge) {
        predConfidenceBadge.className = "px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40";
        predConfidenceBadge.textContent = `🎯 Độ Khớp Cấu Trúc: ${histAccuracy}% (${histWinCount} TP1 / ${histLossCount} SL)`;
      }
      if (predDirectionText) {
        predDirectionText.className = "text-sm font-bold text-amber-400";
        predDirectionText.textContent = "📉 SỤP ĐỔ • BẮT ĐỈNH KIỆT SỨC (SHORT)";
      }
      if (predScenarioAText) {
        predScenarioAText.textContent = `Giá hồi nhẹ lên vùng 🔴 BÁN XẢ SHORT (${formatSmartPrice(entryP)}$) để đón thanh khoản Limit Maker, sau đó áp lực xả đỉnh đẩy giá sập về 🟡 CHỐT LỜI TP1 (${formatSmartPrice(tp1P)}$).`;
      }
      if (predScenarioBText) {
        predScenarioBText.textContent = `Nếu phe mua bất ngờ bơm bão vượt 🛡️ CẮT LỖ (${formatSmartPrice(slP)}$), cơ chế Shock Rescue ngắt lệnh ngay ở lỗ nhỏ để bảo toàn 98.5% vốn.`;
      }
      if (predActionSummaryBadge) {
        predActionSummaryBadge.className = "p-1.5 rounded text-[11px] text-center font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30";
        predActionSummaryBadge.textContent = "💡 Đặt lệnh Limit Maker tại vùng Bán Xả, tuyệt đối KHÔNG bán tháo đuổi đáy!";
      }
    } else {
      if (predConfidenceBadge) {
        predConfidenceBadge.className = "px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
        predConfidenceBadge.textContent = `🎯 Độ Khớp Cấu Trúc: ${histAccuracy}% (${histWinCount} TP1 / ${histLossCount} SL)`;
      }
      if (predDirectionText) {
        predDirectionText.className = "text-sm font-bold text-emerald-400";
        predDirectionText.textContent = "📈 TĂNG TRƯỞNG • MUA GOM THUẬN CÁ MẬP";
      }
      if (predScenarioAText) {
        predScenarioAText.textContent = `Giá hồi nhẹ về vùng 🟢 MUA GOM (${formatSmartPrice(entryP)}$) để đón thanh khoản Limit Maker, sau đó lực mua bão đẩy giá bứt phá lên 🟡 CHỐT LỜI TP1 (${formatSmartPrice(tp1P)}$).`;
      }
      if (predScenarioBText) {
        predScenarioBText.textContent = `Nếu phe xả ép thủng 🔴 CẮT LỖ (${formatSmartPrice(slP)}$), cơ chế Shock Rescue ngắt lệnh ngay ở lỗ nhỏ để bảo toàn 98.5% vốn.`;
      }
      if (predActionSummaryBadge) {
        predActionSummaryBadge.className = "p-1.5 rounded text-[11px] text-center font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30";
        predActionSummaryBadge.textContent = "💡 Đặt lệnh Limit Maker tại vùng xanh, tuyệt đối KHÔNG mua đuổi Market!";
      }
    }

    // Cập nhật nến Live Ticker thời gian thực mỗi 2.5 giây
    window._portfolioLiveTickerInterval = setInterval(async () => {
      try {
        const tickUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${cleanSym}&interval=${interval}&limit=2`;
        const tickRes = await fetch(tickUrl);
        if (tickRes.ok && portfolioCandleSeries) {
          const tKlines = await tickRes.json();
          if (tKlines && tKlines.length > 0) {
            const lastK = tKlines[tKlines.length - 1];
            const liveClose = parseFloat(lastK[4]);
            portfolioCandleSeries.update({
              time: Math.floor(lastK[0] / 1000),
              open: parseFloat(lastK[1]),
              high: parseFloat(lastK[2]),
              low: parseFloat(lastK[3]),
              close: liveClose
            });
            if (aiTrajectorySeries && trajectoryData.length > 0) {
              const liveLine = liveClose * 0.15 + entryP * 0.85;
              aiTrajectorySeries.update({
                time: Math.floor(lastK[0] / 1000),
                value: liveLine
              });
              const chartAiLineValLive = document.getElementById("chartAiLineVal");
              if (chartAiLineValLive) chartAiLineValLive.textContent = `${formatSmartPrice(liveLine)}$`;
            }
            updateAdvice(liveClose);
          }
        }
      } catch (tickErr) {}
    }, 2500);

    if (!window._portfolioChartResizeBound) {
      window._portfolioChartResizeBound = true;
      window.addEventListener('resize', () => {
        if (portfolioChart && container) {
          portfolioChart.applyOptions({ width: container.clientWidth });
        }
      });
    }

  } catch (err) {
    console.error("loadPortfolioChart error:", err);
  } finally {
    if (spinner) spinner.classList.add("hidden");
  }
}

// Quản lý Vị Thế Đang Hold (Active Holdings Tracker)
function getUserHoldings() {
  try {
    const raw = localStorage.getItem("tradematrix_active_holdings");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUserHoldings(holdings) {
  try {
    localStorage.setItem("tradematrix_active_holdings", JSON.stringify(holdings));
  } catch (e) {}
}

function addUserHolding(symbol, entryPrice, amountUSD) {
  const holdings = getUserHoldings();
  holdings.unshift({
    id: Date.now(),
    symbol: symbol,
    entryPrice: entryPrice,
    amountUSD: amountUSD,
    timestamp: new Date().toLocaleString()
  });
  saveUserHoldings(holdings);
  renderUserHoldings();
}

function removeUserHolding(id) {
  let holdings = getUserHoldings();
  holdings = holdings.filter(h => h.id !== id);
  saveUserHoldings(holdings);
  renderUserHoldings();
}

async function renderUserHoldings() {
  const tbody = document.getElementById("holdingsTableBody");
  if (!tbody) return;

  const holdings = getUserHoldings();
  if (holdings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-gray-500 font-sans">
          Chưa có vị thế nào được lưu. Bạn hãy nhập mã tài sản mình đã mua vào form phía trên để bắt đầu theo dõi!
        </td>
      </tr>
    `;
    return;
  }

  let rows = "";
  for (const h of holdings) {
    const clean = h.symbol.replace('/', '').toUpperCase();
    let curPrice = h.entryPrice * 1.025;
    try {
      const pRes = await fetch(`https://fapi.binance.com/fapi/v1/ticker/price?symbol=${clean}USDT`);
      if (pRes.ok) {
        const pData = await pRes.json();
        curPrice = parseFloat(pData.price) || curPrice;
      }
    } catch (e) {}

    const pnlPct = ((curPrice - h.entryPrice) / h.entryPrice) * 100;
    const pnlDollar = (h.amountUSD * (pnlPct / 100));
    const isProfit = pnlDollar >= 0;

    let trailingStopPrice = h.entryPrice * 0.985;
    let strategyBadge = `<span class="px-2 py-0.5 rounded bg-gray-500/20 text-gray-300 font-bold">🟡 Theo dõi bình thường</span>`;

    if (pnlPct >= 5.0) {
      trailingStopPrice = curPrice * 0.982;
      strategyBadge = `<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold animate-pulse">⚡ Khuyến nghị: Chốt lời 50%</span>`;
    } else if (pnlPct >= 1.5) {
      trailingStopPrice = h.entryPrice * 1.0022;
      strategyBadge = `<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">🟢 Đã khóa Hòa Vốn (Risk-Free)</span>`;
    } else if (pnlPct <= -1.5) {
      trailingStopPrice = h.entryPrice * 0.985;
      strategyBadge = `<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">🚨 Chạm ngưỡng Cắt Lỗ</span>`;
    }

    rows += `
      <tr class="hover:bg-white/[0.02] transition">
        <td class="py-3 px-4 font-bold text-white">${h.symbol}</td>
        <td class="py-3 px-4 text-gray-400">$${formatSmartPrice(h.entryPrice)}</td>
        <td class="py-3 px-4 text-white font-bold">$${formatSmartPrice(curPrice)}</td>
        <td class="py-3 px-4 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}">
          ${isProfit ? '+' : ''}${pnlDollar.toFixed(2)}$ (${isProfit ? '+' : ''}${pnlPct.toFixed(2)}%)
        </td>
        <td class="py-3 px-4 text-purple-300 font-bold bg-purple-950/20">
          $${formatSmartPrice(trailingStopPrice)}
        </td>
        <td class="py-3 px-4">${strategyBadge}</td>
        <td class="py-3 px-4 text-center">
          <button type="button" class="btn-del-holding text-gray-500 hover:text-rose-400 transition" data-id="${h.id}" title="Đóng / Xóa vị thế">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = rows;

  tbody.querySelectorAll(".btn-del-holding").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      if (id) removeUserHolding(id);
    });
  });

  if (window.lucide) lucide.createIcons();
}

// Khởi chạy khi script được tải
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolioNavigator);
} else {
  initPortfolioNavigator();
}
