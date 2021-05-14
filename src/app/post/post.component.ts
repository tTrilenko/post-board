import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Post } from '@app/models';

@Component({
  selector: 'app-post',
  templateUrl: 'post.component.html',
  styleUrls: ['post.less'],
})
export class PostComponent implements OnInit {
    @Input() public post: Post;

    @Output() public selectPost: EventEmitter<Post> = new EventEmitter();
    @Output() public deletePost: EventEmitter<number> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    public onDeletePost() {
      this.deletePost.emit(this.post.id);
    }

    public onSelectPost() {
      this.selectPost.emit(this.post);
    }
}
