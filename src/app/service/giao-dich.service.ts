import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GiaoDich {
  maGiaoDich: number;
  tenDangNhap: string;
  tenDanhMuc: string;
  soTien: number;
  loai: string;
  ngayGiaoDich: string;
  ngayTao: string;
  ghiChu?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GiaoDichService {
  private API = 'http://localhost:5000/giaodich'; // Thay bằng URL thực tế nếu khác

  constructor(private http: HttpClient) {}

  // Lấy danh sách giao dịch theo người dùng
  getGiaoDichTheoNguoiDung(maNguoiDung: number): Observable<GiaoDich[]> {
    return this.http.get<GiaoDich[]>(`${this.API}?maNguoiDung=${maNguoiDung}`);
  }

  // Tạo giao dịch mới
  createGiaoDich(giaoDich: GiaoDich): Observable<any> {
    return this.http.post(this.API, giaoDich);
  }

  // ✅ Xóa giao dịch theo ID
  deleteGiaoDich(maGiaoDich: number): Observable<any> {
    return this.http.delete(`${this.API}/${maGiaoDich}`);
  }
  //cap nhat giao dich
  capNhatGiaoDich(maGiaoDich: number, duLieu: any): Observable<any> {
  return this.http.put(`${this.API}/${maGiaoDich}`, duLieu);
}
  // thong ke nguoi dung thu chi
  layThongKeThuChi(maNguoiDung: number): Observable<{ tongThu: number, tongChi: number }> {
  return this.http.get<{ tongThu: number, tongChi: number }>(`${this.API}/thongke/${maNguoiDung}`);
  }
  // Thống kê phần trăm thu theo danh mục (Pie Chart)
  layThongKeThuTheoDanhMuc(maNguoiDung: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.API}/thu-theo-danh-muc/${maNguoiDung}`);
}
  // Thống kê phần trăm chi theo danh mục (Doughnut Chart)
  layThongKeChiTheoDanhMuc(maNguoiDung: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.API}/chi-theo-danh-muc/${maNguoiDung}`);
}
  // Thống kê thu chi theo tháng (Biểu đồ cột + đường)
  layThongKeTheoThang(maNguoiDung: number, year: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.API}/thongke-thang/${maNguoiDung}`, {
    params: { year: year.toString() }
  });
}
//                             ADMIN
   // Thống kê toàn hệ thống cho admin (tổng thu, tổng chi, tiền tiết kiệm)
layThongKeToanBoHeThong(): Observable<{
  tongThuAll: number;
  tongChiAll: number;
  tienTietKiemAll: number;
}> {
  return this.http.get<{
    tongThuAll: number;
    tongChiAll: number;
    tienTietKiemAll: number;
  }>('http://localhost:5000/admin/thongkeAdmin');
}
// Thống kê phần trăm thu theo danh mục cho toàn hệ thống (Admin)
layThongKeThuTheoDanhMucToanHeThong(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:5000/admin/thu-theo-danh-muc');
}
// Thống kê phần trăm chi theo danh mục cho toàn hệ thống (Admin)
layThongKeChiTheoDanhMucToanHeThong(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:5000/admin/chi-theo-danh-muc');
}
// Thống kê thu chi theo tháng cho toàn hệ thống (Admin)
layThongKeTheoThangToanHeThong(nam: number): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:5000/admin/thongke-thang-he-thong', {
    params: { year: nam.toString() }
  });
}
}
