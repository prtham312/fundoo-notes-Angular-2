import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './icon-list.component.html',
  styleUrls: ['./icon-list.component.css'],
})
export class IconListComponent {
  @Input() context: 'create' | 'view' = 'create'; // where it's used
  @Input() noteId?: string; // for note-card actions

  @Output() archiveClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();
  @Output() colorSelected = new EventEmitter<string>();

  showColorPalette = false;

  colors = ['#fff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8'];

  togglePalette() {
    this.showColorPalette = !this.showColorPalette;
  }

  pickColor(color: string) {
    this.colorSelected.emit(color);
    this.showColorPalette = false;
  }

  onArchive() {
    this.archiveClicked.emit();
  }

  onDelete() {
    this.deleteClicked.emit();
  }
}
