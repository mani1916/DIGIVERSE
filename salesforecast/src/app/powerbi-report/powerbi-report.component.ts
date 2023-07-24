import { Component } from '@angular/core';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-powerbi-report',
  template: '<div #reportContainer></div>'
})
export class PowerbiReportComponent {
  // private file: File;
  // private dashboardContainer: HTMLElement;

  // constructor() {}

  // onFileSelected(event) {
  //   this.file = event.target.files[0];
  // }

  // onSubmit() {
  //   if (!this.file) {
  //     alert('Please select a file.');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = btoa(reader.result as string);
  //     this.displayDashboard(data);
  //   };
  //   reader.readAsBinaryString(this.file);
  // }

  // private displayDashboard(data: string) {
  //   this.dashboardContainer = document.getElementById('dashboardContainer');
  //   const accessToken = 'YOUR_ACCESS_TOKEN';
  //   const config: pbi.IEmbedConfiguration = {
  //     type: 'dashboard',
  //     tokenType: pbi.models.TokenType.Embed,
  //     accessToken: accessToken,
  //     embedUrl: 'https://app.powerbi.com/dashboardEmbed',
  //     dashboardId: 'YOUR_DASHBOARD_ID',
  //     permissions: pbi.models.Permissions.All
  //   };
  //   // const dashboard = pbi.Embed(this.dashboardContainer, config);
  //   dashboard.off('loaded');
  //   dashboard.on('loaded', () => {
  //     console.log('Dashboard loaded.');
  //   });
  //   dashboard.off('error');
  //   dashboard.on('error', (error) => {
  //     console.error('Dashboard error:', error);
  //   });
  // }
}
