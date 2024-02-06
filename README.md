# Transcribe-Notes: Advanced Voice Note-Taking App

![Transcribe-Notes Banner](https://github.com/YourGitHubUsername/Transcribe-Notes/assets/banner.jpg)

## Introduction
Transcribe-Notes is a groundbreaking note-taking application, melding the organizational prowess of a Fullstack Notion Clone with state-of-the-art voice transcription technology, akin to Otter.ai. Crafted with Next.js 13, React, Convex, and Tailwind, this app is designed to revolutionize the way we capture, organize, and manage spoken information. It offers a real-time, voice-to-text conversion mechanism, enabling users to effortlessly transcribe meetings, lectures, or personal notes into editable text.

[VIDEO TUTORIAL for Notion Clone](https://www.youtube.com/watch?v=ZbX4Ok9YX94)

## Key Features

- **Notion Clone Base Features**:
  - Real-time database, Notion-style editor.
  - Light and Dark modes.
  - Infinite children documents, trash can, soft delete.
  - Authentication, file management.
  - Expandable and collapsible sidebar.
  - Mobile responsiveness, web publishing.
  - Landing page, cover images for documents, file recovery.

- **Voice Transcription Integration**:
  - Real-time voice-to-text transcription.
  - Integration with the editor for dynamic text updates.
  - Final transcription accuracy enhancement via OpenAI.

# Application Overview: Voice Transcription Integration with Text Editor

## Foundation
- **Based on**: Fullstack Notion Clone (Next.js 13, React, Convex, Tailwind | Full Course 2023).

## Key Features of Notion Clone
- Real-time database, Notion-style editor.
- Light and Dark mode support.
- Infinite children documents, Trash can & soft delete.
- Authentication, File management (upload, delete, replace).
- Document icons, Expandable and collapsible sidebar.
- Mobile responsiveness, Web publishing.
- Landing page, Cover image for documents.
- Recover deleted files.

## Current Voice Transcription Project

### Primary Functionality
- Integrating voice transcription features with the Notion clone text editor.

### Components
- **Microphone**: Voice input and live transcription.
- **Editor**: Transcribed text display and editing.
- **TranscriptionContext**: State management across components.

## Current Achievements and Missing Elements

### Microphone Component (Microphone.js)
- Captures voice, live transcription.

### Editor Component (Editor.js)
- Displays and edits transcribed text.

### Transcription Context (TranscriptionContext.js)
- Manages shared transcription state.

### Voice Recording Hook (useRecordVoice.js)
- Manages voice recording for final transcription processing.

## Functionality Achieved
- **Live Transcription**: Real-time voice-to-text conversion.
- **Final Transcription Setup**: Prepared for OpenAI integration.
- **State Management**: Using React Context.

## Missing Elements (For Otter.ai-like Service)
- **Accuracy and Integration**: Enhancing final transcription quality.
- **Real-Time Sync**: Improving transcription updates.
- **Speaker Identification**: Differentiating speakers.
- **Advanced Editing Features**: Rich text editing enhancements.
- **Audio Sync**: Playback aligned with transcription.
- **Cloud Storage**: Cross-device access.
- **UI/UX Refinement**: Intuitive, user-friendly interface.
- **Robust Error Handling**: Comprehensive management of potential issues.
- **Scalability and Performance**: Optimizing for heavy use.
- **Accessibility Features**: Ensuring universal usability.

## Additional Considerations
- **Accessibility and Scalability**: Key for future growth and diverse user base.





## Prerequisites

- Node version 18.x.x.
- Familiarity with Next.js, React, and TailwindCSS.

## Cloning the Repository

```shell
git clone https://github.com/YourGitHubUsername/Transcribe-Notes.git


### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/notion-clone-tutorial.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
```

### Setup Convex

```shell
npx convex dev

```

### Start the app

```shell
npm run dev
```
# Transcribe-Notes
