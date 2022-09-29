import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appSharedHoverEffect]',
})
export class SharedHoverEffectDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
  }
}
