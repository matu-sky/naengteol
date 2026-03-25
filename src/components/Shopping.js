import React, { useState } from 'react';

function Shopping({ navigate }) {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('shoppingList') || '[]');
  });
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const COUPANG_ID = 'AF9636369';

  const addItem = () => {
    if (!name.trim()) return;
    const newItem = {
      name: name.trim(),
      quantity: quantity.trim(),
      checked: false
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
    setName('');
    setQuantity('');
  };

  const toggleItem = (index) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
  };

  const clearChecked = () => {
    if (!window.confirm('구매완료 항목을 삭제할까요?')) return;
    const updated = items.filter(i => !i.checked);
    setItems(updated);
    localStorage.setItem('shoppingList', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (!window.confirm('장보기 목록을 전체 삭제할까요?')) return;
    setItems([]);
    localStorage.setItem('shoppingList', JSON.stringify([]));
  };

  const copyToClipboard = () => {
    if (items.length === 0) return;
    const text = '🛒 장보기 리스트\n\n' +
      items.map((item) =>
        (item.checked ? '✅ ' : '⬜ ') +
        item.name +
        (item.quantity ? ' (' + item.quantity + ')' : '')
      ).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사됐어요!\n카카오톡에 붙여넣기 하세요 😊');
    });
  };

  const shareViaSMS = () => {
    if (items.length === 0) return;
    const text = '🛒 장보기 리스트\n\n' +
      items.map(item =>
        '• ' + item.name +
        (item.quantity ? ' (' + item.quantity + ')' : '')
      ).join('\n');
    window.location.href = 'sms:?body=' + encodeURIComponent(text);
  };

  const openCoupang = (itemName) => {
    const url = `https://www.coupang.com/np/search?q=${encodeURIComponent(itemName)}&channel=user&isPriceRange=false&filterType=&listSize=36&filter=&isPriceRange=false&minPrice=&maxPrice=&page=1&rocketAll=false&searchIndexingToken=&sorter=scoreDesc&ref=${COUPANG_ID}`;
    window.open(url, '_blank');
  };

  const openCoupangMain = () => {
    const url = `https://www.coupang.com?ref=${COUPANG_ID}`;
    window.open(url, '_blank');
  };

  const downloadPDF = async () => {
    if (items.length === 0) return;

    const html2pdf = (await import('html2pdf.js')).default;

    const content = document.createElement('div');
    content.innerHTML = `
      <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; padding: 40px;">
        <h1 style="color: #ff6b35; font-size: 24px; margin-bottom: 4px;">🛒 장보기 리스트</h1>
        <p style="color: #999; font-size: 12px; margin-bottom: 24px;">
          ${new Date().toLocaleDateString('ko-KR')} 작성 · 총 ${items.length}개
        </p>
        <hr style="border: 1px solid #ff6b35; margin-bottom: 24px;" />
        ${items.map(item => `
          <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span style="
              display: inline-block;
              width: 18px; height: 18px;
              border: 2px solid #ff6b35;
              border-radius: 4px;
              margin-right: 12px;
              background: ${item.checked ? '#ff6b35' : 'white'};
              flex-shrink: 0;
            "></span>
            <span style="
              font-size: 15px;
              color: ${item.checked ? '#aaa' : '#333'};
              text-decoration: ${item.checked ? 'line-through' : 'none'};
            ">${item.name}</span>
            ${item.quantity ? `
              <span style="color: #999; font-size: 13px; margin-left: 8px;">
                (${item.quantity})
              </span>` : ''}
          </div>
        `).join('')}
        <p style="color: #ccc; font-size: 11px; margin-top: 32px; text-align: right;">
          Made by K냉털 🍳
        </p>
      </div>
    `;

    const options = {
      margin: 0,
      filename: '장보기리스트.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(content).save();
  };

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="screen">
      <div className="header">
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>🛒 장보기 리스트</h2>
        <p>총 {items.length}개 · 완료 {checkedCount}개</p>
      </div>

      <div className="manual-input-box">
        <input
          type="text"
          placeholder="재료 이름 (예: 두부)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="manual-name-input"
        />
        <input
          type="text"
          placeholder="수량 (예: 2개, 500g) - 선택사항"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="manual-name-input"
        />
        <button className="main-btn primary" onClick={addItem}>
          + 추가
        </button>
      </div>

      {items.length > 0 && (
        <>
          <div className="shopping-list">
            {items.map((item, index) => (
              <div
                key={index}
                className={'shopping-item' + (item.checked ? ' checked' : '')}
                onClick={() => toggleItem(index)}
              >
                <div className="shopping-checkbox">
                  {item.checked ? '✅' : '⬜'}
                </div>
                <div className="shopping-item-info">
                  <span className="shopping-item-name">{item.name}</span>
                  {item.quantity && (
                    <span className="shopping-item-quantity">{item.quantity}</span>
                  )}
                </div>
                <button
                  className="coupang-btn"
                  onClick={(e) => { e.stopPropagation(); openCoupang(item.name); }}
                  title="쿠팡에서 검색"
                >
                  🛍️
                </button>
                <button
                  className="manual-item-delete"
                  onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                >✕</button>
              </div>
            ))}
          </div>

          <div className="shopping-actions">
            {checkedCount > 0 && (
              <button className="main-btn secondary" onClick={clearChecked}>
                🗑️ 구매완료 삭제 ({checkedCount}개)
              </button>
            )}
            <button className="main-btn secondary" onClick={clearAll}>
              🗑️ 전체 삭제
            </button>
          </div>

          <div style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
              공유 / 출력
            </p>
            <button className="main-btn primary" onClick={copyToClipboard}>
              📋 카카오톡 공유 (복사하기)
            </button>
            <button className="main-btn secondary" onClick={shareViaSMS}>
              💬 문자로 공유
            </button>
            <button className="main-btn secondary" onClick={downloadPDF}>
              📄 PDF 저장
            </button>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', background: '#fff8f5', borderRadius: '12px', border: '1px solid #ffd6c0' }}>
            <p style={{ fontSize: '13px', color: '#ff6b35', fontWeight: '600', marginBottom: '8px' }}>
              🛒 쿠팡에서 장보기
            </p>
            <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
              재료 옆 🛍️ 버튼으로 개별 검색하거나, 아래 버튼으로 쿠팡 바로가기
            </p>
            <button
              className="main-btn primary"
              onClick={openCoupangMain}
              style={{ background: '#ff6b35' }}
            >
              🛒 쿠팡에서 한번에 장보기
            </button>
          </div>
        </>
      )}

      {items.length === 0 && (
        <div className="empty-state">
          <p>장보기 목록이 비어있어요</p>
          <p>위에서 재료를 추가해주세요! 😊</p>
        </div>
      )}
    </div>
  );
}

export default Shopping;
```

---

## 추가된 기능
```
✅ 재료 옆 🛍️ 버튼 → 쿠팡에서 재료 검색
✅ 하단 🛒 쿠팡 바로가기 버튼
✅ 파트너스 ID AF9636369 자동 적용
