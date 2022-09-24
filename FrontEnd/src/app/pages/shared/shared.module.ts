import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImageDirective } from './directives/profile-image.directive';

@NgModule({
  declarations: [ProfileImageDirective],
  imports: [CommonModule],
  exports: [
    ProfileImageDirective
  ]
})
export class SharedModule {}
