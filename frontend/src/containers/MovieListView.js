import React from 'react'
import axios from 'axios'

import Movies from '../components/Movies'

class MovieList extends React.Component {

    state = {
        movies: []
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:5000/api/movies/ ')
            .then(res => {
                this.setState({
                    movies: res.data
                })

            })
    }

    render() {
        return (

            <Movies data={this.state.movies} />

        );
    }
}

export default MovieList