// Authentication Module with Firebase v10
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { firebaseConfig, ADMIN_EMAILS } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db };

// DOM Elements
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const authNavContainer = document.getElementById("authNavContainer");
const userProfile = document.getElementById("userProfile");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userRoleBadge = document.getElementById("userRoleBadge");

// Login Handler
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    try {
      btnLogin.disabled = true;
      btnLogin.innerHTML = `<span class="animate-spin mr-2">⏳</span> Đang đăng nhập...`;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await syncUserProfile(user);
      // Đăng nhập xong bay thẳng vào Dashboard
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Login Error:", error);
      alert("Đăng nhập thất bại: " + error.message);
    } finally {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.innerHTML = `<span>Đăng Nhập Google</span>`;
      }
    }
  });
}

// Logout Handler
if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  });
}

// Sync User to Firestore (Bootstrap Admin & Members)
export async function syncUserProfile(user) {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
  
  if (!userSnap.exists()) {
    // Tạo profile mới lần đầu
    const newProfile = {
      uid: user.uid,
      email: user.email.toLowerCase(),
      displayName: user.displayName || "Trader",
      photoURL: user.photoURL || "",
      role: isAdmin ? "admin" : "member",
      status: isAdmin ? "approved" : "pending", // Admin được duyệt ngay, Member chờ Admin duyệt
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      assignedBalance: 40.0,
      assignedLeverage: 10
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    // Cập nhật thời gian đăng nhập
    const currentData = userSnap.data();
    if (isAdmin && currentData.role !== "admin") {
      await setDoc(userRef, { role: "admin", status: "approved" }, { merge: true });
      currentData.role = "admin";
      currentData.status = "approved";
    } else if (!isAdmin && currentData.role === "admin") {
      // Gmail khác không được giữ quyền admin dù từng bị gán nhầm.
      await setDoc(userRef, { role: "member", status: "pending" }, { merge: true });
      currentData.role = "member";
      currentData.status = "pending";
    }
    // Không chặn quyết định approved chỉ vì ghi lastLogin chậm/bị Rules từ chối.
    // Trả profile đã đọc được ngay; cập nhật lastLogin ở nền và không đổi status.
    setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true })
      .catch((err) => console.warn("lastLogin sync warning:", err));
    return currentData;
  }
}

// Listen to Auth State (Only for Index / Landing Page navigation)
if (btnLogin || document.getElementById("heroCtaBtn") || document.getElementById("authNavContainer")) {
  onAuthStateChanged(auth, async (user) => {
  if (user) {
    // 1. CẬP NHẬT UI NGAY TỨC THÌ (Zero Delay)
    const floatingBtn = document.getElementById("floatingDashboardBtn");
    if (floatingBtn) {
      floatingBtn.classList.remove("hidden");
    }

    if (btnLogin && userProfile) {
      btnLogin.classList.add("hidden");
      userProfile.classList.remove("hidden");
      if (userAvatar) userAvatar.src = user.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || "Trader");
      if (userName) userName.textContent = user.displayName || "Trader";
    }

    const heroCtaBtn = document.getElementById("heroCtaBtn");
    const heroCtaText = document.getElementById("heroCtaText");
    const heroCtaIcon = document.getElementById("heroCtaIcon");
    if (heroCtaBtn) {
      heroCtaBtn.onclick = () => { window.location.href = "dashboard.html"; };
      if (heroCtaText) heroCtaText.textContent = "Vào Bảng Điều Khiển";
      if (heroCtaIcon) heroCtaIcon.setAttribute("data-lucide", "layout-dashboard");
    }

    // 2. Chạy syncUserProfile trong background với try/catch an toàn
    try {
      const profile = await syncUserProfile(user);
      if (userRoleBadge) {
        userRoleBadge.textContent = profile?.role === "admin" ? "ADMIN" : (profile?.status === "approved" ? "MEMBER" : "CHỜ DUYỆT");
        userRoleBadge.className = profile?.role === "admin" 
          ? "text-[10px] px-2 py-0.5 rounded-full badge-admin mono-font uppercase font-bold"
          : (profile?.status === "approved" ? "text-[10px] px-2 py-0.5 rounded-full badge-live mono-font uppercase font-bold" : "text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 mono-font uppercase font-bold");
      }
    } catch (err) {
      console.warn("Background profile sync warning:", err);
    }

    if (window.lucide) lucide.createIcons();
  } else {
    const floatingBtn = document.getElementById("floatingDashboardBtn");
    if (floatingBtn) {
      floatingBtn.classList.add("hidden");
    }
    if (btnLogin && userProfile) {
      btnLogin.classList.remove("hidden");
      userProfile.classList.add("hidden");
    }
    const heroCtaBtn = document.getElementById("heroCtaBtn");
    const heroCtaText = document.getElementById("heroCtaText");
    const heroCtaIcon = document.getElementById("heroCtaIcon");
    if (heroCtaBtn) {
      heroCtaBtn.onclick = () => { document.getElementById("btnLogin")?.click(); };
      if (heroCtaText) heroCtaText.textContent = "Đăng Nhập Google Để Truy Cập";
      if (heroCtaIcon) heroCtaIcon.setAttribute("data-lucide", "log-in");
    }
    if (window.lucide) lucide.createIcons();
  }
});
}
