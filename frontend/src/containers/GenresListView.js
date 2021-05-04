import React from 'react'
import axios from 'axios'

import Genres from '../components/Genre'

class GenresList extends React.Component {

    state = {
        genres: []
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:5000/api/genres/')
            .then(res => {
                this.setState({
                    genres: res.data
                })

            })
    }

    render() {
        return (

            <Genres data={this.state.genres} />

        );
    }
}

export default GenresList