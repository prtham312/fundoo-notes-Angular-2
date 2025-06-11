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
    TrashComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  pinnedNotes: any[] = [];
  otherNotes: any[] = [];

  isSidenavOpen = false;
  isHovered = false;
  currentSection = 'notes';
  viewMode: 'grid' | 'list' = 'grid';
  isMobile = false;

  constructor(
    private notesService: NotesService,
    private router: Router
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

    this.fetchNotesFromAPI();

    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const lastSegment = e.urlAfterRedirects.split('/').pop();
      this.currentSection = lastSegment;
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
        const visible = all.filter((n : any) => !n.isArchived && !n.isDeleted);
        this.pinnedNotes = visible.filter((n:any) => n.isPined);
        this.otherNotes = visible.filter((n:any) => !n.isPined);
      },
      error: (err) => console.error('Error fetching notes:', err)
    });
  }



  onNoteCreated(note: any) {
    console.log('Note created event received:', note);
    this.fetchNotesFromAPI();
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

  onNoteArchived() {
    this.fetchNotesFromAPI(); // refresh to remove from list
  }

}
