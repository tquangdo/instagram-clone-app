import { Button } from "@material-ui/core"
import React, { useState } from 'react'
import { tiSta, db, storage } from '../utils/firebase/firebase'
import './ImageUpload.css'

function ImageUpload({ username }) {
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
        // Error function ...
        console.log(error)
        alert(error.message)
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(stateImage.name)
          .getDownloadURL()
          .then(url => {
            // post stateImage inside db
            db.collection("posts").add({
              timestamp: tiSta,
              caption: stateCaption,
              imageUrl: url,
              username: username
            })
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
      <input type="text" placeholder='Hãy nhập tiêu đề post...'
        onChange={event => setStateCaption(event.target.value)} value={stateCaption} />
      <input type="file" onChange={onHandleChange} />
      <Button variant="contained" onClick={onHandleUpload}>
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload
