import { useState, useMemo } from 'react';
import './App.css';
import { places, accessFeatures } from './data/mockData';

function FilterBar({ selectedFilters, onToggleFilter }) {
  return (
    <div className="filter-bar">
      {accessFeatures.map((feature) => {
        const isActive = selectedFilters.includes(feature.id);
        return (
          <button
            key={feature.id}
            className={`filter-btn ${isActive ? 'active' : ''}`}
            onClick={() => onToggleFilter(feature.id)}
            aria-pressed={isActive}
          >
            <span className="filter-icon">{feature.icon}</span>
            <span className="filter-label">{feature.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PlaceCard({ place, onClick }) {
  return (
    <div className="place-card" onClick={() => onClick(place)} role="button" tabIndex={0}>
      <div className="place-image-wrapper">
        <img src={place.image} alt={place.name} loading="lazy" />
        <span className="place-category">{place.category}</span>
        <div className="place-rating">★ {place.rating}</div>
      </div>
      <div className="place-info">
        <h3 className="place-name">{place.name}</h3>
        <p className="place-address">{place.address}</p>
        <p className="place-description">{place.description}</p>

        <div className="place-features">
          {place.features.map(featureId => {
            const feature = accessFeatures.find(f => f.id === featureId);
            if (!feature) return null;
            return (
              <span key={featureId} className={`badge badge-${featureId}`} title={feature.label}>
                {feature.icon} {feature.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlaceList({ places, onPlaceClick }) {
  if (places.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <p>조건에 맞는 장소가 없습니다.</p>
        <p className="empty-subtext">필터를 변경해보세요.</p>
      </div>
    );
  }

  return (
    <div className="place-list">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} onClick={onPlaceClick} />
      ))}
    </div>
  );
}

function PlaceDetailModal({ place, onClose }) {
  if (!place) return null;

  const getStepIcon = (type) => {
    switch (type) {
      case 'station': return '🚇';
      case 'crosswalk': return '🚦';
      case 'elevator': return '🛗';
      case 'ramp': return '♿️';
      case 'arrival': return '🏁';
      default: return '🚶';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2 className="modal-title">{place.name} 상세 정보</h2>
          <p className="modal-address">{place.address}</p>
        </div>

        <div className="modal-body">
          <div className="modal-section gallery-section">
            <h3>📸 미리보는 내부 모습</h3>
            <div className="gallery-grid">
              <div className="gallery-item">
                <img src={place.details.interiorImage} alt={`${place.name} 내부 전경`} />
                <span>내부 전경</span>
              </div>
              <div className="gallery-item">
                <img src={place.details.counterImage} alt={`${place.name} 주문하는 곳`} />
                <span>주문하는 곳</span>
              </div>
            </div>
          </div>

          <div className="modal-section route-section">
            <h3>🗺️ {place.details.route.origin}에서 가는 길 (무장애 경로)</h3>
            <div className="route-summary">총 거리: <strong>{place.details.route.distance}</strong></div>

            <div className="route-timeline">
              {place.details.route.steps.map((step, index) => (
                <div key={index} className={`timeline-item type-${step.type}`}>
                  <div className="timeline-icon">{getStepIcon(step.type)}</div>
                  <div className="timeline-content">
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const toggleFilter = (featureId) => {
    setSelectedFilters(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const filteredPlaces = useMemo(() => {
    if (selectedFilters.length === 0) return places;
    return places.filter(place =>
      selectedFilters.every(filterId => place.features.includes(filterId))
    );
  }, [selectedFilters]);

  // Handle body scroll locking when modal is open
  if (selectedPlace) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo text-gradient">모두를 위한 지도</h1>
            <p className="subtitle">무장애 카페 & 식당을 한눈에 찾아보세요</p>
          </div>
        </div>
      </header>

      <main className="container main-content fade-in">
        <section className="filter-section">
          <h2 className="section-title">어떤 편의시설이 필요하신가요?</h2>
          <FilterBar
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
          />
        </section>

        <section className="results-section">
          <div className="results-header">
            <h2 className="section-title">검색 결과</h2>
            <span className="results-count">전체 {filteredPlaces.length}개</span>
          </div>
          <PlaceList places={filteredPlaces} onPlaceClick={setSelectedPlace} />
        </section>
      </main>

      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}

export default App;
