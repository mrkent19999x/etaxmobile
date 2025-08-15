import { auth, db } from "/shared/js/firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (s)=>document.querySelector(s);

// Auto-fill MST from URL parameter
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mstParam = urlParams.get('mst');
  if (mstParam) {
    $("#mst").value = mstParam;
    $("#pass").focus(); // Focus on password field
  }
};

// Support both MST login and Email login  
$("#btnLogin").onclick = async ()=>{
  const loginValue = $("#mst").value.trim();
  const pass = $("#pass").value;
  
  if(!loginValue || !pass){ 
    alert("Nhập MST/Email và mật khẩu"); 
    return; 
  }
  
  try{
    let email = '';
    let mst = '';
    
    // Check if input looks like email
    if(loginValue.includes('@')) {
      email = loginValue;
      // Get MST from Firestore by email
      // This is a simplified approach - in production you'd need better user lookup
    } else {
      // Input is MST - check if user exists in Firestore
      mst = loginValue;
      const userDoc = await getDoc(doc(db, "users", mst));
      
      if (!userDoc.exists()) {
        alert(`❌ MST ${mst} chưa được đăng ký trong hệ thống!\n\nVui lòng liên hệ admin để tạo tài khoản.`);
        return;
      }
      
      const userData = userDoc.data();
      email = userData.login_email || userData.email;
      
      if (!email) {
        alert(`❌ MST ${mst} chưa có email đăng ký!\n\nVui lòng liên hệ admin để cập nhật email.`);
        return;
      }
      
      // Check if account can login
      if (!userData.can_login) {
        alert(`❌ Tài khoản MST ${mst} chưa được kích hoạt đăng nhập!\n\nVui lòng liên hệ admin.`);
        return;
      }
    }
    
    // Try Firebase Auth login with email
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    
    // Get user data from Firestore
    if (!mst) {
      // If logged in with email, find MST
      // This is simplified - you might need to query users collection
      mst = loginValue.replace('@', '').replace(/\./g, ''); // Basic extraction
    }
    
    // Store login info
    localStorage.setItem("mst", mst);
    localStorage.setItem("email", email);
    localStorage.setItem("loginTime", new Date().toISOString());
    
    alert(`✅ Đăng nhập thành công!\nMST: ${mst}\nEmail: ${email}`);
    location.href = "/user/index.html";
    
  } catch(e) {
    console.error("Login error:", e);
    
    let errorMsg = "Đăng nhập thất bại: ";
    
    if (e.code === 'auth/user-not-found') {
      errorMsg += "Tài khoản không tồn tại. Vui lòng liên hệ admin để tạo tài khoản.";
    } else if (e.code === 'auth/wrong-password') {
      errorMsg += "Mật khẩu không đúng.";
    } else if (e.code === 'auth/invalid-email') {
      errorMsg += "Email không hợp lệ.";
    } else {
      errorMsg += e.message;
    }
    
    alert(`❌ ${errorMsg}\n\n💡 Gợi ý:\n- Kiểm tra lại MST/Email và mật khẩu\n- Liên hệ admin nếu chưa có tài khoản`);
  }
};