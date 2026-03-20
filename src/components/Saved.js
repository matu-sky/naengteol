import React, { useState } from 'react';

function Saved({ navigate, setSelectedRecipe }) {
  const [savedRecipes, setSavedRecipes] = useState(
    JSON.parse(localStorage.getItem('savedRecipes') || '[]')
  );

  const deleteRecipe = (index) => {
    if (!window.confirm('이 레시피를 삭제할까요?')) return;
    const updated = savedRecipes.filter((_, i) => i !== index);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
    setSavedRecipes(updated);
  };

  const viewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    navigate('recipeDetail');
  };

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
        <h2>🔖 저장된 레시피</h2>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="empty-state">
          <p>저장된 레시피가 없어요</p>
          <p>마음에 드는 레시피를 저장해보세요! 😊</p>
          <button className="main-btn primary" onClick={() => navigate('home')}>
            레시피 찾으러 가기
          </button>
        </div>
      ) : (
        <div className="recipe-list">
          {savedRecipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <div className="recipe-card-header">
                <h3 onClick={() => viewRecipe(recipe)}>{recipe.name}</h3>
                <button className="delete-btn" onClick={() => deleteRecipe(index)}>🗑️</button>
              </div>
              <div className="recipe-info">
                <span>⏱️ {recipe.time}</span>
                <span>📊 {recipe.difficulty}</span>
                <span>🔥 {recipe.calories}</span>
              </div>
              {recipe.rating > 0 && (
                <div className="saved-rating">
                  {'★'.repeat(recipe.rating)}{'☆'.repeat(5 - recipe.rating)}
                </div>
              )}
              {recipe.memo && (
                <div className="saved-memo">📝 {recipe.memo}</div>
              )}
              <div className="saved-date">저장일: {recipe.savedAt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Saved;