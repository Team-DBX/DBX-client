<div style="display: flex; justify-content: center;">
  <img style="width: 500px; " alt="DBX Logo" src="https://github.com/Team-DBX/DBX-client/assets/93499071/1adba02c-75d4-4513-bf7c-ffe8ffc928b8">
</div>
<div style="text-align: center;">Developer와 Designer가 협업할 수 있는 Brand Experience <strong>리소스 관리 툴</strong> DBX입니다.</div>
<br />

# 📒 Table of Contents

- [Introduction](#Introduction)
- [Challenges](#Challenges)
  - [1. 이미지 업로드 server VS client](#1-이미지-업로드-server-vs-client)
  - [2. RESTful API 설계를 위한 데이터 구조](#2-restful-api-설계를-위한-데이터-구조)
  - [3. 로그인 유지 유무에 따라 리다이렉트](#3-로그인-유지-유무에-따라-리다이렉트)
- [Tech Stack](#Tech-Stacks)
- [Preview](#Preview)
- [Project Contribution](#Project-Contribution)
- [Members](#Members)

# Introduction

비전공자인 저희 팀은 평소 개발자와 개발자가 아닌 직군 사이의 **협업**이 필요한 부분이 무엇이 있을까 궁금했습니다. <br/>
그래서 협업자들의 다양한 의견을 듣던 중 디자이너와 개발자 사이의 헙업을 도와줄 수 있는 **리소스 관리 툴**을 생각하게 되었습니다. <br/>
Brand Experience Design인 BX는 브랜드 사용자 경험 디자인을 말합니다.<br/>
브랜드의 가치, 의미를 사용자에게 긍정적인 경험을 만들어서 브랜드의 긍정적이고 좋은 이미지를 형성 시키는 것을 말합니다.<br/>
BX를 유지하기 위해서는 브랜드에서 만드는 브랜드 이미지 리소스들을 관리할 필요가 있습니다.<br/>
리소스를 회사 전체 직원들이 편하게 가져갈 수 있고, 리소스의 디자인이 바뀔 때마다 회사 홈페이지 배너를 바로 반영이 되는 버전 관리 툴을 개발하게 되었습니다.<br/>
**DBX**는 디자이너와 개발자 사이의 협업을 도와주는 어플리케이션으로, 그래픽 리소스의 버전 관리와 고정 url을 제공하여 리소스 자동 업데이트를 빠르게 반영 시킵니다. **DBX**를 통해 디자이너가 리소스를 업데이트하면, 해당 웹사이트가 자동으로 업데이트되어 프로젝트의 효율성을 극대화하며, 더 나은 협업 환경을 제공합니다.

# Preview

[<img src="https://github.com/Team-DBX/DBX-client/assets/93499071/ad5b5166-4868-490d-b580-36881d7f603f" width="500" alt="바닐라코딩 부트캠프 15기의 첫 팀 프로젝트 | TEAM PROJECT - 15TH BOOTCAMP">](https://youtu.be/qeqnc5V3pCk?si=7wiSx_Zm3h1Q2oCC&t=2826)

# Challenges

DBX를 개발하면서 크게 3가지 어려웠던 점이 있었습니다.

- 예측 가능한 S3 url을 만들기 위한 MongoDB와 S3 파이프라인 구축
- RESTful API 설계를 위한 데이터 구조
- 로그인 유지를 위해 IndexDB에 저장된 로그인 정보 활용하기

> [!NOTE]
> 챌린지 들어가기 앞서 필요한 설명들을 하고 넘어가겠습니다.
>
> - 카테고리 : BrandLogo, Icon, KeyImage
> - 리소스 : 브랜드의 로고, 키이미지, 아이콘 등의 이미지
> - 리소스 버전 : 리소스마다 가지고 있는 버전별 이미지들

## 1. 이미지 업로드 server VS client

이미지 업로드는 이 프로젝트의 핵심적인 개발 부분입니다. S3 업로드를 클라이언트 사이드에서 진행할지, 서버 사이드에서 진행할지는 큰 고민거리였습니다. S3 업로드를 어느쪽에서 진행하지 고민하는 과정에는 다음과 같은 고려 대상들이 있었습니다.

- 인증된 사용자가 업로든 하는 것이 맞는가?
- 예측 가능한 S3 url을 만들 수 있는가?>

### 1.1 Client side VS Server side

앞에서 언급 했듯이 S3에 이미지를 업로드 할 때 선택할 수 있는 방법은 두 가지입니다. 클라이언트 s3 통신, 서버 s3 통신이 있습니다.

클라이언트에서 업로드 하는 것과, 서버에서 S3에 이미지를 업로드 하는 것은 장단점이 있었습니다.
||장점|단점|
|------|---|---|
|클라이언트 - S3 |중복적인 네트워크 통신 없앰|보안 취약|
|테스트1|보안성 높음|중복적인 네트워크 통신 있음 (클라이언트 - 서버 - s3 )|

위에 있는 표처럼, 둘은 각기 다른 장점을 가지고 있다. 하지만, 다른 것보다 인증된 사용자들만이 S3에 업로드 할 수 있게 만드는 것이 가장 중요하다고 생각했습니다. 클라이언트도 인증된 사용자들인지 확인할 수 있는 방법이 있지만, 서버에 저장된 사용자가 맞는지 확인 후 업로드 하는 것이 조금 더 안정성 있는 선택일것이라고 생각하였습니다.

### 1.2 MongoDB, S3 파이프라인

S3는 정해진 틀 안에서 사용자가 url을 직접 정할 수 있습니다. 이는 예측 가능한 url을 만들 수 있다는 말입니다. 예측 가능한 url은 패턴이 있기 때문에 유지 보수 측면에서 상당히 긍정적인 면모를 볼 수 있다. s3 url은 하나의 버킷 안에서는 유니크 해야 합니다.
그래서 예측 가능한 s3 url을 만들기 위해서는 유니크한 값을 생성해야 했습니다.
MongoDB와 S3 파이프라인으로 에측 가능한 url을 만드는 과정은 다음과 같았습니다.

- 클라이언트 사이드에서 서버로 이미지와, 세부 정보들을 넘긴다.
- 서버는 클라이언트에서 받은 이미지, 이름 및 상세 설명들을 이용해 일단 DB에 저장해둡니다.
- DB에서 저장한 다음 받은 .id 값으로 ObjectId + "/" + el.fileName + ".svg"와 같은 형식으로 예측 가능한 s3 url을 생성한다.
- 생성된 S3url, svg를 png로 변환한 이미지를 이미 저장된 데이터에 정보 업데이트를 한다.

<img src = "https://github.com/Team-DBX/DBX-client/assets/93499071/b7250272-fd50-4976-a008-209e84a5b515" height="300px" width="450px"/>

이 파이프라인을 통해 DB의 object.\_id를 통해 url을 예측할 수 있게 되었습니다.

위의 과정들을 통해 예측 가능한 url을 만들 수 있고, 보안성이 조금 더 높은 서버 사이드에서 S3 이미지 업로드를 하게 되었습니다.

## 2. RESTful API 설계를 위한 데이터 구조

RESTful한 API는 다양한 장점을 가지고 있지만, 브랜드 리소스 버전 관리 툴인 만큼 URL을 통해 리소스를 명확하게 식별하므로, 버전 관리가 용이하다고 생각했습니다. 또한, API를 확장하거나 수정하는 것이 비교적 간단하여 유지보수가 용이하기 때문에 RESTful API를 설계하기로 했습니다.

데이터 구조를 설계하며 가장 고민 많이 한 부분은 2가지입니다.

1. 어떤 방식이 필요한 데이터를 찾을때 효율적으로 순회하는 데이터 구조일까?
2. RESTful 한 구조인가?

### 2.1 카테고리별 별도의 데이터 구조

처음 설계한 데이터 구조는 카테고리별로 각자 스키마를 가지고 있었습니다.
<img src="https://github.com/Team-DBX/DBX-client/assets/93499071/446c06f2-6f7c-483f-b1d2-da23ff9f49f3" width ="600px"/>

이 구조의 장점은 카테고리별로 방을 가지고 있기 때문에 모든 리소스들이 합쳐있는것 보다 불필요한 순회를 하지 않을것입니다. 하지만, RESTful하지 않다는 단점이 있습니다.
BrandLogo, KeyImage, Icon을 하나로 묶어주는 상위 카테고리가 없고, 또한 중복된 코드가 너무 많다는 판단을 했습니다.

중복 코드

```js
{
	"detail": {
		"name": String,
		"version": String,  // 1.2.0
		"uploadDate": Date,
		"author": String,
		"category": String,
		"files": {
			"default": {
				"s3url": String,
				"png": String,
			},
			"darkmode": {
				"s3url": String,
				"png": String,
			},
			"1.5x": {
				"s3url": String,
				"png": String,
			},
			"2x": {
				"s3url": String,
				"png": String,
			},
			"3x": {
				"s3url": String,
				"png": String,
			},
			"4x": {
				"s3url": String,
				"png": String,
			},
		}
	}
}
```

```js
{
	"detail": {
		"name": String,
		"version": String,  // 1.2.0
		"uploadDate": Date,
		"author": String,
		"files": {
			"default": {
				"s3url": String,
				"png": String,
			}
		}
	}
}
```

위에 BrandLogo 스키마와 Icon 스키마는 중복되는 로직이 정말 많았습니다. 다른거라고는 files안에 있는 파일들의 갯수였습니다. 이처럼 중복이 많은 데이터 구조는 나중에 수정 및 추가 작업이 일어날때 여러 곳에서 수정을 및 추가를 해줘야 하기 떄문에 좋지 않은 데이터 구조라고 판단했습니다.

### 2.2 하나의 상위 개념으로 통합된 데이터 구조

3개의 카테고리가 거의 동일한 형태를 가지고 있다는 점에서 아래와 같은 구조로 데이터 구조로 데이터를 구상해보았습니다.

<img width="709" alt="image" src="https://github.com/Team-DBX/DBX-client/assets/93499071/8180a5b3-794b-4a7e-80d3-5cce426863f8">

먼저, Categories라는 상위 카테고리를 만들어서 API 작성시, 자원의 구조를 명확히 보일 수 있도록 하였습니다. 또한, Resource와 ResourceVersions를 각각 카테고리별로 스키마를 설계하던 모습에서 하나의 스키마로 통합하면서, 변경 사항이 있을시, 유지 보수가 편해졌고 확장성도 생겼습니다.
마지막으로 많이 고민했던, 필요하지 않은 순회는 각 스키마마다 관계형 DB처럼 fk키 즉, 참조할 수 있는 Object ID를 가지고 있음으로써 불필요한 순회를 Object.\_id로 찾는것으로 해결하였습니다.

## 3. 로그인 유지 유무에 따라 리다이렉트

firebase를 이용한 소셜 로그인을 구현하고 있습니다. firebase는 IndexDB에 현재 로그인되어 있는 사용자의 정보가 들어있습니다. firebase는 refreshToken가 만료되기도 하기 때문에 로그인되어 있다가도 오랜 시간이 지나면 로그아웃 되도록 구현해야 했습니다.

IndexDB에 있는 값에 접근하기 위해서는 댜양한 방법을 사용할 수 있는데, firebase에서 사용자가 변경되지 않는지 계속 관찰하는 프로퍼트를 사용할 수 있습니다.

```js
useEffect(() => {
  auth.onAuthStateChanged(user => {
    //IndexDB에 저장된 정보 가져옴
    if (user) {
      //currentUser가 있으면 accessToken이랑 email context API에 저장하기
      setUserCredentials(user.accessToken, user.email);
      navigate("/resource-list/BrandLogo");
    } else {
      navigate("/login");
    }
  });
}, [setUserCredentials]);
```

이를 통해 로그아웃 하지 않고, 남아있는 유저의 경우 token이 만료되면 자연스럽게 login으로 이동하게 되고, 만약 token이 만료되지 않았다면 categoryList를 보여주는 페이지로 이동할 수 있게 됩니다.

# Schedule

프로젝트 기간: **2023.07.10 ~ 2023.08.03** / 기획 10일 개발 15일

<details close>
  <summary>1주차 일정</summary>
  <li> 아이디어 수집 </li>
  <li> Git 플로우 정하기 </li>
  <li> 코드 컨벤션, 커밋 룰 등 팀 협업 규칙 정립 </li>
  <li> Figma를 사용한 Mockup 제작 </li>
  <li> Notion을 사용한 칸반 작성 </li>
</details>

<br/>

<details close>
  <summary>2주차 ~ 3주차 일정</summary>
  <li> husky, eslint, lint-staged를 사용한 초기 설정 </li>
  <li> 프론트엔드, 백엔드 보일러 플레이트 초기 설정 </li>
  <li> S3 초기 설정 </li>
  <li> Firebase 로그인 구현 </li>
  <li> 백엔드 기능 구현 </li>
  <li> 프론트엔드 기능 구현 </li>
  <li> 팀프로젝트 발표 </li>
</details>

<br/>

# Tech Stacks

## Frontend

<!-- React -->
<img src= "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
<!-- TailWind -->
<img src= "https://img.shields.io/badge/TailWind-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=black">
<!-- Firebase -->
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
<!-- S3 -->
<img src="https://img.shields.io/badge/Amazon_S3-FFCA28?style=for-the-badge&logo=Amazon-s3&logoColor=black"/>

<br/>

## Backend

<!-- Express -->
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"/>
<!-- MongoDB & Mongoose -->
<img src="https://img.shields.io/badge/MongoDB&Mongoose-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"/>
<!-- Firebase -->
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
<!-- Node Js -->
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/>
<!-- S3 -->
<img src="https://img.shields.io/badge/Amazon_S3-FFCA28?style=for-the-badge&logo=Amazon-s3&logoColor=black"/>
<!-- Sharp -->
<img src="https://img.shields.io/badge/sharp-47A248?style=for-the-badge&logo=&logoColor=black"/>
<br/>
<br/>

# Project Contribution

<details>
<summary style="font-size:20px">Frontend Contribution</summary>

| 구분              | 전세원 | 조빈 |
| ----------------- | -----: | ---: |
| Login             |    50% |  50% |
| New Resource Form |    10% |  90% |
| Resource Card     |    10% |  90% |
| Resource List     |    10% |  90% |
| Resource Modal    |    10% |  90% |
| Resource Version  |    10% |  90% |
| New Version Form  |    10% |  90% |

</details>
<br/>
<details>
<summary style="font-size:20px">Backend Contribution</summary>

| 구분              | 전세원 | 조빈 |
| ----------------- | -----: | ---: |
| Login             |    90% |  10% |
| New Resource Form |    90% |  10% |
| Resource Card     |    90% |  10% |
| Resource List     |    90% |  10% |
| Resource Modal    |    90% |  10% |
| Resource Version  |    90% |  10% |
| New Version Form  |    90% |  10% |

</details>
<br/>

# Members

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/93499071?v=4" alt="전세원 프로필" width="200px" height="200px">
    </td>
   <td align="center">
	    <img src="https://avatars.githubusercontent.com/u/35984962?v=4" alt="조빈 프로필" width="200px" height="200px" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <ul>
        <li><a href="https://github.com/sewonjun">Sewon Jun 전세원</a></li>
        <li>junsewon77@gmail.com</li>
      </ul>
    </td>
    <td align="center">
      <ul>
        <li><a href="https://github.com/koreanerd">Bin Jo 조빈</a></li>
        <li>qksksk0147@gmail.com</li>
      </ul>
    </td>
  </tr>
</table>
```
````
