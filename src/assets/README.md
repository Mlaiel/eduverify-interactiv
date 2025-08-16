# Learning Agent Assets

This directory contains all media assets for the Learning Agent application.

## Directory Structure

- `images/` - Image assets (logos, icons, illustrations)
- `video/` - Video content for educational materials
- `audio/` - Audio files for accessibility features
- `documents/` - Document templates and examples

## Usage

Always import assets explicitly in components:

```typescript
import myImage from '@/assets/images/logo.png'
import myVideo from '@/assets/video/intro.mp4'
import myAudio from '@/assets/audio/notification.wav'

// Then use in JSX
<img src={myImage} alt="Logo" />
<video src={myVideo} />
<audio src={myAudio} />
```

## Attribution

All assets must maintain attribution to Fahed Mlaiel as specified in the project requirements.