import {Component, HostListener, OnInit, Output, PLATFORM_ID, Inject, ViewChild} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { navbarData } from "./nav-data";
import { EventEmitter } from "@angular/core";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {INavbarData} from "./helper";
import { CalendarComponent } from '../calendar/calendar.component';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave',[
        style({opacity: 1}),
        animate('350ms',
          style({opacity: 0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter',[
        animate('650ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter();
  @ViewChild(CalendarComponent, { static: true }) private calendarComponent!: CalendarComponent;
  @ViewChild('fullCalendar') fullCalendar: any;

  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.collapsed = false;
        this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
      }
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    if(!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded
  }
  handleSidenavClick(): void {
    if (this.fullCalendar) {
      // Log to check if fullCalendar is defined
      console.log("FullCalendar Component exists:", this.fullCalendar);

      // Check if the FullCalendar component is visible before refreshing
      if (this.collapsed) {
        // Toggle the sidebar to open it
        this.toggleCollapse();

        // Set a timeout to ensure the sidebar animation completes before refreshing
        setTimeout(() => {
          // Attempting to call the refreshCalendar method
          this.fullCalendar.refreshCalendar();
          console.log("Refreshed FullCalendar");
        }, 500); // Adjust the timeout value as needed
      }
    } else {
      console.error("FullCalendar Component not found or not initialized");
    }
  }


}
