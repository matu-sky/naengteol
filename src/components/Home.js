import React from 'react';

function Home({ navigate }) {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  const expiryItems = JSON.parse(localStorage.getItem('expiryItems') || '[]');
  const shoppingItems = JSON.parse(localStorage.getItem('shoppingList') || '[]');

  const soonCount = expiryItems.filter(item => {
    if (!item.expiry) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(item.expiry);
    const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return diff <= 3;
  }).length;

  const uncheckedCount = shoppingItems.filter(i => !i.checked).length;

  return (
    <div className="screen">
      <div className="header">
        <h1>🍳 K냉털</h1>
        <p>냉장고를 털어라!</p>
      </div>
      <div className="main-buttons">
        <button className="main-btn primary" onClick={() => navigate('camera')}>
          📷 냉장고 사진 찍기
        </button>
        <button className="main-btn primary" onClick={() => navigate('manual')}>
          ✏️ 재료 직접 입력
        </button>
        <button className="main-btn secondary" onClick={() => navigate('expiry')}>
          ⏰ 유통기한 관리
          {soonCount > 0 && (
            <span className="expiry-badge">{soonCount}</span>
          )}
        </button>
        <button className="main-btn secondary" onClick={() => navigate('shopping')}>
          🛒 장보기 리스트
          {uncheckedCount > 0 && (
            <span className="expiry-badge">{uncheckedCount}</span>
          )}
        </button>
        <button className="main-btn secondary" onClick={() => navigate('saved')}>
          🔖 저장된 레시피 ({savedRecipes.length})
        </button>
      </div>
    </div>
  );
}

export default Home;
