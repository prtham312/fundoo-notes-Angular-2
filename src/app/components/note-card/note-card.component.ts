import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
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
  @Input() context: 'notes' | 'archive' = 'notes';

  // ✅ Outputs
  @Output() archived = new EventEmitter<void>();
  @Output() pinToggled = new EventEmitter<void>();

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

  // ✅ Archive logic
  onArchive() {
    const payload = {
      noteIdList: [this.id],
      isArchived: true
    };

    this.notesService.archiveNote(payload).subscribe({
      next: () => {
        console.log('Note archived successfully');
        this.archived.emit();
      },
      error: (err) => {
        console.error('Error archiving note', err);
      }
    });
  }

  // ✅ Pin toggle logic
  togglePin(event: MouseEvent) {
    event.stopPropagation();
    console.log('PIN CLICKED');

    const payload = {
      noteIdList: [this.id],
      isPined: !this.isPined
    };

    this.notesService.pinNote(payload).subscribe({
      next: () => {
        console.log('Pin API success');
        this.pinToggled.emit();
      },
      error: (err: any) => {
        console.error('Pin API error:', err);
      }
    });

    this.isPined = !this.isPined;
  }
}
