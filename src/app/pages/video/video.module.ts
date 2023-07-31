import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';

@NgModule({
  declarations: [VideoListComponent, VideoDetailComponent],
  imports: [CommonModule, SharedModule, VideoRoutingModule],
})
export class VideoModule {}
