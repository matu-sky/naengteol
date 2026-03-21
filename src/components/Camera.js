import React, { useState, useRef } from 'react';

function Camera({ navigate, setIngredients, apiKey }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const base64 = image.split(',')[1];
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: '이 냉장고 사진에서 보이는 식재료를 모두 찾아서 한국어로 쉼표로 구분해서 나열해줘. 예시: 계란, 두부, 당근, 대파. 재료 목록만 답해줘.' },
                { inline_data: { mime_type: 'image/jpeg', data: base64 } }
              ]
            }]
          })
        }
      );
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const ingredientList = text.split(',').map(i => i.trim()).filter(i => i);
      setIngredients(ingredientList);
      navigate('ingredients');
    } catch (err) {
      setError('재료 인식에 실패했어요. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
        <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        <h2>📷 냉장고 사진</h2>
      </div>

      <div className="camera-area">
        {image ? (
          <img src={image} alt="냉장고" className="preview-image" />
        ) : (
          <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
            <span>📷</span>
            <p>사진을 선택하거나 촬영해주세요</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="button-group">
        <button className="main-btn secondary" onClick={() => {
  fileInputRef.current.removeAttribute('capture');
  fileInputRef.current.click();
}}>
  🖼️ 파일에서 선택
</button>
<button className="main-btn primary" onClick={() => {
  fileInputRef.current.setAttribute('capture', 'environment');
  fileInputRef.current.click();
}}>
  📷 카메라로 촬영
  </button>
        {image && (
          <button className="main-btn primary" onClick={analyzeImage} disabled={loading}>
            {loading ? '🔍 재료 분석 중...' : '🔍 재료 분석하기'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Camera;