import { Component } from '@angular/core';
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
isGrid = true;

toggleView() {
  this.isGrid = !this.isGrid;
}

refreshPage() {
  location.reload();
}

toggleSidebar() {
}
mobileSearchOpen = false;

}
