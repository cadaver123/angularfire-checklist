import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResizableDirective } from './resizable.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ResizeEvent } from './interfaces/resize-event.interface';

describe('ResizableDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  function getElement(): DebugElement {
    return fixture.debugElement.query(By.css('.element'));
  }

  function getHandle(): DebugElement {
    return fixture.debugElement.query(By.css('.resizableHandle'));
  }

  @Component({
    template: `
      <div class="element" [appResizable]="resizableHandle" (appResizableOnEnded)="onEnded($event)">
        <div #resizableHandle class="resizableHandle"></div>
      </div>`,
    styles: [
      `.element {
        width: 400px;
        height: 400px;
      }`
    ]
  })
  class TestHostComponent {
    public onEnded: jasmine.Spy<(event: ResizeEvent) => void> = jasmine.createSpy('onEnded');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        ResizableDirective
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);

    fixture.detectChanges();
  });

  describe('when the user starts resizing', () => {
    beforeEach(waitForAsync(() => {
      const pointerdownEvent: PointerEvent = new PointerEvent('pointerdown');

      Object.defineProperty(pointerdownEvent, 'clientX', { value: 390 });
      Object.defineProperty(pointerdownEvent, 'clientY', { value: 395 });
      (getHandle().nativeElement as HTMLElement).dispatchEvent(pointerdownEvent);

      fixture.detectChanges();
    }));

    describe('when the user moves the pointer', () => {
      beforeEach(waitForAsync(() => {
        const pointermoveEvent: PointerEvent = new PointerEvent('pointermove');

        Object.defineProperty(pointermoveEvent, 'clientX', { value: 467 });
        Object.defineProperty(pointermoveEvent, 'clientY', { value: 489 });
        window.document.dispatchEvent(pointermoveEvent);

        fixture.detectChanges();
      }));

      it('should resize the element', () => {
        expect((getElement().nativeElement as HTMLElement).style.width).toBe('477px');
        expect((getElement().nativeElement as HTMLElement).style.height).toBe('494px');
      });

      describe('when the user finished resizing', () => {
        beforeEach(waitForAsync(() => {
          const pointerupEvent: PointerEvent = new PointerEvent('pointerup');

          window.document.dispatchEvent(pointerupEvent);

          fixture.detectChanges();
        }));

        it('should emit event', () => {
          expect(fixture.componentInstance.onEnded).toHaveBeenCalledWith({
            newWidth: 477,
            newHeight: 494
          });
        });
      });
    });

    describe('when the user tries to resize element below minimum value', () => {
      beforeEach(waitForAsync(() => {
        const pointermoveEvent: PointerEvent = new PointerEvent('pointermove');

        Object.defineProperty(pointermoveEvent, 'clientX', { value: 100 });
        Object.defineProperty(pointermoveEvent, 'clientY', { value: 10 });
        window.document.dispatchEvent(pointermoveEvent);

        fixture.detectChanges();
      }));

      it('should not resize the element', () => {
        expect((getElement().nativeElement as HTMLElement).style.width).toBe('325px');
        expect((getElement().nativeElement as HTMLElement).style.height).toBe('200px');
      });

      describe('when the user finished resizing', () => {
        beforeEach(waitForAsync(() => {
          const pointerupEvent: PointerEvent = new PointerEvent('pointerup');

          window.document.dispatchEvent(pointerupEvent);

          fixture.detectChanges();
        }));

        it('should emit event', () => {
          expect(fixture.componentInstance.onEnded).toHaveBeenCalledWith({
            newWidth: 325,
            newHeight: 200
          });
        });
      });
    });
  });

  afterAll(() => {
    fixture = null;
  });
});
