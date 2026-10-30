// Thay các giá trị trong CONFIG bằng thông tin thật trước khi đăng website.
const DEFAULT_CONFIG = {
  phone: "0395268824",
  phoneDisplay: "0395268824",
  zalo: "http://zaloapp.com/qr/p/d6b6iunnx6a9",
  facebook: "https://www.facebook.com/share/1DyMQm2soS/",
  tiktok: "https://www.tiktok.com/@tinphatsonlaa?is_from_webapp=1&sender_device=pc",
  // Có thể dùng FormSubmit (miễn phí) hoặc Google Forms. Để trống sẽ mở email dự phòng.
  email: "tinphatsonlaa@gmail.com",
  backgroundImage: "https://i.postimg.cc/0yrxcbkT/Dap-thuy-dien-giua-nui-rung-xanh-tham.png",
  leadsEndpoint: "https://script.google.com/macros/s/AKfycbzeMV5PaLfxBNlc4OGQaW7EilWiXGQPwIJ1IISoC4foqBwUXYTdqM1jv-H-0WUUjOoO/exec",
  mapEmbedUrl: "https://www.google.com/maps?q=21.3213837,103.9211815&output=embed",
  backgroundBlur: "0",
  overlayOpacity: "0"
};
const CONFIG_VERSION = "professional-ui-v1";
const storedConfig = JSON.parse(localStorage.getItem("tinphat-config") || "{}");
if (localStorage.getItem("tinphat-config-version") !== CONFIG_VERSION) {
  storedConfig.backgroundBlur = "0";
  storedConfig.overlayOpacity = "0";
  storedConfig.backgroundImage = DEFAULT_CONFIG.backgroundImage;
  localStorage.setItem("tinphat-config-version", CONFIG_VERSION);
  localStorage.setItem("tinphat-config", JSON.stringify(storedConfig));
}
const CONFIG = { ...DEFAULT_CONFIG, ...storedConfig };
const CONTENT = JSON.parse(localStorage.getItem("tinphat-content") || "{}");
const SLIDES = JSON.parse(localStorage.getItem("tinphat-slides") || "[]");
const visualEditor = new URLSearchParams(location.search).get("visual-editor") === "1";
const visualLayout = JSON.parse(localStorage.getItem("tinphat-visual-layout") || "{}");
document.documentElement.style.setProperty("--background-image", `url("${CONFIG.backgroundImage}")`);
document.documentElement.style.setProperty("--blue", CONFIG.primaryColor || "#0d6efd");
document.documentElement.style.setProperty("--ink", CONFIG.textColor || "#172b4d");
document.documentElement.style.setProperty("--font-size", `${CONFIG.fontSize || 16}px`);
const backgroundBlur = Number(CONFIG.backgroundBlur);
const overlayOpacity = Number(CONFIG.overlayOpacity);
document.documentElement.style.setProperty("--background-blur", `${Number.isFinite(backgroundBlur) ? backgroundBlur : 0}px`);
document.documentElement.style.setProperty("--overlay-opacity", `${Number.isFinite(overlayOpacity) ? overlayOpacity / 100 : 0}`);
document.querySelectorAll("[data-image]").forEach((element) => {
  const imageUrl = String(CONFIG[element.dataset.image] || "").trim();
  if (!imageUrl) return;
  if (element.tagName === "IMG") {
    element.src = imageUrl;
    element.hidden = false;
  } else {
    element.style.backgroundImage = `url("${imageUrl}")`;
    element.classList.add("has-admin-image");
    element.textContent = "";
  }
});
const mapUrl = String(CONFIG.mapEmbedUrl || "").trim();
const mapFrame = document.querySelector("[data-map-frame]");
const map = document.querySelector("[data-map]");
if (mapUrl && mapFrame && map) {
  map.src = mapUrl;
  mapFrame.hidden = false;
}
document.querySelectorAll("[data-edit]").forEach((element) => {
  const key = element.dataset.edit;
  if (CONTENT[key]) element.innerHTML = CONTENT[key];
});
document.querySelectorAll("[data-layout-id]").forEach((section) => {
  const savedHtml = visualLayout[section.dataset.layoutId]?.html;
  const container = section.querySelector(":scope > .container");
  if (savedHtml && container) container.innerHTML = savedHtml;
});
if (Array.isArray(SLIDES) && SLIDES.length) {
  const homepage = document.querySelector("main#top");
  const sections = new Map([...document.querySelectorAll("[data-layout-id]")].map((section) => [section.dataset.layoutId, section]));
  SLIDES.forEach((slide) => {
    const section = sections.get(slide.id);
    if (!section) return;
    homepage?.appendChild(section);
    section.style.color = slide.color || "";
    section.style.backgroundColor = slide.background ? `${slide.background}cc` : "";
    const container = section.querySelector(".container");
    if (container) container.style.maxWidth = `calc(1200px * ${Math.min(100, Math.max(60, Number(slide.width) || 100)) / 100})`;
    const heading = section.querySelector("h1, h2");
    if (heading && slide.title) heading.textContent = slide.title;
    const description = section.querySelector(".hero-lead, .section-heading > p, .center-heading > p, .proof-grid .muted, .contact-copy > p, .legal-copy > p");
    if (description && slide.description) description.textContent = slide.description;
    if (heading && slide.fontSize) heading.style.fontSize = `${slide.fontSize}px`;
  });
}
function enableVisualEditor() {
  if (!visualEditor || sessionStorage.getItem("tinphat-admin") !== "yes") return;
  document.body.classList.add("visual-editor-active");
  const toolbar = document.createElement("div");
  toolbar.className = "visual-toolbar";
  toolbar.innerHTML = '<strong>CHỈNH TRỰC TIẾP</strong><span>Kéo khung nhỏ hoặc bấm chữ để sửa</span><button type="button" data-block-up title="Đưa khung lên">↑</button><button type="button" data-block-down title="Đưa khung xuống">↓</button><button type="button" data-block-duplicate>Nhân bản</button><button type="button" data-block-delete>Xóa</button><button type="button" data-visual-save>Lưu thay đổi</button><button type="button" data-visual-close>Thoát</button>';
  document.body.appendChild(toolbar);
  let selectedBlock = null;
  const blockSelectors = ".hero-grid > *, .market-grid > *, .steps > *, .proof-grid > *, .blog-grid > *, .contact-grid > *, .legal-grid > *";
  const registerBlocks = () => {
    document.querySelectorAll("[data-layout-id]").forEach((section) => {
      [...section.querySelectorAll(blockSelectors)].forEach((block, index) => {
        if (!block.dataset.visualBlock) block.dataset.visualBlock = `${section.dataset.layoutId}-${index}-${Math.random().toString(36).slice(2, 7)}`;
        block.draggable = true;
        block.classList.add("visual-block");
        block.addEventListener("click", (event) => {
          if (event.target.closest("a,button,input,textarea,select")) return;
          selectedBlock = block;
          document.querySelectorAll(".visual-block.visual-selected").forEach((item) => item.classList.remove("visual-selected"));
          block.classList.add("visual-selected");
        });
        block.addEventListener("dragstart", (event) => {
          event.stopPropagation();
          event.dataTransfer.setData("text/visual-block", block.dataset.visualBlock);
          block.classList.add("visual-dragging");
        });
        block.addEventListener("dragend", () => block.classList.remove("visual-dragging"));
        block.addEventListener("dragover", (event) => event.preventDefault());
        block.addEventListener("drop", (event) => {
          const sourceId = event.dataTransfer.getData("text/visual-block");
          const source = document.querySelector(`[data-visual-block="${sourceId}"]`);
          if (!source || source === block || source.parentElement !== block.parentElement) return;
          event.preventDefault();
          event.stopPropagation();
          const siblings = [...block.parentElement.children];
          if (siblings.indexOf(source) < siblings.indexOf(block)) block.after(source);
          else block.before(source);
        });
      });
    });
  };
  registerBlocks();
  const sections = [...document.querySelectorAll("[data-layout-id]")];
  sections.forEach((section) => {
    section.draggable = true;
    section.setAttribute("data-visual-editable", "true");
    section.addEventListener("dragstart", (event) => {
      if (event.target.closest(".visual-block")) return;
      event.dataTransfer.setData("text/plain", section.dataset.layoutId);
      section.classList.add("visual-dragging");
    });
    section.addEventListener("dragend", () => section.classList.remove("visual-dragging"));
    section.addEventListener("dragover", (event) => event.preventDefault());
    section.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceId = event.dataTransfer.getData("text/plain");
      const source = document.querySelector(`[data-layout-id="${sourceId}"]`);
      if (!source || source === section) return;
      const main = document.querySelector("main#top");
      const boxes = [...main.querySelectorAll("[data-layout-id]")];
      if (boxes.indexOf(source) < boxes.indexOf(section)) section.after(source);
      else section.before(source);
    });
  });
  document.querySelectorAll("[data-edit], [data-layout-id] h1, [data-layout-id] h2, [data-layout-id] h3, [data-layout-id] p").forEach((element) => {
    if (element.closest(".visual-toolbar") || element.closest("form")) return;
    element.contentEditable = "true";
    element.spellcheck = true;
  });
  const moveSelected = (direction) => {
    if (!selectedBlock?.parentElement) return;
    const sibling = direction < 0 ? selectedBlock.previousElementSibling : selectedBlock.nextElementSibling;
    if (!sibling || !sibling.classList.contains("visual-block")) return;
    direction < 0 ? sibling.before(selectedBlock) : sibling.after(selectedBlock);
  };
  toolbar.querySelector("[data-block-up]").addEventListener("click", () => moveSelected(-1));
  toolbar.querySelector("[data-block-down]").addEventListener("click", () => moveSelected(1));
  toolbar.querySelector("[data-block-delete]").addEventListener("click", () => {
    if (!selectedBlock) return;
    selectedBlock.hidden = true;
    selectedBlock.dataset.visualDeleted = "true";
    selectedBlock.classList.remove("visual-selected");
    selectedBlock = null;
  });
  toolbar.querySelector("[data-block-duplicate]").addEventListener("click", () => {
    if (!selectedBlock) return;
    const copy = selectedBlock.cloneNode(true);
    copy.dataset.visualBlock = `${selectedBlock.dataset.visualBlock}-copy-${Date.now()}`;
    copy.hidden = false;
    copy.dataset.visualDeleted = "false";
    selectedBlock.after(copy);
    registerBlocks();
    copy.click();
  });
  document.addEventListener("keydown", (event) => {
    if (!selectedBlock || event.target.isContentEditable || event.target.closest("input,textarea,select")) return;
    if (event.key === "Delete") {
      event.preventDefault();
      toolbar.querySelector("[data-block-delete]").click();
    } else if (event.ctrlKey && event.key.toLowerCase() === "d") {
      event.preventDefault();
      toolbar.querySelector("[data-block-duplicate]").click();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelected(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelected(1);
    }
  });
  toolbar.querySelector("[data-visual-save]").addEventListener("click", () => {
    const order = [...document.querySelectorAll("main#top>[data-layout-id]")].map((section) => section.dataset.layoutId);
    const storedSlides = JSON.parse(localStorage.getItem("tinphat-slides") || "[]");
    const orderedSlides = order.map((id) => storedSlides.find((slide) => slide.id === id)).filter(Boolean);
    localStorage.setItem("tinphat-slides", JSON.stringify(orderedSlides));
    const content = JSON.parse(localStorage.getItem("tinphat-content") || "{}");
    document.querySelectorAll("[data-edit]").forEach((element) => { content[element.dataset.edit] = element.innerHTML; });
    localStorage.setItem("tinphat-content", JSON.stringify(content));
    const layout = {};
    document.querySelectorAll("[data-layout-id]").forEach((section) => {
      const container = section.querySelector(":scope > .container");
      layout[section.dataset.layoutId] = {
        html: container?.innerHTML || "",
        order: [...section.querySelectorAll("[data-visual-block]")].map((block) => block.dataset.visualBlock),
        hidden: [...section.querySelectorAll("[data-visual-block][data-visual-deleted=\"true\"]")].map((block) => block.dataset.visualBlock)
      };
    });
    localStorage.setItem("tinphat-visual-layout", JSON.stringify(layout));
    toolbar.firstElementChild.textContent = "ĐÃ LƯU";
  });
  toolbar.querySelector("[data-visual-close]").addEventListener("click", () => {
    location.href = "index.html";
  });
}
enableVisualEditor();

