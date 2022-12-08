import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/angular';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { PublicPopupComponent } from '../../popup/public-popup/public-popup.component';

@Component({
  selector: 'app-invite-partners',
  templateUrl: './invite-partners.component.html',
  styleUrls: ['./invite-partners.component.css']
})
export class InvitePartnersComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  @Input() emailAccount : string = 'nguyenphuocdang1234@gmail.com';
  partnerEmail: string = '';
  description: string = 'Sharing Calendar';
  @Input() status: string = 'Not Public';
  constructor(
    private storageService: LocalStorageService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> 
  {
    const INITIAL_EVENTS: EventInput[] = this.storageService.getActiveCalendar();
    if (INITIAL_EVENTS != null)
    {
      forwardRef(() => Calendar);
      this.calendarOptions = {       
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        events: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventColor: '#378006',
        // select: this.handleDateSelect.bind(this),
        // eventClick: this.handleEventClick.bind(this),
        // eventsSet: this.handleEvents.bind(this)
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      };
    }
  }

  openPublicCalendarPopup()
  {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 
    {
      title: 'PUBLIC YOUR CALENDAR',
    };
    this.dialog.open(PublicPopupComponent, dialogConfig);
  }

}


