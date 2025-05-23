import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/photo';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf,NgFor, NgStyle,NgClass,FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  private authService=inject(AuthService);
  private memberService=inject(MembersService);
  member =input.required<Member>();
  uploader?:FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  baseUrl='https://localhost:7263/api/';
  memberChange =output<Member>();

  ngOnInit(): void {
     this.initializeUploader(); 
  }
  public fileOverBase(e: boolean): void {
    console.log('File over base:', e); 
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo:Photo){
    this.memberService.setMainPhoto(photo).subscribe({
      next: _=>{
        const user=this.authService.currentUser();
        if(user){
          user.photoUrl=photo.url;
          this.authService.setCurrentUser(user);
        }
        const updatedMember={...this.member()}
        updatedMember.photoUrl=photo.url;
        updatedMember.photos.forEach(p=>{
          if(p.isMain) p.isMain=false;
          if(p.id === photo.id) p.isMain=true;
        });
        this.memberChange.emit(updatedMember);
      }
    })
  }

  deletePhoto(photo:Photo){
    this.memberService.deletePhoto(photo).subscribe({
      next:_=>{
        const updatedMember={...this.member()};
        updatedMember.photos=updatedMember.photos.filter(x=>x.id !=photo.id);
        this.memberChange.emit(updatedMember);
      }
    })
  }
  initializeUploader(){
    this.uploader =new FileUploader({
      url:this.baseUrl+'User/add-photo',
      authToken: 'Bearer '+ this.authService.currentUser()?.token,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1024*1024,
    });
    this.uploader.onAfterAddingFile=(file)=>{
      file.withCredentials=false
    };

    this.uploader.onSuccessItem=(item, response,status,headers)=>{
      const photo =JSON.parse(response);
      const updatedMember={...this.member()}
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);
      if(photo.isMain)
      {
        const user=this.authService.currentUser();
        if(user){
          user.photoUrl=photo.url;
          this.authService.setCurrentUser(user);
        }
        updatedMember.photoUrl=photo.url;
        updatedMember.photos.forEach(p=>{
          if(p.isMain) p.isMain=false;
          if(p.id === photo.id) p.isMain=true;
        });
        this.memberChange.emit(updatedMember);
      }
    }
 }
 
}
