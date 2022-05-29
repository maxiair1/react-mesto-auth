import React, {useState, useEffect} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import '../index.css';
import Header from './Header.js';
import Footer from './Footer.js';
import Main from './Main.js';
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import ImagePopup from "./ImagePopup.js";
import AddPlacePopup from "./AddPlacePopup";
import {CurrentUserContext} from '../context/CurrentUserContext.js';
import {api} from '../utils/Api.js';
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(true);
    const [selectedCard, setSelectedCard] = useState({name: '', link: ''});
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isCardsLoading, setIsCardsLoading] = useState(false);

    useEffect(() => {
        setIsProfileLoading(true);
        api.getProfile()
            .then(res => {
                setCurrentUser(res);
            })
            .catch((err) => console.log('Ошибка загрузки профиля: ', err))
            .finally(() => setIsProfileLoading(false));

        api.getCards()
            .then(res => {
                setCards(res.map(card => {
                    return ({
                        _id: card._id,
                        name: card.name,
                        link: card.link,
                        likes: card.likes,
                        owner: card.owner
                    })
                }))
            })
            .catch((err) => console.log('Ошибка загрузки карточек: ', err))
            .finally(() => setIsCardsLoading(false));
    }, [])

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setIsOpen(true)
    }


    function closeAllPopups() {
        setIsOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsInfoTooltipOpen(false)
        setSelectedCard({name: '', link: ''});
    }

    function handleUpdateUser(user) {
        api.editProfile(user)
            .then(res => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => console.log('Ошибка загрузки профиля: ', err));
    }

    function handleUpdateAvatar(avatar) {
        api.updateAvatar(avatar)
            .then(res => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => console.log('Ошибка загрузки аватара: ', err));
    }

    function handleAddPlaceSubmit(card) {
        api.addCard(card)
            .then(res => {
                setCards([res, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log('Ошибка загрузки карточки: ', err));
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные лайка
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
            })
            .catch((err) => console.log('Ошибка обновления лайка: ', err));
    }

    function handleCardDelete(card) { //cards.filter(item => item !== card))
        api.deleteCard(card._id)
            .then(() => {
                setCards(prevState => prevState.filter(item => item !== card))
            })
            .catch((err) => console.log('Ошибка удаления карточки: ', err));
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="App">
                <div className="page">
                    <Header/>

                    <Switch>
                        <Route path="/sign-in">
                            <Login/>
                        </Route>
                        <Route path="/sign-up">
                            <Register/>
                        </Route>
                    </Switch>
                    <Route path="/main">
                        <Main
                            onEditAvatar={handleEditAvatarClick}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onCardClick={handleCardClick}
                            isCardsLoading={isCardsLoading}
                            isProfileLoading={isProfileLoading}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                            cards={cards}
                        />
                        <Footer/>
                        {isEditProfilePopupOpen &&
                        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                                          onUpdateUser={handleUpdateUser}/>}
                        {isAddPlacePopupOpen &&
                        <AddPlacePopup isOpen={isAddPlacePopupOpen} onAddPlace={handleAddPlaceSubmit}
                                       onClose={closeAllPopups}
                        />}
                        {isEditAvatarPopupOpen && <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                                                   onUpdateAvatar={handleUpdateAvatar}/>}
                        <ImagePopup card={selectedCard} onClose={closeAllPopups} isOpen={isOpen}/>
                    </Route>
                    <InfoTooltip
                        infoMessage="Вы успешно зарегистрировались!"
                        infoIcon={'success'}
                        isOpen={isInfoTooltipOpen}
                        onClose={closeAllPopups}
                    />

                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
