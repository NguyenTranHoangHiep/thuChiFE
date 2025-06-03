import { Component } from '@angular/core';
import { UserService } from '../service/users.service';

@Component({
  selector: 'app-dang-ky',
  templateUrl: './dang-ky.component.html',
  styleUrls: ['./dang-ky.component.css']
})
export class DangKyComponent {
  tenDangNhap = '';
  matKhau = '';
  nhapLaiMatKhau = '';
  email = '';
  message = '';

  constructor(private userService: UserService) {}

  dangKy() {
    if (!this.tenDangNhap || !this.matKhau) {
      this.message = 'Tên đăng nhập và mật khẩu không được để trống';
      return;
    }

    if (this.matKhau !== this.nhapLaiMatKhau) {
      this.message = 'Mật khẩu nhập lại không khớp';
      return;
    }

    // Check username tồn tại
    this.userService.checkUsername(this.tenDangNhap).subscribe({
      next: (resUsername) => {
        if (resUsername.exists) {
          this.message = 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.';
          return;
        }

        // Nếu có email thì check email tồn tại
        if (this.email) {
          this.userService.checkEmail(this.email).subscribe({
            next: (resEmail) => {
              if (resEmail.exists) {
                this.message = 'Email đã được sử dụng. Vui lòng dùng email khác.';
                return;
              }

              // Nếu username và email đều OK, gọi API đăng ký
              this.dangKyThucSu();

            },
            error: (err) => {
              this.message = 'Lỗi kiểm tra email: ' + (err.error?.message || err.message);
            }
          });
        } else {
          // Nếu không nhập email thì bỏ qua bước check email
          this.dangKyThucSu();
        }
      },
      error: (err) => {
        this.message = 'Lỗi kiểm tra tên đăng nhập: ' + (err.error?.message || err.message);
      }
    });
  }

  private dangKyThucSu() {
    this.userService.register({
      tenDangNhap: this.tenDangNhap,
      matKhau: this.matKhau,
      email: this.email || undefined
    }).subscribe({
      next: (res) => {
        this.message = 'Đăng ký thành công';
        // Xóa form sau khi đăng ký
        this.tenDangNhap = this.matKhau = this.nhapLaiMatKhau = this.email = '';
      },
      error: (err) => {
        this.message = 'Lỗi đăng ký: ' + (err.error?.message || err.message);
      }
    });
  }
}
