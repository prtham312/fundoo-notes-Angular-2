import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoteCardComponent } from 'src/app/components/note-card/note-card.component';
import { NoteInputComponent } from 'src/app/components/note-input/note-input.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ToolbarComponent , SidenavComponent , MatSidenavModule , NoteCardComponent , NoteInputComponent , MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidenavOpen = false;
  isHovered = false;
  currentSection = 'notes';

  setSection(section: string) {
  this.currentSection = section;
}

  notes : {title : string ; description : string}[] = [];

  onNoteCreated(note: { title: string; description: string }) {
  this.notes.unshift(note);
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