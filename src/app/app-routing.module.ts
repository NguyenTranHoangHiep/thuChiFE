import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DangKyComponent } from './dang-ky/dang-ky.component';
import { DangNhapComponent } from './dang-nhap/dang-nhap.component';
import { TrangChuComponent } from './trang-chu/trang-chu.component';
import { QlUserComponent } from './ql-user/ql-user.component';
import { QlDanhMucComponent } from './ql-danh-muc/ql-danh-muc.component';
import { ThongkeComponent } from './thongke/thongke.component';

const routes: Routes = [
  { path: '', redirectTo: '/dangNhap', pathMatch: 'full' },
  { path: 'dangKy', component: DangKyComponent },
  { path: 'dangNhap', component: DangNhapComponent },
  {
    path: 'trangChu',
    component: TrangChuComponent,
    children: [
      {path:'qlUser',component: QlUserComponent},
      {path:'qlDanhMuc',component: QlDanhMucComponent},
      {path:'thongKe', component: ThongkeComponent},
      { path: '', redirectTo: 'trangChu', pathMatch: 'full' } // Redirect to 'ban' by default under 'trangchu'
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
