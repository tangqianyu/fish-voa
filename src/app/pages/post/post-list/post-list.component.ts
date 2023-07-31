import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../../core/services';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  postList = [];
  category!: string;
  pageNumber = 1;
  pageSize = 5;
  orderType = 'DESC';
  keyword: string = '';
  sortOptions = [
    { label: 'Date High to Low', value: 'DESC' },
    { label: 'Date Low to High', value: 'ASC' },
  ];

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.category = res.category;
      this.postList = [];
      this.pageNumber = 1;
      this.pageSize = 5;
      this.getPostList();
    });
  }

  getPostList() {
    this.electronService.getPostList(
      {
        category: this.category,
        keyword: this.keyword,
        orderType: this.orderType,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      },
      (postList: any) => {
        this.zone.run(() => {
          this.postList = postList;
        });
      }
    );
  }

  onPageChange(event: PaginatorState) {
    this.pageNumber = event.first as number;
    this.pageSize = event.rows as number;
    this.getPostList();
  }

  goDetail(id: number) {
    this.router.navigate([`post/post-detail/${id}`]);
  }

  onSortChange() {
    this.pageNumber = 1;
    this.getPostList();
  }

  onFilter() {
    this.pageNumber = 1;
    this.getPostList();
  }

  refresh() {
    this.electronService.getFetchData({ type: 'post', category: this.category }, data => {
      console.log('data===',data);
    });
  }
}
