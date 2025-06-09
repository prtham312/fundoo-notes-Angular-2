import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Output , EventEmitter } from '@angular/core';



@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule , MatSidenavModule ,  MatListModule , MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  selected = 'notes';

 @Output() sectionSelected = new EventEmitter<string>();

  select(item: string) {
    this.selected = item;
    this.sectionSelected.emit(item); // ✅ emit to dashboard
  }
}
