import React from 'react'
import axios from 'axios'
import { Card, Image, Row, Col, Radio, Input } from 'antd'
import { Link } from 'react-router-dom';

const { TextArea } = Input;



function ReviewsList(props) {
    const reviews = props.reviews;
    //console.log(genres)
    const listItems = reviews.map((review) =>
        <li>

            <p>{review.name}: </p>
            <p>Rating: {review.rating}</p>
            <p>Review: {review.text_review}</p>
            <br />
        </li>
    );
    return (
        <div>
            <p>User Reviews:</p>
            <ul>{listItems}</ul>
        </div>
    );
}


class UserDetail extends React.Component {

    state = {
        user_data: {},
        reviews: [],
    }

    componentDidMount() {

        const eMail = sessionStorage.getItem('email')
        var success;
        axios.get(`http://127.0.0.1:5000/api/user/${eMail}/`)
            .then(res => {
                this.setState({
                    user_data: res.data[0]
                })


            })
            .catch(error => {
                console.log(error)
            });
        axios.get(`http://127.0.0.1:5000/api/user/${eMail}/reviews/`)
            .then(res => {
                this.setState({
                    reviews: Object.values(res.data)
                })


            })
            .catch(error => {
                console.log(error)
            });


    }

    render() {
        //console.log('data', this.state.movie)
        return (

            <Card title={this.state.user_data.username}>
                <Row>
                    <Col>
                        <p>Email : {this.state.user_data.email}</p>
                        <p>Birthdate : {this.state.user_data.birthdate}</p>
                        <p>Country : {this.state.user_data.country}</p>
                        <p>Gender: {this.state.user_data.gender === 'm' ? 'Male' : 'Female'}</p>
                        <ReviewsList reviews={this.state.reviews} />

                    </Col>
                </Row>



            </Card >

        );
    }
}

export default UserDetail