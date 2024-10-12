# ⚡ SSR 렌더링 미션

## 👀 리뷰를 통한 생각 나눔

### SSR 렌더링 시 초기 렌더링 성능이 왜 유리할까?

SSR은 서버에서 HTML을 미리 생성해 클라이언트에 전달하기 때문에, 클라이언트는 추가적인 요청이나 렌더링 과정 없이 **즉시 HTML을 렌더링할 수 있습니다**. 따라서 초기 로딩 속도가 빨라지고, 사용자는 빠르게 페이지의 기본 콘텐츠를 확인할 수 있게 됩니다.

### 서버에서 렌더링한 영화 목록을 어떻게 클라이언트에 데이터를 전달하고 브라우저에서는 어떤 작업을 수행할까?

1. 서버에서 데이터 fetch 및 렌더링
   - **서버에서 데이터 fetch**: 서버는 영화 데이터를 TMDB 서버에서 가져옵니다.
   - **React를 사용해 렌더링**: 가져온 데이터를 App 혹은 각 컴포넌트에 전달하고, `react/client`에서 제공하는 `renderToString`을 사용해 데이터를 포함한 React 컴포넌트를 HTML로 렌더링합니다.
   - **HTML에 데이터 포함**: 렌더링된 HTML에 \<script\> 태그를 사용해 전역 변수로 삽입합니다.
2. 클라이언트에서 Hydration 수행
   - **서버 HTML과 React 컴포넌트 연결**: 클라이언트 측 React가 로드된 후, `hydrateRoot` 함수를 사용해 서버에서 전달된 HTML과 React 컴포넌트를 연결합니다.
   - **서버에서 전달된 데이터를 상태로 설정**: 서버에서 \<script\>를 사용해 `window.\_\_INITIAL_DATA\_\_`에 넣은 영화 데이터를 읽어와 클라이언트의 상태로 설정합니다.
   - **서버 HTML과 React 동기화**: 클라이언트는 hydrateRoot를 사용하여 초기 상태와 HTML을 동기화하고, 이벤트 핸들러를 복원하여 전체 React 애플리케이션을 활성화합니다.

### 전역 객체 초기화 작업은 왜 진행해야 할까?

전역 객체 초기화 작업을 수행하지 않으면 서버와 클라이언트의 초기 데이터가 일치하지 않을 수 있습니다. 이는 Hydration 과정에서 오류를 유발할 수 있습니다. 예를 들어, 다음과 같은 오류가 발생할 수 있습니다

```shell
react-dom.development.js:86 Warning: An error occurred during hydration. The server HTML was replaced with client content in
react-dom.development.js:12507 Uncaught Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

이 오류는 서버에서 렌더링된 HTML과 클라이언트에서 수화되는 React 컴포넌트의 초기 상태가 일치하지 않기 때문에 발생합니다.

예를 들어 서버에서 데이터를 가져와 HTML을 렌더링했는데, 클라이언트에서 해당 데이터를 전역 변수로 초기화하지 않으면 클라이언트는 데이터를 알지 못해 다른 내용으로 렌더링하게 됩니다.
이렇게 되면 클라이언트는 기존 DOM을 재조정하게 됩니다. 이로 인해 DOM 요소들이 화면에 그려졌다가 사라지는 문제가 발생할 수 있습니다.

![](./hydration-error.gif)

따라서 전역 객체(예: window.\_\_INITIAL_DATA\_\_)를 초기화하여 서버와 동일한 데이터를 클라이언트에서 사용하도록 설정하면, Hydration 과정에서 데이터 불일치를 방지할 수 있습니다.
