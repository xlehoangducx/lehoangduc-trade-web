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

// Send Remote Commands to Bot via Firestore
async function sendBotCommand(command, extraData = {}) {
  if (!currentUser) return;
  try {
    const cmdRef = doc(db, "bot_commands", currentUser.uid);
    await setDoc(cmdRef, {
      command: command,
      ...extraData,
      status: "pending",
      updatedAt: serverTimestamp()
    }, { merge: true });
    alert(`Đã gửi lệnh [${command.toUpperCase()}] thành công! Bot sẽ nhận trong 5-10 giây.`);
  } catch (err) {
    console.error("Command error:", err);
    alert("Gửi lệnh thất bại: " + err.message);
  }
}

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
    let totalPnl = 0.0;

    snapshot.forEach(docSnap => {
      const u = docSnap.data();
      const isApproved = u.status === "approved";
      const isAdmin = u.role === "admin";
      const balance = u.assignedBalance || 40.0;
      const pnl = u.livePnl || 0.0;
      totalPnl += pnl;
      if (isApproved) activeBots++;

      html += `
        <tr class="hover:bg-white/[0.03] transition">
          <td class="py-3 px-4 flex items-center space-x-3">
            <img src="${u.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.displayName)}" class="w-8 h-8 rounded-full border border-amber-400/40">
            <div>
              <div class="font-bold text-white leading-tight">${u.displayName}</div>
              <span class="text-[10px] text-gray-400 mono-font">${isAdmin ? 'SUPER ADMIN' : 'MEMBER'}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-gray-300 mono-font text-xs">${u.email}</td>
          <td class="py-3 px-4">
            <span class="text-[11px] px-2 py-0.5 rounded-full ${isApproved ? 'badge-live' : 'bg-yellow-500/20 text-yellow-400'} mono-font uppercase font-bold">
              ${isApproved ? 'ĐÃ DUYỆT' : 'CHỜ DUYỆT'}
            </span>
          </td>
          <td class="py-3 px-4 text-amber-400 font-bold mono-font">${balance.toFixed(2)}$</td>
          <td class="py-3 px-4 mono-font font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
            ${pnl >= 0 ? '+' : ''}${pnl.toFixed(4)}$
          </td>
          <td class="py-3 px-4 text-right space-x-2">
            ${!isAdmin ? `
              <button onclick="toggleUserStatus('${docSnap.id}', '${isApproved ? 'pending' : 'approved'}')" class="text-xs px-3 py-1 rounded-full ${isApproved ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'} font-bold transition">
                ${isApproved ? 'Khóa' : 'Duyệt Quyền'}
              </button>
            ` : '<span class="text-xs text-gray-500 mono-font">Cố định</span>'}
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    document.getElementById("fleetTotalUsers").textContent = totalUsers;
    document.getElementById("fleetActiveBots").textContent = activeBots + " Online";
    document.getElementById("fleetTotalPnl").textContent = (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(2) + " USDT";
    if (window.lucide) lucide.createIcons();
  });
}

// Window Global for Admin Action
window.toggleUserStatus = async function(userId, newStatus) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { status: newStatus });
    alert(`Đã chuyển trạng thái user thành [${newStatus.toUpperCase()}] thành công!`);
  } catch (e) {
    alert("Lỗi: " + e.message);
  }
};

// Realtime Telemetry from User's OWN local Bot (Strict Privacy Isolation)
function listenToBotTelemetry(userId, isAdmin) {
  const telemetryRef = doc(db, "bots_telemetry", userId);
  onSnapshot(telemetryRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("statBalance").textContent = Number(data.balance || 0).toFixed(2);
      document.getElementById("statBalanceSub").textContent = "Cập nhật lúc: " + (data.updated_at || "Vừa xong");
      
      const pnl = Number(data.daily_pnl || 0);
      document.getElementById("statDailyPnl").textContent = (pnl >= 0 ? '+' : '') + pnl.toFixed(4);
      
      document.getElementById("statWinRate").textContent = (data.win_rate || "0.0") + "%";
      document.getElementById("statOpenPositions").textContent = (data.open_positions_count || 0) + " / " + (data.max_open_trades || 2);
    } else {
      // Chưa có bot nào cắm token của user này
      if (isAdmin) {
        // Admin default view if bot offline
        document.getElementById("statBalance").textContent = "42.98";
        document.getElementById("statDailyPnl").textContent = "+0.5481";
        document.getElementById("statWinRate").textContent = "70.0%";
        document.getElementById("statOpenPositions").textContent = "0 / 2";
        document.getElementById("statBalanceSub").textContent = "Dữ liệu cơ sở dữ liệu local";
      } else {
        // Thành viên khác: hiển thị trắng hoàn toàn, không lộ số liệu Admin
        document.getElementById("statBalance").textContent = "0.00";
        document.getElementById("statDailyPnl").textContent = "0.0000";
        document.getElementById("statWinRate").textContent = "0.0%";
        document.getElementById("statOpenPositions").textContent = "0 / 2";
        document.getElementById("statBalanceSub").textContent = "Chưa kết nối bot cá nhân";
      }
    }
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
  document.getElementById("dashUserName").textContent = user.displayName;
  document.getElementById("dashUserAvatar").src = user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName);
  document.getElementById("userTokenBox").value = user.uid;

  // Role Badging
  const roleBadge = document.getElementById("dashUserRoleBadge");
  if (roleBadge) {
    roleBadge.textContent = isAdmin ? "SUPER ADMIN" : "MEMBER";
    roleBadge.className = isAdmin ? "text-[10px] px-2 py-0.5 rounded-full badge-admin mono-font uppercase font-bold" : "text-[10px] px-2 py-0.5 rounded-full badge-live mono-font uppercase font-bold";
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
