import { Component, Output, EventEmitter } from '@angular/core';
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
  constructor(private notesService: NotesService) {}

  isExpanded = false;
  title = '';
  description = '';
  backgroundColor: string = '#fff'; // ✅ for note background color

  expand() {
    this.isExpanded = true;
  }

  @Output() noteAdded = new EventEmitter<{
  id: string;
  title: string;
  description: string;
  color?: string;
}>();

collapse() {
  if (this.title.trim() || this.description.trim()) {
    const newNote = {
      title: this.title.trim(),
      description: this.description.trim(),
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      color: this.backgroundColor,
    };

    this.notesService.addNote(newNote).subscribe({
      next: (res: any) => {
        const apiNote = res.data?.details;
        if (apiNote) {
          const createdNote = {
            id: apiNote.id,
            title: this.title.trim(),
            description: this.description.trim(),
            color: this.backgroundColor,
          };
          console.log('✅ Emitting:', createdNote);
          this.noteAdded.emit(createdNote);
        }
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

  onArchiveClick() {
    console.log('Archive clicked from icon-list');
  }

  setNoteColor(color: string) {
    this.backgroundColor = color;
  }
}
