import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbItemClickEvent } from 'primeng/breadcrumb';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../../core/services';
import * as APlayer from 'aplayer';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined = { icon: 'pi pi-home', routerLink: '/' };
  id!: number;
  post: any;
  player: any;
  isEn = true;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private electronService: ElectronService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.id = res.id;
    });
  }

  ngAfterViewInit(): void {
    this.getPostInfo();
  }

  handleItemClick(event: BreadcrumbItemClickEvent) {
    if (event.item.label === 'Posts') {
      this.location.back();
    }
  }

  getPostInfo() {
    this.electronService.getPostDetail(this.id, (post: any) => {
      this.zone.run(() => {
        this.post = post;
        this.items = [{ label: 'Posts' }, { label: post.title }];
        this.player = new APlayer({
          container: document.getElementById('player'),
          lrcType: 3,
          audio: [
            {
              name: post.title,
              artist: post.category,
              url: post.audio_link,
              lrc: `https://www.51voa.com${post.lrc_link}`,
            },
          ],
        });
      });
    });
  }

  translate() {
    if (this.isEn) {
      this.isEn = false;
      return;
    }
    this.isEn = true;
  }

  ngOnDestroy(): void {
    this.player.destroy();
  }
}
