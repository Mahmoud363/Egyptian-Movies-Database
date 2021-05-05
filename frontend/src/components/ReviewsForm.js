import React from 'react';
import { Form, Input, Button, Radio } from 'antd';
import axios from 'axios';

const ReviewForm = () => {

    handFormSubmit = (event, requestType) => {
        event.preventDefault();
        const rating = event.target.elements.rating.value;
        const review = event.target.elements.review.value;


        const movieID = this.props.match.params.movieID
        axios.post(`http://127.0.0.1:5000/api/movie/${movieID}/review/`, {
            'review': review,
            'rating': rating
        }).then(res => {
            window.location.reload()
        }).catch(err => {
            alert("you already have a review")
            // 
        })


    }

    return (
        <div>
            <Form onSubmit={this.handFormSubmit}>
                <Form.Item label="Rating">
                    <Input name='rating' placeholder="Enter rating from 1 to 10" />
                </Form.Item>
                <Form.Item label="Review">
                    <Input name='review' placeholder="Enter Review" />
                </Form.Item>
                <Form.Item {...buttonItemLayout}>
                    <Button type="primary" htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CustomForm