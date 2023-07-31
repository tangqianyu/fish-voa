import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { BackComponent } from './components';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [WebviewDirective, SafeHtmlPipe, BackComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    DataViewModule,
    PaginatorModule,
    BreadcrumbModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    DataViewModule,
    PaginatorModule,
    BreadcrumbModule,
    InputTextModule,
    DropdownModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ButtonModule,
    SafeHtmlPipe,
    BackComponent,
  ],
})
export class SharedModule {}
