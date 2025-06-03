import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface NganSachData {
  tenDangNhap: string;
  tenDanhMuc: string;
  gioiHanTien: number;
  thang?: number;
  nam: number;
}
@Injectable({
  providedIn: 'root'
})
export class NganSachService {
  private apiUrl = 'http://localhost:7000/ngansach';

  constructor(private http: HttpClient) {}

  // Gọi đúng route có param :id
  getNganSachTheoNguoiDung(maNguoiDung: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/thongke/${maNguoiDung}`);
  }
  xoaNganSach(maNganSach: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${maNganSach}`);
  }
  capNhatNganSach(maNganSach: number, duLieu: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${maNganSach}`, duLieu);
  }
  taoNganSach(nganSachData: NganSachData): Observable<any> {
    return this.http.post(this.apiUrl, nganSachData);
  }
}
