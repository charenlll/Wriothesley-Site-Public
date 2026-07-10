import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://svmtxhahbjhuhcguuzeg.supabase.co";
const SUPABASE_KEY = "sb_publishable_tttVR5qfrT90sTQVEFFoPg_b1kFbYHe";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginPanel = document.querySelector("#loginPanel");
const dashboardPanel = document.querySelector("#dashboardPanel");
const loginForm = document.querySelector("#adminLoginForm");
const loginMessage = document.querySelector("#loginMessage");
const dashboardMessage = document.querySelector("#dashboardMessage");
const usersTableBody = document.querySelector("#usersTableBody");
const adminIdentity = document.querySelector("#adminIdentity");
const refreshUsers = document.querySelector("#refreshUsers");
const logoutAdmin = document.querySelector("#logoutAdmin");

function setMessage(node, text, ok = false) {
  node.textContent = text || "";
  node.classList.toggle("ok", Boolean(ok));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("zh-CN", { hour12: false });
}

async function getCurrentProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,status,role")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.status !== "approved" || profile.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("当前账号不是已审核管理员");
  }
  return profile;
}

function showDashboard(profile) {
  loginPanel.hidden = true;
  dashboardPanel.hidden = false;
  adminIdentity.textContent = `当前管理员：${profile.email || profile.id}`;
}

function showLogin() {
  dashboardPanel.hidden = true;
  loginPanel.hidden = false;
  usersTableBody.innerHTML = "";
  adminIdentity.textContent = "";
}

async function loadPendingUsers() {
  setMessage(dashboardMessage, "正在读取待审核用户...", true);
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,status,role,created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;

  if (!data.length) {
    usersTableBody.innerHTML = '<tr><td colspan="5" class="empty-cell">暂无待审核用户</td></tr>';
    setMessage(dashboardMessage, "审核队列为空。", true);
    return;
  }

  usersTableBody.innerHTML = data.map((user) => `
    <tr data-user-id="${user.id}">
      <td>${user.email || "-"}</td>
      <td><span class="status-pill">${user.status}</span></td>
      <td>${user.role}</td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <div class="row-actions">
          <button class="approve-btn" type="button" data-action="approve">通过</button>
          <button class="reject-btn" type="button" data-action="reject">拒绝</button>
        </div>
      </td>
    </tr>
  `).join("");
  setMessage(dashboardMessage, `共 ${data.length} 个待审核用户。`, true);
}

async function reviewUser(userId, action) {
  const status = action === "approve" ? "approved" : "rejected";
  const { error } = await supabase
    .from("profiles")
    .update({ status, role: "user" })
    .eq("id", userId);
  if (error) throw error;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, "正在登录...", true);
  const email = document.querySelector("#adminEmail").value.trim();
  const password = document.querySelector("#adminPassword").value;
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await requireAdmin();
    showDashboard(profile);
    await loadPendingUsers();
    setMessage(loginMessage, "");
  } catch (error) {
    setMessage(loginMessage, error.message || "登录失败");
  }
});

usersTableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const row = button.closest("tr[data-user-id]");
  if (!row) return;
  button.disabled = true;
  setMessage(dashboardMessage, "正在提交审核结果...", true);
  try {
    await reviewUser(row.dataset.userId, button.dataset.action);
    await loadPendingUsers();
  } catch (error) {
    button.disabled = false;
    setMessage(dashboardMessage, error.message || "审核失败");
  }
});

refreshUsers.addEventListener("click", () => {
  loadPendingUsers().catch((error) => setMessage(dashboardMessage, error.message || "刷新失败"));
});

logoutAdmin.addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin();
});

(async function boot() {
  try {
    const profile = await requireAdmin();
    showDashboard(profile);
    await loadPendingUsers();
  } catch (_) {
    showLogin();
  }
})();
