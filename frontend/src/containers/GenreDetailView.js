import React from 'react'
import axios from 'axios'

import Movies from '../components/Movies'

class GenreMoviesList extends React.Component {

    state = {
        movies: []
    }

    componentDidMount() {
        const genreID = this.props.match.params.genreID
        console.log(genreID)
        axios.get(`http://127.0.0.1:5000/api/genres/${genreID}`)
            .then(res => {
                this.setState({
                    movies: res.data
                })
                console.log(this.state.movies)
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        return (

            <Movies data={this.state.movies} />

        );
    }
}

export default GenreMoviesList