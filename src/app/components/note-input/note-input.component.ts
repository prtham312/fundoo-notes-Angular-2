import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';
import { IconListComponent } from '../icon-list/icon-list.component';

@Component({
  selector: 'app-note-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, IconListComponent],
  templateUrl: './note-input.component.html',
  styleUrls: ['./note-input.component.css'],
})
export class NoteInputComponent {
  @Output() noteAdded = new EventEmitter<any>(); 
  isExpanded = false;
  title = '';
  description = '';
  backgroundColor: string = '#fff';
  justExpanded = false;

  constructor(
    private notesService: NotesService,
    private eRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  expand() {
    this.isExpanded = true;
    this.justExpanded = true;
    setTimeout(() => {
      this.justExpanded = false;
    });
  }

  collapse() {
    if (this.title.trim() || this.description.trim()) {
      const payload = {
        title: this.title.trim(),
        description: this.description.trim(),
        isPinned: false,
        isArchived: false,
        isDeleted: false,
        color: this.backgroundColor,
      };

      this.notesService.addNote(payload).subscribe({
        next: (res : any) => {
          this.noteAdded.emit(res.data); 
          this.cdr.detectChanges();
          this.resetFields();
        },
        error: (err) => {
          console.error('API failed:', err);
          this.resetFields();
        },
      });
    } else {
      this.resetFields();
    }
  }

  resetFields() {
    this.title = '';
    this.description = '';
    this.backgroundColor = '#fff';
    this.isExpanded = false;
  }

  setNoteColor(color: string) {
    this.backgroundColor = color;
  }

  onArchiveClick() {
    console.log('Archive clicked');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.justExpanded) return;
    if (this.isExpanded && !this.eRef.nativeElement.contains(event.target)) {
      this.collapse();
    }
  }
}
