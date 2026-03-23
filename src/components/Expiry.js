import React, { useState } from 'react';

function Expiry({ navigate, setIngredients, setRecipes, apiKey }) {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('expiryItems') || '[]');
  });

  const getExpiryStatus = (expiry) => {
    if (!expiry) return 'none';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiry);
    const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'expired';
    if (diff <= 3) return 'soon';
    return 'ok';
  };

  const getExpiryLabel = (expiry) => {
    if (!expiry) return '유통기한 미입력';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiry);
    const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '⚠️ ' + Math.abs(diff) + '일 초과 만료';
    if (diff === 0) return '⚠️ 오늘 만료';
    if (diff <= 3) return '⚠️ ' + diff + '일 남음';
    return '✅ ' + diff + '일 남음';
  };

  const getSortedItems = () => {
    return [...items].sort((a, b) => {
      if (!a.expiry) return 1;
      if (!b.expiry) return -1;
      return new Date(a.expiry) - new Date(b.expiry);
    });
  };

  const removeItem = (index) => {
    const sorted = getSortedItems();
    const itemToRemove = sorted[index];
    const updated = items.filter(i => !(i.name === itemToRemove.name && i.expiry === itemToRemove.expiry));
    setItems(updated);
    localStorage.setItem('expiryItems', JSON.stringify(updated));
  };

  const clearExpired = () => {
    if (!window.confirm('만료된 재료를 모두 삭제할까요?')) return;
    const updated = items.filter(i => getExpiryStatus(i.expiry) !== 'expired');
    setItems(updated);
    localStorage.setItem('expiryItems', JSON.stringify(updated));
  };

  const useForRecipe = async (item) => {
    const soonItems = getSortedItems().filter(i =>
      getExpiryStatus(i.expiry) === 'soon' || getExpiryStatus(i.expiry) === 'expired'
    );
    const ingredientList = soonItems.length > 0
      ? soonItems.map(i => i.name)
      : [item.name];
    setIngredients(ingredientList);

    const promptText = '재료: ' + ingredientList.join(', ') + '\n' +
      '이 재료들로 만들 수 있는 한국 요리 5가지를 추천해줘.\n' +
      '유통기한이 임박한 재료를 반드시 사용하는 레시피를 추천해줘.\n' +
      '반드시 아래 JSON 형식으로만 답해줘. 다른 말은 하지 마:\n' +
      '[\n' +
      '  {\n' +
      '    "name": "요리이름",\n' +
      '    "time": "조리시간(예:15분)",\n' +
      '    "difficulty": "난이도(쉬움/보통/어려움)",\n' +
      '    "calories": "칼로리(예:350kcal)",\n' +
      '    "ingredients": ["재료1 적정량", "재료2 적정량"],\n' +
      '    "steps": ["1단계 설명", "2단계 설명", "3단계 설명"]\n' +
      '  }\n' +
      ']';

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const recipes = JSON.parse(jsonMatch[0]);
        setRecipes(recipes);
        navigate('recipes');
      }
    } catch (err) {
      alert('레시피 추천에 실패했어요. 다시 시도해주세요.');
    }
  };

  const sortedItems = getSortedItems();
  const expiredCount = sortedItems.filter(i => getExpiryStatus(i.expiry) === 'expired').length;
  const soonCount = sortedItems.filter(i => getExpiryStatus(i.expiry) === 'soon').length;

  return (
    <div className="screen">
      <div className="header">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>⏰ 유통기한 관리</h2>
        <p>총 {items.length}개 재료</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>등록된 재료가 없어요</p>
          <p>재료 직접 입력에서 추가해주세요!</p>
          <button className="main-btn primary" onClick={() => navigate('manual')} style={{ marginTop: '24px' }}>
            ✏️ 재료 입력하러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="expiry-summary">
            {expiredCount > 0 && (
              <div className="expiry-summary-item expired">
                <span>만료됨</span>
                <span>{expiredCount}개</span>
              </div>
            )}
            {soonCount > 0 && (
              <div className="expiry-summary-item soon">
                <span>임박</span>
                <span>{soonCount}개</span>
              </div>
            )}
            <div className="expiry-summary-item ok">
              <span>양호</span>
              <span>{items.length - expiredCount - soonCount}개</span>
            </div>
          </div>

          {expiredCount > 0 && (
            <button className="main-btn secondary" onClick={clearExpired} style={{ marginBottom: '16px' }}>
              🗑️ 만료된 재료 전체 삭제
            </button>
          )}

          {soonCount > 0 && (
            <button className="main-btn primary" onClick={() => useForRecipe(sortedItems[0])} style={{ marginBottom: '16px' }}>
              🍳 임박 재료로 레시피 추천받기
            </button>
          )}

          <div className="manual-items">
            {sortedItems.map((item, index) => {
              const status = getExpiryStatus(item.expiry);
              return (
                <div key={index} className={'manual-item ' + status}>
                  <div className="manual-item-info">
                    <span className="manual-item-name">{item.name}</span>
                    <span className={'manual-item-expiry ' + status}>
                      {getExpiryLabel(item.expiry)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className="manual-item-delete"
                      onClick={() => removeItem(index)}
                    >✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Expiry;
