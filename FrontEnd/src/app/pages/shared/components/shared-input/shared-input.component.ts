import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-shared-input',
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.scss'],
})
export class SharedInputComponent implements OnInit {
  @Output() input = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  @Input() placeholder: string;

  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  constructor(public elementRef: ElementRef) {}

  ngOnInit(): void {}
}
