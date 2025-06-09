import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';

@Component({
  selector: 'app-note-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './note-input.component.html',
  styleUrls: ['./note-input.component.css']
})
export class NoteInputComponent {
  constructor(private notesService: NotesService) {}

  isExpanded = false;
  title = '';
  description = '';

  @Output() noteCreated = new EventEmitter<{ title: string; description: string }>();

  expand() {
    this.isExpanded = true;
  }

 collapse() {
  if (this.title.trim() || this.description.trim()) {
    const newNote = {
      title: this.title.trim(),
      description: this.description.trim(),
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      color: ''
    };

    this.notesService.addNote(newNote).subscribe({
      next: (res: any) => {
        const createdNote = res.data?.details;
        if (createdNote) {
          this.noteCreated.emit(createdNote); // ✅ emit real backend-created note
        }
        this.resetFields();
      },
      error: (err) => {
        console.error('API failed to add note:', err);
        this.resetFields();
      }
    });
  } else {
    this.resetFields();
  }
}

resetFields() {
  this.title = '';
  this.description = '';
  this.isExpanded = false;
}





}
