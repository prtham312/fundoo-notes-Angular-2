import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css'],
})
export class NoteCardComponent {
  hover = false;
  isSelected = false;

  constructor(private notesService: NotesService) {}

  toggleSelect(event: MouseEvent) {
    event.stopPropagation();
    this.isSelected = !this.isSelected;
  }

  // ✅ Inputs
  @Input() noteId!: string;
  @Input() title: string = '';
  @Input() color: string = '#fff';
  @Input() id!: string;
  @Input() description: string = '';
  @Input() isPined: boolean = false;
  @Input() isArchived: boolean = false;
  @Input() isDeleted: boolean = false;
  @Input() context: 'notes' | 'archive' | 'trash' = 'notes';

  // ✅ Outputs
  @Output() archived = new EventEmitter<void>();
  @Output() pinToggled = new EventEmitter<void>();
  @Output() restored = new EventEmitter<void>();
  @Output() deletedForever = new EventEmitter<void>();
  @Output() trash = new EventEmitter<void>();          // old one, still used elsewhere
  @Output() trashed = new EventEmitter<string>();      // ✅ new one for Dashboard

  // ✅ Handle viewMode binding from dashboard
  private viewMode: string = 'grid';

  @Input() set ngClass(value: string) {
    this.viewMode = value;
  }

  @HostBinding('class.grid')
  get isGrid() {
    return this.viewMode === 'grid';
  }

  @HostBinding('class.list')
  get isList() {
    return this.viewMode === 'list';
  }

  lightColors = ['#fff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8'];
  showColorPalette = false;

  toggleColorPalette() {
    this.showColorPalette = !this.showColorPalette;
  }

  selectColor(color: string) {
  const noteId = this.id || this.noteId;
  const payload = {
    noteIdList: [noteId],
    color: color
  };

  this.notesService.changeNoteColor(payload).subscribe({
    next: () => {
      console.log('Color updated to:', color);
      this.color = color; // update UI
    },
    error: (err : any) => {
      console.error('Color change failed:', err);
    }
  });

  this.showColorPalette = false;
}


  // ✅ Archive logic
  onArchive() {
    const payload = {
      noteIdList: [this.id],
      isArchived: true,
    };

    this.notesService.archiveNote(payload).subscribe({
      next: () => {
        console.log('Note archived successfully');
        this.archived.emit();
      },
      error: (err) => {
        console.error('Error archiving note', err);
      },
    });
  }

  // ✅ Pin toggle logic
  togglePin(event: MouseEvent) {
    event.stopPropagation();

    const payload = {
      noteIdList: [this.id],
      isPined: !this.isPined,
    };

    this.notesService.pinNote(payload).subscribe({
      next: () => {
        console.log('Pin API success');
        this.pinToggled.emit();
      },
      error: (err) => {
        console.error('Pin API error:', err);
      },
    });

    this.isPined = !this.isPined;
  }

 onTrash() {
  const noteId = this.id || this.noteId;
  const noteIdList = [noteId];

  if (this.isArchived) {
    // Only unarchive if it was archived
    this.notesService.archiveNote({ noteIdList, isArchived: false }).subscribe({
      next: () => {
        this.moveToTrash(noteIdList, noteId);
      },
      error: (err) => console.error('Unarchive API error', err)
    });
  } else {
    this.moveToTrash(noteIdList, noteId);
  }
}

private moveToTrash(noteIdList: string[], noteId: string) {
  this.notesService.trashNote({ noteIdList, isDeleted: true }).subscribe({
    next: () => {
      console.log('Moved to trash');
      this.trash.emit();
      this.trashed.emit(noteId); // ✅ emits noteId to parent
    },
    error: (err) => console.error('Trash API error', err),
  });
}

  // ✅ Restore from trash
  onRestore() {
    const payload = {
      noteIdList: [this.id || this.noteId],
      isDeleted: false,
    };

    this.notesService.trashNote(payload).subscribe({
      next: () => {
        console.log('Note restored');
        this.restored.emit();
      },
      error: (err) => console.error('Restore error', err),
    });
  }

  // ✅ Delete forever
  onDeleteForever() {
    const payload = {
      noteIdList: [this.id || this.noteId],
    };

    this.notesService.deleteForever(payload).subscribe({
      next: () => {
        console.log('Note permanently deleted');
        this.deletedForever.emit();
      },
      error: (err) => console.error('Delete forever error', err),
    });
  }
}
