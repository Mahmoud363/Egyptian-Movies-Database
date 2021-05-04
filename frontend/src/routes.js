import React from 'react'
import { Route } from 'react-router-dom'

import MovieList from './containers/MovieListView'
import MovieDetail from './containers/MovieDetailView'
import CastList from './containers/CastListView'
import CastDetail from './containers/CastDetailView'
import GenresList from './containers/GenresListView'
import GenreMoviesList from './containers/GenreDetailView'
import MovieAllList from './containers/MovieDateListView'
import LoginForm from './components/LoginForm'
import LogoutForm from './components/LogoutForm'
import RegistrationForm from './components/RegistrationForm'
import ReviewsList from './containers/ReviewsListView'
import UserDetail from './containers/UserDetailView'

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={MovieList} />
        <Route exact path='/movies' component={MovieAllList} />
        <Route exact path='/movie/:movieID' component={MovieDetail} />
        <Route exact path='/movie/:movieID/reviews' component={ReviewsList} />
        <Route exact path='/casts/' component={CastList} />
        <Route exact path='/cast/:castID' component={CastDetail} />
        <Route exact path='/genres/' component={GenresList} />
        <Route exact path='/genre/:genreID' component={GenreMoviesList} />
        <Route exact path='/login/' component={LoginForm} />
        <Route exact path='/logout/' component={LogoutForm} />
        <Route exact path='/register/' component={RegistrationForm} />
        <Route exact path='/user/:eMail/' component={UserDetail} />
    </div>
)

export default BaseRouter
