import { Directive, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ResizableDirective } from './resizable.directive';
import { ResizeEvent } from './interfaces/resize-event.interface';

@Directive({
  selector: '[appResizable]',
  providers: [
    { provide: ResizableDirective, useExisting: forwardRef(() => ResizableDirectiveStub) }
  ]
})
export class ResizableDirectiveStub {
  @Input('appResizable')
  public appResizableHandle: HTMLElement;

  @Output()
  public appResizableOnEnded: EventEmitter<ResizeEvent> = new EventEmitter<ResizeEvent>();
}
