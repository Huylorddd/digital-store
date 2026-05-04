
document.addEventListener("DOMContentLoaded", function () {

    // --- 1. XỬ LÝ HIỆU ỨNG ACCORDION CHO SIDEBAR (Đóng/Mở danh mục) ---
    const sidebarHeaders = document.querySelectorAll('.sidebar-header');

    sidebarHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const currentItem = this.parentElement;
            const isActive = currentItem.classList.contains('active');

            // Thu gọn tất cả các mục khác trước
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
            });

            // Nếu mục vừa bấm đang đóng thì mở nó ra
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // --- 2. XỬ LÝ MENU MOBILE & OVERLAY (Cho nút "Danh mục" ở các trang) ---
    const btnMenu = document.getElementById("btnMenu");
    const overlay = document.getElementById("overlay");
    const mobileSidebar = document.getElementById("mobileSidebar"); 

    if (btnMenu && overlay) {
        btnMenu.addEventListener("click", function () {
            overlay.classList.toggle("active");
            if (mobileSidebar) mobileSidebar.classList.toggle("active");
        });

        overlay.addEventListener("click", function () {
            overlay.classList.remove("active");
            if (mobileSidebar) mobileSidebar.classList.remove("active");
        });
    }

    // --- 3. KIỂM TRA DỮ LIỆU ĐĂNG NHẬP / ĐĂNG KÝ ---
    
    // Biểu thức chính quy (Regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; 
    const nameRegex = /^(\p{Lu}\p{Ll}*\s?)+$/u;     // Lu : chữ hoa unicode, Ll: chữ thường unicod, Unicode hỗ trợ tên Việt
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; 

    // Xử lý Đăng nhập
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', function(e) {
            e.preventDefault(); 

            document.getElementById('loginError').style.display = 'none';

            let email = document.getElementById('loginEmail').value.trim();
            let pass = document.getElementById('loginPass').value;

            if (emailRegex.test(email) == false) {
                document.getElementById('loginError').innerText = "Email không đúng định dạng!";
                document.getElementById('loginError').style.display = 'block';
                return; 
            }
            if (pass === '') {
                document.getElementById('loginError').innerText = "Vui lòng nhập mật khẩu!";
                document.getElementById('loginError').style.display = 'block';
                return;
            }

            alert("Đăng nhập thành công!");
            document.querySelector('#authModal .btn-close').click();
        });
    }

    // Xử lý Đăng ký
    const btnSignup = document.getElementById('btnSignup');
    if (btnSignup) {
        btnSignup.addEventListener('click', function(e) {
            e.preventDefault();

            document.getElementById('signupError').style.display = 'none';

            let name = document.getElementById('regName').value.trim();
            let email = document.getElementById('regEmail').value.trim();
            let pass = document.getElementById('regPass').value;

            if (nameRegex.test(name) == false) {
                document.getElementById('signupError').innerText = "Họ tên chỉ được chứa chữ cái!";
                document.getElementById('signupError').style.display = 'block';
                return;
            }
            if (emailRegex.test(email) == false) {
                document.getElementById('signupError').innerText = "Email không đúng định dạng!";
                document.getElementById('signupError').style.display = 'block';
                return;
            }
            if (passRegex.test(pass) == false) {
                document.getElementById('signupError').innerText = "Mật khẩu phải từ 8 ký tự, gồm chữ hoa, chữ thường và số!";
                document.getElementById('signupError').style.display = 'block';
                return;
            }

            alert("Đăng ký thành công!");
            
            document.querySelector('#authModal .btn-close').click();

            document.getElementById('regName').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPass').value = '';
        });
    }
});