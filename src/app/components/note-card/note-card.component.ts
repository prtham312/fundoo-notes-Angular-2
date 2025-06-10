import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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



toggleSelect(event: MouseEvent) {
  event.stopPropagation();
  this.isSelected = !this.isSelected;
}

@Input() noteId!: string;
@Input() title: string = '';
@Input() description: string = '';
@Input() color: string = '';
@Input() isPinned: boolean = false;
@Input() isArchived: boolean = false;
@Input() isDeleted: boolean = false;
}
