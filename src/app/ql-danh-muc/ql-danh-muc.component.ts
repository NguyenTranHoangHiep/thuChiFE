import { Component, OnInit } from '@angular/core';
import { DanhMucService, DanhMuc } from '../service/danh-muc.service';

@Component({
  selector: 'app-ql-danh-muc',
  templateUrl: './ql-danh-muc.component.html',
  styleUrls: ['./ql-danh-muc.component.css']
})
export class QlDanhMucComponent implements OnInit {
  danhMucList: DanhMuc[] = [];

  // Thêm biến hiển thị popup thêm/sửa
  showAddModal = false;
  showEditModal = false;

  // Dữ liệu danh mục mới để thêm
  newDanhMuc: Omit<DanhMuc, 'maDanhMuc'> = {
    tenDanhMuc: '',
    loai: 'thu'
  };

  // Dữ liệu danh mục đang sửa
  editingDanhMuc: DanhMuc | null = null;

  // Lọc dữ liệu
  private _filterTenDanhMuc: string = '';
  private _filterLoai: 'all' | 'thu' | 'chi' = 'all';

  get filterTenDanhMuc(): string {
    return this._filterTenDanhMuc;
  }
  set filterTenDanhMuc(value: string) {
    this._filterTenDanhMuc = value;
    this.page = 1; // reset trang khi lọc
  }

  get filterLoai(): 'all' | 'thu' | 'chi' {
    return this._filterLoai;
  }
  set filterLoai(value: 'all' | 'thu' | 'chi') {
    this._filterLoai = value;
    this.page = 1; // reset trang khi lọc
  }

  // Phân trang
  page: number = 1;
  itemsPerPage: number = 5;

  constructor(private danhMucService: DanhMucService) {}

  ngOnInit(): void {
    this.loadDanhMuc();
  }

  loadDanhMuc(): void {
    this.danhMucService.getDanhMuc().subscribe({
      next: (data) => this.danhMucList = data,
      error: (err) => console.error('Lỗi khi lấy danh mục:', err)
    });
  }

  // Thêm danh mục
  openAddModal(): void {
    this.newDanhMuc = { tenDanhMuc: '', loai: 'thu' };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addDanhMuc(): void {
    if (!this.newDanhMuc.tenDanhMuc || !this.newDanhMuc.loai) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.danhMucService.createDanhMuc(this.newDanhMuc).subscribe({
      next: () => {
        this.loadDanhMuc();
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Lỗi khi thêm danh mục:', err);
        alert('Không thể thêm danh mục');
      }
    });
  }

  // Sửa danh mục
  openEditModal(danhMuc: DanhMuc): void {
    this.editingDanhMuc = { ...danhMuc };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingDanhMuc = null;
  }

  updateDanhMuc(): void {
    if (!this.editingDanhMuc) return;

    if (!this.editingDanhMuc.tenDanhMuc || !this.editingDanhMuc.loai) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.danhMucService.updateDanhMuc(this.editingDanhMuc.maDanhMuc, {
      tenDanhMuc: this.editingDanhMuc.tenDanhMuc,
      loai: this.editingDanhMuc.loai
    }).subscribe({
      next: () => {
        this.loadDanhMuc();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật danh mục:', err);
        alert('Không thể cập nhật danh mục');
      }
    });
  }

  // Danh sách lọc và phân trang
  get filteredDanhMucList(): DanhMuc[] {
    const filtered = this.danhMucList.filter(dm => {
      const matchTen = dm.tenDanhMuc.toLowerCase().includes(this.filterTenDanhMuc.toLowerCase());
      const matchLoai = this.filterLoai === 'all' || dm.loai === this.filterLoai;
      return matchTen && matchLoai;
    });

    const start = (this.page - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    const filtered = this.danhMucList.filter(dm => {
      const matchTen = dm.tenDanhMuc.toLowerCase().includes(this.filterTenDanhMuc.toLowerCase());
      const matchLoai = this.filterLoai === 'all' || dm.loai === this.filterLoai;
      return matchTen && matchLoai;
    });
    return Math.ceil(filtered.length / this.itemsPerPage);
  }
}
