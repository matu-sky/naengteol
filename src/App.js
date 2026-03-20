import React, { useState } from 'react';
import './App.css';

// 화면 컴포넌트들
import Home from './components/Home';
import Camera from './components/Camera';
import Ingredients from './components/Ingredients';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Saved from './components/Saved';

function App() {
  const [screen, setScreen] = useState('home');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('gemini_api_key') || ''
  );

  const navigate = (screenName) => setScreen(screenName);

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <Home navigate={navigate} apiKey={apiKey} setApiKey={setApiKey} />;
      case 'camera':
        return <Camera navigate={navigate} setIngredients={setIngredients} apiKey={apiKey} />;
      case 'ingredients':
        return <Ingredients navigate={navigate} ingredients={ingredients} setIngredients={setIngredients} setRecipes={setRecipes} apiKey={apiKey} />;
      case 'recipes':
        return <RecipeList navigate={navigate} recipes={recipes} setSelectedRecipe={setSelectedRecipe} />;
      case 'recipeDetail':
        return <RecipeDetail navigate={navigate} recipe={selectedRecipe} />;
      case 'saved':
        return <Saved navigate={navigate} setSelectedRecipe={setSelectedRecipe} />;
      default:
        return <Home navigate={navigate} apiKey={apiKey} setApiKey={setApiKey} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;