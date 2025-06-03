import { Component } from '@angular/core';
import { UserService } from '../service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dang-nhap',
  templateUrl: './dang-nhap.component.html',
  styleUrls: ['./dang-nhap.component.css']
})
export class DangNhapComponent {
  tenDangNhap: string = '';
  matKhau: string = '';
  message: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  dangNhap() {
  this.userService.login({
    tenDangNhap: this.tenDangNhap,
    matKhau: this.matKhau
  }).subscribe({
    next: (res) => {
      console.log('User login response:', res);
      // Lưu trạng thái đăng nhập
      localStorage.setItem('user', JSON.stringify(res.user));

      this.message = 'Đăng nhập thành công';
      
      if (res.user.role === 1) {
        this.router.navigate(['/trangChuUsers/soThuChi']);
      } else {
        this.router.navigate(['/trangChu']);
      }
    },
    error: (err) => {
      this.message = 'Tên đăng nhập hoặc mật khẩu sai';
    }
  });
}
}
