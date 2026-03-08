export const accessFeatures = [
  { id: 'ramp', icon: '♿️', label: '단차 없음/경사로' },
  { id: 'elevator', icon: '🛗', label: '엘리베이터' },
  { id: 'toilet', icon: '🚻', label: '장애인 화장실' },
  { id: 'parking', icon: '🅿️', label: '전용 주차장' },
];

export const places = [
  {
    id: 'p1',
    name: '블루보틀 성수 카페',
    category: '카페',
    address: '서울 성동구 아차산로 7',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    description: '넓은 공간과 문턱 없는 출입구로 휠체어 진입이 수월합니다.',
    features: ['ramp', 'elevator', 'toilet'],
    rating: 4.8,
    details: {
      interiorImage: 'https://images.unsplash.com/photo-1525610553991-56e11153656d?auto=format&fit=crop&q=80&w=800',
      counterImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95e28a?auto=format&fit=crop&q=80&w=800',
      route: {
        origin: '뚝섬역 (2호선)',
        distance: '150m (도보/휠체어 약 3분)',
        steps: [
          { type: 'station', description: '뚝섬역 1번 출구 엘리베이터 이용' },
          { type: 'path', description: '출구에서 나와 직진 방향 100m 이동 (평탄한 인도)' },
          { type: 'crosswalk', description: '신호등 없는 작은 횡단보도 1회 (요철 없음)' },
          { type: 'arrival', description: '좌측 건물 1층 (넓은 자동문 출입구)' }
        ]
      }
    }
  },
  {
    id: 'p2',
    name: '어니언 안국',
    category: '식당',
    address: '서울 종로구 계동길 5',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
    description: '한옥의 멋스러움을 느낄 수 있고, 전용 주차장과 경사로가 완비되어 있습니다.',
    features: ['ramp', 'parking'],
    rating: 4.5,
    details: {
      interiorImage: 'https://images.unsplash.com/photo-1588667355047-9dc0cff738c6?auto=format&fit=crop&q=80&w=800',
      counterImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=800',
      route: {
        origin: '안국역 (3호선)',
        distance: '300m (도보/휠체어 약 6분)',
        steps: [
          { type: 'station', description: '안국역 3번 출구 엘리베이터 이용' },
          { type: 'path', description: '계동길 방면으로 우회전하여 250m 직진 (보도블럭 양호)' },
          { type: 'ramp', description: '가게 입구 전 5도 미만의 완만한 목재 경사로 진입' },
          { type: 'arrival', description: '한옥 마당을 거쳐 본관으로 진입' }
        ]
      }
    }
  },
  {
    id: 'p3',
    name: '스타벅스 더종로R점',
    category: '카페',
    address: '서울 종로구 평창11길 19',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
    description: '모든 편의시설이 완벽히 갖춰진 프리미엄 리저브 매장입니다.',
    features: ['ramp', 'elevator', 'toilet', 'parking'],
    rating: 4.9,
    details: {
      interiorImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
      counterImage: 'https://images.unsplash.com/photo-1521017432531-fbd9202ca219?auto=format&fit=crop&q=80&w=800',
      route: {
        origin: '종각역 (1호선)',
        distance: '50m (도보/휠체어 약 1분)',
        steps: [
          { type: 'station', description: '종각역 지하 연결 통로 종로타워 방향 진입' },
          { type: 'path', description: '타워 지하 1층 로비를 가로질러 이동' },
          { type: 'elevator', description: '로비 중앙 엘리베이터를 탑승하여 1층으로 이동' },
          { type: 'arrival', description: '동선 방해물 없이 바로 주문 데스크 연결' }
        ]
      }
    }
  },
  {
    id: 'p4',
    name: '더 플레이스',
    category: '식당',
    address: '서울 강남구 테헤란로 123',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    description: '엘리베이터와 넓은 실내 화장실로 쾌적한 식사가 가능합니다.',
    features: ['elevator', 'toilet'],
    rating: 4.3,
    details: {
      interiorImage: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
      counterImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
      route: {
        origin: '강남역 (2호선/신분당선)',
        distance: '200m (도보/휠체어 약 4분)',
        steps: [
          { type: 'station', description: '강남역 12번 출구 엘리베이터 이용' },
          { type: 'path', description: '테헤란로를 따라 150m 직진 (넓은 보행로)' },
          { type: 'crosswalk', description: '상가 진입을 위한 횡단 시설 없음 (그대로 빌딩 1층 진입)' },
          { type: 'arrival', description: '빌딩 내 엘리베이터 탑승 후 2층으로 진입' }
        ]
      }
    }
  },
  {
    id: 'p5',
    name: '비건 키친',
    category: '식당',
    address: '서울 마포구 와우산로 25',
    image: 'https://images.unsplash.com/photo-1498837167922-41c543212871?auto=format&fit=crop&q=80&w=800',
    description: '단차 없는 출입구와 장애인 전용 주차공간을 제공하는 친환경 식당.',
    features: ['ramp', 'parking'],
    rating: 4.6,
    details: {
      interiorImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
      counterImage: 'https://images.unsplash.com/photo-1558904541-efaa3205b331?auto=format&fit=crop&q=80&w=800',
      route: {
        origin: '상수역 (6호선)',
        distance: '400m (도보/휠체어 약 8분)',
        steps: [
          { type: 'station', description: '상수역 1번 출구 엘리베이터 이용' },
          { type: 'path', description: '다소 좁은 인도지만 휠체어 양방향 통행 가능' },
          { type: 'crosswalk', description: '시각장애인용 음향신호기가 설치된 건널목 통과' },
          { type: 'arrival', description: '우측 건물 1층 (넓은 주차장을 가로질러 진입)' }
        ]
      }
    }
  },
];
