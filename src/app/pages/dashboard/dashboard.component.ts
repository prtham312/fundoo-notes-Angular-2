import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoteCardComponent } from 'src/app/components/note-card/note-card.component';
import { NoteInputComponent } from 'src/app/components/note-input/note-input.component';
import { MatIconModule } from '@angular/material/icon';
import { NotesService } from 'src/app/services/notes/notes.service';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isSidenavOpen = false;
  isHovered = false;
  currentSection = 'notes';
  viewMode: 'grid' | 'list' = 'grid';
  isMobile = false;

  notes: { title: string; description: string }[] = [];

  constructor(private notesService: NotesService) {}

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
  }

  toggleViewMode() {
    if (this.isMobile) return;

    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('viewMode', this.viewMode);
  }

  fetchNotesFromAPI() {
    this.notesService.getAllNotes().subscribe({
      next: (res: any) => {
        const apiNotes = res.data?.data;
        this.notes = apiNotes
          .filter((n: any) => !n.isArchived && !n.isDeleted)
          .reverse();
      },
      error: (err) => {
        console.error('Error fetching notes:', err);
      },
    });
  }

  onNoteCreated(note: any) {
    console.log('Note received in dashboard:', note);
    this.notes.unshift(note);
    setTimeout(() => this.fetchNotesFromAPI(), 300);
  }

  setSection(section: string) {
    this.currentSection = section;
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
}
