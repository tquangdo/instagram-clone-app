import React, { useState, useEffect } from 'react'
import './App.css'
import Post from './components/Post'
import { db, auth } from './utils/firebase/firebase'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core'
import ImageUpload from './components/ImageUpload'
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  //Phức tạp 2 chỗ: 1) chỉ có DLG "Signup" mới có "signupUsername" -> đẻ ra thêm "setUsername" ngoài "setStateAuthUser"
  //2) thường tách làm 2 file riêng: Signup.js & Login.js -> TH này gom lại!
  const [signupUsername, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [stateAuthUser, setStateAuthUser] = useState(null)
  const [stateUserImage, setStateUserImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT9pwsN7oN02FOgJSVg2fe-R1dMMFRZi9J7Lw&usqp=CAU")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(auth_user => {
      if (auth_user) {
        // user has logged in...
        setStateAuthUser(auth_user)
      } else {
        // user has logged out...
        setStateAuthUser(null)
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe()
    }
  }, [stateAuthUser])


  useEffect(() => {
    // this is where the code runs
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        // every time a new post is added, this code fires...
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })))
      })
  }, [])

  const signUp = (event) => {
    event.preventDefault()

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(auth_user => {
        auth_user.user.updateProfile({
          displayName: signupUsername,
          photoURL: stateUserImage,
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(error => alert(error.message))

    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))

    setOpenSignIn(false)
  }
  const instagramEmbeddedHtml = arg_url => {
    return <InstagramEmbed
      url={`https://www.instagram.com/p/${arg_url}/`}
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      injectScript
      onLoading={() => { }}
      onSuccess={() => { }}
      onAfterRender={() => { }}
      onFailure={() => { }}
    />
  }

  return (
    <div className="app">
      {/* 1. SIGNUP */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={signupUsername}
              onChange={e => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <ImageUpload isSignup setStateUserImage={setStateUserImage}/>
            <Button variant="contained" type="submit"
              onClick={signUp}
            >Đăng kí tài khoản</Button>
          </form>

        </div>
      </Modal>
      {/* 2. LOGIN */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button variant="contained" type="submit"
              onClick={signIn}
            >Login</Button>
          </form>

        </div>
      </Modal>
      {/* 3. HEADER(=instagram logo + login&signup OR logout) */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {(stateAuthUser?.displayName) ? (
            <Button
              onClick={() => auth.signOut()}
            >Xin chào: "{stateAuthUser?.displayName}"<br/>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpen(true)}>Đăng kí tài khoản</Button>
            </div>
          )}
      </div>
      {/* 4. POST */}
      <div className="app__posts">
        {/* 4.1. postsLeft */}
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id}
                user={stateAuthUser}
                propsPost={post} />
            ))
          }
        </div>
        {/* 4.2. postsRight */}
        <div className="app__postsRight">
          {instagramEmbeddedHtml('CEMc-O1B8Gw')}
          {instagramEmbeddedHtml('BSYEbdJhlHW')}
        </div>
      </div>
      {(stateAuthUser?.displayName) ? (
        <ImageUpload propsUser={stateAuthUser} />
      ) : (
          <h2 style={{ textAlign: 'center' }}>Bạn cần login để có thể up file</h2>
        )}
      <br /><br /><br />
    </div>
  )
}

export default App
