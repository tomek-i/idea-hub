# idea-hub
# Idea Hub

> A workspace to collect, refine, and manage your project ideas in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Idea Hub** helps you gather, organize, and develop your project ideas. Move ideas from draft to refined, add notes, relate projects, and link to GitHub repositories—all in a single, user-friendly app.

## Features

- Collect and manage new project ideas
- Draft, refine, and archive ideas
- Add detailed notes to each project
- Mark projects as related
- Link projects to GitHub repositories
- Organize projects visually on a board

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)

### Setup

1. Clone the repository:
	```sh
	git clone https://github.com/tomek-i/idea-hub.git
	cd idea-hub
	```
2. Install dependencies:
	```sh
	pnpm install
	```
3. Set up the database (using Prisma):
	```sh
	pnpm prisma migrate dev
	```
4. Start the development server:
	```sh
	pnpm dev
	```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- Add new project ideas and save them as drafts
- Refine ideas by adding notes and details
- Mark projects as related to each other
- Link to external GitHub repositories
- Archive completed or dropped ideas

## Documentation

For detailed documentation, see the [`/docs`](docs/) folder.

## Contributing

Contributions are welcome! See [`/docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License.

