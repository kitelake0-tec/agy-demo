#!/bin/bash

echo "🚀 Starting Automated Vercel Deployment..."

# 1. Install Dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Link Project
echo "🔗 Linking to Vercel..."
npx vercel link --yes

# 3. Setup Environment Variables
echo "🔑 configuring Environment Variables..."

# Generate and set NEXTAUTH_SECRET if not exists
SECRET=$(openssl rand -base64 32)
echo "Generated Secret: $SECRET"

# We use '|| true' to ignore errors if var already exists or fails
echo "$SECRET" | npx vercel env add NEXTAUTH_SECRET production || true
echo "$SECRET" | npx vercel env add NEXTAUTH_SECRET preview || true
echo "$SECRET" | npx vercel env add NEXTAUTH_SECRET development || true

# Note: DATABASE_URL must be set manually or via Dashboard integration usually
echo "⚠️  IMPORTANT: Please ensure you find your Postgres Connection String and add it as DATABASE_URL in Vercel."

# 4. Deploy
echo "🚀 Deploying to Production..."
npx vercel deploy --prod --yes

echo "✅ Deployment Process Finished!"
