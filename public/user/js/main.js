document.getElementById("loginBtn").addEventListener("click", function () {
  const username = document.getElementById("tax-id").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "123456") {
    window.location.href = "home.html";
  } else {
    alert("Sai tài khoản hoặc mật khẩu.");
  }
});
