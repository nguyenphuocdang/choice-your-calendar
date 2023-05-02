import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  defaultElevation = 2;
  raisedElevation = 8;
  freePlanType = 'BASIC';
  costPlanType = 'BUSINESS';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSelectPlanClick(event: MouseEvent, planType: string) {
    this.router.navigate(['/signup'], { state: { planType: planType } });
  }
}
