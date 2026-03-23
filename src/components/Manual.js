import React, { useState } from 'react';

function Manual({ navigate, setIngredients, setRecipes, apiKey }) {
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('expiryItems') || '[]');
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('전체');

  const addItem = () => {
    if (!name.trim()) return;
    const newItem = { name: name.trim(), expiry };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('expiryItems', JSON.stringify(updated));
    setName('');
    setExpiry('');
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('expiryItems', JSON.stringify(updated));
  };

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
    if (!expiry) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(expiry);
    const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '⚠️ 만료됨';
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

  const getRecipes = async () => {
    if (items.length === 0) return;
    setLoading(true);
    const sortedItems = getSortedItems();
    const ingredientList = sortedItems.map(i => i.name);
    setIngredients(ingredientList);
    try {
      const filterText = filter === '전체' ? '' : filter + ' 요리로';
      const promptText = '재료: ' + ingredientList.join(', ') + '\n' +
        '이 재료들로 만들 수 있는 ' + filterText + ' 한국 요리 5가지를 추천해줘.\n' +
        '유통기한이 임박한 재료를 우선 사용하는 레시피를 먼저 추천해줘.\n' +
        '반드시 아래 JSON 형식으로만 답해줘. 다른 말은 하지 마:\n' +
        '[\n' +
        '  {\n' +
        '    "name": "요리이름",\n' +
        '    "time": "조리시간(예:15분)",\n' +
        '    "difficulty": "난이도(쉬움/보통/어려움)",\n' +
        '    "calories": "칼로리(예:350kcal)",\n' +
        '    "ingredients": ["재료1 적정량(예: 돼지고기 200g)", "재료2 적정량(예: 고춧가루 1큰술)"],\n' +
        '    "steps": ["1단계: 재료 용량을 정확히 포함해서 설명", "2단계 설명", "3단계 설명"]\n' +
        '  }\n' +
        ']';
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
    setLoading(false);
  };

  return (
    <div className="screen">
      <div className="header">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>✏️ 재료 직접 입력</h2>
        <p>재료와 유통기한을 입력해주세요</p>
      </div>

      <div className="manual-input-box">
        <input
          type="text"
          placeholder="재료 이름 (예: 계란)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="manual-name-input"
        />
        <div className="expiry-row">
          <label>유통기한</label>
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="manual-date-input"
          />
        </div>
        <button className="main-btn primary" onClick={addItem}>
          + 재료 추가
        </button>
      </div>

      {items.length > 0 && (
        <div className="manual-items">
          <h3>입력된 재료 ({items.length}개)</h3>
          {getSortedItems().map((item, index) => {
            const status = getExpiryStatus(item.expiry);
            return (
              <div key={index} className={'manual-item ' + status}>
                <div className="manual-item-info">
                  <span className="manual-item-name">{item.name}</span>
                  {item.expiry && (
                    <span className={'manual-item-expiry ' + status}>
                      {getExpiryLabel(item.expiry)}
                    </span>
                  )}
                </div>
                <button className="manual-item-delete" onClick={() => removeItem(index)}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="filter-group" style={{ marginTop: '16px' }}>
          <p>요리 종류 선택</p>
          <div className="filter-buttons">
            {['전체', '혼밥', '다이어트', '10분요리', '한식'].map(f => (
              <button
                key={f}
                className={'filter-btn' + (filter === f ? ' active' : '')}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <button
          className="main-btn primary"
          onClick={getRecipes}
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? '🍳 레시피 찾는 중...' : '🍳 레시피 추천받기 (' + items.length + '개 재료)'}
        </button>
      )}
    </div>
  );
}

export default Manual;
