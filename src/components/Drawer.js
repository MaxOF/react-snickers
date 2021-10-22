import React from 'react'
import AppContext from '../context';
import axios from 'axios';

import Info from './Info';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [] }) {
    const { cartItems, setCartItems } = React.useContext(AppContext);
    const [ordierId, setOrderId] = React.useState(null);
    const [isOrderComplete, setIsOrderComplete] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

const onClickOrder = async () => {
    try {
        setIsLoading(true);
        const {data} = await axios.post('https://615f36b4f7254d0017068056.mockapi.io/orders', {
            items : cartItems,
        });
        
        setOrderId(data.id);
        setIsOrderComplete(true);
        setCartItems([]);

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            await axios.delete('https://615f36b4f7254d0017068056.mockapi.io/cart' + item.id);
            await delay(1000);
        }
        
    } catch (err) {
        alert('Ошибка при создании заказа :(')
    }
    setIsLoading(false);
}

    return (
        <div className="overlay">
            <div className="drawer">
                <h2 className="d-flex  justify-between mb-30">Корзина <img onClick={onClose} className=" removeBtn cu-p" src="/img/btn-remove.svg" alt="Close" />
                </h2>
                {items.length > 0 ? (
                    <div className="d-flex flex-column flex">
                        <div className="items">
                            {
                                items.map((obj) => (
                                    <div key={obj.id} className="cartItem d-flex align-center mb-20">
                                        <div style={{ backgroundImage: `url(${obj.imageUrl})` }}
                                            className="cartItemImg">
                                        </div>
                                        <div className="mr-20 flex">
                                            <p className="mb-5">{obj.title}</p>
                                            <b>{obj.price} руб.</b>
                                        </div>
                                        <img onClick={() => onRemove(obj.id)} className="removeBtn" src="/img/btn-remove.svg" alt="Remove" />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="cartTotalBlock">
                            <ul>
                                <li className="d-flex">
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>21 498 руб. </b>
                                </li>
                                <li className="d-flex">
                                    <span>Налог 5%:</span>
                                    <div></div>
                                    <b>1074 руб. </b>
                                </li>
                            </ul>
                            <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                                Оформить заказ <img src="/img/arrow.svg" alt="Arrow" /></button>
                        </div>


                    </div>)
                    : (
                    <Info
                    title={isOrderComplete? "Заказ Оформлен!" : "Корзина пустая"}
                    description={isOrderComplete? `Ваш заказ #${ordierId} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ"} 
                    image={isOrderComplete? "/img/complete-order.jpg" : "/img/empty-cart.jpg"} />)
                    
                }


            </div>
        </div>);

}

export default Drawer;