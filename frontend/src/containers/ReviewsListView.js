import React from 'react'
import axios from 'axios'

import Reviews from '../components/Review'

class ReviewsList extends React.Component {

    state = {
        reviews: []
    }

    componentDidMount() {
        const movieID = this.props.match.params.movieID;
        axios.get(`http://127.0.0.1:5000/api/movies/${movieID}/reviews`)
            .then(res => {
                this.setState({
                    reviews: res.data
                })

            })
    }

    render() {
        return (

            <Reviews data={this.state.reviews} />

        );
    }
}

export default ReviewsList