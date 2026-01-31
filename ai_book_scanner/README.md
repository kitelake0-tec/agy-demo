# AI Book Scanner (Setup Guide)

현재 코드는 `lib/` 폴더와 `pubspec.yaml`이 작성된 상태입니다. 
제 환경에서 Flutter 명령어를 실행할 수 없어 **플랫폼 폴더(android, ios)**와 **생성된 코드(.g.dart)**가 누락되어 있습니다.

실행을 위해서는 아래 4단계를 순서대로 수행해주세요.

## 1. 프로젝트 초기화 (Platform Setup)
프로젝트 루트 폴더(`ai_book_scanner`) 터미널에서 아래 명령어를 실행하여 iOS/Android 폴더를 생성합니다.
```bash
flutter create . --org com.example.ai_book_scanner
```

## 2. 패키지 설치 및 코드 생성
Riverpod과 Isar는 코드 생성이 필요합니다.
```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs
```

## 3. 네이티브 권한 설정 (중요!)

### iOS (`ios/Runner/Info.plist`)
`<dict>` 태그 안에 아래 키들을 추가해야 카메라와 센서가 작동합니다.
```xml
<key>NSCameraUsageDescription</key>
<string>책을 스캔하기 위해 카메라 권한이 필요합니다.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>스캔한 문서를 저장하기 위해 갤러리 접근 권한이 필요합니다.</string>
<key>NSMicrophoneUsageDescription</key>
<string>영상 촬영 시 오디오 녹음을 위해 필요합니다.</string>
```
*참고: `google_mlkit_text_recognition`을 위해 `ios/Podfile`의 플랫폼 버전을 12.0 이상으로 설정해주세요 (`platform :ios, '12.0'`).*

### Android (`android/app/src/main/AndroidManifest.xml`)
`<manifest>` 태그 안에 권한을 추가합니다.
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```
*참고: `android/app/build.gradle`에서 `minSdkVersion`을 21 이상으로 설정해주세요.*

## 4. 앱 실행
```bash
flutter run
```

