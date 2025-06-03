import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DangKyComponent } from './dang-ky/dang-ky.component';

// Thêm dòng này:
import { FormsModule } from '@angular/forms';
import { DangNhapComponent } from './dang-nhap/dang-nhap.component';
import { TrangChuComponent } from './trang-chu/trang-chu.component';
import { QlUserComponent } from './ql-user/ql-user.component';
import { QlDanhMucComponent } from './ql-danh-muc/ql-danh-muc.component';
import { ThongkeComponent } from './thongke/thongke.component';
import { TrangChuUsersComponent } from './trang-chu-users/trang-chu-users.component';
import { SoThuChiComponent } from './so-thu-chi/so-thu-chi.component';
import { ThongkeUsersComponent } from './thongke-users/thongke-users.component';
import { NgChartsModule } from 'ng2-charts';
import { NganSachComponent } from './ngan-sach/ngan-sach.component';
@NgModule({
  declarations: [
    AppComponent,
    DangKyComponent,
    DangNhapComponent,
    TrangChuComponent,
    QlUserComponent,
    QlDanhMucComponent,
    ThongkeComponent,
    TrangChuUsersComponent,
    SoThuChiComponent,
    ThongkeUsersComponent,
    NganSachComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
