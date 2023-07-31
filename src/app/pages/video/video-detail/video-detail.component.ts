import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbItemClickEvent } from 'primeng/breadcrumb';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../../core/services';
import { VgApiService } from '@videogular/ngx-videogular/core';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
})
export class VideoDetailComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined = { icon: 'pi pi-home', routerLink: '/' };
  id!: number;
  post: any;
  api!: VgApiService;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private electronService: ElectronService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.id = res.id;
      this.getPostInfo();
    });
  }

  ngAfterViewInit(): void {
    // this.getPostInfo();
  }

  handleItemClick(event: BreadcrumbItemClickEvent) {
    if (event.item.label === 'Videos') {
      this.location.back();
    }
  }

  getPostInfo() {
    this.electronService.getVideoDetail(this.id, (post: any) => {
      this.zone.run(() => {
        this.post = post;
        this.items = [{ label: 'Videos' }, { label: post.title }];
      });
    });
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
  }

  ngOnDestroy(): void {
    // this.player.destroy();
  }
}
