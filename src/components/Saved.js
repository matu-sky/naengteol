import React, { useState } from 'react';

function Saved({ navigate, setSelectedRecipe, setWeeklyPlan, setPreviousScreen, setPreviousWeeklyScreen }) {
  const [activeTab, setActiveTab] = useState('recipes');
  const [savedRecipes, setSavedRecipes] = useState(
    JSON.parse(localStorage.getItem('savedRecipes') || '[]')
  );
  const [savedPlans, setSavedPlans] = useState(
    JSON.parse(localStorage.getItem('savedWeeklyPlans') || '[]')
  );

  const deleteRecipe = (index) => {
    if (!window.confirm('이 레시피를 삭제할까요?')) return;
    const updated = savedRecipes.filter((_, i) => i !== index);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
    setSavedRecipes(updated);
  };

  const deletePlan = (index) => {
    if (!window.confirm('이 식단을 삭제할까요?')) return;
    const updated = savedPlans.filter((_, i) => i !== index);
    localStorage.setItem('savedWeeklyPlans', JSON.stringify(updated));
    setSavedPlans(updated);
  };

  const viewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setPreviousScreen('saved');
    navigate('recipeDetail');
  };

  const viewPlan = (plan) => {
    setWeeklyPlan(plan.plan);
    setPreviousWeeklyScreen('saved');
    navigate('weeklyPlan');
  };

  return (
    <div className="screen">
      <div className="header">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>🔖 저장 목록</h2>
      </div>

      <div className="saved-tabs">
        <button
          className={'saved-tab' + (activeTab === 'recipes' ? ' active' : '')}
          onClick={() => setActiveTab('recipes')}
        >
          📋 레시피 ({savedRecipes.length})
        </button>
        <button
          className={'saved-tab' + (activeTab === 'plans' ? ' active' : '')}
          onClick={() => setActiveTab('plans')}
        >
          📅 식단 ({savedPlans.length})
        </button>
      </div>

      {activeTab === 'recipes' && (
        <>
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
        </>
      )}

      {activeTab === 'plans' && (
        <>
          {savedPlans.length === 0 ? (
            <div className="empty-state">
              <p>저장된 식단이 없어요</p>
              <p>일주일 식단을 추천받고 저장해보세요! 😊</p>
              <button className="main-btn primary" onClick={() => navigate('home')}>
                식단 만들러 가기
              </button>
            </div>
          ) : (
            <div className="recipe-list">
              {savedPlans.map((plan, index) => (
                <div key={index} className="recipe-card">
                  <div className="recipe-card-header">
                    <h3 onClick={() => viewPlan(plan)}>
                      📅 {plan.savedAt} 식단
                    </h3>
                    <button className="delete-btn" onClick={() => deletePlan(index)}>🗑️</button>
                  </div>
                  <div className="weekly-day-meals-preview" style={{ marginTop: '8px' }}>
                    {plan.plan.slice(0, 3).map((day, i) => (
                      <span key={i} className="weekly-meal-chip">
                        {day.day}: {day.meals[0].name}
                      </span>
                    ))}
                    {plan.plan.length > 3 && (
                      <span className="weekly-meal-chip">+{plan.plan.length - 3}일</span>
                    )}
                  </div>
                  <div className="saved-date">저장일: {plan.savedAt}</div>
                  <button
                    className="main-btn secondary"
                    onClick={() => viewPlan(plan)}
                    style={{ marginTop: '10px', marginBottom: '0' }}
                  >
                    자세히 보기 →
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Saved;
