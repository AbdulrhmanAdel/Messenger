import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[appProfileImage]',
})
export class ProfileImageDirective implements OnInit {
  @Input() imageWidth: number = 50;
  private _circular: boolean;

  @Input('circular')
  get circular() {
    return this._circular;
  }
  set circular(value: any) {
    this._circular = coerceBooleanProperty(value);
  }

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.applyDimension();
    if (
      !this.elementRef.nativeElement.src ||
      this.elementRef.nativeElement.src == window.location.href
    ) {
      this.elementRef.nativeElement.src =
        '../../../../assets/media/no-profile-image.png';
    }
  }

  applyDimension() {
    this.elementRef.nativeElement.style.width = this.imageWidth + 'px';
    this.elementRef.nativeElement.style.height = this.imageWidth + 'px';

    if (this._circular) {
      this.elementRef.nativeElement.style.borderRadius = this.imageWidth / 2 + 'px';
    }
  }
}
