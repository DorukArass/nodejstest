// admin.js

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Kullanıcı adı ve parolayı sunucuya gönder
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Giriş başarılı, yönlendirme yapabilirsiniz
        window.location.href = '/admin/dashboard'; // Örneğin, admin paneline yönlendir
      } else {
        // Giriş başarısız, hata mesajını gösterin
        console.error('Giriş başarısız.');
      }
    }
  };

  const data = JSON.stringify({ username, password });
  xhr.send(data);
});
