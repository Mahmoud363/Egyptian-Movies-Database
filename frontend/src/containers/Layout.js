import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Content } = Layout;



const CustomLayout = (props) => {
    var loggd_in = sessionStorage.getItem('logged_in')
    const eMail = sessionStorage.getItem('email')

    console.log(loggd_in)
    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">
                        <Link to='/'>
                            Top Movies
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to='/movies'>
                            Movies
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to='/genres'>
                            Genres
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to='/casts'>
                            Casts
                        </Link>
                    </Menu.Item>

                    {
                        loggd_in === null ?
                            <Menu.Item key="5">
                                <Link to='/login/'>
                                    Login
                                </Link>
                            </Menu.Item>
                            :
                            <Menu.Item key="5">
                                <Link to='/logout/'>
                                    Logout
                                </Link>
                            </Menu.Item>

                    }
                    {
                        loggd_in === null ?
                            <Menu.Item key="6">
                                <Link to='/register/'>
                                    Register
                                </Link>
                            </Menu.Item>
                            :
                            <Menu.Item key="6">
                                <Link to={`/user/${eMail}/`}>
                                    Profile
                                </Link>
                            </Menu.Item>


                    }

                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to='/'>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to='/'>List</Link></Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    {props.children}
                </div>
            </Content>
        </Layout>
    );
}

export default CustomLayout;
