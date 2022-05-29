import React from 'react';
import {Link} from "react-router-dom";

function Header(props) {

    return (
        <header className="header page__header">
            <div className="header__logo"></div>
            <div className="header__auth">
                <Link to="/sign-up">Зарегистрироваться</Link>
                <Link to="/sign-in">Войти</Link>
            </div>

        </header>
    )

}

export default Header;