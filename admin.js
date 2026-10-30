const ADMIN_PASSWORD = "TinPhat2026";
const configDefaults = {
  phone: "0980000000", phoneDisplay: "0980 000 000", zalo: "https://zalo.me/0980000000",
  facebook: "https://www.facebook.com/", tiktok: "https://www.tiktok.com/", email: "thay-email-cua-ban@example.com",
  backgroundImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=2400&q=85",
  backgroundBlur: "0", overlayOpacity: "0", primaryColor: "#0d6efd", textColor: "#172b4d", fontSize: "16"
};
const contentDefaults = {
  heroTitle: "Mở lối đi <span>vững vàng</span> cho tương lai của bạn",
  heroLead: "Tư vấn du học Nhật, Hàn, Đài Loan và xuất khẩu lao động Nhật. Lộ trình rõ ràng, chi phí minh bạch, đồng hành từ lúc chuẩn bị hồ sơ đến khi ổn định tại nước bạn.",
  studentTitle: "Học viên của chúng tôi đã bắt đầu như bạn",
  studentLead: "Mỗi bức ảnh, lời kể và video là một hành trình thật. Hãy xem thêm trên Page và TikTok của văn phòng.",
  contactTitle: "Để lại thông tin,<br><span>nhận tư vấn miễn phí</span>",
  contactLead: "Không biết mình phù hợp với thị trường nào? Cứ để lại số điện thoại. Chúng tôi sẽ liên hệ trong giờ làm việc để cùng bạn gỡ từng câu hỏi.",
  officeName: "Chi nhánh Tín Phát Sơn La", address: "Đang cập nhật - Sơn La",
  hours: "Thứ 2 - Thứ 7 · 08:00 - 17:30", legalInfo: "Giấy phép và thông tin doanh nghiệp sẽ cập nhật tại đây",
  legalLead: "Hãy bổ sung giấy phép, tên pháp nhân, địa chỉ chính xác và giờ làm việc trước khi đưa website lên quảng bá."
};
const loginPanel = document.getElementById("login-panel");
const editorPanel = document.getElementById("editor-panel");
const error = document.getElementById("login-error");
const form = document.getElementById("editor-form");
const CONFIG_VERSION = "clear-background-v1";
const storedConfig = JSON.parse(localStorage.getItem("tinphat-config") || "{}");
if (localStorage.getItem("tinphat-config-version") !== CONFIG_VERSION) {
  storedConfig.backgroundBlur = "0";
  storedConfig.overlayOpacity = "0";
  localStorage.setItem("tinphat-config-version", CONFIG_VERSION);
  localStorage.setItem("tinphat-config", JSON.stringify(storedConfig));
}
const savedConfig = { ...configDefaults, ...storedConfig };
const savedContent = { ...contentDefaults, ...JSON.parse(localStorage.getItem("tinphat-content") || "{}") };

function showEditor() { loginPanel.hidden = true; editorPanel.hidden = false; fillForm(); }
if (sessionStorage.getItem("tinphat-admin") === "yes") showEditor();
document.getElementById("login-button").addEventListener("click", () => {
  if (document.getElementById("admin-password").value === ADMIN_PASSWORD) {
    sessionStorage.setItem("tinphat-admin", "yes"); error.textContent = ""; showEditor();
  } else error.textContent = "Mật khẩu chưa đúng.";
});
document.getElementById("logout-button").addEventListener("click", () => {
  sessionStorage.removeItem("tinphat-admin"); editorPanel.hidden = true; loginPanel.hidden = false;
});
function fillForm() {
  Object.entries({ ...savedConfig, ...savedContent }).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
  updateRangeLabels();
}
function updateRangeLabels() {
  document.getElementById("font-output").textContent = `${form.elements.fontSize.value}px`;
  document.getElementById("blur-output").textContent = `${form.elements.backgroundBlur.value}px`;
  document.getElementById("overlay-output").textContent = `${form.elements.overlayOpacity.value}%`;
}
form.elements.fontSize.addEventListener("input", updateRangeLabels);
form.elements.backgroundBlur.addEventListener("input", updateRangeLabels);
form.elements.overlayOpacity.addEventListener("input", updateRangeLabels);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  const configKeys = Object.keys(configDefaults);
  const config = Object.fromEntries(configKeys.map((key) => [key, values[key]]));
  const content = Object.fromEntries(Object.keys(contentDefaults).map((key) => [key, values[key]]));
  localStorage.setItem("tinphat-config", JSON.stringify(config));
  localStorage.setItem("tinphat-config-version", CONFIG_VERSION);
  localStorage.setItem("tinphat-content", JSON.stringify(content));
  document.documentElement.style.setProperty("--blue", config.primaryColor);
  document.documentElement.style.setProperty("--ink", config.textColor);
  document.documentElement.style.setProperty("--font-size", `${config.fontSize}px`);
  document.documentElement.style.setProperty("--background-image", `url("${config.backgroundImage}")`);
  document.documentElement.style.setProperty("--background-blur", `${config.backgroundBlur}px`);
  document.documentElement.style.setProperty("--overlay-opacity", `${Number(config.overlayOpacity) / 100}`);
  document.getElementById("save-status").textContent = "Đã lưu trên trình duyệt này.";
});
document.getElementById("reset-button").addEventListener("click", () => {
  if (!confirm("Khôi phục toàn bộ nội dung mẫu?")) return;
  localStorage.removeItem("tinphat-config"); localStorage.removeItem("tinphat-content"); fillForm();
  document.getElementById("save-status").textContent = "Đã khôi phục nội dung mẫu.";
});
