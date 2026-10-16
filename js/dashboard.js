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

      inputLeverage.value = 8;

      inputMaxTrades.value = 3;

    } else if (val <= 300) {

      inputLeverage.value = 8;

      inputMaxTrades.value = 4;

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

  });

});



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



document.getElementById("btnSaveConfig")?.addEventListener("click", () => {

  const lev = parseInt(inputLeverage.value) || 10;

  const trades = parseInt(inputMaxTrades.value) || 2;

  sendBotCommand("update_config", {

    max_leverage: lev,

    max_open_trades: trades

  });

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



  if (!user) {

    window.location.href = "index.html";

    return;

  }

  currentUser = user;

  currentProfile = await syncUserProfile(user);



  const isAdmin = currentProfile?.role === "admin";

  const isApproved = currentProfile?.status === "approved";



  // Hide loading screen

  if (authLoadingScreen) authLoadingScreen.classList.add("hidden");



  // Kiểm tra quyền hạn: Nếu Member chưa duyệt -> Chỉ hiện màn hình chờ duyệt (Bảo mật 100%, không hiện dashboard bên dưới)

  if (!isApproved && !isAdmin) {

    if (dashboardApp) dashboardApp.classList.add("hidden");

    if (pendingOverlay) pendingOverlay.classList.remove("hidden");

    document.getElementById("pendingEmail").textContent = user.email;

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

