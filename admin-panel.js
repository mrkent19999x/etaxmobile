// Cấu hình Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase, ref, set, push, get, remove, child
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getAuth, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_rJgBFgBulheVenQUE2KXr4PBpSpTCxw",
  authDomain: "etax-7fbf8.firebaseapp.com",
  databaseURL: "https://etax-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "etax-7fbf8",
  storageBucket: "etax-7fbf8.firebasestorage.app",
  messagingSenderId: "1030026724634",
  appId: "1:1030026724634:web:d76f5f9dad43bad6fd58a3",
  measurementId: "G-YS5DLECJE6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Tạo user mới
window.createUser = async function () {
  const id = document.getElementById('user-id').value.trim();
  const password = document.getElementById('user-password').value.trim();
  const role = document.getElementById('user-role').value;
  const token = document.getElementById('user-token').value.trim();
  const days = parseInt(document.getElementById('token-days').value);
  if (!id || !password || !token || !days) return alert('Điền đầy đủ thông tin!');

  const email = `${id}@etax.vn`;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const now = Date.now();
    const expireAt = now + days * 24 * 60 * 60 * 1000;

    await set(ref(db, 'users/' + uid), {
      id, role, email
    });
    await set(ref(db, 'tokens/' + token), {
      uid, createdAt: now, expireAt
    });
    alert('Đã tạo tài khoản!');
    loadUsers();
  } catch (e) {
    alert('Lỗi tạo user: ' + e.message);
  }
};

// Load danh sách user
async function loadUsers() {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    for (let uid in data) {
      const user = data[uid];
      const tokenSnap = await get(ref(db, 'tokens'));
      let userToken = '', expireText = '-';
      if (tokenSnap.exists()) {
        const tokens = tokenSnap.val();
        for (let key in tokens) {
          if (tokens[key].uid === uid) {
            userToken = key;
            const date = new Date(tokens[key].expireAt);
            expireText = date.toLocaleDateString();
          }
        }
      }
      const row = `
        <tr>
          <td>${user.id}</td>
          <td>${user.role}</td>
          <td>${userToken}</td>
          <td>${expireText}</td>
          <td><button onclick="deleteUser('${uid}')">Xoá</button></td>
        </tr>
      `;
      userList.innerHTML += row;
    }
  }
}

// Xoá user (tạm thời chỉ xoá DB)
window.deleteUser = async function (uid) {
  if (!confirm('Xoá người dùng này?')) return;
  await remove(ref(db, 'users/' + uid));
  const tokenSnap = await get(ref(db, 'tokens'));
  if (tokenSnap.exists()) {
    const tokens = tokenSnap.val();
    for (let key in tokens) {
      if (tokens[key].uid === uid) {
        await remove(ref(db, 'tokens/' + key));
      }
    }
  }
  loadUsers();
};

// Tải ban đầu
loadUsers();
<script>
  const firebaseConfig = {
    apiKey: "AIzaSyD_rJgBFgBulheVenQUE2KXr4PBpSpTCxw",
    authDomain: "etax-7fbf8.firebaseapp.com",
    databaseURL: "https://etax-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "etax-7fbf8",
    storageBucket: "etax-7fbf8.firebasestorage.app",
    messagingSenderId: "1030026724634",
    appId: "1:1030026724634:web:d76f5f9dad43bad6fd58a3",
    measurementId: "G-YS5DLECJE6"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const auth = firebase.auth();

  async function createUser() {
    const id = document.getElementById("user-id").value.trim();
    const name = document.getElementById("user-name").value.trim();
    const pw = document.getElementById("user-password").value;
    const role = document.getElementById("user-role").value;
    const token = document.getElementById("user-token").value;
    const days = parseInt(document.getElementById("token-days").value);
    const now = Date.now();
    const expires = now + days * 86400000;

    if (!id || !pw || !token || !name) return alert("Vui lòng nhập đầy đủ thông tin.");

    try {
      await auth.createUserWithEmailAndPassword(id + "@etax.vn", pw);
      await db.ref("users/" + id).set({ role, name, created_at: now });
      await db.ref("tokens/" + token).set({ valid: true, expires_at: expires });

      const noticeId = now;
      const noticeCode = `${id}/2025/TB-TĐT`;
      const transactionCode = Math.floor(Math.random() * 1e14).toString().padStart(14, '0');
      const content = `Người nộp thuế đã đăng ký thành công tài khoản giao dịch điện tử. Mã giao dịch: ${transactionCode}. Tài khoản: ${id}, Mật khẩu: ${pw}`;

      await db.ref(`notifications/${id}/${noticeId}`).set({
        title: "V/v: Tài khoản giao dịch thuế điện tử",
        code: noticeCode,
        transactionCode,
        created_at: now,
        content
      });

      alert("✅ Tạo tài khoản và thông báo thành công");
      location.reload();
    } catch (e) {
      alert("Lỗi tạo user: " + e.message);
    }
  }

  window.onload = function loadUsers() {
    db.ref("users").once("value", (snapshot) => {
      const tbody = document.getElementById("user-list");
      tbody.innerHTML = "";
      snapshot.forEach(child => {
        const id = child.key;
        const val = child.val();
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${id}</td>
          <td>${val.name || ""}</td>
          <td>${val.role || ""}</td>
          <td>${val.created_at ? new Date(val.created_at).toLocaleDateString() : "-"}</td>
          <td><button onclick="deleteUser('${id}')">Xoá</button></td>
        `;
        tbody.appendChild(row);
      });
    });
  };

  function deleteUser(id) {
    if (confirm("Xoá tài khoản " + id + "?")) {
      db.ref("users/" + id).remove().then(() => location.reload());
    }
  }
</script>

