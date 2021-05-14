import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from '@app/models';

@Injectable({ providedIn: 'root' })
export class PostsService {
    public posts$ = new BehaviorSubject<Post[]>([]);

    constructor() {
        this.posts$.next(JSON.parse(localStorage.getItem('posts')) || []);
    }

    public addPost(newPost: Post) {
        const posts = this.posts$.getValue();
        posts.unshift(newPost);
        this.posts$.next(posts);
        this.updatePostsInStorage(posts);
    }

    public updatePost(id: number, updatedPost: Post) {
        const posts = this.posts$.getValue()
          .map(post => (post.id === id) ? updatedPost : post)
          .sort((a, b) => b.id - a.id);

        this.posts$.next(posts);
        this.updatePostsInStorage(posts);
    }

    public deletePost(postId: number) {
        const posts = this.posts$.getValue().filter(post => post.id !== postId);
        this.posts$.next(posts);
        this.updatePostsInStorage(posts);
    }

    public generateNewPost(author: string, description: string): Post {
        return {
            id: Date.now(),
            author,
            description,
            date: new Date(),
        };
    }

    private updatePostsInStorage(posts: Post[]) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}
