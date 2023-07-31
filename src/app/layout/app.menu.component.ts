import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'POSTS',
        items: [
          {
            label: 'Technology Report',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Technology_Report'],
          },
          {
            label: 'Health Report',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Health_Report'],
          },
          {
            label: 'Education Report',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Education_Report'],
          },
          {
            label: 'Economics Report',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Economics_Report'],
          },
          {
            label: 'American Mosaic',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/American_Mosaic'],
          },
          {
            label: 'Ask a teacher',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/ask_a_teacher'],
          },
          {
            label: 'Words And Their Stories',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Words_And_Their_Stories'],
          },
          { label: 'As it is', icon: 'pi pi-fw pi-book', routerLink: ['/post/post-list/as_it_is'] },
          {
            label: 'Everyday Grammar',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Everyday_Grammar'],
          },
          {
            label: 'This is America',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/This_is_America'],
          },
          {
            label: 'Science in the News',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Science_in_the_News'],
          },
          {
            label: 'In the News',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/In_the_News'],
          },
          {
            label: 'American Stories',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/American_Stories'],
          },
          {
            label: 'Trending Today',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Trending_Today'],
          },
          {
            label: 'The Making of a Nation',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/The_Making_of_a_Nationr'],
          },
          {
            label: 'National Parks',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/National_Parks'],
          },
          {
            label: 'Americas Presidents',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Americas_Presidents'],
          },
          {
            label: 'Agriculture Report',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Agriculture_Report'],
          },
          {
            label: 'Explorations',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/Explorations'],
          },
          {
            label: 'People in America',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/post/post-list/People_in_America'],
          },
        ],
      },
      {
        label: 'VIDEOS',
        items: [
          {
            label: 'VOA60',
            icon: 'pi pi-fw pi-video',
            routerLink: ['/video/video-list/VOA60'],
          },
          {
            label: 'English in a Minute Videos',
            icon: 'pi pi-fw pi-video',
            routerLink: ['/video/video-list/English_in_a_Minute_Videos'],
          },
          {
            label: 'English at the Movies',
            icon: 'pi pi-fw pi-video',
            routerLink: ['/video/video-list/English_at_the_Movies'],
          },
          {
            label: 'News Words',
            icon: 'pi pi-fw pi-video',
            routerLink: ['/video/video-list/News_Words'],
          },
          {
            label: 'Everyday Grammar TV',
            icon: 'pi pi-fw pi-video',
            routerLink: ['/video/video-list/Everyday_Grammar_TV'],
          },
          {
            label: 'How to Pronounce',
            icon: 'pi pi-fw pi-video',
            routerLink: ['/video/video-list/How_to_Pronounce'],
          },
        ],
      },
    ];
  }
}
