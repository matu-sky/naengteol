import React from 'react';

function RecipeList({ navigate, recipes, setSelectedRecipe }) {
  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    navigate('recipeDetail');
  };

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('ingredients')}>← 뒤로</button>
        <h2>🍽️ 추천 레시피</h2>
      </div>

      <div className="recipe-list">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card" onClick={() => selectRecipe(recipe)}>
            <div className="recipe-card-header">
              <h3>{recipe.name}</h3>
              <span className="recipe-number">#{index + 1}</span>
            </div>
            <div className="recipe-info">
              <span>⏱️ {recipe.time}</span>
              <span>📊 {recipe.difficulty}</span>
              <span>🔥 {recipe.calories}</span>
            </div>
            <div className="recipe-ingredients-preview">
              {recipe.ingredients.slice(0, 3).map((ing, i) => (
                <span key={i} className="ingredient-chip">{ing}</span>
              ))}
              {recipe.ingredients.length > 3 && (
                <span className="ingredient-chip">+{recipe.ingredients.length - 3}개</span>
              )}
            </div>
            <div className="recipe-arrow">자세히 보기 →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;