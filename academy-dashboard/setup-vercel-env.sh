#!/bin/bash

# Generates a secure random secret
SECRET=$(openssl rand -base64 32)
echo "Generated NEXTAUTH_SECRET: $SECRET"

# Set NEXTAUTH_SECRET
echo "Setting NEXTAUTH_SECRET on Vercel..."
echo "$SECRET" | npx vercel env add NEXTAUTH_SECRET production
echo "$SECRET" | npx vercel env add NEXTAUTH_SECRET preview
echo "$SECRET" | npx vercel env add NEXTAUTH_SECRET development

# Placeholder for DATABASE_URL - User needs to provide this or we use Vercel Postgres
echo "NOTE: Ensure DATABASE_URL is set in Vercel Project Settings for Postgres connection."
