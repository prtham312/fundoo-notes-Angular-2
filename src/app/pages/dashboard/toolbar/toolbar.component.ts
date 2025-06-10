import { Component, EventEmitter, Output , Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatToolbarModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
@Input() viewMode!: 'grid' | 'list';
@Output() toggleView = new EventEmitter<void>();


  isGrid = true;

  toggleViewMode() {
    this.toggleView.emit();
  }

  refreshPage() {
    location.reload();
  }

  @Output() menuClicked = new EventEmitter<void>();

  toggleSidebar() {
    this.menuClicked.emit();
  }

  mobileSearchOpen = false;
}