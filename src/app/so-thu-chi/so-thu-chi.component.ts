import { Component, OnInit } from '@angular/core';
import { GiaoDich, GiaoDichService } from '../service/giao-dich.service';
import { DanhMucService } from '../service/danh-muc.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style'
@Component({
  selector: 'app-so-thu-chi',
  templateUrl: './so-thu-chi.component.html',
  styleUrls: ['./so-thu-chi.component.css']
})
export class SoThuChiComponent implements OnInit {
  danhSachDanhMuc: any[] = [];

  // Dữ liệu gốc
  danhSachGiaoDich: GiaoDich[] = [];

  // Dữ liệu sau khi lọc theo từ khóa
  giaoDichDaLoc: GiaoDich[] = [];

  // Dữ liệu phân trang hiển thị
  giaoDichTheoTrang: GiaoDich[] = [];

  // Phân trang
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Lọc 
  tuKhoaLoc: string = '';
  loaiLoc: string = '';
  ngayLoc: string = '';

  fromDate: string = '';
  toDate: string = '';
  filteredData: any[] = [];
  allData: any[] = [];
  // Modal thêm/sửa
  showAddModal = false;
  showEditModal = false;

  giaoDichMoi: Partial<GiaoDich> = {
    tenDangNhap: '',
    tenDanhMuc: '',
    soTien: undefined,
    ghiChu: '',
    ngayGiaoDich: ''
  };

  giaoDichDangSua: Partial<GiaoDich> = {};

  constructor(
    private giaoDichService: GiaoDichService,
    private danhMucService: DanhMucService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.giaoDichMoi.tenDangNhap = JSON.parse(user).tenDangNhap;
    }
    this.loadDanhMuc();
    this.loadGiaoDich();
  }

  // Lấy danh mục và sắp xếp
  loadDanhMuc() {
    this.danhMucService.getDanhMuc().subscribe({
      next: data => {
        this.danhSachDanhMuc = data.sort((a, b) => {
          if (a.loai === b.loai) return 0;
          return a.loai === 'thu' ? -1 : 1;
        });
      },
      error: err => console.error('Lỗi khi lấy danh mục:', err)
    });
  }

  // Lấy giao dịch theo người dùng
  loadGiaoDich() {
    const user = localStorage.getItem('user');
    if (user) {
      const maNguoiDung = JSON.parse(user).maNguoiDung;
      this.giaoDichService.getGiaoDichTheoNguoiDung(maNguoiDung).subscribe({
        next: data => {
          this.danhSachGiaoDich = data;
          this.applyFilterAndPagination();
        },
        error: err => console.error('Lỗi khi lấy giao dịch:', err)
      });
    }
  }

 applyFilterAndPagination() {
  let ketQua = this.danhSachGiaoDich;

  // Lọc theo loại
  ketQua = this.locTheoLoai(ketQua, this.loaiLoc);

  // ✅ Lọc theo khoảng ngày (fromDate - toDate) — thay thế hoàn toàn lọc theo ngày cụ thể
  if (this.fromDate || this.toDate) {
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    ketQua = ketQua.filter(gd => {
      if (!gd.ngayGiaoDich) return false;
      const ngayGD = new Date(gd.ngayGiaoDich);
      if (isNaN(ngayGD.getTime())) return false;

      // Đặt giờ về đầu ngày để so sánh chính xác
      ngayGD.setHours(0, 0, 0, 0);
      if (from) from.setHours(0, 0, 0, 0);
      if (to) to.setHours(0, 0, 0, 0);

      if (from && to) {
        return ngayGD >= from && ngayGD <= to;
      } else if (from) {
        return ngayGD >= from;
      } else if (to) {
        return ngayGD <= to;
      }
      return true;
    });
  }

  // Lọc theo từ khóa
  const keyword = this.tuKhoaLoc.trim().toLowerCase();
  if (keyword) {
    ketQua = ketQua.filter(gd =>
      gd.tenDanhMuc?.toLowerCase().includes(keyword) ||
      gd.ghiChu?.toLowerCase().includes(keyword) ||
      gd.loai?.toLowerCase().includes(keyword) ||
      (gd.ngayGiaoDich ? new Date(gd.ngayGiaoDich).toLocaleDateString().includes(keyword) : false)
    );
  }

  // Gán danh sách đã lọc
  this.giaoDichDaLoc = ketQua;

  // Tính lại số trang và cập nhật nếu cần
  this.totalPages = Math.ceil(this.giaoDichDaLoc.length / this.pageSize);
  if (this.page > this.totalPages) this.page = this.totalPages || 1;

  // Cập nhật danh sách theo trang
  this.updateGiaoDichTheoTrang();
}


  locTheoLoai(danhSach: GiaoDich[], loai: string): GiaoDich[] {
  if (!loai) return danhSach;
  return danhSach.filter(gd => gd.loai?.toLowerCase() === loai.toLowerCase());
}


  // Cập nhật dữ liệu hiển thị theo trang
  updateGiaoDichTheoTrang() {
    const start = (this.page - 1) * this.pageSize;
    this.giaoDichTheoTrang = this.giaoDichDaLoc.slice(start, start + this.pageSize);
  }

  // Xử lý thay đổi trang (gọi khi user click số trang hoặc nút prev/next)
  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.updateGiaoDichTheoTrang();
  }

  // Bắt sự kiện khi nhập từ khóa lọc (có thể bind trực tiếp trên input)
  onFilterChange() {
    this.page = 1;
    this.applyFilterAndPagination();
  }

  // Thêm giao dịch
  themGiaoDich() {
    if (!this.giaoDichMoi.tenDanhMuc || !this.giaoDichMoi.soTien || !this.giaoDichMoi.ngayGiaoDich) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    this.giaoDichService.createGiaoDich(this.giaoDichMoi as GiaoDich).subscribe({
      next: () => {
        alert('Thêm giao dịch thành công');
        this.closeAddModal();
        this.loadGiaoDich();
        this.page = 1;
      },
      error: err => {
        alert('Lỗi khi thêm giao dịch: ' + (err.error?.message || 'Không xác định'));
      }
    });
  }

  // Xóa giao dịch
  xoaGiaoDich(id: number): void {
    if (!id) {
      alert('ID giao dịch không hợp lệ');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      this.giaoDichService.deleteGiaoDich(id).subscribe({
        next: () => {
          alert('Đã xóa giao dịch');
          this.loadGiaoDich();
        },
        error: err => {
          alert('Xóa thất bại: ' + (err.error?.message || 'Không xác định'));
        }
      });
    }
  }

  // Mở modal thêm
  openAddModal() {
    this.resetGiaoDichMoi();
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  resetGiaoDichMoi() {
    const user = localStorage.getItem('user');
    this.giaoDichMoi = {
      tenDangNhap: user ? JSON.parse(user).tenDangNhap : '',
      tenDanhMuc: '',
      soTien: undefined,
      ghiChu: '',
      ngayGiaoDich: ''
    };
  }

  // Mở modal sửa
  moEditModal(gd: GiaoDich) {
    this.giaoDichDangSua = { ...gd };

    if (this.giaoDichDangSua.ngayGiaoDich) {
      const date = new Date(this.giaoDichDangSua.ngayGiaoDich);
      const yyyy = date.getFullYear();
      const mm = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      this.giaoDichDangSua.ngayGiaoDich = `${yyyy}-${mm}-${dd}`;
    }
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  // Cập nhật giao dịch
  capNhatGiaoDich() {
    if (
      !this.giaoDichDangSua.maGiaoDich ||
      !this.giaoDichDangSua.tenDanhMuc ||
      !this.giaoDichDangSua.soTien ||
      !this.giaoDichDangSua.ngayGiaoDich
    ) {
      alert('Vui lòng nhập đầy đủ thông tin cần thiết.');
      return;
    }

    this.giaoDichService
      .capNhatGiaoDich(this.giaoDichDangSua.maGiaoDich, this.giaoDichDangSua)
      .subscribe({
        next: () => {
          alert('Cập nhật thành công');
          this.closeEditModal();
          this.loadGiaoDich();
        },
        error: err => {
          alert('Lỗi khi cập nhật: ' + (err.error?.message || 'Không xác định'));
        }
      });
  }
  //xuat excel
  getAutoColumnWidths(data: any[]): { wch: number }[] {
  const keys = Object.keys(data[0] || {});
  return keys.map((key, index) => {
    const maxLength = data.reduce((max, row) => {
      const cell = row[key];
      const length = cell ? cell.toString().length : 0;
      return Math.max(max, length);
    }, key.length);

    let width = maxLength + 2; // padding 2 ký tự

    // Tăng độ rộng cột ghi chú (giả sử cột thứ 3)
    if (index === 3) {
      width = Math.max(width, 30); // tối thiểu 30 ký tự rộng
    }

    return { wch: width };
  });
}

  tieuDeStyle() {
  return {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '008000' } }, // royal blue
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    },
    alignment: { horizontal: 'center', vertical: 'center' }
  };
}

