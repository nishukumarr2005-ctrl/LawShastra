# Database Schema

## Primary entities

- User
- Category
- Law
- Subcategory
- Chapter
- Course
- RefreshToken
- AuditLog
- ApiKey

## Relationship summary

- One Category has many Laws.
- One Law belongs to one Category.
- One Law has many Subcategories.
- One Law has many Chapters.
- One User has many RefreshTokens.
- One User has many AuditLogs.

## Key constraints

- Unique email per user
- Unique category name and slug
- Unique law slug
- Unique subcategory names per law
- Foreign keys enforce relationship validity
- OnDelete cascade for user token cleanup and law child records
- Restrict deletes for category-to-law relationships unless explicitly handled
