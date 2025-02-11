import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { Member } from '../../_models/member';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-memberlist',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './memberlist.component.html',
  styleUrl: './memberlist.component.css'
})
export class MemberlistComponent implements OnInit{
 memberService= inject(MembersService)
  

  ngOnInit(): void {
    if(this.memberService.members().length===0) this.loadMembers();  
    this.loadMembers();

  }
  loadMembers(){
    this.memberService.getMembers()
      
    
  }
}
