import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNoteDialogComponent } from './edit-note-dialog.component';

describe('EditNoteDialogComponent', () => {
  let component: EditNoteDialogComponent;
  let fixture: ComponentFixture<EditNoteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditNoteDialogComponent]
    });
    fixture = TestBed.createComponent(EditNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
