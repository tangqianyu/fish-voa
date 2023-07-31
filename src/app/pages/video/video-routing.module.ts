import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';

const routes: Routes = [
  {
    path: 'video-list/:category',
    component: VideoListComponent,
  },
  {
    path: 'video-detail/:id',
    component: VideoDetailComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
