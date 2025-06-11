import { Component, Input , Output , EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule , MatIconModule],
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

@Input() noteId!: string;
@Input() title: string = '';
@Input() color: string = '#fff';
@Input() id!: string;
@Input() description: string = '';
@Input() isPinned: boolean = false;
@Input() isArchived: boolean = false;
@Input() isDeleted: boolean = false;
@Output() archived = new EventEmitter<void>();
@Input() context: 'notes' | 'archive' = 'notes';


onArchive() {
  const payload = {
    noteIdList: [this.id],
    isArchived: true
  };

  this.notesService.archiveNote(payload).subscribe({
    next: () => {
      console.log('Note archived successfully');
      this.archived.emit(); // ✅ tell parent to refresh
    },
    error: (err) => {
      console.error('Error archiving note', err);
    }
  });
}



}
