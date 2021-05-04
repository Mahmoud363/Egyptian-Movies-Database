import React from 'react'
import { List } from 'antd';




const Genres = (props) => {
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 10,
            }}
            dataSource={props.data}

            renderItem={item => (
                <List.Item
                    key={item.name}
                >
                    <List.Item.Meta
                        title={<a href={`/genre/${item.type}`}>{item.type}</a>}
                    />
                </List.Item>
            )}
        />
    );
}


export default Genres;