import React, { useState } from 'react';

function RecipeDetail({ navigate, recipe }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [memo, setMemo] = useState('');
  const [rating, setRating] = useState(0);

  const saveRecipe = () => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    const newRecipe = {
      ...recipe,
      memo,
      rating,
      savedAt: new Date().toLocaleDateString('ko-KR')
    };
    savedRecipes.push(newRecipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    setSaved(true);
    alert('레시피가 저장됐어요! 🎉');
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  if (!recipe) {
    navigate('home');
    return null;
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('recipes')}>← 뒤로</button>
        <h2>{recipe.name}</h2>
      </div>

      <div className="recipe-meta">
        <span>⏱️ {recipe.time}</span>
        <span>📊 {recipe.difficulty}</span>
        <span>🔥 {recipe.calories}</span>
      </div>

      <div className="section">
        <h3>🥕 필요한 재료</h3>
        <div className="ingredients-list">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="ingredient-tag">
              <span>{ing}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>👨‍🍳 조리 순서</h3>
        <div className="steps-list">
          {recipe.steps.map((step, i) => (
            <div
              key={i}
              className={`step-item ${currentStep === i ? 'active' : ''}`}
              onClick={() => setCurrentStep(i)}
            >
              <div className="step-number">{i + 1}</div>
              <div className="step-text">{step}</div>
              <button
                className="speak-btn"
                onClick={(e) => { e.stopPropagation(); speak(step); }}
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>⭐ 별점</h3>
        <div className="rating">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`star ${rating >= star ? 'active' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>📝 메모</h3>
        <textarea
          placeholder="간 좀 더 세게, 다음엔 파 추가 등..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="memo-input"
        />
      </div>

      <button
        className={`main-btn ${saved ? 'saved' : 'primary'}`}
        onClick={saveRecipe}
        disabled={saved}
      >
        {saved ? '✅ 저장됨' : '🔖 레시피 저장하기'}
      </button>

      <div style={{ height: '20px' }} />
    </div>
  );
}

export default RecipeDetail;