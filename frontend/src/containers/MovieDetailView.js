import React from 'react'
import axios from 'axios'
import { Card, Image, Row, Col, Radio, Input } from 'antd'
import { Link } from 'react-router-dom';

const { TextArea } = Input;

function formatRevenue(num) {
    var p = Number(num).toFixed(2).split(".");
    var chars = p[0].split("").reverse();
    var newstr = '';
    var count = 0;
    for (var x in chars) {
        count++;
        if (count % 3 == 1 && count != 1) {
            newstr = chars[x] + ',' + newstr;
        } else {
            newstr = chars[x] + newstr;
        }
    }
    return newstr;
}

function GenresList(props) {
    const genres = props.genres;
    //console.log(genres)
    const listItems = genres.map((genre) =>
        <Link to={`/genre/${genre.type}`}><li>{genre.type}</li></Link>
    );
    return (
        <div>
            <p>Genres:</p>
            <ul>{listItems}</ul>
        </div>
    );
}
function CastList(props) {
    const casts = props.casts;
    //console.log(casts)
    const listItems = casts.map((cast) =>
        <Link to={`/cast/${cast.castID}`}> <li>{cast.name}: ({cast.role})</li></Link>
    );
    return (
        <div>
            <p>Cast:</p>
            <ul>{listItems}</ul>
        </div>
    );
}

function ReviewsComponent(props) {
    //const casts = props.casts;
    //console.log(casts)
    const movieID = props.movieID
    return (
        <Link to={`/movie/${movieID}/reviews`}><p>Reviews</p></Link>
    );
}

class MovieDetail extends React.Component {

    state = {
        movie: {},
        genres: [],
        cast: [],
        reviews: [],
        avg_rating: 0,
        movieID: 0
    }

    componentDidMount() {
        const movieID = this.props.match.params.movieID
        this.setState({
            movieID: movieID
        })
        axios.get(`http://127.0.0.1:5000/api/movies/${movieID}`)
            .then(res => {
                this.setState({
                    movie: res.data[0]
                })


            })
            .catch(error => {
                console.log(error)
            });
        axios.get(`http://127.0.0.1:5000/api/movies/${movieID}/avg_rating`)
            .then(res => {
                this.setState({
                    avg_rating: res.data[0]
                })


            })
            .catch(error => {
                console.log(error)
            });
        axios.get(`http://127.0.0.1:5000/api/movies/${movieID}/genres`)
            .then(res => {
                this.setState({
                    genres: Object.values(res.data)
                })


            })
            .catch(error => {
                console.log(error)
            });
        axios.get(`http://127.0.0.1:5000/api/movies/${movieID}/cast`)
            .then(res => {
                this.setState({
                    cast: Object.values(res.data)
                })


            })
            .catch(error => {
                console.log(error)
            });

    }
    handleReviewSubmit = (event) => {
        event.preventDefault()
        const rating = Number(event.target.elements.rating.value);
        const review = event.target.elements.review.value;
        const movieID = this.props.match.params.movieID;
        const eMail = sessionStorage.getItem('email')
        var success;
        axios.post(`http://127.0.0.1:5000/api/movies/${movieID}/review/`, {
            'rating': Number(rating),
            'review': review,
            'email': eMail
        })
            .then(res => {
                console.log('worked')
                window.location.reload()
            })
            .catch(error => {
                alert('You already did a review')
            });

    }
    render() {
        //console.log('data', this.state.movie)
        var loggd_in = sessionStorage.getItem('logged_in')
        return (

            <Card title={this.state.movie.name}>

                {
                    loggd_in !== null ?
                        <Row>
                            <Col span={5}>
                                <Image src={this.state.movie.image} alt='img_movie'></Image>
                            </Col>
                            <Col span={10}>
                                <p>Average Rating: {this.state.avg_rating.rating}</p>
                                <p>Age Rating: {this.state.movie.age_rating}</p>
                                <p>Coloured: {this.state.movie.coloured === 1 ? 'Yes' : 'No'}</p>
                                <p>Duration: {this.state.movie.duration} Minutes</p>
                                <p>Release Date: {this.state.movie.release_date}</p>
                                <p>Total Revenue: {formatRevenue(this.state.movie.revenue)} EGP</p>
                                <p>Description: {this.state.movie.description}</p>
                                <ReviewsComponent movieID={this.state.movieID} />
                                <GenresList genres={this.state.genres} />

                                <CastList casts={this.state.cast} />
                            </Col>

                            <Col span={9}>
                                <form onSubmit={this.handleReviewSubmit}>
                                    <label>
                                        Rating:
                                        <br />
                                        <Radio.Group name="rating" defaultValue={1}>
                                            <Radio value={1}>1</Radio>
                                            <Radio value={2}>2</Radio>
                                            <Radio value={3}>3</Radio>
                                            <Radio value={4}>4</Radio>
                                            <Radio value={5}>5</Radio>
                                            <Radio value={6}>6</Radio>
                                            <Radio value={7}>7</Radio>
                                            <Radio value={8}>8</Radio>
                                            <Radio value={9}>9</Radio>
                                            <Radio value={10}>10</Radio>
                                        </Radio.Group>
                                    </label>
                                    <br />
                                    <label>
                                        Review:
                                        <br />
                                        <TextArea name='review' rows={4} />
                                    </label>
                                    <br />
                                    <input type="submit" value="Submit" />
                                </form>
                            </Col>
                        </Row>

                        :
                        <Row>
                            <Col span={5}>
                                <Image src={this.state.movie.image} alt='img_movie'></Image>
                            </Col>
                            <Col span={19}>

                                <p>Age Rating : {this.state.movie.age_rating}</p>
                                <p>Coloured : {this.state.movie.coloured === 1 ? 'Yes' : 'No'}</p>
                                <p>Duration : {this.state.movie.duration} Minutes</p>
                                <p>Release Date: {this.state.movie.release_date}</p>
                                <p>Total Revenue : {this.state.movie.revenue} EGP</p>
                                <p>Description : {this.state.movie.description}</p>
                                <ReviewsComponent movieID={this.state.movieID} />
                                <GenresList genres={this.state.genres} />

                                <CastList casts={this.state.cast} />
                            </Col>
                        </Row>
                }


            </Card >

        );
    }
}

export default MovieDetail