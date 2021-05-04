import React from 'react'
import { List, Avatar } from 'antd';

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


const Movies = (props) => {
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

                        avatar={<Avatar src={item.image} />}
                        title={<a href={`/movie/${item.movieID}`}>{item.name}</a>}
                        description={'Total Revenue: ' + formatRevenue(item.revenue) + 'EGP'}
                    />
                    {item.description}
                </List.Item>
            )}
        />
    );
}


export default Movies;