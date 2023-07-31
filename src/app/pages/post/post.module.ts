import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

@NgModule({
  declarations: [PostListComponent, PostDetailComponent],
  imports: [CommonModule, SharedModule, PostRoutingModule],
})
export class PostModule {}
