import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule , MatSidenavModule ,  MatListModule , MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  selected = 'notes';

  select(item: string) {
    this.selected = item;
  }
}
