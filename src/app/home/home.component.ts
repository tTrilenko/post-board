import {Component, OnInit, TemplateRef} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '@app/models';
import { PostsService } from '@app/services';
import { Observable } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
    public posts$: Observable<Post[]>;
    public postForm: FormGroup;
    public submitted = false;
    private activeModalRef: NgbModalRef;

    constructor(
        private postsService: PostsService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
    ) { }

    public ngOnInit() {
        this.posts$ = this.postsService.posts$.asObservable();

        this.postForm = this.formBuilder.group({
            id: [],
            author: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    public selectPost(post: Post, content: TemplateRef<any>) {
        this.openModal(content);
        this.postForm.patchValue({
            ...post,
        });
    }

    public deletePost(postId: number) {
        this.postsService.deletePost(postId);
    }

    public onSubmit() {
        this.submitted = true;

        if (this.postForm.invalid) {
            return;
        }

        const newPost = this.postsService.generateNewPost(
            this.postForm.controls.author.value,
            this.postForm.controls.description.value,
        );
        const selectedPostId = this.postForm.controls.id.value;

        if (selectedPostId) {
            this.postsService.updatePost(selectedPostId, newPost);
        } else {
            this.postsService.addPost(newPost);
        }

        this.activeModalRef.close();
        this.postForm.reset();
        this.submitted = false;
    }

    public openModal(content: any) {
        this.activeModalRef = this.modalService.open(content);
    }

    public closeModal(modal: NgbModalRef) {
        modal.close();
        this.postForm.reset();
    }
}
