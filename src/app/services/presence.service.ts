import { inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl='https://localhost:7263/hubs/';
  private hubConnection?: HubConnection;
  private toastr=inject(ToastrService);
  private router=inject(Router);
  onlineUsers=signal<string[]>([]);

  createHubConnection(user: User) {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      console.log('🔁 Already connected to SignalR - skipping.');
      return;
    }
  
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connecting) {
      console.log('⏳ Connection is in progress...');
      return;
    }
  
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();
  
    this.hubConnection
      .start()
  
    
    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers.update(users=>[...users,username]);
    });
  
    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers.update(users=>users.filter(x=>x!==username));
    });
  
    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsers.set(usernames);
    });
  
    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr.info(`${knownAs} has sent you a new message! Click to view.`)
        .onTap.pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl('/members/' + username + '?tab=Messages');
        });
    });
  }
  
  stopHubConnection(){
    if(this.hubConnection?.state===HubConnectionState.Connected){
      this.hubConnection.stop().catch(error=>console.log(error));
    }
  }
}
