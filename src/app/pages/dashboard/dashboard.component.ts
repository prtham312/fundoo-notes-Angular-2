import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoteCardComponent } from 'src/app/components/note-card/note-card.component';
import { NoteInputComponent } from 'src/app/components/note-input/note-input.component';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ArchiveComponent } from 'src/app/components/archive/archive.component';
import { TrashComponent } from 'src/app/components/trash/trash.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditNoteDialogComponent } from 'src/app/components/edit-note/edit-note-dialog.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    SidenavComponent,
    MatSidenavModule,
    NoteCardComponent,
    NoteInputComponent,
    MatIconModule,
    RouterModule,
    ArchiveComponent,
    TrashComponent,
    MatDialogModule,
    EditNoteDialogComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  pinnedNotes: any[] = [];
  otherNotes: any[] = [];

  filteredPinned: any[] = [];
  filteredNotes: any[] = [];

  searchTerm: string = '';
  searching: boolean = false;

  isSidenavOpen = false;
  isHovered = false;
  currentSection = 'notes';
  viewMode: 'grid' | 'list' = 'grid';
  isMobile = false;

  constructor(
    private notesService: NotesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
    const saved = localStorage.getItem('viewMode');
    this.viewMode = this.isMobile ? 'list' : (saved as 'grid' | 'list') || 'grid';

    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;

      if (this.isMobile && !wasMobile) {
        this.viewMode = 'list';
      } else if (!this.isMobile && wasMobile) {
        const savedView = localStorage.getItem('viewMode');
        this.viewMode = (savedView as 'grid' | 'list') || 'grid';
      }
    });

    const currentUrl = this.router.url;
    const lastSegment = currentUrl.split('/').pop();
    this.currentSection = lastSegment || 'notes';

    if (this.currentSection === 'notes') {
      this.fetchNotesFromAPI();
    }

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const updatedSegment = e.urlAfterRedirects.split('/').pop();

        if (updatedSegment === 'notes' && updatedSegment !== this.currentSection) {
          this.fetchNotesFromAPI();
        }

        this.currentSection = updatedSegment;
      });
  }

  toggleViewMode() {
    if (this.isMobile) return;
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('viewMode', this.viewMode);
  }

  fetchNotesFromAPI() {
    this.notesService.getAllNotes().subscribe({
      next: (res: any) => {
        const all = res.data?.data || [];
        const visible = all
          .filter((n: any) => !n.isArchived && !n.isDeleted)
          .reverse();

        this.pinnedNotes = visible.filter((n: any) => n.isPined);
        this.otherNotes = visible.filter((n: any) => !n.isPined);

        if (this.searching) {
          this.searchNotes();
        }
      },
      error: (err) => console.error('Error fetching notes:', err),
    });
  }

  onNoteCreated(note: any) {
    if (!note?.title) return;

    if (note.isPined) {
      this.pinnedNotes.unshift(note);
    } else {
      this.otherNotes.unshift(note);
    }

    if (this.searching) this.searchNotes();
  }

  onNoteArchived() {
    this.fetchNotesFromAPI();
  }

  onNoteTrashed(noteId: string) {
    this.pinnedNotes = this.pinnedNotes.filter(note => note.id !== noteId);
    this.otherNotes = this.otherNotes.filter(note => note.id !== noteId);
    if (this.searching) this.searchNotes();
  }

  onSearch(term: string) {
    this.searchTerm = term.trim();
    this.searching = !!this.searchTerm;

    if (this.searching) {
      this.searchNotes();
    } else {
      this.filteredPinned = [];
      this.filteredNotes = [];
    }
  }

  searchNotes() {
    const searchLower = this.searchTerm.toLowerCase();

    this.filteredPinned = this.pinnedNotes.filter(
      note =>
        note.title?.toLowerCase().includes(searchLower) ||
        note.description?.toLowerCase().includes(searchLower)
    );

    this.filteredNotes = this.otherNotes.filter(
      note =>
        note.title?.toLowerCase().includes(searchLower) ||
        note.description?.toLowerCase().includes(searchLower)
    );
  }

  highlight(text: string): string {
    if (!this.searching || !this.searchTerm) return text;

    const escaped = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  get sidenavOpened(): boolean {
    return this.isSidenavOpen || this.isHovered;
  }

  onMouseEnterSidenav() {
    this.isHovered = true;
  }

  onMouseLeaveSidenav() {
    this.isHovered = false;
  }

  // ✅ OPEN EDIT DIALOG
  openEditDialog(note: any) {
    const dialogRef = this.dialog.open(EditNoteDialogComponent, {
      data: {
        id: note.id,
        title: note.title,
        description: note.description
      },
      panelClass: 'edit-note-dialog',
      backdropClass: 'blurred-backdrop'
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        // live update without refresh
        const noteList = note.isPined ? this.pinnedNotes : this.otherNotes;
        const index = noteList.findIndex(n => n.id === note.id);
        if (index > -1) {
          noteList[index].title = updated.title;
          noteList[index].description = updated.description;
        }
      }
    });
  }

  get sectionTitle(): string {
  switch (this.currentSection) {
    case 'archive':
      return 'Archive';
    case 'trash':
      return 'Trash';
    case 'reminders':
      return 'Reminders';
    case 'notes':
    default:
      return 'Keep';
  }
}

}
