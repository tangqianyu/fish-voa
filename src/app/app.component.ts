import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { PrimeNGConfig } from "primeng/api";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private primengConfig: PrimeNGConfig
  ) {
    this.translate.setDefaultLang('en');
    this.primengConfig.ripple = true;

  }
}
