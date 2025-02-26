import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AuthService } from '../../services/auth.service';
import { UserParams } from '../../_models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons'

@Component({
  selector: 'app-memberlist',
  standalone: true,
  imports: [MemberCardComponent,PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './memberlist.component.html',
  styleUrl: './memberlist.component.css'
})
export class MemberlistComponent implements OnInit{ 
  memberService= inject(MembersService);
  genderList=[{value:'male', display:'Males'}, {value:'female', display:'Females'}]
   
  
  ngOnInit(): void {
    if(this.memberService.paginatedResult()) this.loadMembers();  
    this.loadMembers();

  }
  loadMembers(){
    this.memberService.getMembers()
      
    
  }
  resetFilters(){
    this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event:any){
    if(this.memberService.userParams().pageNumber!=event.page)
      this.memberService.userParams().pageNumber=event.page;
      this.loadMembers();
  }
}