document.querySelectorAll("[data-phone-link]").forEach((link) => {
  link.href = `tel:${CONFIG.phone}`;
});
document.querySelectorAll("[data-phone-text]").forEach((text) => {
  text.textContent = CONFIG.phoneDisplay;
});
document.querySelectorAll("[data-zalo-link]").forEach((link) => {
  link.href = CONFIG.zalo;
});
document.querySelectorAll("[data-facebook-link]").forEach((link) => {
  link.href = CONFIG.facebook;
});
document.querySelectorAll("[data-tiktok-link]").forEach((link) => {
  link.href = CONFIG.tiktok;
});
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const leadForm = document.getElementById("lead-form");
leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const interest = data.get("interest");
  const message = data.get("message");
  const body = `Họ tên: ${name}\nSố điện thoại: ${phone}\nQuan tâm: ${interest}\nLời nhắn: ${message || "(không có)"}`;
  const status = form.querySelector(".form-status");

  const lead = { name, phone, interest, message, createdAt: new Date().toISOString() };
  const localLeads = JSON.parse(localStorage.getItem("tinphat-leads") || "[]");
  localStorage.setItem("tinphat-leads", JSON.stringify([lead, ...localLeads]));
  if (CONFIG.leadsEndpoint) {
    fetch(CONFIG.leadsEndpoint, { method: "POST", mode: "no-cors", body: JSON.stringify(lead) }).catch(() => {});
    status.textContent = "Đã gửi yêu cầu. Chúng tôi sẽ liên hệ sớm!";
    form.reset();
    return;
  }
  if (CONFIG.email && !CONFIG.email.includes("example.com")) {
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Yêu cầu tư vấn mới từ website")}&body=${encodeURIComponent(body)}`;
    status.textContent = "Đã mở ứng dụng email để gửi yêu cầu. Cảm ơn bạn!";
    return;
  }

  navigator.clipboard?.writeText(body);
  status.textContent = "Đã ghi nhận thông tin trên trình duyệt. Vui lòng bấm Gọi/Zalo để được phản hồi nhanh hơn.";
  form.reset();
});
document.querySelectorAll(".section,.contact-section,.legal-section").forEach((section) => section.classList.add("reveal"));
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
