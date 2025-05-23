import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserRegister {
  tenDangNhap: string;
  matKhau: string;
  email?: string;
}
export interface User {
  maNguoiDung: number;
  tenDangNhap: string;
  email: string;
  ngayTao: string;
  role: 0 | 1; 
}
export interface UpdateUserPayload {
  tenDangNhap: string;
  email?: string;
  role: 0 | 1;
}

export interface LoginPayload {
  tenDangNhap: string;
  matKhau: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // URL backend

  constructor(private http: HttpClient) { }

  // Hàm đăng ký user
  register(user: UserRegister): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }
  //Ham check email va ten dang nhap ton tai
  checkUsername(tenDangNhap: string): Observable<{ exists: boolean }> {
  return this.http.get<{ exists: boolean }>(`${this.apiUrl}/users/check-username/${tenDangNhap}`);
  }

// Kiểm tra email tồn tại
  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/users/check-email/${encodeURIComponent(email)}`);
  }
  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  deleteUser(maNguoiDung: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/users/${maNguoiDung}`);
}
  updateUser(id: number, data: UpdateUserPayload): Observable<any> {
  return this.http.put(`${this.apiUrl}/admin/${id}`, data);
}

}
