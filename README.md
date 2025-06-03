
# Domain

https://dev.easytoweb.store/

# 기능 

프로젝트 초대 , 관리 , 생성, 삭제 
이메일 인증
웹 에디터 
발행
클릭 가능한 UI 
웹 사이트 빌드 , 공유 등 

# 추후 추가 기능 
상세한 웹 변경 
요소별 핸들 (텍스트 / 이미지 / 영상)

- 텍스트

- 이미지
배경색 / 테두리 설정 가능 


# 라이브러리 

y-indexedDb
브라우저에 영구적으로 룸 관련된 내용들 저장 
for yjs 

yjs 동시편집 / 소켓 
puppeteer (next js  server side screenCapture)



# Trouble shooting

## 순환 업데이트의 발생 메커니즘
양방향 동기화 구조:
YJS에서 변경이 감지되면 Redux 상태를 업데이트
Redux 상태가 변경되면 YJS 문서를 업데이트
이 두 과정이 서로를 트리거하는 순환 구조
객체 비교의 한계:
JavaScript에서 객체 비교(JSON.stringify)는 참조가 아닌 값을 비교
객체의 구조는 같아도 새로운 객체 참조가 생성되면 다른 객체로 인식
Redux는 불변성을 유지하기 위해 항상 새 객체를 생성하므로, 내용이 같아도 참조가 다름
이벤트 전파와 타이밍 문제:
YJS는 변경 이벤트를 비동기적으로 처리
Redux 상태 업데이트와 YJS 업데이트 사이에 타이밍 차이가 있어 동일한 변경이 여러 번 감지될 수 있음


## 최신 Next js 
React.usㄷ
Next.js 14+의 app 디렉토리에서만 등장하는 새로운 패턴
서버 컴포넌트/클라이언트 컴포넌트 경계에서,
비동기 데이터(Promise)를 컴포넌트에서 바로 사용할 수 있게 함 
React.use(promise)는 Promise가 resolve될 때까지 컴포넌트 렌더링을 일시 중단(suspend)하고,
resolve된 값을 반환


## ws=> wss 
 HTTPS 페이지에서 HTTP(WebSocket: ws://) 연결을 시도하면 보안상 차단됨
