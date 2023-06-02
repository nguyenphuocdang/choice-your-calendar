import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import {
  MatDrawerContainer,
  MatSidenav,
  MatSidenavContainer,
} from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import {
  BookingSlotRequest,
  CreateExternalSlotRequest,
  DateBookingSlot,
  EventDetail,
  EventSearchRequest,
  MakeEventRequest,
  SingleEventDetail,
} from 'src/app/_models/event';
import { socketRequest } from 'src/app/_models/request';
import { SearchDevice } from 'src/app/_models/resource';
import { ResourceBasicInfo, ResourceDetail } from 'src/app/_models/resource';
import {
  ApiResponse,
  CustomError,
  DataListResponse,
} from 'src/app/_models/response';
import {
  BookingSlot,
  PublicBookingSlot,
  ScheduleData,
  ScheduleDatas,
  TimeData,
} from 'src/app/_models/schedule';
import { UserBusinessDetail, UserProfile } from 'src/app/_models/user';
import { EventService } from 'src/app/_services/event.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import { DeviceService } from 'src/app/_services/resource.service';
import { SocketService } from 'src/app/_services/socket.service';
import { UserService } from 'src/app/_services/user.service';
import Utils from 'src/app/_utils/utils';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-booking-resources',
  templateUrl: './booking-resources.component.html',
  styleUrls: ['./booking-resources.component.scss'],
})
export class BookingResourcesComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  resourceType: ResourceBasicInfo[] = [];
  resourceRoom: ResourceDetail[] = [];
  resourceSupportDevice: ResourceDetail[] = [];
  resourcePeople: UserBusinessDetail[] = [];
  selectedResourceTypeValue: string[] = [];
  selectedResourceRoom: ResourceDetail[] = [];
  selectedResourceDevice: ResourceDetail[] = [];
  selectedResourcePeople: UserBusinessDetail[] = [];
  isSelectRoom: boolean = false;
  isSelectDevice: boolean = false;
  isSelectPeople: boolean = false;
  selectedResourceFormControl = new FormControl();
  selectedResourceTypeFormControl = new FormControl();
  tooltipSelectedResources: string = '';
  upcomingEvents: EventDetail[] = [];
  pendingEvents: EventDetail[] = [];
  cancelEvents: EventDetail[] = [];
  previousEvents: EventDetail[] = [];
  organizationEvents: EventDetail[] = [];
  externalEvents: EventDetail[] = [];
  isShowingBookSidenav: boolean = false;
  isShowingConfirmBookSidenav: boolean = false;
  isShowingConfirmRescheduleBookSidenav: boolean = false;
  isShowingEventInfoSidenav: boolean = false;
  isShowingGenerateExternalSlotsSidenav: boolean = false;
  isShowingRescheduleOrganizationEventSidenav: boolean = false;
  weekdays: DateBookingSlot[] = [];
  indexSelectedWeekday: number = 0;
  // eventDurationFormControl = new FormControl('30 minutes');
  eventDuration: string = '';
  bookingSlots: BookingSlot[] = [];
  rescheduleBookingSlots: BookingSlot[] = [];
  publicBookingSlots: BookingSlot[] = [];
  selectedPublicBookingSlots: PublicBookingSlot[] = [];
  indexSelectedBookingSlot: number = 0;
  user: UserProfile = this.storageService.getUserProfile();
  currentIdUser: number = this.user.id;
  makeEventForm: UntypedFormGroup = this.fb.group({
    eventDuration: [''],
    freeScheduleFlag: [false],
    eventName: ['', Validators.required],
    eventDescription: [''],
    eventLocation: [''],
    genMeetingLinkFlag: [false],
    eventType: [''],
    publicModeFlag: [false],
    publicShareModeFlag: [false],
    listDeviceId: [[]],
    listPartnerId: [[]],
    startTime: [''],
    endTime: [''],
    schedulingEventType: ['personal-booking'],
  });

  rescheduleEventForm: UntypedFormGroup = this.fb.group({
    startTime: [''],
    endTime: [''],
    eventName: [''],
    eventDescription: [''],
    eventType: [''],
    eventLocation: [''],
    eventDuration: [''],
  });

  displaySelectedResourceRoom: ResourceDetail[] = [];
  displaySelectedResourceDevice: ResourceDetail[] = [];
  displaySelectedResourcePeople: UserBusinessDetail[] = [];
  displayEventLocation: string = '';
  displayEventDevice: string = '';
  displayEventParticipants: string = '';

  selectedDatePicker: Date = new Date();
  minDate: Date = new Date();
  @ViewChild('datepicker') datepicker!: MatDatepicker<Date>;
  rescheduleEventId: number = 0;
  constructor(
    private fb: UntypedFormBuilder,
    private socketService: SocketService,
    private resourceService: DeviceService,
    private eventService: EventService,
    private toastrService: ToastrService,
    private organizationService: OrganizationService,
    private storageService: LocalStorageService,
    @Optional() private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this._handleWebSocket();
    this._getResourceType();
    this._getAllResources();
    this._getAllUserInOrganization();
    this._getEventList();
    // this._handleWebsocketForReceivingResourceApproval();
  }

  _getResourceType() {
    try {
      this.resourceService
        .getResourceType()
        .subscribe((response: ApiResponse<ResourceBasicInfo[]>) => {
          if (response.statusCode === 200) {
            this.resourceType = response.data;
          } else {
            this.toastrService.error(
              'Error in getting resources type',
              'ERROR'
            );
          }
        });
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting resources type', 'ERROR');
    }
  }

  _getAllResources() {
    try {
      const requestBody: SearchDevice = {
        approverFullName: '',
        code: '',
        description: '',
        location: '',
        name: '',
      };
      this.resourceService
        .getAllResources(requestBody)
        .subscribe(
          (response: ApiResponse<DataListResponse<ResourceDetail[]>>) => {
            if (response.statusCode === 200) {
              response.data.content.forEach((element, index) => {
                if (
                  element.deviceType != null &&
                  element.deviceType === 'ROOM'
                ) {
                  this.resourceRoom.push(element);
                } else if (
                  element.deviceType != null &&
                  element.deviceType === 'DEVICE'
                ) {
                  this.resourceSupportDevice.push(element);
                }
              });
            } else {
              debugger;
              this.toastrService.error('Error in getting resources', 'ERROR');
            }
          }
        );
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting resources', 'ERROR');
    }
  }

  _getAllUserInOrganization() {
    try {
      this.organizationService
        .getUserInOrganization()
        .subscribe(
          (response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
            if (response.statusCode === 200) {
              response.data.content.forEach((element) => {
                if (
                  element.fullname != 'User Default' &&
                  element.id != this.currentIdUser
                ) {
                  this.resourcePeople.push(element);
                }
              });
            } else {
              debugger;
              this.toastrService.error('Error in getting users', 'ERROR');
            }
          }
        );
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting users', 'ERROR');
    }
  }

  onResourceTypeSelectChangeAction(event: any) {
    this.isSelectRoom = false;
    this.isSelectDevice = false;
    this.isSelectPeople = false;
    this.selectedResourceTypeFormControl.value.forEach((element: any) => {
      if (element === 'Meeting Room') {
        this.selectedResourceRoom = this.resourceRoom;
        this.isSelectRoom = true;
      }
      if (element === 'Person') {
        this.selectedResourcePeople = this.resourcePeople;
        this.isSelectPeople = true;
      }
      if (element === 'Support Device') {
        this.selectedResourceDevice = this.resourceSupportDevice;
        this.isSelectDevice = true;
      }
    });
  }

  onResourceSelectionChangeAction(event: any) {
    if (this.selectedResourceFormControl.value?.length > 2) {
      const tempTooltipContent: string[] = [];
      this.selectedResourceFormControl.value
        .slice(2)
        .forEach((element: any) => {
          if (element.deviceType != null) tempTooltipContent.push(element.name);
          else tempTooltipContent.push(element.fullname);
        });
      this.tooltipSelectedResources = tempTooltipContent.join(', ');
    }
  }

  _getEventList() {
    try {
      let defaultPage: number = 0;
      let defaultSize: number = 100;
      let currentDate: Date = new Date();
      let nextYearDate: Date = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      let lastYearDate: Date = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      //Example: "2023-05-14T17:00:00.000Z"
      let isoLastYearDate: string = lastYearDate.toISOString(); //Example: "2022-05-14T17:00:00.000Z"
      let isoNextYearDate: string = nextYearDate.toISOString(); //Example: "2024-05-14T17:00:00.000Z"
      let isoCurrentlyDate: string = currentDate.toISOString();
      let requestBody: EventSearchRequest = {
        endTime: isoCurrentlyDate,
        eventDescription: '',
        eventName: '',
        hostName: '',
        partnerName: '',
        startTime: isoLastYearDate,
      };
      const sortCondition: string = 'id,DESC';
      //Get all events from last year to next year
      this.eventService
        .getEventList(requestBody, defaultPage, defaultSize, sortCondition)
        .subscribe((response: ApiResponse<DataListResponse<EventDetail[]>>) => {
          if (response.statusCode === 200) {
            response.data.content.forEach((element: any) => {
              const event: EventDetail = new EventDetail(element);
              this.previousEvents.push(event);
              if (event.publicModeFlag && !event.cexternalEventFlag)
                this.organizationEvents.push(event);
              if (event.cexternalEventFlag) this.externalEvents.push(event);
            });
          }
        });
      //Get all events from current day to next year

      let upcomingEventsRequestBody: EventSearchRequest = {
        endTime: isoNextYearDate,
        eventDescription: '',
        eventName: '',
        hostName: '',
        partnerName: '',
        startTime: isoCurrentlyDate,
      };
      this.eventService
        .getEventList(
          upcomingEventsRequestBody,
          defaultPage,
          defaultSize,
          sortCondition
        )
        .subscribe((response: ApiResponse<DataListResponse<EventDetail[]>>) => {
          if (response.statusCode === 200) {
            response.data.content.forEach((element: any) => {
              const event: EventDetail = new EventDetail(element);
              this.upcomingEvents.push(event);
              if (event.publicModeFlag && !event.cexternalEventFlag)
                this.organizationEvents.push(event);
              if (event.cexternalEventFlag) this.externalEvents.push(event);
            });
          }
        });
    } catch (error) {
      debugger;
      // this.toastrService.error('Error in getting events', 'ERROR');
    }
  }

  scheduleBookingResource() {
    if (
      this.makeEventForm.get('schedulingEventType')!.value ===
      'public-sharing-slot'
    ) {
      this.triggerPublicSharingSlotSidenav();
    } else {
      if (
        this.makeEventForm.get('schedulingEventType')!.value === 'company-event'
      ) {
        this.makeEventForm.get('publicModeFlag')!.setValue(true);
      }
      this.triggerBookingSidenav();
    }
  }

  triggerBookingSidenav() {
    this._handleCreateEventForm();
    const currentDate: Date = new Date();
    this._handleWeekdays(currentDate);
    this.makeEventForm!.get('listPartnerId')!.setValue([this.currentIdUser]);
    this._handleResourceSelection();
    this._getBookingSlots(0);
    this.isShowingBookSidenav = true;
  }

  triggerPublicSharingSlotSidenav() {
    const currentDate: Date = new Date();
    this._handleWeekdays(currentDate);
    this.makeEventForm!.get('listPartnerId')!.setValue([this.currentIdUser]);
    this._handleResourceSelection();
    const isOpeningPublicSchedule: boolean = true;
    this._getBookingSlots(0, isOpeningPublicSchedule);
    this.isShowingGenerateExternalSlotsSidenav = true;
  }

  _handleResourceSelection() {
    //Handle Resource
    const listDeviceId: number[] = [];
    const listPartnerId: number[] = [];
    this.displaySelectedResourceDevice = [];
    this.displaySelectedResourcePeople = [];
    this.displaySelectedResourceRoom = [];
    if (this.selectedResourceFormControl.value) {
      listPartnerId.push(this.currentIdUser);
      this.selectedResourceFormControl.value.forEach((element: any) => {
        if (element.deviceType != null) {
          listDeviceId.push(element.id);
          if (element.deviceType === 'ROOM') {
            this.displaySelectedResourceRoom.push(element);
          } else if (element.deviceType === 'DEVICE')
            this.displaySelectedResourceDevice.push(element);
        } else {
          listPartnerId.push(element.id);
          this.displaySelectedResourcePeople.push(element);
        }
      });
      this.makeEventForm!.get('listDeviceId')!.setValue(listDeviceId);
      this.makeEventForm!.get('listPartnerId')!.setValue(listPartnerId);
    }
    if (this.displaySelectedResourcePeople.length > 0)
      this.displayEventParticipants = this.displaySelectedResourcePeople
        .map((element) => element.fullname)
        .join(', ');
    if (this.displaySelectedResourceRoom.length > 0)
      this.displayEventLocation = this.displaySelectedResourceRoom
        .map((element) => element.name)
        .join(', ');
    if (this.displayEventLocation.length > 0)
      this.makeEventForm!.get('eventLocation')!.setValue(
        this.displayEventLocation
      );
    this._handleCreateEventForm();
  }

  _handleCreateEventForm() {
    let defaultEventDuration: string = '30 minutes';
    let defaultEventType: string = '';
    if (this.makeEventForm.get('listDeviceId')!.value.length > 0)
      defaultEventType = 'Offline';
    else {
      defaultEventType = 'Online';
      this.makeEventForm.get('eventLocation')?.setValue('Google Meet Link');
    }
    this.makeEventForm.get('eventDuration')?.setValue(defaultEventDuration);
    this.makeEventForm.get('eventType')?.setValue(defaultEventType);
  }
  _handleWeekdays(selectedDate: Date) {
    if (this.weekdays.length > 0) {
      if (this.weekdays[this.indexSelectedWeekday])
        this.weekdays[this.indexSelectedWeekday].selectFlag = false;
      this.indexSelectedWeekday = 0;
      this.weekdays[0].selectFlag = true;
    } else {
      for (let i = 0; i < 7; i++) {
        let dateFormat = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate() + i
        );
        const weekday: DateBookingSlot = {
          code: dateFormat.toLocaleString('en-US', { weekday: 'short' }),
          day:
            dateFormat.getDate() < 10
              ? `0${dateFormat.getDate()}`
              : `${dateFormat.getDate()}`,
          date_ddmmyy: Utils.convertFromDatetoDDMMYY(dateFormat),
          date: dateFormat,
          selectFlag: false,
        };
        this.weekdays.push(weekday);
        this.weekdays[this.indexSelectedWeekday].selectFlag = true;
      }
    }
  }

  onDateChange(date: Date) {
    this.weekdays = [];
    this._handleWeekdays(date);
  }

  closeBookingSidenav() {
    if (this.isShowingBookSidenav) this.isShowingBookSidenav = false;
  }
  closePublicSharingSlotSidenav() {
    if (this.isShowingGenerateExternalSlotsSidenav)
      this.isShowingGenerateExternalSlotsSidenav = false;
  }

  closeRescheduleSidenav() {
    if (this.isShowingRescheduleOrganizationEventSidenav)
      this.isShowingRescheduleOrganizationEventSidenav = false;
  }

  dateSelect(index: number) {
    if (this.weekdays[this.indexSelectedWeekday])
      this.weekdays[this.indexSelectedWeekday].selectFlag = false;
    this.indexSelectedWeekday = index;
    this.weekdays[this.indexSelectedWeekday].selectFlag = true;
    if (this.bookingSlots.length > 0) {
      this.bookingSlots[this.indexSelectedBookingSlot].selectFlag = false;
    }
    // this.isShowingConfirmBookSidenav = true;
    this._getBookingSlots(this.indexSelectedWeekday);
  }

  dateSelectForPublicBooking(index: number) {
    if (this.weekdays[this.indexSelectedWeekday])
      this.weekdays[this.indexSelectedWeekday].selectFlag = false;
    this.indexSelectedWeekday = index;
    this.weekdays[this.indexSelectedWeekday].selectFlag = true;
    const isOpeningPublicSchedule: boolean = true;
    this._getBookingSlots(this.indexSelectedWeekday, isOpeningPublicSchedule);
  }

  dateSelectForReschedule(index: number) {
    if (this.weekdays[this.indexSelectedWeekday])
      this.weekdays[this.indexSelectedWeekday].selectFlag = false;
    this.indexSelectedWeekday = index;
    this.weekdays[this.indexSelectedWeekday].selectFlag = true;
    if (this.rescheduleBookingSlots.length > 0) {
      this.rescheduleBookingSlots[this.indexSelectedBookingSlot].selectFlag =
        false;
    }
    this._getBookingSlotsForReschedule(
      this.rescheduleEventId,
      this.indexSelectedWeekday
    );
  }

  onSelectionChangeEventDuration() {
    const isOpeningPublicSchedule: boolean = true;
    this._getBookingSlots(this.indexSelectedWeekday, isOpeningPublicSchedule);
  }

  onSelectionChangeEventType() {
    if (this.makeEventForm.get('eventType')!.value === 'Online') {
      this.makeEventForm.get('eventLocation')?.setValue('Google Meet Link');
    } else {
      this.makeEventForm
        .get('eventLocation')
        ?.setValue(this.displayEventLocation);
    }
  }
  _getBookingSlots(index: number, flag?: boolean) {
    try {
      //Handle Duration
      let eventDuration: number = 0;
      let match =
        this.makeEventForm!.get('eventDuration')!.value.match(
          /^\d+(?= minutes)/
        );
      if (match) eventDuration = parseInt(match[0]);
      //Handle Time
      let selectedDate: Date = new Date(this.weekdays[index].date);
      let fromDate: string = '';
      if (index == 0) {
        let currentDate: Date = new Date();
        currentDate.setHours(currentDate.getHours() + 7);
        currentDate.setMinutes(
          Math.ceil(currentDate.getMinutes() / eventDuration) * eventDuration
        );
        currentDate.setSeconds(1);
        currentDate.setMilliseconds(0);
        fromDate = currentDate.toISOString();
      } else {
        selectedDate.setHours(0, 0, 0, 0);
        const newDate = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);
        fromDate = newDate.toISOString();
      }
      selectedDate.setHours(23, 59, 0, 0);
      const newDate = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);
      let toDate: string = newDate.toISOString();
      //Handle Request
      let requestBody: BookingSlotRequest = {
        eventDuration: eventDuration,
        freeScheduleFlag: false,
        fromDate: fromDate,
        toDate: toDate,
        listDeviceId: this.makeEventForm.get('listDeviceId')!.value,
        listPartnerId: this.makeEventForm.get('listPartnerId')!.value,
      };
      this.eventService
        .getBookingSlots(requestBody)
        .subscribe((response: ApiResponse<ScheduleDatas>) => {
          if (response.statusCode === 200) {
            const tempBookingSlots: BookingSlot[] = [];
            response.data.scheduleDatas[0].timeDatas.forEach(
              (element: TimeData) => {
                const bookingSlot: BookingSlot = {
                  selectFlag: false,
                  timeDatas: element,
                };
                tempBookingSlots.push(bookingSlot);
              }
            );
            this.bookingSlots = tempBookingSlots;
            if (flag) {
              this.publicBookingSlots = tempBookingSlots;
              this.selectedPublicBookingSlots.forEach((element, index) => {
                if (
                  element.date === this.weekdays[this.indexSelectedWeekday].date
                ) {
                  const findIndex: number = this.publicBookingSlots.findIndex(
                    (item) =>
                      item.timeDatas.startTime ===
                        element.timeDatas.startTime &&
                      item.timeDatas.endTime === element.timeDatas.endTime
                  );
                  this.publicBookingSlots[findIndex].selectFlag = true;
                }
              });
            } else this.bookingSlots = tempBookingSlots;
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
      if (this.selectedResourceFormControl.value == null) {
        this.toastrService.warning(
          'Please select resource for booking request.',
          'WARNING',
          Utils.toastrConfig
        );
      }
    }
  }

  onSelectBookingSlotClicked(index: number) {
    this.bookingSlots[this.indexSelectedBookingSlot].selectFlag = false;
    this.indexSelectedBookingSlot = index;
    this.bookingSlots[this.indexSelectedBookingSlot].selectFlag = true;
    //Handle request formBody
    const startTime: string = this._combineTimeAndDateForRequestType(
      this.bookingSlots[this.indexSelectedBookingSlot].timeDatas.startTime,
      this.weekdays[this.indexSelectedWeekday].date
    );
    const endTime: string = this._combineTimeAndDateForRequestType(
      this.bookingSlots[this.indexSelectedBookingSlot].timeDatas.endTime,
      this.weekdays[this.indexSelectedWeekday].date
    );
    let requestStartTime: string = startTime;
    let requestEndTime: string = endTime;
    this.makeEventForm.get('startTime')?.setValue(requestStartTime);
    this.makeEventForm.get('endTime')?.setValue(requestEndTime);
    this.isShowingConfirmBookSidenav = true;
  }

  onSelectGenerateExternalSlotClicked(index: number) {
    if (this.publicBookingSlots[index].selectFlag) {
      this.publicBookingSlots[index].selectFlag = false;
      const findIndex: number = this.selectedPublicBookingSlots.findIndex(
        (item) => item.timeDatas === this.publicBookingSlots[index].timeDatas
      );
      this.selectedPublicBookingSlots.splice(findIndex, 1);
    } else {
      this.publicBookingSlots[index].selectFlag = true;
      const newPublicSlot: PublicBookingSlot = {
        selectFlag: true,
        timeDatas: this.publicBookingSlots[index].timeDatas,
        date: this.weekdays[this.indexSelectedWeekday].date,
      };
      this.selectedPublicBookingSlots.push(newPublicSlot);
    }
  }

  onSelectRescheduleConfirmSidenav(index: number) {
    this.rescheduleBookingSlots[this.indexSelectedBookingSlot].selectFlag =
      false;
    this.indexSelectedBookingSlot = index;
    this.rescheduleBookingSlots[this.indexSelectedBookingSlot].selectFlag =
      true;
    //Handle request formBody
    const startTime: string = this._combineTimeAndDateForRequestType(
      this.rescheduleBookingSlots[this.indexSelectedBookingSlot].timeDatas
        .startTime,
      this.weekdays[this.indexSelectedWeekday].date
    );
    const endTime: string = this._combineTimeAndDateForRequestType(
      this.rescheduleBookingSlots[this.indexSelectedBookingSlot].timeDatas
        .endTime,
      this.weekdays[this.indexSelectedWeekday].date
    );
    let requestStartTime: string = startTime;
    let requestEndTime: string = endTime;
    this.rescheduleEventForm.get('startTime')?.setValue(requestStartTime);
    this.rescheduleEventForm.get('endTime')?.setValue(requestEndTime);
    this.isShowingConfirmRescheduleBookSidenav = true;
  }

  _combineTimeAndDateForRequestType(time: string, date: Date): string {
    const [hours, minutes] = time.split(':');
    const combinedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Number(hours),
      Number(minutes)
    );
    const _earlier7hourTime: Date = new Date(
      combinedDate.getTime() + 7 * 60 * 60 * 1000
    );
    const requestStartTime: string = _earlier7hourTime.toISOString();
    return requestStartTime;
  }
  onCloseConfirmSidenav() {
    this.isShowingConfirmBookSidenav = false;
  }
  onConfirmBookingSlot() {
    const makeEventRequestBody: MakeEventRequest = {
      startTime: this.makeEventForm.get('startTime')!.value,
      endTime: this.makeEventForm.get('endTime')!.value,
      eventName: this.makeEventForm.get('eventName')!.value,
      eventDescription: this.makeEventForm.get('eventDescription')!.value,
      listDeviceId: this.makeEventForm.get('listDeviceId')!.value,
      listPartnerId: this.makeEventForm.get('listPartnerId')!.value,
      genMeetingLinkFlag:
        this.makeEventForm.get('eventType')!.value === 'Offline' ? false : true,
      publicModeFlag: this.makeEventForm.get('publicModeFlag')!.value,
      location:
        this.makeEventForm.get('eventType')!.value === 'Offline'
          ? this.makeEventForm.get('eventLocation')!.value
          : '',
    };
    debugger;
    makeEventRequestBody.listPartnerId.shift();
    try {
      this.eventService
        .makeNewEvent(makeEventRequestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.makeEventForm.get('publicModeFlag')!.setValue(false);
            this.toastrService.success(
              'Your event is created successfully, the resources booking status will be updated constantly. Please view detail of your event.'
            );
            const data: any = {
              id: response.data.id,
              startTime: response.data.startTime,
              endTime: response.data.endTime,
              hostFlag: '',
              partnerName: '',
              organizationName: '',
              eventStatus: response.data.eventStatusEnum,
              sendEmailFlag: false,
              appointmentUrl: '',
              reason: '',
              eventName: response.data.eventName,
              publicModeFlag: response.data.publicModeFlag,
            };
            const newEvent: EventDetail = new EventDetail(data);
            // this.previousEvents.unshift(newEvent);
            this.upcomingEvents.unshift(newEvent);
            if (newEvent.publicModeFlag)
              this.organizationEvents.unshift(newEvent);
            this.onCloseConfirmSidenav();
          } else {
            debugger;
            this.toastrService.error('Error In Creating Event');
          }
        });
    } catch (error) {
      debugger;
      this.toastrService.error('Error In Creating Event');
    }
  }

  onCloseConfirmRescheduleSidenav() {
    this.isShowingRescheduleOrganizationEventSidenav = false;
  }

  onReschedule() {
    try {
      const requestBody: any = {
        eventName: this.rescheduleEventForm.get('eventName')!.value,
        eventDescription:
          this.rescheduleEventForm.get('eventDescription')!.value,
        eventId: this.rescheduleEventId,
        startTime: this.rescheduleEventForm.get('startTime')!.value,
        endTime: this.rescheduleEventForm.get('endTime')!.value,
      };
      this.eventService
        .rescheduleOrganizationEvent(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Event has been scheduled successfully',
              'SUCCESS'
            );
            const rescheduledEvent: EventDetail = new EventDetail(
              response.data
            );
            const findIndex: number = this.upcomingEvents.findIndex(
              (item) => item.id === rescheduledEvent.id
            );
            this.upcomingEvents[findIndex] = rescheduledEvent;
            this.isShowingConfirmRescheduleBookSidenav = false;
            this.isShowingRescheduleOrganizationEventSidenav = false;
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }

  onViewingEventDetail(event: EventDetail) {
    const dialogRef = this.dialog.open(EventDetailComponent, {
      width: '800px',
      height: 'fit-content',
      data: {
        eventId: event.id,
        publicModeFlag: event.publicModeFlag,
        hostFlag: event.hostFlag,
        participantFlag: true,
      },
    });
    dialogRef.componentInstance.triggerEvent.subscribe(
      (event: SingleEventDetail) => {
        this.triggerReschedulingSidenav(event);
      }
    );
  }

  triggerReschedulingSidenav(event: SingleEventDetail) {
    const currentDate: Date = new Date();
    // const selectedDate: Date = new Date(event.date!);
    this._handleWeekdays(currentDate);
    this.rescheduleEventId = event.id;
    this.rescheduleEventForm.get('eventName')!.setValue(event.eventName);
    this.rescheduleEventForm
      .get('eventDescription')!
      .setValue(event.eventDescription);
    if (event.appointmentUrl == '')
      this.rescheduleEventForm.get('eventType')!.setValue('Offline');
    else this.rescheduleEventForm.get('eventType')!.setValue('Online');

    // if (event.location == '')
    //   this.rescheduleEventForm
    //     .get('eventLocation')!
    //     .setValue('Google Meeting Link');
    // else
    this.rescheduleEventForm.get('eventLocation')!.setValue(event.location);
    // const eventDuration: string = this._getEventDuration(
    //   event.startTime,
    //   event.endTime
    // );
    // this.rescheduleEventForm
    //   .get('eventDuration')!
    //   .setValue(`${eventDuration} minutes`);
    this._getBookingSlotsForReschedule(this.rescheduleEventId, 0);
    this.isShowingRescheduleOrganizationEventSidenav =
      !this.isShowingRescheduleOrganizationEventSidenav;
  }

  _getBookingSlotsForReschedule(eventId: number, index: number) {
    let fromDate: string = '';
    let selectedDate: Date = new Date(this.weekdays[index].date);
    if (index == 0) {
      let currentDate: Date = new Date();
      currentDate.setHours(currentDate.getHours() + 7);
      currentDate.setMinutes(Math.ceil(currentDate.getMinutes() / 60) * 60);
      currentDate.setSeconds(1);
      currentDate.setMilliseconds(0);
      fromDate = currentDate.toISOString();
    } else {
      selectedDate.setHours(0, 0, 0, 0);
      const newDate = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);
      fromDate = newDate.toISOString();
    }
    selectedDate.setHours(23, 59, 0, 0);
    const newDate = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);
    let toDate: string = newDate.toISOString();
    try {
      this.eventService
        .getSlotsForReschedule(fromDate, toDate, eventId)
        .subscribe((response: ApiResponse<ScheduleDatas>) => {
          const tempBookingSlots: BookingSlot[] = [];
          response.data.scheduleDatas[0].timeDatas.forEach(
            (element: TimeData) => {
              const bookingSlot: BookingSlot = {
                selectFlag: false,
                timeDatas: element,
              };
              tempBookingSlots.push(bookingSlot);
            }
          );
          this.rescheduleBookingSlots = tempBookingSlots;
        });
    } catch (error) {
      debugger;
    }
  }

  _getEventDuration(startTime: string, endTime: string): string {
    // Parse the time strings into Date objects
    const timeFormat = /\d{1,2}:\d{2} [AP]M/;
    const time1Match = startTime.match(timeFormat);
    const time2Match = endTime.match(timeFormat);
    let result: string = '';
    if (time1Match && time2Match) {
      const time1 = new Date(`2000-01-01 ${time1Match[0]}`);
      const time2 = new Date(`2000-01-01 ${time2Match[0]}`);
      // Calculate the time difference in milliseconds
      const timeDiff = time2.getTime() - time1.getTime();
      // Convert milliseconds to minutes
      const minutes = Math.floor(timeDiff / (1000 * 60));
      result = minutes.toString();
    }
    return result;
  }

  _handleWebsocketForReceivingResourceApproval() {
    const userId: number = this.storageService.getUserProfile().id;
    this.socketService.subscribe(
      '/user/notify/private-messages',
      (message: any) => {
        debugger;
        const messageData = JSON.parse(message.body);
        console.log(messageData);
      },
      userId
    );
  }

  onClickGeneratingPublicSlot() {
    let length: number = this.selectedPublicBookingSlots.length;
    let flag: number = 0;
    this.selectedPublicBookingSlots.forEach((slot, index) => {
      const startTime: string = this._combineTimeAndDateForRequestType(
        slot.timeDatas.startTime,
        slot.date
      );
      const endTime: string = this._combineTimeAndDateForRequestType(
        slot.timeDatas.endTime,
        slot.date
      );
      const requestBody: CreateExternalSlotRequest = {
        startTime: startTime,
        endTime: endTime,
        eventName: this.makeEventForm.get('eventName')!.value,
        generateMeetingLink:
          this.makeEventForm.get('eventType')!.value === 'Offline'
            ? false
            : true,
        listDeviceId: this.makeEventForm.get('listDeviceId')!.value,
        location:
          this.makeEventForm.get('eventType')!.value === 'Offline'
            ? this.makeEventForm.get('eventLocation')!.value
            : '',
      };
      try {
        this.eventService
          .createExternalSlots(requestBody)
          .subscribe((response: ApiResponse<any>) => {
            if (response.statusCode === 200) {
              flag++;
              console.log(flag);
              console.log(length);
              if (flag == length) {
                this.toastrService.success(
                  'All slots have been generated. Check Public Sharing Slots for more information.',
                  'SUCCESS'
                );
              }
            } else {
              debugger;
            }
          });
      } catch (error: any) {
        debugger;
      }
    });
  }
}
