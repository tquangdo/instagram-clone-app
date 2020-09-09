import { Button } from "@material-ui/core"
import React, { useState } from 'react'
import { tiSta, db, storage } from '../utils/firebase/firebase'
import './ImageUpload.css'

function ImageUpload({ propsUser = null, isSignup = false, setStateUserImage = null }) {
  const [stateImage, setStateImage] = useState(null)
  const [stateProgress, setStateProgress] = useState(0)
  const [stateCaption, setStateCaption] = useState('')

  const onHandleChange = (e) => {
    if (e.target.files[0]) {
      setStateImage(e.target.files[0])
    }
  }

  const onHandleUpload = () => {
    const uploadTask = storage.ref(`images/${stateImage.name}`).put(stateImage)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setStateProgress(progress)
      },
      (error) => {
        alert(error.message)
      },
      () => {
        storage
          .ref("images")
          .child(stateImage.name)
          .getDownloadURL()
          .then(url => {
            if (isSignup) {
              setStateUserImage(url)
              //TH cần INS vô collection "users":
              // db.collection("users").add({
              //   username: username,
              //   email: isSignup,
              //   photoURL: url,
              // })
            } else {
              db.collection("posts").add({
                timestamp: tiSta,
                caption: stateCaption,
                imageUrl: url,
                username: propsUser.displayName,
                useravatar: propsUser.photoURL,
              })
            }
            alert('Đã upload ảnh OK!')
            setStateProgress(0)
            setStateCaption("")
            setStateImage(null)
          })
      }
    )
  }

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={stateProgress} max="100" />
      {!isSignup && <input type="text" placeholder='Hãy nhập tiêu đề post...'
        onChange={event => setStateCaption(event.target.value)} value={stateCaption} />}
      <input type="file" onChange={onHandleChange} />
      <Button variant="contained" onClick={onHandleUpload}>
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload
