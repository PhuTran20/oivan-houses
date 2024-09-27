import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from "./component/footer/footer.component";

@Component({
    selector: 'oivan-layout',
    standalone: true,
    template: `
        <div class="min-h-screen flex flex-col">
            <oivan-header></oivan-header>
            <div class="flex-grow">
                <router-outlet></router-outlet>
            </div>
            <oivan-footer></oivan-footer>
        </div>
    `,
    imports: [RouterModule, DatePipe, HeaderComponent, FooterComponent],
    styles: ``,
    animations: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LayoutComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}