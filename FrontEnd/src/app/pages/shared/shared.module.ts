import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImageDirective } from './directives/profile-image.directive';
import { SharedInputComponent } from './components/shared-input/shared-input.component';
import { SharedHoverEffectDirective } from './directives/shared-hover-effect.directive';

@NgModule({
  declarations: [ProfileImageDirective, SharedInputComponent, SharedHoverEffectDirective],
  imports: [CommonModule],
    exports: [
        ProfileImageDirective,
        SharedInputComponent
    ]
})
export class SharedModule {}
