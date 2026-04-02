import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Camera from './components/Camera';
import Ingredients from './components/Ingredients';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Saved from './components/Saved';
import Manual from './components/Manual';
import Expiry from './components/Expiry';
import Shopping from './components/Shopping';
import WeeklyPlan from './components/WeeklyPlan';

function App() {
  const [screen, setScreen] = useState('home');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [previousScreen, setPreviousScreen] = useState('recipes');

  // ✅ 환경변수에서 API 키 가져오기 (localStorage 제거)
  const apiKey = process.env.REACT_APP_GEMINI_KEY;

  const navigate = (screenName) => setScreen(screenName);

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'camera':
        return <Camera navigate={navigate} setIngredients={setIngredients} apiKey={apiKey} />;
      case 'manual':
        return <Manual navigate={navigate} setIngredients={setIngredients} setRecipes={setRecipes} setWeeklyPlan={setWeeklyPlan} apiKey={apiKey} />;
      case 'expiry':
        return <Expiry navigate={navigate} setIngredients={setIngredients} setRecipes={setRecipes} apiKey={apiKey} />;
      case 'shopping':
        return <Shopping navigate={navigate} />;
      case 'ingredients':
        return <Ingredients navigate={navigate} ingredients={ingredients} setIngredients={setIngredients} setRecipes={setRecipes} setWeeklyPlan={setWeeklyPlan} apiKey={apiKey} />;
      case 'recipes':
        return <RecipeList navigate={navigate} recipes={recipes} setSelectedRecipe={setSelectedRecipe} />;
      case 'recipeDetail':
        return <RecipeDetail navigate={navigate} recipe={selectedRecipe} previousScreen={previousScreen} />;
      case 'weeklyPlan':
        return <WeeklyPlan navigate={navigate} weeklyPlan={weeklyPlan} />;
      case 'saved':
        return <Saved navigate={navigate} setSelectedRecipe={setSelectedRecipe} setWeeklyPlan={setWeeklyPlan} setPreviousScreen={setPreviousScreen} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
