import { Component, OnInit } from '@angular/core';
import { NganSachService } from '../service/ngan-sach.service';
import { DanhMucService, DanhMuc } from '../service/danh-muc.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style'
@Component({
  selector: 'app-ngan-sach',
  templateUrl: './ngan-sach.component.html',
  styleUrls: ['./ngan-sach.component.css']
})
export class NganSachComponent implements OnInit {
  nganSachList: any[] = [];
  maNguoiDung: number | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  editNganSach: any = null;
  isEditModalOpen: boolean = false;
  danhMucList: any[] = [];

  isAddModalOpen: boolean = false;
  newNganSach: any = {
    maDanhMuc: '',
    gioiHanTien: 0,
    thang: null,
    nam: new Date().getFullYear()
  };

  selectedLoai: string = 'tatca';
  selectedNam: number | null = null;
  selectedThang: number | null = null;
  selectedDanhMuc: number | null = null;

  constructor(
    private nganSachService: NganSachService,
    private danhMucService: DanhMucService
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.maNguoiDung = user?.maNguoiDung || null;
      } catch (error) {
        console.error('Lỗi parse user từ localStorage', error);
      }
    }

    if (this.maNguoiDung) {
      this.loadNganSach();
      this.layDanhMuc();
    }
  }
  
  loadNganSach(): void {
  if (this.maNguoiDung) {
    this.nganSachService.getNganSachTheoNguoiDung(this.maNguoiDung).subscribe({
      next: (data) => {
        console.log('Dữ liệu ngân sách:', data);
        this.nganSachList = data;
      },
      error: (err) => console.error('Lỗi lấy danh sách ngân sách:', err)
    });
  }
}

  getDanhSachNam(): number[] {
  const namSet = new Set<number>();
  this.nganSachList.forEach(ns => {
    if (ns.nam) namSet.add(ns.nam);
  });
  return Array.from(namSet).sort((a, b) => b - a); // sắp xếp giảm dần
}

  xoaNganSach(maNganSach: number): void {
    if (confirm('Bạn có chắc muốn xóa ngân sách này không?')) {
      this.nganSachService.xoaNganSach(maNganSach).subscribe({
        next: (res) => {
          alert(res.message);
          this.nganSachList = this.nganSachList.filter(item => item.maNganSach !== maNganSach);
          this.loadNganSach();
        },
        error: (err) => alert('Xóa ngân sách thất bại: ' + (err.error?.message || err.message))
      });
    }
  }

  moModalSua(item: any): void {
    const danhMuc = this.danhMucList.find(dm => dm.tenDanhMuc === item.tenDanhMuc);
    this.editNganSach = {
      ...item,
      maDanhMuc: danhMuc?.maDanhMuc || null,
      thang: item.thang ?? null
    };
    this.isEditModalOpen = true;
  }

  capNhatNganSach(): void {
    if (this.editNganSach?.maNganSach) {
      const danhMucObj = this.danhMucList.find(dm => dm.maDanhMuc === this.editNganSach.maDanhMuc);

      const duLieu: any = {
        gioiHanTien: this.editNganSach.gioiHanTien,
        nam: this.editNganSach.nam,
        tenDanhMuc: danhMucObj?.tenDanhMuc || '',
        maNguoiDung: this.maNguoiDung,
        thang: this.editNganSach.thang ?? null
      };

      this.nganSachService.capNhatNganSach(this.editNganSach.maNganSach, duLieu).subscribe({
        next: () => {
          alert('Cập nhật ngân sách thành công');
          this.isEditModalOpen = false;
          this.loadNganSach();
        },
        error: (err) => alert('Lỗi cập nhật ngân sách: ' + (err.error?.message || err.message))
      });
    }
  }

  layDanhMuc(): void {
    this.danhMucService.getDanhMuc().subscribe({
      next: (data) => {
        this.danhMucList = data.sort((a: DanhMuc, b: DanhMuc) => {
          if (a.loai === 'thu' && b.loai === 'chi') return -1;
          if (a.loai === 'chi' && b.loai === 'thu') return 1;
          return 0;
        });
      },
      error: (err) => console.error('Lỗi lấy danh mục:', err)
    });
  }
  
  get filteredNganSachList() {
  return this.nganSachList.filter(item => {
    const matchLoai = this.selectedLoai === 'tatca' || (item.loai && this.selectedLoai && item.loai.toLowerCase() === this.selectedLoai.toLowerCase());
    const matchNam = this.selectedNam == null || item.nam == this.selectedNam;
    const matchThang = this.selectedThang == null || item.thang == this.selectedThang;
    const matchDanhMuc = this.selectedDanhMuc == null || item.tenDanhMuc === this.selectedDanhMuc;

    return matchLoai && matchNam && matchThang && matchDanhMuc;
  });
}

  get totalPages(): number {
    return Math.ceil(this.filteredNganSachList.length / this.itemsPerPage);
  }

  get paginatedNganSachList(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredNganSachList.slice(start, start + this.itemsPerPage);
  }

  getTrangThai(item: any): string {
    const loai = item.loai?.toLowerCase();
    const soTien = Number(item.soTienDaThucHien);
    const gioiHan = Number(item.gioiHanTien);
    if (isNaN(soTien) || isNaN(gioiHan)) return 'Không xác định';

    if (loai === 'thu') return soTien >= gioiHan ? 'Hoàn thành' : 'Đang tiến hành';
    if (loai === 'chi') return soTien <= gioiHan ? 'Trong ngân sách' : 'Vượt quá ngân sách';
    return 'Loại không xác định';
  }

  moModalThem(): void {
    this.newNganSach = {
      maDanhMuc: '',
      gioiHanTien: 0,
      thang: null,
      nam: new Date().getFullYear()
    };
    this.isAddModalOpen = true;
  }

  taoNganSach(): void {
  const danhMuc = this.danhMucList.find(dm => dm.maDanhMuc == this.newNganSach.maDanhMuc);

  const nganSachMoi: any = {
    ...this.newNganSach,
    tenDanhMuc: danhMuc?.tenDanhMuc || '',
    loai: danhMuc?.loai || '',
    maNguoiDung: this.maNguoiDung,
    soTienDaThucHien: 0,
    ngayTao: new Date().toISOString() // ✅ dòng này lấy ngày hiện tại
  };

  if (this.newNganSach.thang != null) {
    nganSachMoi.thang = this.newNganSach.thang;
  }

  if (!nganSachMoi.tenDanhMuc || !nganSachMoi.gioiHanTien || !nganSachMoi.nam || !nganSachMoi.loai) {
    alert('Vui lòng nhập đầy đủ các trường bắt buộc.');
    return;
  }

  this.nganSachService.taoNganSach(nganSachMoi).subscribe({
    next: (res) => {
      alert(res.message || 'Thêm ngân sách thành công!');
      this.isAddModalOpen = false;
      this.loadNganSach();
    },
    error: (err) => alert('Thêm ngân sách thất bại: ' + (err.error?.message || err.message))
  });
}

  xuatExcel(): void {
  const tieuDe = [
    [{
      v: 'Danh sách ngân sách',
      s: {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
        fill: { patternType: 'solid', fgColor: { rgb: '4169E1' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: this.getBorder()
      }
    }, {}, {}, {}, {}, {}, {}, {}, {}] // 9 cột
  ];

  const tieuDeCot = [
    { v: 'Tên danh mục', s: this.tieuDeStyle() },
    { v: 'Loại', s: this.tieuDeStyle() },
    { v: 'Giới hạn tiền', s: this.tieuDeStyle() },
    { v: 'Số tiền đã thực hiện', s: this.tieuDeStyle() },
    { v: 'Số tiền còn lại', s: this.tieuDeStyle() },
    { v: 'Trạng thái', s: this.tieuDeStyle() },
    { v: 'Ngày tạo', s: this.tieuDeStyle() },
    { v: 'Tháng', s: this.tieuDeStyle() },
    { v: 'Năm', s: this.tieuDeStyle() }
  ];

  // DÙNG filteredNganSachList để xuất theo bộ lọc
  const duLieu = this.filteredNganSachList.map(ns => {
    const soTienDaThucHien = Number(ns.soTienDaThucHien) || 0;
    const gioiHanTien = Number(ns.gioiHanTien) || 0;
    const soTienConLai = gioiHanTien - soTienDaThucHien;
    const ngayTaoFormatted = ns.ngayTao ? new Date(ns.ngayTao).toLocaleDateString() : '';

    return [
      { v: ns.tenDanhMuc || '', s: this.oStyle() },
      { v: ns.loai || '', s: this.oStyle() },
      { v: ns.gioiHanTien || '', s: this.oStyle() },
      { v: soTienDaThucHien, s: this.oStyle() },
      { v: soTienConLai, s: this.oStyle() },
      { v: this.getTrangThai(ns), s: this.oStyle() },
      { v: ngayTaoFormatted, s: this.oStyle() },
      { v: ns.thang != null ? ns.thang : '', s: this.oStyle() },
      { v: ns.nam || '', s: this.oStyle() }
    ];
  });

  const worksheetData = [
    ...tieuDe,
    tieuDeCot,
    ...duLieu
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]; // merge 9 cột
  worksheet['!cols'] = [
    { wch: 20 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ngân sách');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, 'danh-sach-ngan-sach.xlsx');
}

  getBorder() {
    return {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    };
  }

  tieuDeStyle() {
  return {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { patternType: 'solid', fgColor: { rgb: '008000' } }, // thêm patternType: 'solid'
    border: this.getBorder(),
    alignment: { horizontal: 'center', vertical: 'center' }
  };
}
  oStyle() {
    return {
      border: this.getBorder(),
      alignment: { vertical: 'center', wrapText: true }
    };
  }

  getAutoColumnWidths(data: any[]): { wch: number }[] {
  const keys = Object.keys(data[0] || {});
  return keys.map((key, index) => {
    const maxLength = data.reduce((max, row) => {
      const cell = row[key];
      const length = cell ? cell.toString().length : 0;
      return Math.max(max, length);
    }, key.length);

    let width = maxLength + 2;

    if (index === 2) { // Cột "Giới hạn tiền"
      width = Math.max(width, 20); // đặt tối thiểu 20 hoặc giá trị bạn muốn
    }

    if (index === 3) { // Cột "Tháng"
      width = Math.max(width, 10);
    }

    return { wch: width };
  });
}

}
