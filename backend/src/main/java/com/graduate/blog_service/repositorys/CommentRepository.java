package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Comment;
import com.graduate.blog_service.models.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findByPost(Post post);
    @Transactional
    void deleteByParentId(Long parentId);
}
