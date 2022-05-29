import React from "react";
import {Link} from "react-router-dom";


function Register(props) {

    const [formParams, setFormParams] = React.useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = React.useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormParams((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formParams.username || !formParams.password) {
            return;
        }
        props.handleLogin({username: formParams.username, password: formParams.password})
            .catch(err => {
                setMessage(err.message);
            });
    }


    return (
        <div className="authorize">
            <form onSubmit={handleSubmit} className="authorize__form">
                <h2 className="authorize__title">Регистрация</h2>
                <input placeholder="Email" type="email" className="authorize__input"/>
                <input placeholder="Пароль" type="text" className="authorize__input"/>
                <button type="submit" className="authorize__button-submit">Зарегистрироваться</button>
                <p className="authorize__subtitle">Уже зарегистрированны? <Link to="/sign-in">Войти</Link></p>
            </form>
        </div>
    )
}

export default Register;