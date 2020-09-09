import Avatar from "@material-ui/core/Avatar"
import React, { useEffect, useState } from 'react'
import { db, tiSta } from '../utils/firebase/firebase'
import './Post.css'

function Post({ postId, user, propsPost }) {
  const { useravatar, username, caption, imageUrl } = propsPost
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    let unsubscribe
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        })
    }

    return () => {
      unsubscribe()
    }
  }, [postId])

  const postComment = (event) => {
    event.preventDefault()

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: tiSta
    })
    setComment('')
  }

  return (
    <div className="post">
      {/* 1. HEADER */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt=''
          src={useravatar}
        />
        <h3>{username}</h3>
      </div>
      {/* 2. IMAGE */}
      <img className="post__image"
        src={imageUrl}
        alt="" />
      {/* 3. USERNAME + CAPTION */}
      <h3 className="post__text"><strong>{caption}</strong></h3>
      {/* 4. COMMENT */}
      ================ Bình luận ================
      <div className="post__comments">
        {comments.map((comment, chiso) => (
          <p key={chiso}>
            <strong>{comment.username}</strong>: {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Viết bình luận..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Đăng
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
