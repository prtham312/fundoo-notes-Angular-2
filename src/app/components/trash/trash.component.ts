import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NotesService } from 'src/app/services/notes/notes.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, MatIconModule, NoteCardComponent],
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css'],
})
export class TrashComponent implements OnInit, OnDestroy {
  trashedNotes: any[] = [];
  @Input() viewMode: 'grid' | 'list' = 'grid';

  private routeSub!: Subscription;

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrashedNotes();

    // 🔁 Listen to navigation changes
    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.includes('/dashboard/trash')) {
          this.loadTrashedNotes();
        }
      });
  }

  loadTrashedNotes() {
    this.notesService.getTrashedNotes().subscribe({
  next: (res: any) => {
    console.log('Raw Trash API Data:', res.data.data); // ✅

    this.trashedNotes = res.data.data
      .filter((note: any) => note.isDeleted && !note.isArchived)
      .reverse();
  },
  error: (err) => console.error('Failed to load trashed notes', err),
});
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
