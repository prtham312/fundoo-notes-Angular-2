import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './note-input.component.html',
  styleUrls: ['./note-input.component.css']
})
export class NoteInputComponent {
  isExpanded = false;
  title = '';
  description = '';

  @Output() noteCreated = new EventEmitter<{ title: string; description: string }>();

  expand() {
    this.isExpanded = true;
  }

  collapse() {
    if (this.title.trim() || this.description.trim()) {
      this.noteCreated.emit({
        title: this.title.trim(),
        description: this.description.trim()
      });
    }

    this.title = '';
    this.description = '';
    this.isExpanded = false;
  }
}
