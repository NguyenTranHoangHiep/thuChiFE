import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DangKyComponent } from './dang-ky/dang-ky.component';
import { DangNhapComponent } from './dang-nhap/dang-nhap.component';
import { TrangChuComponent } from './trang-chu/trang-chu.component';
import { QlUserComponent } from './ql-user/ql-user.component';
import { QlDanhMucComponent } from './ql-danh-muc/ql-danh-muc.component';
import { ThongkeComponent } from './thongke/thongke.component';
import { TrangChuUsersComponent } from './trang-chu-users/trang-chu-users.component';
import { SoThuChiComponent } from './so-thu-chi/so-thu-chi.component';
import { ThongkeUsersComponent } from './thongke-users/thongke-users.component';
import { NganSachComponent } from './ngan-sach/ngan-sach.component';

const routes: Routes = [
  { path: '', redirectTo: '/dangNhap', pathMatch: 'full' },
  { path: 'dangKy', component: DangKyComponent },
  { path: 'dangNhap', component: DangNhapComponent },
  { path: 'trangChuUsers', component: TrangChuUsersComponent },
  {
    path: 'trangChuUsers',
    component: TrangChuUsersComponent,
    children: [
      {path:'soThuChi',component: SoThuChiComponent},
      {path:'thongKeUsers',component: ThongkeUsersComponent},
      {path:'nganSach',component:NganSachComponent},
      { path: '', redirectTo: 'trangChuUsers', pathMatch: 'full' }
    ]
  },

  {
    path: 'trangChu',
    component: TrangChuComponent,
    children: [
      {path:'qlUser',component: QlUserComponent},
      {path:'qlDanhMuc',component: QlDanhMucComponent},
      {path:'thongKe', component: ThongkeComponent},
      { path: '', redirectTo: 'qlUser', pathMatch: 'full' } 
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
