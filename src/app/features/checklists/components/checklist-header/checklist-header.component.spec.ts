import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChecklistHeaderComponent } from './checklist-header.component';

describe('ChecklistHeaderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  function getCloseButton(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklistHeader-deleteButton'));
  }

  function getNameInput(): DebugElement {
    return fixture.debugElement.query(By.css('.AppChecklistHeader-nameInput'));
  }

  @Component({
    template: `
      <app-checklist-header
        [appChecklistHeaderCardName]="name"
        (appChecklistHeaderOnDelete)="onDelete($event)"
        (appChecklistHeaderOnNameChanged)="onNameChanged($event)"
      ></app-checklist-header>
    `,
  })
  class TestHostComponent {
    public name: string;
    public onDelete: jasmine.Spy = jasmine.createSpy('onDelete');
    public onNameChanged: jasmine.Spy = jasmine.createSpy('onNameChanged');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, ChecklistHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  describe('when a name of the checklist is set', () => {
    beforeEach(() => {
      fixture.componentInstance.name = 'checklist name';
      fixture.detectChanges();
    });

    it('should show the title', () => {
      expect((getNameInput().nativeElement as HTMLInputElement).value).toEqual('checklist name');
    });
  });

  describe('when the user clicked delete checklist button', () => {
    beforeEach(() => {
      (getCloseButton().nativeElement as HTMLElement).click();
    });

    it('should emit delete event', () => {
      expect(fixture.componentInstance.onDelete).toHaveBeenCalled();
    });
  });

  describe('when the name of the checklist has changed', () => {
    beforeEach(() => {
      (getNameInput().nativeElement as HTMLInputElement).value = 'new name';
      (getNameInput().nativeElement as HTMLInputElement).dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    });

    it('should emit a new name', () => {
      expect(fixture.componentInstance.onNameChanged).toHaveBeenCalledWith('new name');
    });
  });

  afterAll(() => {
    fixture = null;
  });
});
