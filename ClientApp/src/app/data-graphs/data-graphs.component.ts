import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-data-graphs',
  templateUrl: './data-graphs.component.html',
  styleUrls: ['./data-graphs.component.css'],
})

export class DataGraphsComponent {
  chartOptions : EChartsOption = {
    title: {
      text: 'Task Progress',
    },
    tooltip: {},
    xAxis: {
      data: ['Task A', 'Task B', 'Task C'],
    },
    yAxis: {},
    series: [
      {
        name: 'Progress',
        type: 'pie',
        data: [50, 70, 90],
      },
    ],
  };
  constructor(private signalRService: SignalRService) {}

  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.chartsOrder$.subscribe((titles: string[]) => {
//      this.charts = titles
//      .map(title => this.charts.find(c => c.title?.text === title))
//      .filter(c => c !== undefined) as typeof this.charts;
      if (titles.length > 0) {
        this.charts = titles.map(title =>
          this.charts.find(c => c.title?.text === title)!
        );
      }
    });
  }

  onChartReorder(): void {
    const order = this.charts.map(c => c.title?.text ?? '');
    this.signalRService.sendChartsOrder(order);
  }

  charts = [
      { ...this.chartOptions, title: { text: 'Chart 1' } },
      { ...this.chartOptions, title: { text: 'Chart 2' } },
      { ...this.chartOptions, title: { text: 'Chart 3' } },
      { ...this.chartOptions, title: { text: 'Chart 4' } },
      { ...this.chartOptions, title: { text: 'Chart 5' } },
      { ...this.chartOptions, title: { text: 'Chart 6' } },
      { ...this.chartOptions, title: { text: 'Chart 7' } },
      { ...this.chartOptions, title: { text: 'Chart 8' } },
      { ...this.chartOptions, title: { text: 'Chart 9' } },
  ]
}
