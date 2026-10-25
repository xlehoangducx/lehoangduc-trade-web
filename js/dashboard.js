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
      // Chưa có dữ liệu telemetry
      if (badgeText) badgeText.textContent = "OFFLINE (CHỜ KẾT NỐI)";
      if (badgeEl) {
        badgeEl.className = "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] mono-font font-bold shadow-sm shadow-amber-500/10";
      }
      // Không ghi đè số 00 nếu đã có số liệu trong cache để tránh giật
      if (!window._lastValidTotalTrades) {
        document.getElementById("statBalance").textContent = "0.00";
        document.getElementById("statDailyPnl").textContent = "0.0000";
        document.getElementById("statWinRate").textContent = "0.0%";
        document.getElementById("statOpenPositions").textContent = "0 / 2";
        document.getElementById("statBalanceSub").textContent = "Chưa kết nối bot cá nhân";
      }
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
      let barGradient = '';
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
        barGradient = 'from-amber-500 via-yellow-400 to-amber-200';
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
        barGradient = 'from-sky-500 via-cyan-400 to-teal-300';
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
        barGradient = 'from-orange-600 via-amber-500 to-yellow-400';
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
        barGradient = 'from-emerald-600 via-teal-400 to-emerald-300';
        textRankColor = 'text-emerald-400';
        symColor = 'text-emerald-200 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]';
        sweepBeam = 'background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.80), transparent);';
        glowColorRgba = 'rgba(16, 185, 129, 0.6)';
        sparkColorHex = '#34d399';
      }

      // 3. Bậc thang thời gian chuyển động (Cascading Staggered Timing: 0.00s, 0.16s, 0.32s, 0.48s)
      const delaySec = (idx * 0.16).toFixed(2);
      const readiness = Math.min(99, Math.max(10, Number(c.readiness_pct) || 75));
      const hitCount = (c.hit_count !== undefined && c.hit_count !== null && Number(c.hit_count) > 0)
        ? Number(c.hit_count)
        : 1;

      const hitTag = `<span class="px-2 py-0.5 rounded-md text-[10px] font-black mono-font bg-amber-400/15 text-amber-300 border border-amber-400/35 flex items-center gap-1 shrink-0 shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>🔥 ${hitCount} lần</span>`;

      const timeWindow = c.time_window_str || c.last_seen_str || "Gần đây";
      const bottleneckReason = c.bottleneck_reason || "Đang kiểm tra ngưỡng an toàn";

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
              <a href="https://www.binance.com/en/futures/${(c.symbol || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}" target="_blank" rel="noopener noreferrer" 
                 title="Bấm để mở biểu đồ ${(c.symbol || '')} trên Binance Futures"
                 class="text-xs sm:text-sm mono-font font-black tracking-wider ${symColor} hover:underline hover:text-amber-300 inline-flex items-center gap-1 select-text cursor-pointer transition-colors z-20"
                 onclick="event.stopPropagation();">
                <span class="select-text">${c.symbol}</span>
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
            <span>Thời điểm: <strong class="text-gray-300">${timeWindow}</strong></span>
            <span>Cập nhật: <strong class="text-gray-300">${c.last_seen_str || '--'}</strong></span>
          </div>

          <div class="mb-2 relative z-10">
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

          <div class="grid grid-cols-3 gap-1 mb-2 text-[10px] mono-font text-center relative z-10">
            <div class="p-1 rounded-lg bg-black/60 border border-white/5">
              <div class="text-[9px] text-gray-400">AI Ensemble</div>
              <div class="font-bold text-white text-[10px] mt-0.5 truncate">${c.side === 'LONG' || c.side === 'BUY' ? 'BUY' : 'SELL'} ${c.confidence_pct || '--'}%</div>
            </div>
            <div class="p-1 rounded-lg bg-black/60 border border-white/5">
              <div class="text-[9px] text-gray-400">Đồng Thuận</div>
              <div class="font-bold text-white text-[10px] mt-0.5 truncate" title="${c.strategies_agreed || '--'}">${c.strategies_agreed || '2/2'}</div>
            </div>
            <div class="p-1 rounded-lg bg-black/60 border border-white/5">
              <div class="text-[9px] text-gray-400">Đòn Bẩy</div>
              <div class="font-bold ${textRankColor} text-[10px] mt-0.5">${c.dynamic_leverage || '5x'}</div>
            </div>
          </div>

          <div class="p-2 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 flex items-start gap-1.5 relative z-10">
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