oStyle() {
  return {
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    },
    alignment: { vertical: 'center', wrapText: true }
  };
}

  xuatExcel() {
  // Tạo dữ liệu tiêu đề bảng (tên bảng, merge 5 cột)
  const tenBang = [
    [{
      v: 'Danh sách giao dịch',
      s: {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
        fill: { fgColor: { rgb: '4169E1' } }, // royal blue
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }
    }, {}, {}, {}, {}]
  ];

  // Tạo dữ liệu tiêu đề cột
  const tieuDeCot = [
    { v: 'Tên danh mục', s: this.tieuDeStyle() },
    { v: 'Loại', s: this.tieuDeStyle() },
    { v: 'Số tiền', s: this.tieuDeStyle() },
    { v: 'Ghi chú', s: this.tieuDeStyle() },
    { v: 'Ngày giao dịch', s: this.tieuDeStyle() },
  ];

  // Dữ liệu chi tiết
  const duLieu = this.giaoDichDaLoc.map(gd => [
    { v: gd.tenDanhMuc || '', s: this.oStyle() },
    { v: gd.loai || '', s: this.oStyle() },
    { v: gd.soTien || '', s: this.oStyle() },
    { v: gd.ghiChu || '', s: this.oStyle() },
    { v: gd.ngayGiaoDich ? new Date(gd.ngayGiaoDich).toLocaleDateString() : '', s: this.oStyle() },
  ]);

  // Ghép tất cả thành mảng 2 chiều
  const worksheetData = [
    ...tenBang,
    tieuDeCot,
    ...duLieu
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Merge tên bảng trên cùng (A1:E1)
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }
  ];

  // Set độ rộng cột tự động
  const columnWidths = this.getAutoColumnWidths(this.giaoDichDaLoc.length ? this.giaoDichDaLoc : [{
    tenDanhMuc: 'Tên danh mục',
    loai: 'Loại',
    soTien: 'Số tiền',
    ghiChu: 'Ghi chú',
    ngayGiaoDich: 'Ngày giao dịch'
  }]);
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Giao dịch');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'danh-sach-giao-dich.xlsx');
}
}
