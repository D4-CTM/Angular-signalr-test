import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  public chartsOrder$ = new BehaviorSubject<string[]>([]);

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/graphs', {
        withCredentials: true,
        transport: signalR.HttpTransportType.LongPolling,
      }).withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.on('ReceiveChartsOrder', (charts: string[]) => {
      this.chartsOrder$.next(charts);
    });

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        // Request the current order from server once connected:
        this.hubConnection.invoke<string[]>('GetCurrentChartsOrder')
          .then(order => this.chartsOrder$.next(order))
          .catch(err => console.error('Error fetching initial order:', err));
      })
      .catch(err => console.error('SignalR connection error:', err));
  }

//  startConnection(): void {
//    this.hubConnection = new signalR.HubConnectionBuilder()
//      .withUrl('hubs/graphs')
//      .withAutomaticReconnect()
//      .build();
//
//    this.hubConnection.start()
//      .then(() => console.log('SignalR connected'))
//      .catch(err => console.error('SignalR error:', err));
//
//    this.hubConnection.on('ReceiveChartsOrder', (charts: string[]) => {
//      this.chartsOrder$.next(charts);
//    });
//  }

  sendChartsOrder(movies: string[]): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('UpdateChartsOrder', movies)
        .catch(err => console.error('Send failed:', err));
    }
  }
}
