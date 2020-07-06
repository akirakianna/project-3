import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../UserContext'
import axios from 'axios'
import Auth from '../lib/auth'


const SingleMovie = (props) => {
  //! Code I've added - Kianna
  const { userInfo, setUserInfo } = useContext(UserContext)
  const [soundtrackData, setSoundtrackData] = useState({})
  const [added, setAdded] = useState(false)
  const [movieData, setMovieData] = useState([])

  useEffect(() => {
    const movieName = props.match.params.name

    axios.get(`https://api.spotify.com/v1/search?q=${movieName}soundtrack&type=playlist`,
      {
        headers: { 'Authorization': 'Bearer BQCwNx0aIOoGFcUNFiDqK2ZwizazjvhHJZhIYUI2A6QkUrqWzTfKukdKDsU4bgKcjBJJPGWqlhQJt0gnB6w' }
      })
      .then(axiosResp => {
        console.log(axiosResp)
        setSoundtrackData(axiosResp.data.playlists.items[0].id)
      })
      .catch(err => console.log(err))
  }, [])

  //! Returning single movie data
 
  useEffect(() => {
    const API_KEY = '089c839eda3ed1ce04045e0b371dedeb'
    const movieName = props.match.params.name
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${movieName}&page=1&include_adult=false
      `)
      .then(axiosResp => {
        setMovieData(axiosResp.data.results[0])
        if (userInfo) {
          const haveAdded = userInfo.favouriteMovies.some((rest) => {
            return rest._id === axiosResp.data.results[0]._id
          })
          setAdded(haveAdded)
        }
      })
      .catch(err => console.log(err))
  }, [userInfo])

  //! Pushing single movie to favourites(profile) page

  const favourite = () => {
    const update = userInfo.favouriteMovies
    //! is undefined, so can't push...
    // console.log(update)
    update.push(movieData)
    axios.post('/api/favourites', { title: movieData.title }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        setUserInfo(res.data.user)
      })
      .catch(err => {
        props.history.push('/login')
        console.log(err)
      })
  }

  //! Returning soundtrack and single movie data on page

  return <section>
    {console.log('Hello', userInfo)}
    <div>
      <iframe src={`https://open.spotify.com/embed/playlist/${soundtrackData}`} width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    </div>
    <div>
      <h1>{movieData.title} </h1>
      <img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} />
    </div>
    {/* <pre>{JSON.stringify(user), null, 2}</pre> */}
    <button onClick={favourite}>Favourite ❤️</button>
  </section>

}


export default SingleMovie