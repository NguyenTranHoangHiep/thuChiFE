import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService, User } from '../service/users.service';
import { DanhMucService, DanhMuc } from '../service/danh-muc.service';
import { GiaoDichService } from '../service/giao-dich.service';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-thongke',
  templateUrl: './thongke.component.html',
  styleUrls: ['./thongke.component.css']
})
export class ThongkeComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('doughnutChart') doughnutChart?: BaseChartDirective;
  @ViewChild('monthlyChartCanvas') monthlyChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Biến chọn năm cho thống kê tháng
  selectedYear: number = new Date().getFullYear();
  yearOptions: number[] = [];

  // Các biến hiển thị tổng số
  tongNguoiDung: number = 0;
  previousUserCount: number = 2;  // Ví dụ số người dùng trước đó
  growthPercent: number = 0;
  displayedUserCount: number = 0;

  displayedDanhMuc: number = 0;
  tongDanhMuc: number = 10;
  danhMucDangHoatDong: number = 10;
  progressWidth: number = 0;

  tongThuAll: number = 0;
  tongChiAll: number = 0;
  tienTietKiemAll: number = 0;

  // Dữ liệu biểu đồ Pie (Thu)
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }
    ]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
    animateRotate: true,  // xoay khi load
    animateScale: false,  // hoặc true nếu muốn zoom dần
    duration: 1000        // thời gian hiệu ứng (ms)
  },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 13 }, color: '#333' }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.toFixed(2)}%`
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 12 },
        formatter: (value: any) => `${value.toFixed(1)}%`
      }
    }
  };

  pieChartPlugins = [ChartDataLabels];

  // Dữ liệu biểu đồ Donut (Chi)
  doughnutChartDataChi: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF9F40', '#FF6384', '#36A2EB', '#9966FF', '#4BC0C0', '#FFCE56'
        ]
      }
    ]
  };

  doughnutChartOptionsChi: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1000,
    },
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 13 }, color: '#333' }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.toFixed(2)}%`
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 12 },
        formatter: (value: any) => `${value.toFixed(1)}%`
      }
    }
  };

  // Biến giữ Chart instance biểu đồ tháng (bar chart)
  monthlyChart?: Chart;

  constructor(
    private userService: UserService,
    private danhMucService: DanhMucService,
    private giaoDichService: GiaoDichService
  ) {}

  ngOnInit(): void {
    // Khởi tạo danh sách năm để chọn (ví dụ 5 năm gần nhất)
    const currentYear = new Date().getFullYear();
    for(let i = currentYear - 4; i <= currentYear; i++) {
      this.yearOptions.push(i);
    }

    // Lấy danh sách người dùng
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.tongNguoiDung = users.length;
        this.calculateGrowth();
        this.animateUserCount();
        this.animateProgressBar();
      },
      error: (err) => console.error('Lỗi lấy danh sách người dùng:', err)
    });

    // Lấy danh sách danh mục
    this.danhMucService.getDanhMuc().subscribe({
      next: (dsDanhMuc: DanhMuc[]) => {
        this.tongDanhMuc = dsDanhMuc.length;
        this.animateDanhMuc();
      },
      error: (err) => console.error('Lỗi lấy danh sách danh mục:', err)
    });

    // Lấy thống kê tổng thu, chi, tiết kiệm toàn hệ thống
    this.giaoDichService.layThongKeToanBoHeThong().subscribe({
      next: (data) => {
        this.animateSoTien(data.tongThuAll, 'tongThuAll');
        this.animateSoTien(data.tongChiAll, 'tongChiAll');
        this.animateSoTien(data.tienTietKiemAll, 'tienTietKiemAll');
      },
      error: (err) => console.error('Lỗi lấy thống kê toàn hệ thống:', err)
    });

    // Lấy dữ liệu biểu đồ Pie (thu)
    this.giaoDichService.layThongKeThuTheoDanhMucToanHeThong().subscribe({
      next: (data: any[]) => {
        this.pieChartData.labels = data.map(item => item.tenDanhMuc);
        this.pieChartData.datasets[0].data = data.map(item => parseFloat(item.phanTram));
        setTimeout(() => this.chart?.update(),);
      },
      error: (err) => console.error('Lỗi lấy biểu đồ thu theo danh mục:', err)
    });

    // Lấy dữ liệu biểu đồ Donut (chi)
    this.giaoDichService.layThongKeChiTheoDanhMucToanHeThong().subscribe({
      next: (data: any[]) => {
        this.doughnutChartDataChi = {
          labels: data.map(item => item.tenDanhMuc),
          datasets: [
            {
              data: data.map(item => parseFloat(item.phanTram)),
              backgroundColor: [
                '#FF9F40', '#FF6384', '#36A2EB', '#9966FF', '#4BC0C0', '#FFCE56'
              ]
            }
          ]
        };
        setTimeout(() => {
          this.doughnutChart?.update();
        });
      },
      error: (err) => console.error('Lỗi lấy biểu đồ chi theo danh mục:', err)
    });

    // Lấy dữ liệu thống kê tháng cho năm mặc định selectedYear
    this.loadMonthlyChartByYear();
  }

  // Hàm gọi API lấy thống kê tháng theo năm chọn
  loadMonthlyChartByYear(): void {
    this.giaoDichService.layThongKeTheoThangToanHeThong(this.selectedYear).subscribe({
      next: (data: any[]) => {
        this.setupMonthlyChart(data);
      },
      error: (err) => console.error('Lỗi lấy thống kê tháng:', err)
    });
  }

  // Hàm tạo biểu đồ thống kê tháng với bar + line
  setupMonthlyChart(data: any[]) {
    const labels = data.map(item => item.thang);
    const thuData = data.map(item => Number(item.thu));
    const chiData = data.map(item => Number(item.chi));
    const tongData = thuData.map((thu, i) => thu + chiData[i]);
    const tietKiemData = thuData.map((thu, i) => thu - chiData[i]);

    const chartData: ChartData<'bar'> = {
      labels,
      datasets: [
        { label: 'Thu', data: thuData, backgroundColor: '#66BB6A' },
        { label: 'Chi', data: chiData, backgroundColor: '#EF5350' },
        { label: 'Tổng', data: tongData, backgroundColor: '#42A5F5' },
        { label: 'Tiết Kiệm', data: tietKiemData, backgroundColor: '#ffca28' }
      ]
    };

    const chartOptions: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { type: 'category' },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Số tiền' }
        }
      },
      plugins: {
        legend: { position: 'top' },
        datalabels: {
          display: true,
          color: '#000',
          font: { weight: 'bold', size: 12 },
          anchor: 'end',
          align: 'top',
          offset: -5,
          formatter: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        }
      }
    };

    if (this.monthlyChart) {
      this.monthlyChart.data = chartData;
      this.monthlyChart.options = chartOptions;
      this.monthlyChart.update();
    } else {
      this.monthlyChart = new Chart(this.monthlyChartCanvas.nativeElement, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
        plugins: [ChartDataLabels]
      });
    }
  }

  // Tính phần trăm tăng trưởng người dùng
  calculateGrowth(): void {
    this.growthPercent = this.previousUserCount === 0
      ? 100
      : ((this.tongNguoiDung - this.previousUserCount) / this.previousUserCount) * 100;
  }

  // Hiệu ứng đếm số người dùng lên
  animateUserCount(): void {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      this.displayedUserCount = current;
      if (current >= this.tongNguoiDung) clearInterval(interval);
    }, 100);
  }

  // Hiệu ứng thanh progress danh mục
  animateProgressBar(): void {
    this.progressWidth = 0;
    const interval = setInterval(() => {
      if (this.progressWidth >= (this.danhMucDangHoatDong / this.tongDanhMuc) * 100) {
        clearInterval(interval);
      } else {
        this.progressWidth += 1;
      }
    }, 10);
  }

  // Hiệu ứng đếm số danh mục
  animateDanhMuc(): void {
    this.displayedDanhMuc = 0;
    const interval = setInterval(() => {
      if (this.displayedDanhMuc >= this.tongDanhMuc) {
        clearInterval(interval);
      } else {
        this.displayedDanhMuc += 1;
      }
    }, 100);
  }

  // Hiệu ứng đếm số tiền
  animateSoTien(value: number, field: 'tongThuAll' | 'tongChiAll' | 'tienTietKiemAll') {
  if (value === null || value === undefined || isNaN(value)) {
    this[field] = 0;
    return;
  }

  let current = 0;
  const duration = 1000; // 1 giây
  const steps = 100;
  const step = value / steps;
  const intervalTime = duration / steps;

  const interval = setInterval(() => {
    current += step;
    if ((value >= 0 && current >= value) || (value < 0 && current <= value)) {
      this[field] = value;
      clearInterval(interval);
    } else {
      this[field] = Math.round(current);
    }
  }, intervalTime);
}
}
