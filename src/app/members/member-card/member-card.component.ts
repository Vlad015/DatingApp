import { Component, computed, inject, input, Input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../services/likes.service';
import { PresenceService } from '../../services/presence.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  position = { x: 0, y: 0 };
  showInfo = false;
  private likeService=inject(LikesService);
  private presenceService=inject(PresenceService);
  member=input.required<Member>();
  hasLiked=computed(()=>this.likeService.likeIds().includes(this.member().id));
  isOnline=computed(()=>this.presenceService.onlineUsers().includes(this.member().username)
)
  toggleLike(){
    this.likeService.toggleLike(this.member().id).subscribe({
      next:()=>{
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids=>ids.filter(x=>x!==this.member().id))
        }
        else{
          this.likeService.likeIds.update(ids=>[...ids, this.member().id])
        }
      }
    })
  }
  onMouseEnter() {
    this.showInfo = true;
  }
  
  onMouseLeave() {
    this.showInfo = false;
  }
  
  onMouseMove(event: MouseEvent) {
    this.position = { x: event.offsetX + 20, y: event.offsetY + 20 };
  }
}
