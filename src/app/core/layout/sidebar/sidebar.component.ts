import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CALCULATORS_CONFIG } from '../../../shared/calculators.config';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  config = CALCULATORS_CONFIG;
  layoutService = inject(LayoutService);
}
