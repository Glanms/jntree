package com.jnt.tree.core;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by arthur on 14-8-1.
 *
 CREATE TABLE `post_tree` (
 `id` bigint(20) NOT NULL,
 `post_id` bigint(20) NOT NULL,
 `tree_id` bigint(20) NOT NULL,
 `create_at` bigint(20) NOT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB
 */

@Entity
@Table(name = "post_tree")
public class PostTree implements Serializable {


    private static final long serialVersionUID = -7203343128718524230L;

    private Long id;

    private Long postId;   //岗位的ID

    private Long treeId;   //技能树的ID

    private Long createAt;

    public PostTree() {
    }

    public PostTree(Long postId, Long treeId) {
        this.postId = postId;
        this.treeId = treeId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "post_id")
    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    @Column(name = "tree_id")
    public Long getTreeId() {
        return treeId;
    }

    public void setTreeId(Long treeId) {
        this.treeId = treeId;
    }

    @Column(name = "create_at")
    public Long getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Long createAt) {
        this.createAt = createAt;
    }

}
