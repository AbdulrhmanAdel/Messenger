import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  private playMessageSubject = new Subject<void>();
  playMessageRequested$: Observable<void>;

  constructor() {
    this.playMessageRequested$ = this.playMessageSubject;
  }

  play() {
    this.playMessageSubject.next();
  }
}
