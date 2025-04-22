import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [TabsModule.forRoot()],
  exports: [TabsModule]
})
export class TabsBootstrapModule {}