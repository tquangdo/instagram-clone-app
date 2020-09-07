import React, { useState, useEffect } from 'react'
import './Post.css'
// import { db } from './firebase'
import Avatar from "@material-ui/core/Avatar"
import firebase from 'firebase/app'
import 'firebase/database'

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  // useEffect(() => {
  //   let unsubscribe
  //   if (postId) {
  //     unsubscribe = db
  //       .collection("posts")
  //       .doc(postId)
  //       .collection("comments")
  //       .orderBy('timestamp', 'desc')
  //       .onSnapshot((snapshot) => {
  //         setComments(snapshot.docs.map((doc) => doc.data()))
  //       })
  //   }

  //   return () => {
  //     unsubscribe()
  //   }
  // }, [postId])

  // const postComment = (event) => {
  //   event.preventDefault()

  //   db.collection("posts").doc(postId).collection("comments").add({
  //     text: comment,
  //     username: user.displayName,
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
  //   })
  //   setComment('')
  // }

  return (
    <div className="post">
      {/* 1. HEADER */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt=''
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT9pwsN7oN02FOgJSVg2fe-R1dMMFRZi9J7Lw&usqp=CAU"
        />
        <h3>{username}</h3>
      </div>
      {/* 2. IMAGE */}
      <img className="post__image"
        src={imageUrl}
        alt="" />
      {/* 3. USERNAME + CAPTION */}
      <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
      {/* 4. POST */}
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
          // onClick={postComment}
          >
            Đăng
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
