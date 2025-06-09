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
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSidenavOpen = false;
  isHovered = false;
  currentSection = 'notes';

  notes: { title: string; description: string }[] = [];

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.fetchNotesFromAPI();
  }

 fetchNotesFromAPI() {
  this.notesService.getAllNotes().subscribe({
    next: (res: any) => {
      const apiNotes = res.data?.data;
      this.notes = apiNotes
        .filter((n: any) => !n.isArchived && !n.isDeleted)
        .reverse(); // ✅ newest notes first
    },
    error: (err) => {
      console.error('Error fetching notes:', err);
    }
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
