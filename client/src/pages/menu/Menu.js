import React, { useState } from 'react';
import './Menu.css';

function Menu() {
  const [cocktails] = useState([
    {
      id: 1,
      name: 'Classic Mojito',
      price: 12,
      ingredients: ['White rum', 'Fresh mint', 'Lime juice', 'Sugar', 'Soda water'],
      description: 'A refreshing Cuban cocktail with mint and lime',
      category: 'Classics'
    },
    {
      id: 2,
      name: 'Old Fashioned',
      price: 14,
      ingredients: ['Bourbon', 'Angostura bitters', 'Sugar cube', 'Orange peel'],
      description: 'A sophisticated blend of bourbon and bitters',
      category: 'Classics'
    },
    {
      id: 3,
      name: 'Passion Fruit Martini',
      price: 13,
      ingredients: ['Vodka', 'Passion fruit liqueur', 'Vanilla syrup', 'Prosecco'],
      description: 'A tropical twist on the classic martini',
      category: 'Signature'
    }
  ]);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (cocktail) => {
    setCart([...cart, { ...cocktail, orderId: Date.now() }]);
  };

  const removeFromCart = (orderId) => {
    setCart(cart.filter(item => item.orderId !== orderId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Cocktail Menu</h1>
        <button 
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      {showCart ? (
        <div className="cart-section">
          <h2>Your Order</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.orderId} className="cart-item">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                    <button 
                      onClick={() => removeFromCart(item.orderId)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>Total: ${getTotalPrice()}</h3>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="menu-grid">
          {cocktails.map(cocktail => (
            <div key={cocktail.id} className="cocktail-card">
              <div className="cocktail-header">
                <h2>{cocktail.name}</h2>
                <span className="price">${cocktail.price}</span>
              </div>
              <p className="description">{cocktail.description}</p>
              <div className="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                  {cocktail.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <button 
                className="order-btn"
                onClick={() => addToCart(cocktail)}
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu; 