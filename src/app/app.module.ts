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

@NgModule({
  declarations: [
    AppComponent,
    DangKyComponent,
    DangNhapComponent,
    TrangChuComponent,
    QlUserComponent,
    QlDanhMucComponent,
    ThongkeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
