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
    const url = 'https://www.coupang.com/np/search?q=' + encodeURIComponent(itemName) + '&channel=user&isPriceRange=false&filterType=&listSize=36&filter=&minPrice=&maxPrice=&page=1&rocketAll=false&searchIndexingToken=&sorter=scoreDesc&ref=' + COUPANG_ID;
    window.open(url, '_blank');
  };

  const openCoupangMain = () => {
    window.open('https://link.coupang.com/a/ecMMwj', '_blank');
  };

  const downloadPDF = () => {
    if (items.length === 0) return;
    const printContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>장보기 리스트</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #ff6b35; font-size: 24px; margin-bottom: 4px; }
            p { color: #999; font-size: 12px; margin-bottom: 24px; }
            hr { border: 1px solid #ff6b35; margin-bottom: 24px; }
            .item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
            .checkbox { width: 18px; height: 18px; border: 2px solid #ff6b35; border-radius: 4px; margin-right: 12px; display: inline-block; }
            .checked-box { background: #ff6b35; }
            .item-name { font-size: 15px; color: #333; }
            .item-qty { font-size: 13px; color: #999; margin-left: 8px; }
            .footer { color: #ccc; font-size: 11px; margin-top: 32px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>🛒 장보기 리스트</h1>
          <p>${new Date().toLocaleDateString('ko-KR')} 작성 · 총 ${items.length}개</p>
          <hr />
          ${items.map(item => `
            <div class="item">
              <span class="checkbox ${item.checked ? 'checked-box' : ''}"></span>
              <span class="item-name" style="${item.checked ? 'text-decoration:line-through;color:#aaa;' : ''}">${item.name}</span>
              ${item.quantity ? '<span class="item-qty">(' + item.quantity + ')</span>' : ''}
            </div>
          `).join('')}
          <p class="footer">Made by K냉털 🍳</p>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
        <p style={{ fontSize: '11px', color: '#aaa', marginTop: '6px', textAlign: 'center' }}>
          이 게시물은 쿠팡파트너스 활동의 일환으로 수수료를 제공받습니다.
        </p>
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
                >
                  🛍️ 구매
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
            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '8px', textAlign: 'center' }}>
              이 게시물은 쿠팡파트너스 활동의 일환으로 수수료를 제공받습니다.
            </p>
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
