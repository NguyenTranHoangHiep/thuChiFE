import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface mô tả danh mục (có thể sửa theo cấu trúc thật)
export interface DanhMuc {
  maDanhMuc: number;
  tenDanhMuc: string;
  loai: 'thu' | 'chi';
}

@Injectable({
  providedIn: 'root'
})
export class DanhMucService {

  private apiUrl = 'http://localhost:4000/danhmuc'; // URL API backend

  constructor(private http: HttpClient) { }

  getDanhMuc(): Observable<DanhMuc[]> {
    return this.http.get<DanhMuc[]>(this.apiUrl);
  }
  createDanhMuc(danhMuc: Omit<DanhMuc, 'maDanhMuc'>): Observable<any> {
  return this.http.post(this.apiUrl, danhMuc);
}
   updateDanhMuc(maDanhMuc: number, danhMuc: Omit<DanhMuc, 'maDanhMuc'>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${maDanhMuc}`, danhMuc);
  }
}
