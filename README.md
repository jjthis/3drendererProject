3d 라이브러리 없이 canvas tag만 사용하여 3d visualizing하기

구현방법
```
입체 도형과 카메라의 각도를 구해 각도를 이용하여 화면에 전시
```


빌드 방법
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

각종 에러 해결방법
```
1. TypeError: URL.canParse is not a function
next 버전을 14.2.11 에서 14.2.10로 바꿔서 해결
버전 다운그레이드는 package.json 을 수정 후 node_modules, packege-lock.json을 삭제 후 npm install


```

