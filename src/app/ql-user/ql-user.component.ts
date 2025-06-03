import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../service/users.service'; 

@Component({
  selector: 'app-ql-user',
  templateUrl: './ql-user.component.html',
  styleUrls: ['./ql-user.component.css']
})
export class QlUserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  startDate: string = '';
  endDate: string = '';

  keyword: string = '';
  selectedRole: string = '';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; // hiển thị ban đầu
      },
      error: (err) =>
        console.error('Lỗi khi lấy danh sách người dùng:', err)
    });
  }

  filterUsers(): void {
  const from = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
  const to = this.endDate ? new Date(this.endDate + 'T23:59:59') : null;
  const keywordLower = this.keyword.toLowerCase();

  this.filteredUsers = this.users.filter(user => {
    const createdDate = new Date(user.ngayTao);

    // Lọc theo ngày
    if (from && createdDate < from) return false;
    if (to && createdDate > to) return false;

    // Lọc theo từ khóa
    const matchKeyword = user.tenDangNhap.toLowerCase().includes(keywordLower) ||
                         user.email.toLowerCase().includes(keywordLower);
    if (this.keyword && !matchKeyword) return false;

    // Lọc theo vai trò
    if (this.selectedRole !== '' && String(user.role) !== this.selectedRole) return false;

    return true;
  });
}

  getRoleLabel(role: number): string {
    return role === 0 ? 'Admin' : 'User';
  }

  deleteUser(user: User) {
    if (confirm(`Bạn có chắc muốn xóa người dùng "${user.tenDangNhap}" không?`)) {
      this.userService.deleteUser(user.maNguoiDung).subscribe({
        next: () => {
          alert('Xóa thành công');
          this.loadUsers();
        },
        error: (err) => {
          alert('Lỗi khi xóa người dùng: ' + err.message);
        }
      });
    }
  }

  editingUser: User | null = null;

  editUser(user: User): void {
    this.editingUser = { ...user };
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
        this.loadUsers();
      },
      error: (err) => alert('Lỗi cập nhật: ' + err.message)
    });
  }
}

