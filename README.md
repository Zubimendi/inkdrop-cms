# 🖋️ Inkdrop CMS

A lightweight, full-stack content management system built with Next.js 14 and MongoDB. Create, edit, and manage blog posts, pages, and custom content types with a clean, intuitive dashboard.

## ✨ Features

- **CRUD Operations** - Create, read, update, and delete content seamlessly
- **Content Types** - Support for posts, pages, and custom content
- **Status Management** - Draft and publish workflow
- **Auto-generated Slugs** - Clean URLs generated automatically from titles
- **Responsive Dashboard** - Modern UI built with Tailwind CSS
- **RESTful API** - Clean API routes for all content operations
- **TypeScript** - Fully typed for better developer experience

## 🛠️ Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd inkdrop-cms
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your MongoDB connection string to `.env.local`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/inkdrop-cms?retryWrites=true&w=majority
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure
```
inkdrop-cms/
├── src/
│   ├── app/
│   │   ├── api/content/          # API routes
│   │   ├── dashboard/            # Content management UI
│   │   └── new/                  # Create content page
│   ├── components/               # React components
│   ├── lib/                      # Database config & models
│   └── types/                    # TypeScript types
```

## 🎯 Usage

1. **Create Content** - Click "New Content" and fill in the form
2. **Manage Content** - View all content in the dashboard
3. **Edit Content** - Click "Edit" on any content card
4. **Delete Content** - Click "Delete" to remove content
5. **Publish** - Toggle between draft and published status

## 🌐 Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

Don't forget to add your `MONGODB_URI` environment variable in Vercel settings.

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built as part of my 6-month full-stack development journey 🚀

