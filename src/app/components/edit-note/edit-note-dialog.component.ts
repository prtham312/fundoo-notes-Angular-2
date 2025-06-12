import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-note-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './edit-note-dialog.component.html',
  styleUrls: ['./edit-note-dialog.component.css']
})
export class EditNoteDialogComponent {
  title: string = '';
  description: string = '';
  color: string = '#fff';

  constructor(
    private notesService: NotesService,
    private dialogRef: MatDialogRef<EditNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.description = data.description;
    this.color = data.color || '#fff';
  }

  close() {
    this.dialogRef.close();
  }

  updateNote() {
    const payload = {
      noteId: this.data.id,
      title: this.title.trim(),
      description: this.description.trim()
    };

    this.notesService.updateNote(payload).subscribe({
      next: () => {
        console.log('✅ Note updated');
        this.dialogRef.close({
          title: this.title,
          description: this.description
        });
      },
      error: (err) => {
        console.error('❌ Update error:', err);
        this.dialogRef.close();
      }
    });
  }
}
