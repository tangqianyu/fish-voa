import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostRoutingModule } from './pages/post/post-routing.module';
import { VideoRoutingModule } from './pages/video/video-routing.module';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'post/post-list/Technology_Report', pathMatch: 'full' },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'post',
        loadChildren: () => import('./pages/post/post.module').then(m => m.PostModule),
      },
      {
        path: 'video',
        loadChildren: () => import('./pages/video/video.module').then(m => m.VideoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {}), PostRoutingModule, VideoRoutingModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
