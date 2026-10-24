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



} from "./auth.js";



import { 



  onAuthStateChanged, 



  signOut 



} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



import { 

  doc, 

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

  

  // Equity từ telemetry live bot (hoặc fallback 97.85)

  const equity = Math.max(10.0, Number(window._lastTelemetryEquity || window._lastTelemetryBalance || 97.85));

  

  // Ngân sách cơ sở cho 1 slot vị thế

  const baseSlotBudget = equity / slots;

  

  // Quy mô vị thế Notional theo phân khúc

  // Altcoin: 95% slot budget (khống chế trần cứng $5,000 cho tài khoản lớn)

  const altNotional = Math.min(5000.0, Math.max(6.0, baseSlotBudget * 0.95));

  // BTC/ETH: 130% slot budget

  const btcNotional = Math.max(10.0, baseSlotBudget * 1.30);

  

  // Ký quỹ thực tế cho 1 lệnh theo đòn bẩy

  const marginPerOrder = altNotional / leverage;

  const marginPctPerOrder = (marginPerOrder / equity) * 100;

  

  // Tổng ký quỹ khi mở đủ tất cả các vị thế cùng lúc

  const totalMaxMargin = marginPerOrder * slots;

  const totalMarginPct = Math.min(100, (totalMaxMargin / equity) * 100);

  const cashBufferPct = Math.max(0, 100 - totalMarginPct);

  

  // Ước tính Lãi / Lỗ:

  // 1. Lệnh thắng chuẩn (Chốt TP1 +1.2%)

  const normalWinUSDT = altNotional * 0.012;

  const normalWinROE = (normalWinUSDT / marginPerOrder) * 100;

  const dailyTarget3Trades = normalWinUSDT * 3;

  

  // 2. Lệnh ăn sóng dài (Runner TP2 +3.5% ~ +5.0%)

  const waveWinMinUSDT = altNotional * 0.035;

  const waveWinMaxUSDT = altNotional * 0.050;

  const waveWinROE = (waveWinMinUSDT / marginPerOrder) * 100;

  

  // 3. Cắt lỗ tối đa (Dính SL cứng -2.0%)

  const maxLossUSDT = altNotional * 0.020;

  const maxLossAccountPct = (maxLossUSDT / equity) * 100;

  

  // 4. Cắt sớm DOA (sau 45p sideway/yếu, cắt chỉ -0.05%)

  const doaLossUSDT = altNotional * 0.0005;



  // Cập nhật giao diện Cloud

  const eqBadge = document.getElementById("cloudSimEquityBadge");

  if (eqBadge) eqBadge.textContent = "Vốn Live: $" + equity.toFixed(2) + " USDT";



  const slotsLabel = document.getElementById("cloudSimSlotsLabel");

  if (slotsLabel) slotsLabel.textContent = slots + " vị thế";



  const levLabel = document.getElementById("cloudSimLevLabel");

  if (levLabel) levLabel.textContent = leverage + "x";



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



  const capTag = document.getElementById("cloudSimCapTag");

  if (capTag) {

    if (altNotional >= 5000) {

      capTag.textContent = "Altcoin (Trần cứng $5k)";

      capTag.className = "text-amber-400 font-bold";

    } else {

      capTag.textContent = "Altcoin (95% slot)";

      capTag.className = "text-cyan-400 font-bold";

    }

  }



  const notionalVal = document.getElementById("cloudSimNotionalVal");

  if (notionalVal) notionalVal.textContent = "~$" + altNotional.toFixed(2) + " USDT";



  const notionalSub = document.getElementById("cloudSimNotionalSub");

  if (notionalSub) {

    notionalSub.innerHTML = `BTC/ETH: ~$${btcNotional.toFixed(1)} · Ký quỹ: <span class="text-amber-400 font-bold">~$${marginPerOrder.toFixed(2)}</span> (${marginPctPerOrder.toFixed(1)}% vốn)`;

  }



  const winVal = document.getElementById("cloudSimWinVal");

  if (winVal) winVal.textContent = "+$" + normalWinUSDT.toFixed(2) + " USDT";



  const winSub = document.getElementById("cloudSimWinSub");

  if (winSub) {

    winSub.innerHTML = `+${normalWinROE.toFixed(1)}% ROE · 3 lệnh/ngày = <strong class="text-emerald-400 font-bold">+$${dailyTarget3Trades.toFixed(2)}</strong>`;

  }



  const waveVal = document.getElementById("cloudSimWaveVal");

  if (waveVal) waveVal.textContent = "+$" + waveWinMinUSDT.toFixed(2) + " ~ +$" + waveWinMaxUSDT.toFixed(2) + " USDT";



  const waveSub = document.getElementById("cloudSimWaveSub");

  if (waveSub) {

    waveSub.innerHTML = `+${waveWinROE.toFixed(0)}%+ ROE · 1-2 sóng = <strong class="text-blue-400 font-bold">+$${(waveWinMinUSDT * 2).toFixed(2)}</strong>`;

  }



  const lossVal = document.getElementById("cloudSimLossVal");

  if (lossVal) lossVal.textContent = "-$" + maxLossUSDT.toFixed(2) + " USDT";



  const lossSub = document.getElementById("cloudSimLossSub");

  if (lossSub) {

    lossSub.innerHTML = `Mất -${maxLossAccountPct.toFixed(2)}% vốn · Cắt sớm DOA: <strong class="text-gray-300">-$${doaLossUSDT < 0.01 ? '0.01' : doaLossUSDT.toFixed(2)}</strong>`;

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



// Send Remote Commands to Bot via Firestore (Non-blocking & Instant Feedback)

async function sendBotCommand(command, extraData = {}, btnEl = null) {

  if (!currentUser) {

    showToast("Bạn cần đăng nhập để điều khiển bot!", "error");

    return;

  }



  let originalHtml = "";

  if (btnEl) {

    originalHtml = btnEl.innerHTML;

    btnEl.disabled = true;

    btnEl.style.opacity = "0.7";

    btnEl.innerHTML = `<span class="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Đang gửi...`;

  }



  try {

    const cmdRef = doc(db, "bot_commands", currentUser.uid);

    await setDoc(cmdRef, {

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

    else if (command === 'toggle_tradfi') label = extraData.only_tradfi ? 'CHỈ CỔ PHIẾU' : (extraData.enabled ? 'CẢ HAI (CRYPTO + CỔ PHIẾU)' : 'TẮT CỔ PHIẾU');

    else if (command === 'update_config') label = `ĐÒN BẨY ${extraData.max_leverage || ''}X & ${extraData.max_open_trades || ''} LỆNH`;



    showToast(`⚡ Đã gửi lệnh [${label}]! Máy treo PC2 đang xử lý...`, "success");

  } catch (err) {

    console.error("Command error:", err);

    showToast("Gửi lệnh thất bại: " + err.message, "error");

  } finally {

    if (btnEl) {

      setTimeout(() => {

        btnEl.innerHTML = originalHtml;

        btnEl.disabled = false;

        btnEl.style.opacity = "1";

      }, 2500);

    }

  }

}

window.sendBotCommand = sendBotCommand;







// Button Listeners for Remote Controls



document.getElementById("btnStartBot")?.addEventListener("click", () => sendBotCommand("start"));



document.getElementById("btnStopBot")?.addEventListener("click", () => sendBotCommand("stop"));



document.getElementById("btnTriggerCycle")?.addEventListener("click", () => sendBotCommand("run_cycle"));



document.getElementById("btnEmergencyClose")?.addEventListener("click", () => {



  if (confirm("CẢNH BÁO: Bạn có chắc chắn muốn ĐÓNG TẤT CẢ VỊ THẾ ngay lập tức?")) {



    sendBotCommand("emergency_close");



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

      if (statTotalTrades) statTotalTrades.textContent = `${totalTrades} lệnh lịch sử`;



      // 6. Win Rate & Phí Sàn

      const statWinRate = document.getElementById("statWinRate");

      if (statWinRate) statWinRate.textContent = `${winRate.toFixed(1)}%`;

      const statFeesSub = document.getElementById("statFeesSub");

      if (statFeesSub) statFeesSub.textContent = `Phí: $${totalFees.toFixed(2)} USDT`;



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



      // Heartbeat Status

      if (badgeText) {

        if (data.is_running === false) {

          badgeText.textContent = "PAUSED (TẠM DỪNG)";

        } else {

          badgeText.textContent = "ONLINE (SYNC REALTIME)";

        }

      }



      // Render Positions Table & Mobile Cards with Bulletproof Calculation Fallbacks

      const positionsMobileList = document.getElementById("positionsMobileList");

      const posCountBadge = document.getElementById("posCountBadge");



      if (positionsTbody || positionsMobileList) {



        // Cập nhật Ra-đa Rình Mồi Leaderboard

      const rawRadar = data.radar_candidates || [];

      renderRadarLeaderboard(rawRadar);



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

                    <span>${p.symbol}</span>

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

                  <button onclick="sendBotCommand('close_position', { symbol: '${p.symbol}' }, this)" class="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto active:scale-95">

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

                    <span class="font-black text-white mono-font text-sm tracking-wide">${p.symbol}</span>

                    <span class="px-2 py-0.5 rounded-full text-[11px] font-bold mono-font ${sideBadgeClass}">

                      ${p.side} ${p.leverage}x

                    </span>

                  </div>

                  <button onclick="sendBotCommand('close_position', { symbol: '${p.symbol}' }, this)" class="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-95">

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

    const adminEmails = ["xlehoangducx@gmail.com", "lehoangduc@gmail.com"];

    const isUserAdmin = adminEmails.includes((user.email || "").toLowerCase());

    currentProfile = {

      uid: user.uid,

      email: user.email,

      displayName: user.displayName || "Trader",

      role: isUserAdmin ? "admin" : "member",

      status: "approved"

    };

  } finally {

    dismissLoading();

  }



  const isAdmin = currentProfile?.role === "admin" || (user.email && user.email.toLowerCase().includes("lehoangduc"));

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

    // 1. Khử trùng lặp tuyệt đối (Strict Deduplication) từ dữ liệu bot gửi lên
    const seen = new Set();
    let candidates = [];

    if (Array.isArray(rawCandidates) && rawCandidates.length > 0) {
      for (const c of rawCandidates) {
        if (!c || !c.symbol) continue;
        const base = normalizeSym(c.symbol);
        if (!seen.has(base)) {
          seen.add(base);
          candidates.push({ ...c, symbol: base });
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
          <div class="text-[11px] text-gray-400 mt-1">Các chốt chặn vi mô đang bảo vệ an toàn vốn tuyệt đối. Chưa có tín hiệu nào bị nghẽn ở bước cuối.</div>
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

    // 3. Sắp xếp thứ hạng CHUẨN XÁC theo Tiềm Năng Khớp Lệnh (Readiness % giảm dần -> Confidence % -> Hit count)
    candidates.sort((a, b) => {
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
    const currentKeys = candidates.map(c => (c.symbol || '') + '_' + (c.hit_count || 1) + '_' + (c.readiness_pct || 0)).join('|');
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

      // 1. Phân loại hiệu ứng Hoán Đổi Vị Trí (Rank Swap & Movement Dynamics)
      const prevRank = (window._prevRadarRankMap && window._prevRadarRankMap[c.symbol]) ? window._prevRadarRankMap[c.symbol] : null;
      const currRank = idx + 1;
      
      let movementClass = (idx < 2) ? 'radar-anim-enter-left' : 'radar-anim-enter-right';
      let rankChangeBadge = '';
      
      if (prevRank) {
        if (currRank < prevRank) {
          // Bứt phá ngoạn mục soán ngôi lên hạng cao hơn!
          movementClass = 'radar-anim-ascend';
          rankChangeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-black mono-font bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5 animate-pulse">🚀 +${prevRank - currRank} Bứt phá</span>`;
        } else if (currRank > prevRank) {
          // Tụt hạng nhường chỗ
          movementClass = 'radar-anim-descend';
          rankChangeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-black mono-font bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-0.5">🔻 -${currRank - prevRank} Hạng</span>`;
        } else {
          // Giữ vững ngôi vị
          rankChangeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-black mono-font bg-white/[0.06] text-gray-400 border border-white/10 flex items-center gap-0.5">⚓ Giữ Top</span>`;
        }
      } else {
        // Tân binh mới lọt vào Top 4 Ra-đa
        rankChangeBadge = `<span class="px-1.5 py-0.5 rounded text-[9px] font-black mono-font bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-0.5">⚡ Mới vào</span>`;
      }

      // 2. Thiết lập 4 ĐẶC TRƯNG HÌNH ẢNH HOÀN TOÀN KHÁC BIỆT CHO 4 THẺ
      let rankThemeClass = '';
      let rankBadge = '';
      let rankBg = '';
      let rankBorder = '';
      let glowBar = '';
      let barGradient = '';
      let textRankColor = '';
      let symColor = '';
      let sweepBeam = '';

      if (idx === 0) {
        // 🥇 TOP 1: QUÁN QUÂN RA-ĐA LƯỢNG TỬ (GOLD TITAN)
        rankThemeClass = 'radar-card-top-1';
        rankBadge = '🥇 #1 QUÁN QUÂN';
        rankBg = 'bg-gradient-to-br from-amber-500/[0.16] via-yellow-500/[0.06] to-[#080d1a]';
        rankBorder = 'border-amber-400/60 shadow-amber-400/20';
        glowBar = 'from-amber-400 via-yellow-400 to-amber-200';
        barGradient = 'from-amber-500 via-yellow-400 to-amber-200';
        textRankColor = 'text-amber-400';
        symColor = 'text-amber-300';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.95), transparent);';
      } else if (idx === 1) {
        // 🥈 TOP 2: Á QUÂN CHIẾN THUẬT (TITANIUM CYAN LASER)
        rankThemeClass = 'radar-card-top-2';
        rankBadge = '🥈 #2 Á QUÂN';
        rankBg = 'bg-gradient-to-br from-cyan-500/[0.13] via-sky-500/[0.05] to-[#080d1a]';
        rankBorder = 'border-cyan-400/50 shadow-cyan-400/15';
        glowBar = 'from-cyan-400 via-sky-400 to-blue-300';
        barGradient = 'from-sky-500 via-cyan-400 to-teal-300';
        textRankColor = 'text-cyan-400';
        symColor = 'text-cyan-200';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.90), transparent);';
      } else if (idx === 2) {
        // 🥉 TOP 3: RÌNH MỒI HỔ PHÁCH (WARM AMBER FLAME)
        rankThemeClass = 'radar-card-top-3';
        rankBadge = '🥉 #3 HỔ PHÁCH';
        rankBg = 'bg-gradient-to-br from-orange-500/[0.11] via-amber-600/[0.04] to-[#080d1a]';
        rankBorder = 'border-orange-500/45 shadow-orange-500/15';
        glowBar = 'from-orange-500 via-amber-500 to-yellow-500';
        barGradient = 'from-orange-600 via-amber-500 to-yellow-400';
        textRankColor = 'text-orange-400';
        symColor = 'text-orange-200';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.85), transparent);';
      } else {
        // 🎖️ TOP 4: TRINH SÁT LỤC BẢO (STEALTH MATRIX EMERALD)
        rankThemeClass = 'radar-card-top-4';
        rankBadge = '🎖️ #4 TRINH SÁT';
        rankBg = 'bg-gradient-to-br from-emerald-500/[0.10] via-teal-600/[0.03] to-[#080d1a]';
        rankBorder = 'border-emerald-500/40 shadow-emerald-500/15';
        glowBar = 'from-emerald-500 via-teal-400 to-cyan-400';
        barGradient = 'from-emerald-600 via-teal-400 to-emerald-300';
        textRankColor = 'text-emerald-400';
        symColor = 'text-emerald-200';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.80), transparent);';
      }

      // 3. Bậc thang thời gian chuyển động (Cascading Staggered Timing: 0.00s, 0.16s, 0.32s, 0.48s)
      const delaySec = (idx * 0.16).toFixed(2);
      const readiness = Math.min(99, Math.max(10, Number(c.readiness_pct) || 75));
      const hitCount = (c.hit_count !== undefined && c.hit_count !== null && Number(c.hit_count) > 0)
        ? Number(c.hit_count)
        : 1;

      const hitTag = `<span class="px-2 py-0.5 rounded-md text-[10px] font-black mono-font bg-amber-400/15 text-amber-300 border border-amber-400/35 flex items-center gap-1 shrink-0 shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>🔥 Xém vào ${hitCount} lần</span>`;

      const timeWindow = c.time_window_str || c.last_seen_str || "Gần đây";
      const bottleneckReason = c.bottleneck_reason || "Đang kiểm tra ngưỡng an toàn";

      return `
        <div class="radar-card-container ${rankThemeClass} ${movementClass} p-3 sm:p-3.5 rounded-2xl ${rankBg} border ${rankBorder} transition-all duration-400 shadow-xl relative overflow-hidden group" style="animation-delay: ${delaySec}s;">
          <div class="radar-laser-line" style="${sweepBeam}"></div>
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${glowBar}"></div>

          <div class="flex items-center justify-between gap-1.5 mb-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded-md text-xs font-black mono-font bg-white/[0.08] ${textRankColor} border border-white/10 shadow-sm">
                ${rankBadge}
              </span>
              <span class="text-xs sm:text-sm font-black ${symColor} mono-font tracking-wider">
                ${c.symbol}
              </span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-black mono-font border ${dirClass}">
                ${dirText}
              </span>
              ${rankChangeBadge}
            </div>
            <div class="shrink-0">
              ${hitTag}
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-gray-400 mono-font mb-2">
            <span>Thời điểm: <strong class="text-gray-300">${timeWindow}</strong></span>
            <span>Cập nhật: <strong class="text-gray-300">${c.last_seen_str || '--'}</strong></span>
          </div>

          <div class="mb-2">
            <div class="flex items-center justify-between text-[10px] sm:text-[11px] mono-font mb-1">
              <span class="text-gray-300 font-semibold flex items-center gap-1">
                <i data-lucide="crosshair" class="w-3.5 h-3.5 ${textRankColor}"></i>
                <span>Độ Sẵn Sàng:</span>
              </span>
              <span class="${textRankColor} font-black">${readiness.toFixed(1)}%</span>
            </div>
            <div class="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/10">
              <div class="h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 shadow-sm" style="width: ${readiness}%"></div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1 mb-2 text-[10px] mono-font text-center">
            <div class="p-1 rounded-lg bg-black/50 border border-white/5">
              <div class="text-[9px] text-gray-400">AI Ensemble</div>
              <div class="font-bold text-white text-[10px] mt-0.5 truncate">${c.side === 'LONG' || c.side === 'BUY' ? 'BUY' : 'SELL'} ${c.confidence_pct || '--'}%</div>
            </div>
            <div class="p-1 rounded-lg bg-black/50 border border-white/5">
              <div class="text-[9px] text-gray-400">Đồng Thuận</div>
              <div class="font-bold text-white text-[10px] mt-0.5 truncate" title="${c.strategies_agreed || '--'}">${c.strategies_agreed || '2/2'}</div>
            </div>
            <div class="p-1 rounded-lg bg-black/50 border border-white/5">
              <div class="text-[9px] text-gray-400">Đòn Bẩy</div>
              <div class="font-bold ${textRankColor} text-[10px] mt-0.5">${c.dynamic_leverage || '5x'}</div>
            </div>
          </div>

          <div class="p-2 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 flex items-start gap-1.5">
            <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5"></i>
            <div class="text-[10px] sm:text-[11px] text-gray-300 leading-snug">
              <span class="text-amber-400 font-bold">Lý do chặn:</span>
              <span>${bottleneckReason}</span>
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
          <div class="text-[10px] text-gray-500 mt-1">Chỉ những coin đạt độ sẵn sàng cao mới được hiển thị.</div>
        </div>
      `;
    }

    // Lưu lại vị trí xếp hạng để so sánh chuyển động hoán đổi trong chu kỳ sau
    const newRankMap = {};
    candidates.slice(0, 4).forEach((c, i) => {
      newRankMap[c.symbol] = i + 1;
    });
    window._prevRadarRankMap = newRankMap;

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (renderErr) {
    console.error("renderRadarLeaderboard error:", renderErr);
  }
}

// Render ngay lập tức khi tải file (trạng thái rỗng an toàn, không coin ảo)
renderRadarLeaderboard([]);

