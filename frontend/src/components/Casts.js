import React from 'react'
import { List, Avatar } from 'antd';




const Casts = (props) => {
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

                        avatar={<Avatar src={item.main_picture} />}
                        title={<a href={`/cast/${item.castID}`}>{item.name}</a>}
                    /*description={'Total Revenue: ' + item.revenue + 'EGP'}*/
                    />
                    {item.biography}
                </List.Item>
            )}
        />
    );
}


export default Casts;