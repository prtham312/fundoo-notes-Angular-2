import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  @Input() viewMode!: 'grid' | 'list';
  @Output() toggleView = new EventEmitter<void>();
  @Output() menuClicked = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();
  @Input() title: string = 'Keep';


  mobileSearchOpen = false;
  searchTerm: string = '';

  constructor(private router: Router) {}

  toggleViewMode() {
    this.toggleView.emit();
  }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  toggleSidebar() {
    this.menuClicked.emit();
  }

  onSearch(term: string) {
    this.searchChanged.emit(term.trim());
  }
}
