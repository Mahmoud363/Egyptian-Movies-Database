import React from 'react'
import axios from 'axios'

import Casts from '../components/Casts'

class CastList extends React.Component {

    state = {
        casts: []
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:5000/api/cast/')
            .then(res => {
                this.setState({
                    casts: res.data
                })

            })
    }

    render() {
        return (

            <Casts data={this.state.casts} />

        );
    }
}

export default CastList