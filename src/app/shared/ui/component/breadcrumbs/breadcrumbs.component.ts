import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { BreadcrumbService } from '../../../data-access/api/breadcrumbs.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'oivan-breadcrumbs',
  standalone: true,
  imports: [RouterModule, CommonModule, NzBreadCrumbModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnChanges {
  @Input() houseName: string | null = null;
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.breadcrumbs.filter(breadcrumb => breadcrumb.label !== undefined);
    this.updateBreadcrumbs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['houseName']) {
      this.updateBreadcrumbs();
    }
  }

  private updateBreadcrumbs(): void {
    // Remove the "House" breadcrumb if it exists
    this.breadcrumbs = this.breadcrumbs.filter(breadcrumb => breadcrumb.label !== 'House');

    if (this.houseName) {
      if (this.breadcrumbs.length > 0) {
        this.breadcrumbs[this.breadcrumbs.length - 1] = { label: this.houseName, url: '' };
      } else {
        this.breadcrumbs.push({ label: this.houseName, url: '' });
      }
    }
  }
}