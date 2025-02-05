import React, { useState } from 'react'
import './Food.css'

function Food() {
  const [recipes] = useState([
    {
      id: 1,
      title: 'Classic Italian Pasta',
      category: 'Italian',
      difficulty: 'Medium',
      prepTime: '30 mins',
      cookTime: '20 mins',
      image: '/images/pasta.jpg',
      description: 'Authentic Italian pasta with homemade sauce',
      ingredients: ['400g spaghetti', '4 ripe tomatoes', 'Fresh basil', 'Olive oil', 'Garlic'],
      steps: ['Boil pasta in salted water', 'Prepare the sauce', 'Combine and serve'],
    },
    {
      id: 2,
      title: 'Asian Stir Fry',
      category: 'Asian',
      difficulty: 'Easy',
      prepTime: '20 mins',
      cookTime: '15 mins',
      image: '/images/stir-fry.jpg',
      description: 'Quick and healthy vegetable stir fry',
      ingredients: ['Mixed vegetables', 'Soy sauce', 'Ginger', 'Garlic', 'Rice'],
      steps: ['Prepare vegetables', 'Cook rice', 'Stir fry vegetables', 'Combine with sauce'],
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Italian', 'Asian', 'Mexican', 'American', 'Desserts']

  const filteredRecipes =
    selectedCategory === 'All' ? recipes : recipes.filter(recipe => recipe.category === selectedCategory)

  return (
    <div className='food-page'>
      <div className='food-header'>
        <h1>Food & Cooking Blog</h1>
        <p>Discover delicious recipes and cooking tips from around the world</p>
      </div>

      <div className='category-filter'>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className='recipes-grid'>
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className='recipe-card'>
            <div className='recipe-image'>
              <img src={recipe.image} alt={recipe.title} />
              <span className='category-tag'>{recipe.category}</span>
            </div>
            <div className='recipe-content'>
              <h2>{recipe.title}</h2>
              <div className='recipe-info'>
                <span>🕒 Prep: {recipe.prepTime}</span>
                <span>👨‍🍳 Cook: {recipe.cookTime}</span>
                <span>📊 {recipe.difficulty}</span>
              </div>
              <p className='description'>{recipe.description}</p>

              <div className='ingredients'>
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className='steps'>
                <h3>Steps:</h3>
                <ol>
                  {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <button className='view-recipe-btn'>View Full Recipe</button>
            </div>
          </div>
        ))}
      </div>

      <div className='cooking-tips'>
        <h2>Cooking Tips & Techniques</h2>
        <div className='tips-grid'>
          <div className='tip-card'>
            <h3>Knife Skills</h3>
            <p>Master basic cutting techniques for better food preparation.</p>
          </div>
          <div className='tip-card'>
            <h3>Seasoning</h3>
            <p>Learn how to properly season your dishes.</p>
          </div>
          <div className='tip-card'>
            <h3>Kitchen Organization</h3>
            <p>Tips for keeping your kitchen efficient and organized.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Food
