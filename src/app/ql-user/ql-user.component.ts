import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../service/users.service'; 

@Component({
  selector: 'app-ql-user',
  templateUrl: './ql-user.component.html',
  styleUrls: ['./ql-user.component.css']
})
export class QlUserComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Lỗi khi lấy danh sách người dùng:', err)
    });
  }

  // Hàm hiển thị vai trò dưới dạng chữ
  getRoleLabel(role: number): string {
    return role === 0 ? 'Admin' : 'User';
  }

  deleteUser(user: User) {
    if (confirm(`Bạn có chắc muốn xóa người dùng "${user.tenDangNhap}" không?`)) {
      this.userService.deleteUser(user.maNguoiDung).subscribe({
        next: () => {
          alert('Xóa thành công');
          this.loadUsers(); // tải lại danh sách sau khi xóa
        },
        error: (err) => {
          alert('Lỗi khi xóa người dùng: ' + err.message);
        }
      });
    }
  }
  editingUser: User | null = null;

  editUser(user: User): void {
    this.editingUser = { ...user }; // Tạo bản sao để không ảnh hưởng trực tiếp
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  saveUser(): void {
    if (!this.editingUser) return;
    const { maNguoiDung, tenDangNhap, email, role } = this.editingUser;
    this.userService.updateUser(maNguoiDung, { tenDangNhap, email, role }).subscribe({
      next: () => {
        alert('Cập nhật thành công');
        this.editingUser = null;
        this.loadUsers(); // reload danh sách
      },
      error: (err) => alert('Lỗi cập nhật: ' + err.message)
    });
  }
}
