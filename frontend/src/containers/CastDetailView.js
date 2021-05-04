import React from 'react'
import axios from 'axios'

import { Card, Image, Row, Col } from 'antd'
import { Link } from 'react-router-dom';


function MoviesList(props) {
    const movies = props.movies;
    console.log(movies)
    const listItems = movies.map((movie) =>
        <Link to={`/movie/${movie.movieID}`}> <li>{movie.name}: ({movie.role})</li></Link>
    );
    return (
        <div>
            <p>Movies:</p>
            <ul>{listItems}</ul>
        </div>
    );
}

class CastDetail extends React.Component {

    state = {
        cast: {},
        movies: []
    }

    componentDidMount() {
        const castID = this.props.match.params.castID
        axios.get(`http://127.0.0.1:5000/api/cast/${castID}`)
            .then(res => {
                this.setState({
                    cast: res.data[0]
                })


            })
            .catch(error => {
                console.log(error)
            });
        axios.get(`http://127.0.0.1:5000/api/cast/${castID}/movies`)
            .then(res => {
                this.setState({
                    movies: Object.values(res.data)
                })


            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        console.log('data', this.state.cast)
        return (

            <Card title={this.state.cast.name}>
                <Row>
                    <Col span={5}>
                        <Image src={this.state.cast.main_picture} alt='img_cast'></Image>
                    </Col>
                    <Col span={19}>
                        <p>Birthdate: {this.state.cast.birthdate}</p>
                        <p>Nationatlity: {this.state.cast.nationality}</p>
                        <p>Biography: {this.state.cast.biography}</p>
                        <MoviesList movies={this.state.movies} />
                    </Col>

                </Row>

            </Card>

        );
    }
}

export default CastDetail