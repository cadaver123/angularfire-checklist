import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ResizeEvent } from './interfaces/resize-event.interface';
import { Point } from '../../model/Point';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements AfterViewInit, OnDestroy {
  @Input('appResizable')
  public appResizableHandle: HTMLElement;

  @Output()
  public appResizableOnEnded: EventEmitter<ResizeEvent> = new EventEmitter<ResizeEvent>();

  @HostBinding('style.touchAction')
  private toucheAction: string = 'none';

  private readonly MIN_WIDTH: number = 325;
  private readonly MIN_HEIGHT: number = 200;

  private resizeStartPosition: Point = { x: 0, y: 0 };
  private startingWidth: number;
  private startingHeight: number;
  private newWidth: number;
  private newHeight: number;

  private readonly componentDestroyed: Subject<void> = new Subject<void>();
  private readonly resizeEndedSubject: Subject<void> = new Subject<void>();

  constructor(private element: ElementRef) {
  }

  public ngAfterViewInit(): void {
    fromEvent(this.appResizableHandle, 'pointerdown')
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe((event: PointerEvent) => {
        this.startResize(event);
      });
  }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
    this.resizeEndedSubject.complete();
  }

  private startResize(event: PointerEvent): void {
    const { width, height, }: { width: number, height: number } = (this.element.nativeElement as HTMLElement).getBoundingClientRect();

    this.resizeStartPosition.x = event.clientX;
    this.resizeStartPosition.y = event.clientY;
    this.startingWidth = width;
    this.startingHeight = height;

    this.subscribeToPointerMoveEvent();
    this.subscribeToPointerUpEvent();
  }

  private subscribeToPointerMoveEvent(): void {
    fromEvent(window.document, 'pointermove')
      .pipe(takeUntil(this.componentDestroyed))
      .pipe(takeUntil(this.resizeEndedSubject))
      .subscribe((pointerEvent: PointerEvent) => this.updateSize(pointerEvent));
  }

  private subscribeToPointerUpEvent(): void {
    fromEvent(window.document, 'pointerup')
      .pipe(takeUntil(this.componentDestroyed))
      .pipe(take(1))
      .subscribe(() => this.endResize());
  }

  private updateSize(event: PointerEvent): void {
    let newWidth: number = this.startingWidth + (event.clientX - this.resizeStartPosition.x);
    let newHeight: number = this.startingHeight + (event.clientY - this.resizeStartPosition.y);

    newWidth = newWidth >= this.MIN_WIDTH ? newWidth : this.MIN_WIDTH;
    this.newWidth = newWidth;
    (this.element.nativeElement as HTMLElement).style.width = `${ newWidth }px`;

    newHeight = newHeight >= this.MIN_HEIGHT ? newHeight : this.MIN_HEIGHT;
    this.newHeight = newHeight;
    (this.element.nativeElement as HTMLElement).style.height = `${ newHeight }px`;
  }

  private endResize(): void {
    this.resizeEndedSubject.next();
    this.appResizableOnEnded.emit({ newWidth: this.newWidth, newHeight: this.newHeight });
  }
}
