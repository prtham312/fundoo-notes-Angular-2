import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ToolbarComponent , SidenavComponent , MatSidenavModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isSidenavOpen = false;   
  isHovered = false;

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
