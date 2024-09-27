import { registerLocaleData } from "@angular/common";
import en from '@angular/common/locales/en'
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { ShellRoutes } from "./shell.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { interceptors } from "../../shared/utils/interceptor/interceptors";
import { provideNzIcons } from 'ng-zorro-antd/icon'
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n'
import { icons } from "../../shared/ui/icons/icons-provider";
import { FormsModule } from "@angular/forms";

registerLocaleData(en);

export const shellConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(ShellRoutes, withComponentInputBinding()),
        // provideClientHydration() -> just open when remove zoneJs
        provideAnimations(),
        provideHttpClient(withInterceptors([interceptors])), provideNzIcons(icons), provideNzI18n(en_US), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(),
    ]
}