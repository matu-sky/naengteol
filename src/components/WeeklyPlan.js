import React, { useState } from 'react';

function WeeklyPlan({ navigate, weeklyPlan }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState(null);

  const saveWeeklyPlan = () => {
  const savedPlans = JSON.parse(localStorage.getItem('savedWeeklyPlans') || '[]');
  const newPlan = {
    plan: weeklyPlan,
    savedAt: new Date().toLocaleDateString('ko-KR')
  };
  savedPlans.push(newPlan);
  localStorage.setItem('savedWeeklyPlans', JSON.stringify(savedPlans));
  alert('일주일 식단이 저장됐어요! 🎉');
};

  const copyToClipboard = () => {
    const text = '📅 일주일 식단\n\n' +
      weeklyPlan.map(day =>
        day.day + '\n' +
        day.meals.map((meal, i) =>
          '  ' + (i + 1) + '. ' + meal.name + ' (' + meal.calories + ', ' + meal.time + ')'
        ).join('\n')
      ).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사됐어요!\n카카오톡에 붙여넣기 하세요 😊');
    });
  };

  const shareViaSMS = () => {
    const text = '📅 일주일 식단\n\n' +
      weeklyPlan.map(day =>
        day.day + ': ' +
        day.meals.map(meal => meal.name).join(', ')
      ).join('\n');
    window.location.href = 'sms:?body=' + encodeURIComponent(text);
  };

  const printPDF = () => {
    const printContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>일주일 식단</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #ff6b35; font-size: 24px; margin-bottom: 20px; }
            .day { margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
            .day-title { font-size: 18px; font-weight: bold; color: #ff6b35; margin-bottom: 12px; }
            .meal { padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
            .meal-name { font-size: 15px; font-weight: bold; }
            .meal-info { font-size: 13px; color: #888; margin-top: 4px; }
            .date { color: #888; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>📅 일주일 식단</h1>
          ${weeklyPlan.map(day => `
            <div class="day">
              <div class="day-title">${day.day}</div>
              ${day.meals.map((meal, i) => `
                <div class="meal">
                  <div class="meal-name">${i + 1}. ${meal.name}</div>
                  <div class="meal-info">⏱️ ${meal.time} · 🔥 ${meal.calories}</div>
                </div>
              `).join('')}
            </div>
          `).join('')}
          <p class="date">작성일: ${new Date().toLocaleDateString('ko-KR')}</p>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (!weeklyPlan || weeklyPlan.length === 0) {
    navigate('home');
    return null;
  }

  return (
    <div className="screen">
      <div className="header">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('ingredients')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>📅 일주일 식단</h2>
        <p>요일을 클릭하면 자세히 볼 수 있어요</p>
      </div>

      <div className="weekly-plan">
        {weeklyPlan.map((day, dayIndex) => (
          <div key={dayIndex} className="weekly-day-card">
            <div
              className="weekly-day-header"
              onClick={() => setExpandedDay(expandedDay === dayIndex ? null : dayIndex)}
            >
              <span className="weekly-day-title">{day.day}</span>
              <div className="weekly-day-meals-preview">
                {day.meals.map((meal, i) => (
                  <span key={i} className="weekly-meal-chip">{meal.name}</span>
                ))}
              </div>
              <span className="weekly-expand-btn">
                {expandedDay === dayIndex ? '▲' : '▼'}
              </span>
            </div>

            {expandedDay === dayIndex && (
              <div className="weekly-day-detail">
                {day.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="weekly-meal-card">
                    <div
                      className="weekly-meal-header"
                      onClick={() => setExpandedMeal(
                        expandedMeal === dayIndex + '-' + mealIndex
                          ? null
                          : dayIndex + '-' + mealIndex
                      )}
                    >
                      <span className="weekly-meal-number">{mealIndex + 1}</span>
                      <div className="weekly-meal-info">
                        <span className="weekly-meal-name">{meal.name}</span>
                        <span className="weekly-meal-meta">⏱️ {meal.time} · 🔥 {meal.calories}</span>
                      </div>
                      <span>{expandedMeal === dayIndex + '-' + mealIndex ? '▲' : '▼'}</span>
                    </div>

                    {expandedMeal === dayIndex + '-' + mealIndex && (
                      <div className="weekly-meal-detail">
                        <div className="weekly-meal-section">
                          <h4>🥕 재료</h4>
                          <div className="ingredients-list">
                            {meal.ingredients.map((ing, i) => (
                              <div key={i} className="ingredient-tag">
                                <span>{ing}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="weekly-meal-section">
                          <h4>👨‍🍳 조리 순서</h4>
                          {meal.steps.map((step, i) => (
                            <div key={i} className="weekly-step">
                              <span className="weekly-step-number">{i + 1}</span>
                              <span className="weekly-step-text">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="main-btn primary" onClick={saveWeeklyPlan}>
          💾 식단 저장하기
        </button>
        <button className="main-btn primary" onClick={copyToClipboard}>
          📋 카카오톡 공유 (복사하기)
        </button>
        <button className="main-btn secondary" onClick={shareViaSMS}>
          💬 문자로 공유
        </button>
        <button className="main-btn secondary" onClick={printPDF}>
          🖨️ 인쇄 / PDF 저장
        </button>
      </div>
    </div>
  );
}

export default WeeklyPlan;
