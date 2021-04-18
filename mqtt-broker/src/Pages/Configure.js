import React from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {topicAPI} from '../Api/api'
import {configure, toggleIsFetching, setTopicData} from '../Redux/Reducers/configure-reducer';
import {Input} from '../Common/FormsControl';
import './Styles/Configure.css';
import Preloader from '../Common/Preloader';

const ConfigureForm = (props) => {
    return( 
        <form onSubmit = {props.handleSubmit}>
            <div className = "title">
                <h3>Конфигурация Брокера</h3>
            </div>
            <div className="configure_management">
                <div className="topic_management">
                    <div className = "title">
                        <h4>Управление топиком:</h4>
                    </div>
                    <div className="description">
                        <p>Обратите внимание, что ваш Email MQTT является префиксом для всех топиков.</p>
                    </div>
                    <div className="new_topic">
                        <div className="title_new_topic">
                            <div className="wrapper">
                                <div className="prefix"><b>Новый топик:</b></div>
                                <div className="input-group mb-3">
                                    <Field name={"topicname"}  component={Input} title="topic" id="topicname" type="text"  className="form-control" placeholder="topicname" aria-label="topicname" />
                                </div>
                                <div className = "wrapper-button">
                                    <button className="btn btn-primary">Добавить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="available_topics">
                        <div className = "title">
                            <b>Доступные топики:</b>
                        </div>
                        <div className="list">
                            props.topics
                        </div>
                    </div>
                </div>
                <div className="user_management">
                    <div className="title">
                        <h4>Пользовательское управление</h4>
                    </div>
                    <div className="description_username">
                        <p>Имя пользователя для вашего MQTT-соединения: props.name</p>
                    </div>
                    <div className="description_password">
                        <p>Ваш пароль брокера MQTT по умолчанию будет таким же, как тот, который вы уже вошли в эту систему.</p>
                        <div className="change_password">
                            <div className="np">
                                <div className="mp"><b>Новый MQTT пароль: </b></div>
                                <div> <Field name={"topicpassword"}  component={Input} title="Пароль" id="password_topic" type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="passwordLabel"/> </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="port_management">
                    <div className="title">
                        <h4>Управление Портом</h4>
                    </div>
                    <div className="description">
                        <ul>
                            <li>MQTT TCP Port: 1883 </li>
                            <li>Secure MQTT over TLS/SSL: 3883 </li>
                            <li>MQTT over Websocket Port: 8883 </li>
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    )
}

const ConfigureReduxForm = reduxForm({
    form: 'configure'
})(ConfigureForm);

class ConfigureContainer extends React.Component {
    componentDidMount() {
        this.props.toggleIsFetching(true);
        topicAPI.list_topics(this.props.token).then(response => {
            let id = response.data.topic.id;
            let topicname = response.data.topic.name;
            let passwordtopichash = response.data.topic.password;
            this.props.setTopicData(id, topicname, passwordtopichash);
            this.props.toggleIsFetching(false);
        })
    }

    onSubmit(formData) {
        this.props.configure(formData.topicname, formData.topicpassword);
    }

    render() {
        return <>
        { this.props.isFetching ? <Preloader /> : null}
            <ConfigureReduxForm onSubmit = {this.onSubmit}/>
        </>
    }    
}

let mapStateToProps = (state) => ({
    name: state.configurePage.name,
    isFetching: state.configurePage.isFetching,
    token: state.auth.token,
});

export default connect(mapStateToProps, {configure, toggleIsFetching, setTopicData}) (ConfigureContainer);