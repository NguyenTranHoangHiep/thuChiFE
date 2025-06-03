import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GiaoDichService } from '../service/giao-dich.service';
import { ChartData, ChartOptions, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { registerables } from 'chart.js';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-thongke-users',
  templateUrl: './thongke-users.component.html',
  styleUrls: ['./thongke-users.component.css']
})
export class ThongkeUsersComponent implements OnInit {
  tongThu: number = 0;
  tongChi: number = 0;
  tienTietKiem: number = 0;

  animatedThu: number = 0;
  animatedChi: number = 0;
  animatedTietKiem: number = 0;

  pieChartLabels: string[] = [];
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A', '#FFCA28', '#26C6DA']
    }]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      datalabels: {
        color: '#fff',
        formatter: (value: number) => value + '%',
        font: { weight: 'bold', size: 14 }
      }
    }
  };

  doughnutChartLabels: string[] = [];
  doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#EF5350', '#29B6F6', '#FF7043', '#7E57C2', '#66BB6A', '#FFA726', '#8D6E63']
    }]
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      datalabels: {
        color: '#fff',
        formatter: (value: number) => value + '%',
        font: { weight: 'bold', size: 14 }
      }
    }
  };

  @ViewChild('monthlyChartCanvas') monthlyChartCanvas!: ElementRef<HTMLCanvasElement>;
  monthlyChart!: Chart;

  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];

  constructor(private giaoDichService: GiaoDichService) {}

  ngOnInit(): void {
    this.generateAvailableYears();

    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('Không tìm thấy mã người dùng trong Local Storage.');
      return;
    }

    const user = JSON.parse(userString);
    const maNguoiDung = user.maNguoiDung;

    this.layThongKeChiTheoDanhMuc(maNguoiDung);
    this.layThongKeThuTheoDanhMuc(maNguoiDung);

    this.giaoDichService.layThongKeThuChi(maNguoiDung).subscribe({
      next: (res) => {
        this.tongThu = res.tongThu;
        this.tongChi = res.tongChi;
        this.tienTietKiem = this.tongThu - this.tongChi;
        this.animateNumber('thu', this.tongThu);
        this.animateNumber('chi', this.tongChi);
        this.animateNumber('tietkiem', this.tienTietKiem);
      },
      error: (err) => console.error('Lỗi khi thống kê:', err)
    });

    this.layThongKeTheoThang(maNguoiDung, this.selectedYear);
  }

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  onYearChange() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    const maNguoiDung = user.maNguoiDung;
    this.layThongKeTheoThang(maNguoiDung, this.selectedYear);
  }

  layThongKeTheoThang(maNguoiDung: number, nam: number) {
    this.giaoDichService.layThongKeTheoThang(maNguoiDung, nam).subscribe({
      next: (res) => this.setupMonthlyChart(res),
      error: (err) => console.error('Lỗi khi lấy thống kê theo tháng:', err)
    });
  }

  animateNumber(type: 'thu' | 'chi' | 'tietkiem', endValue: number) {
    const duration = 1000;
    const frameRate = 30;
    const steps = duration / (1000 / frameRate);
    let count = 0;
    const startValue = 0;
    const stepValue = (endValue - startValue) / steps;

    const interval = setInterval(() => {
      count++;
      const newValue = Math.round(startValue + stepValue * count);

      if (type === 'thu') this.animatedThu = newValue;
      else if (type === 'chi') this.animatedChi = newValue;
      else this.animatedTietKiem = newValue;

      if (count >= steps) {
        clearInterval(interval);
        if (type === 'thu') this.animatedThu = endValue;
        else if (type === 'chi') this.animatedChi = endValue;
        else this.animatedTietKiem = endValue;
      }
    }, 1000 / frameRate);
  }

  formatVND(value: number): string {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  layThongKeThuTheoDanhMuc(maNguoiDung: number) {
    this.giaoDichService.layThongKeThuTheoDanhMuc(maNguoiDung).subscribe({
      next: (res: any) => {
        const data = res.phanTramTheoDanhMuc;
        this.pieChartLabels = data.map((item: any) => item.tenDanhMuc);
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [{
            data: data.map((item: any) => +item.phanTram),
            backgroundColor: this.pieChartData.datasets[0].backgroundColor
          }]
        };
      },
      error: (err) => console.error('Lỗi thống kê thu:', err)
    });
  }

  layThongKeChiTheoDanhMuc(maNguoiDung: number) {
    this.giaoDichService.layThongKeChiTheoDanhMuc(maNguoiDung).subscribe({
      next: (res: any) => {
        const data = res.phanTramTheoDanhMuc;
        this.doughnutChartLabels = data.map((item: any) => item.tenDanhMuc);
        this.doughnutChartData = {
          labels: this.doughnutChartLabels,
          datasets: [{
            data: data.map((item: any) => +item.phanTram),
            backgroundColor: this.doughnutChartData.datasets[0].backgroundColor
          }]
        };
      },
      error: (err) => console.error('Lỗi thống kê chi:', err)
    });
  }

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
}
