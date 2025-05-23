import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trang-chu',
  templateUrl: './trang-chu.component.html'
})
export class TrangChuComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('user');

    if (!isLoggedIn) {
      this.router.navigate(['/dangNhap']);
    }
  }

  dangXuat(): void {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('user');
    // Chuyển hướng về trang đăng nhập
    this.router.navigate(['/dangNhap']);
  }
}
