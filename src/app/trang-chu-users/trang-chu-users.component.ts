import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trang-chu-users',
  templateUrl: './trang-chu-users.component.html',
  styleUrls: ['./trang-chu-users.component.css']
})
export class TrangChuUsersComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('user');

    if (!isLoggedIn) {
      this.router.navigate(['/dangNhap']);
    }
  }

  dangXuat(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/dangNhap']);
  }
}
