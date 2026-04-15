import React, { useState, useEffect } from 'react';

function Ingredients({ navigate, ingredients, setIngredients, setRecipes, setWeeklyPlan, apiKey }) {
  const [loading, setLoading] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [filter, setFilter] = useState('전체');
  const [loadingMessage, setLoadingMessage] = useState('');

  const loadingMessages = [
    '🍳 AI가 레시피를 찾고 있어요...',
    '📖 맛있는 레시피를 작성 중이에요...',
    '🥘 재료 조합을 분석하고 있어요...',
    '👨‍🍳 요리 순서를 정리하고 있어요...',
    '✨ 거의 다 됐어요!'
  ];

  useEffect(() => {
    if (!loading) return;
    let index = 0;
    setLoadingMessage(loadingMessages[0]);
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const addIngredient = () => {
    if (!newIngredient.trim()) return;
    setIngredients([...ingredients, newIngredient.trim()]);
    setNewIngredient('');
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const getRecipes = async () => {
    setLoading(true);
    try {
      if (filter === '일주일식단') {
        const promptText = '재료: ' + ingredients.join(', ') + '\n' +
          '이 재료들을 최대한 활용해서 일주일 식단을 짜줘.\n' +
'월요일부터 일요일까지 각 요일별로 2가지 메뉴를 추천해줘.\n' +
'반드시 아래 조건을 지켜줘:\n' +
'1. 7일 동안 같은 요리가 절대 반복되지 않게 해줘\n' +
'2. 매일 탄수화물, 단백질, 채소가 균형있게 포함되도록 해줘\n' +
'3. 입력된 재료를 최대한 골고루 사용해줘\n' +
'4. 조리 순서는 재료 용량을 정확히 포함해서 상세하게 설명해줘\n' +
'5. 난이도는 쉬움~보통 수준으로 일반인이 만들 수 있는 요리로 해줘\n' +
'6. 한국인 입맛에 맞는 한식 위주로 추천해줘\n' +
          '반드시 아래 JSON 형식으로만 답해줘. 다른 말은 하지 마:\n' +
          '[\n' +
          '  {\n' +
          '    "day": "월요일",\n' +
          '    "meals": [\n' +
          '      {\n' +
          '        "name": "요리이름",\n' +
          '        "time": "조리시간(예:15분)",\n' +
          '        "calories": "칼로리(예:350kcal)",\n' +
          '        "ingredients": ["재료1 적정량", "재료2 적정량"],\n' +
          '        "steps": ["1단계 설명", "2단계 설명"]\n' +
          '      },\n' +
          '      {\n' +
          '        "name": "요리이름2",\n' +
          '        "time": "조리시간",\n' +
          '        "calories": "칼로리",\n' +
          '        "ingredients": ["재료1 적정량"],\n' +
          '        "steps": ["1단계 설명"]\n' +
          '      }\n' +
          '    ]\n' +
          '  }\n' +
          ']';

        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + apiKey,
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
          const plan = JSON.parse(jsonMatch[0]);
          setWeeklyPlan(plan);
          navigate('weeklyPlan');
        }
      } else {
        const filterText = filter === '전체' ? '' : filter + ' 요리로';
        const promptText = '재료: ' + ingredients.join(', ') + '\n' +
          '이 재료들로 만들 수 있는 ' + filterText + ' 한국 요리 5가지를 추천해줘.\n' +
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
          <button className="back-btn" onClick={() => navigate('camera')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>🥕 재료 확인</h2>
      </div>

      <div className="ingredients-list">
        {ingredients.map((item, index) => (
          <div key={index} className="ingredient-tag">
            <span>{item}</span>
            <button onClick={() => removeIngredient(index)}>✕</button>
          </div>
        ))}
      </div>

      <div className="add-ingredient">
        <input
          type="text"
          placeholder="재료 추가하기"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
        />
        <button onClick={addIngredient}>추가</button>
      </div>

      <div className="filter-group">
        <p>요리 종류 선택</p>
        <div className="filter-buttons">
          {['전체', '혼밥', '다이어트', '10분요리', '한식', '비건', '일주일식단'].map(f => (
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

      <button
        className="main-btn primary"
        onClick={getRecipes}
        disabled={loading || ingredients.length === 0}
      >
        {loading ? loadingMessage : filter === '일주일식단' ? '📅 일주일 식단 추천받기' : '🍳 레시피 추천받기'}
      </button>
    </div>
  );
}

export default Ingredients;
