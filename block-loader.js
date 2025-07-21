// block-loader.js
// Tải block từ Firebase và hiển thị theo user hoặc trang

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://etax-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Xác định ID (user hoặc tên trang)
let blockKey = localStorage.getItem("user") || document.body.dataset.page || "";
if (!blockKey) console.warn("⚠️ Không xác định được blockKey (user hoặc page)!");

// Vùng chèn block động
const container = document.getElementById("dynamic-blocks");
if (!container) console.warn("❌ Thiếu thẻ có id='dynamic-blocks'");

// Hàm hiển thị từng block
function renderBlock(block) {
  const el = document.createElement("div");
  el.style.margin = "1rem 0";

  switch (block.type) {
    case "text":
      el.innerHTML = `<div style='padding:1rem; background:#fff3e0; border-left: 5px solid #fb8c00;'>${block.content}</div>`;
      break;
    case "banner":
      el.innerHTML = `<img src='${block.content}' style='width:100%; border-radius:8px;'>`;
      break;
    case "link":
      el.innerHTML = `<a href='${block.url}' target='_blank' style='display:block; padding:1rem; background:#e3f2fd; border-left: 5px solid #1e88e5; text-decoration:none;'>🔗 ${block.title}</a>`;
      break;
    case "upload":
      el.innerHTML = `<a href='${block.content}' target='_blank' style='display:block; padding:1rem; background:#ede7f6; border-left: 5px solid #7e57c2;'>📄 Xem file PDF</a>`;
      break;
    default:
      el.innerHTML = `<i>❓ Loại block không hỗ trợ</i>`;
  }

  container.appendChild(el);
}

// Tải dữ liệu từ Firebase
async function loadBlocks() {
  if (!blockKey || !container) return;
  const snap = await get(ref(db, "blocks/" + blockKey));
  if (snap.exists()) {
    const blocks = snap.val();
    blocks.forEach(renderBlock);
  } else {
    container.innerHTML = `<div style='padding:1rem; background:#eee;'>⛔ Không có block nào để hiển thị.</div>`;
  }
}

// Gọi hàm chính
loadBlocks();
