import React, { useState, useRef } from 'react';

function Camera({ navigate, setIngredients, apiKey }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          if (prev.length >= 4) return prev;
          return [...prev, reader.result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prev => {
        if (prev.length >= 4) return prev;
        return [...prev, reader.result];
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeImages = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const parts = [
        { text: '이 냉장고 사진들에서 보이는 식재료를 모두 찾아서 한국어로 쉼표로 구분해서 나열해줘. 예시: 계란, 두부, 당근, 대파. 재료 목록만 답해줘.' },
        ...images.map(image => ({
          inline_data: {
            mime_type: 'image/jpeg',
            data: image.split(',')[1]
          }
        }))
      ];
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }]
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
        <div className="header-nav">
          <button className="back-btn" onClick={() => navigate('home')}>← 뒤로</button>
          <button className="home-btn" onClick={() => navigate('home')}>🏠 홈</button>
        </div>
        <h2>📷 냉장고 사진</h2>
        <p>여러 장 올리면 더 정확해요! (최대 4장)</p>
      </div>

      <div className="image-preview-grid">
        {images.map((img, index) => (
          <div key={index} className="image-preview-item">
            <img src={img} alt={"냉장고" + (index + 1)} />
            <button className="remove-image-btn" onClick={() => removeImage(index)}>X</button>
          </div>
        ))}
        {images.length < 4 && (
          <div className="image-add-placeholder">
            <span>+</span>
            <p>{images.length === 0 ? '사진을 추가해주세요' : '사진 추가'}</p>
          </div>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="button-group">
        <button
          className="main-btn secondary"
          onClick={() => fileInputRef.current.click()}
          disabled={images.length >= 4}
        >
          파일에서 선택 (여러 장 가능)
        </button>
        <button
          className="main-btn secondary"
          onClick={() => cameraInputRef.current.click()}
          disabled={images.length >= 4}
        >
          카메라로 촬영
        </button>
        {images.length > 0 && (
          <button
            className="main-btn primary"
            onClick={analyzeImages}
            disabled={loading}
          >
            {loading ? '재료 분석 중...' : '재료 분석하기 (' + images.length + '장)'}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default Camera;
