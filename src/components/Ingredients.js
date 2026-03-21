import React, { useState } from 'react';

function Ingredients({ navigate, ingredients, setIngredients, setRecipes, apiKey }) {
  const [loading, setLoading] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [filter, setFilter] = useState('전체');

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
      const filterText = filter === '전체' ? '' : `${filter} 요리로`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `재료: ${ingredients.join(', ')}
이 재료들로 만들 수 있는 ${filterText} 한국 요리 5가지를 추천해줘.
반드시 아래 JSON 형식으로만 답해줘. 다른 말은 하지 마:
[
  {
    "name": "요리이름",
    "time": "조리시간(예:15분)",
    "difficulty": "난이도(쉬움/보통/어려움)",
    "calories": "칼로리(예:350kcal)",
    "ingredients": ["재료1 적정량(예: 돼지고기 200g)", "재료2 적정량(예: 고춧가루 1큰술)"],
    "steps": ["1단계: 재료 용량을 정확히 포함해서 설명 (예: 고춧가루 1큰술, 간장 2큰술을 섞어 양념을 만듭니다)", "2단계 설명", "3단계 설명"]
  }
]`
              }]
            }]
          })
        }
      );
