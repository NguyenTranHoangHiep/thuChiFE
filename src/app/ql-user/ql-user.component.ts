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

  // Pagination
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  paginatedUsers: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filterUsers(); // Áp dụng lọc và phân trang
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách người dùng:', err);
      }
    });
  }

  filterUsers(): void {
    const from = this.startDate ? new Date(this.startDate + 'T00:00:00') : null;
    const to = this.endDate ? new Date(this.endDate + 'T23:59:59') : null;
    const keywordLower = this.keyword.toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      const createdDate = new Date(user.ngayTao);

      if (from && createdDate < from) return false;
      if (to && createdDate > to) return false;

      const matchKeyword = user.tenDangNhap.toLowerCase().includes(keywordLower) ||
                           user.email.toLowerCase().includes(keywordLower);
      if (this.keyword && !matchKeyword) return false;

      if (this.selectedRole !== '' && String(user.role) !== this.selectedRole) return false;

      return true;
    });

    this.page = 1; // Reset về trang đầu tiên sau khi lọc
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;
    this.page = pageNumber;
    this.updatePaginatedUsers();
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
