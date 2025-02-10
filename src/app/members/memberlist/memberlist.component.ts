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
  private memberService= inject(MembersService)
  members:Member[]=[];

  ngOnInit(): void {
      this.loadMembers();
  }
  loadMembers(){
    this.memberService.getMembers().subscribe({
      next: members=> this.members=members
    })
  }
}
