import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-shared-input',
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.scss'],
})
export class SharedInputComponent implements OnInit {
  _multiline: boolean;
  @Input() set multiline(value: string) {
    this._multiline = coerceBooleanProperty(value);
  }

  @Output() input = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  @Input() placeholder: string | null | undefined;

  @Input() value: string | null | undefined;
  @Output() valueChange = new EventEmitter<string>();

  constructor(public elementRef: ElementRef) {}

  ngOnInit(): void {}
}
