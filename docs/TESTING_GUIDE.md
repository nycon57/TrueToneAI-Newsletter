# Testing Guide - Newsletter Trigger & AI Limits

This guide provides step-by-step instructions for testing the newly implemented newsletter trigger system and AI generation limits.

---

## Prerequisites

1. **Environment Variables**
   ```bash
   CRON_SECRET=your-secret-here
   NEXT_PUBLIC_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Database Setup**
   - Ensure `anonymous_ai_usage` table exists
   - Ensure users have `category_preferences` field
   - Ensure users have `subscription_tier` and limit fields

3. **Test User Setup**
   Create test users with different configurations:
   ```sql
   -- Free tier user with category preferences
   UPDATE users SET
     subscription_tier = 'free',
     monthly_generation_limit = 3,
     monthly_generations_used = 0,
     category_preferences = ARRAY['rates', 'market']
   WHERE email = 'free@test.com';

   -- Paid tier user without preferences
   UPDATE users SET
     subscription_tier = 'paid',
     monthly_generation_limit = 50,
     monthly_generations_used = 0,
     category_preferences = NULL
   WHERE email = 'paid@test.com';
   ```

---

## Test 1: Newsletter Trigger - Happy Path

**Goal:** Verify newsletter triggers when 3 articles are approved on Mon/Wed/Fri

### Setup
1. Ensure today is Monday, Wednesday, or Friday
2. Create 3 draft articles with different categories

### Steps

1. **Create draft articles:**
   ```bash
   # Use admin dashboard or API to create 3 draft articles
   POST /api/admin/articles
   {
     "title": "Article 1",
     "category": "rates",
     "status": "draft"
   }
   ```

2. **Approve first article:**
   ```bash
   POST /api/admin/articles/[id]/approve
   {
     "action": "approve"
   }
   ```

   **Expected Response:**
   ```json
   {
     "success": true,
     "action": "approve",
     "article": { ... },
     "newsletter": {
       "triggered": false,
       "reason": "Only 1 article(s) approved since last newsletter. Need 3 to trigger."
     }
   }
   ```

3. **Approve second article:**
   ```bash
   POST /api/admin/articles/[id]/approve
   {
     "action": "approve"
   }
   ```

   **Expected Response:**
   ```json
   {
     "success": true,
     "action": "approve",
     "article": { ... },
     "newsletter": {
       "triggered": false,
       "reason": "Only 2 article(s) approved since last newsletter. Need 3 to trigger."
     }
   }
   ```

4. **Approve third article:**
   ```bash
   POST /api/admin/articles/[id]/approve
   {
     "action": "approve"
   }
   ```

   **Expected Response:**
   ```json
   {
     "success": true,
     "action": "approve",
     "article": { ... },
     "newsletter": {
       "triggered": true,
       "reason": "Newsletter successfully created and sent with 3 articles",
       "newsletterId": "uuid-here"
     }
   }
   ```

5. **Verify newsletter created:**
   ```sql
   SELECT * FROM newsletter_posts
   ORDER BY created_at DESC
   LIMIT 1;
   ```

6. **Check email logs:**
   - Verify emails sent via Resend
   - Check subscriber received newsletter
   - Verify category filtering worked

### Cleanup
```sql
-- Reset for next test
DELETE FROM newsletter_posts WHERE id = 'uuid-from-test';
UPDATE articles SET status = 'draft' WHERE id IN ('id1', 'id2', 'id3');
```

---

## Test 2: Newsletter Trigger - Wrong Day

**Goal:** Verify newsletter does NOT trigger on Tue/Thu/Sat/Sun

### Steps

1. Ensure today is Tuesday, Thursday, Saturday, or Sunday
2. Approve 3 articles
3. **Expected:** Newsletter does NOT trigger

**Expected Response:**
```json
{
  "success": true,
  "action": "approve",
  "article": { ... },
  "newsletter": {
    "triggered": false,
    "reason": "Today is Tuesday. Newsletters only send on Monday, Wednesday, and Friday."
  }
}
```

---

## Test 3: Category Preference Filtering

**Goal:** Verify users only receive articles matching their preferences

### Setup
1. Create newsletter with articles from different categories:
   - Article A: category = "rates"
   - Article B: category = "market"
   - Article C: category = "regulations"

2. Create test users with preferences:
   - User 1: preferences = ["rates", "market"]
   - User 2: preferences = ["regulations"]
   - User 3: preferences = [] (empty)

### Steps

1. **Trigger newsletter send:**
   ```bash
   GET /api/cron/newsletter
   Authorization: Bearer <CRON_SECRET>
   ```

2. **Check email logs:**
   - User 1 should receive Articles A & B only
   - User 2 should receive Article C only
   - User 3 should receive all articles

3. **Verify console logs:**
   ```
   Newsletter contains articles from categories: rates, market, regulations
   Sending 2 filtered articles to user1@test.com
   Sending 1 filtered articles to user2@test.com
   Sending 3 filtered articles to user3@test.com
   ```

---

## Test 4: AI Generation Limits - Anonymous User

**Goal:** Verify anonymous users can generate 3 times then get blocked

### Steps

1. **Open browser in incognito mode**
2. **Navigate to article page**
3. **Click personalize button 3 times**

   **1st Generation:**
   - Should succeed
   - Should set `anonymous_session` cookie

   **2nd Generation:**
   - Should succeed
   - Should use same session

   **3rd Generation:**
   - Should succeed
   - Session now at limit

   **4th Generation:**
   - Should fail with 429 status
   - Should show upgrade prompt

   **Expected Response (4th attempt):**
   ```json
   {
     "error": "Free trial limit reached. Sign up to continue personalizing content.",
     "remaining": 0,
     "limit": 3,
     "used": 3,
     "tier": "anonymous"
   }
   ```

4. **Verify database:**
   ```sql
   SELECT * FROM anonymous_ai_usage
   WHERE session_id = 'anon_xxxxx';
   -- Should show generations_used = 3
   ```

---

## Test 5: AI Generation Limits - Free Tier User

**Goal:** Verify free tier users get 3 generations per month

### Setup
```sql
UPDATE users SET
  subscription_tier = 'free',
  monthly_generation_limit = 3,
  monthly_generations_used = 0
WHERE email = 'free@test.com';
```

### Steps

1. **Login as free tier user**
2. **Generate AI content 3 times**

   **Generations 1-3:**
   - Should succeed
   - Counter should increment

   **4th Generation:**
   - Should fail with 429 status

   **Expected Response:**
   ```json
   {
     "error": "Free tier limit reached. Upgrade to continue personalizing content.",
     "remaining": 0,
     "limit": 3,
     "used": 3,
     "tier": "free"
   }
   ```

3. **Verify database:**
   ```sql
   SELECT monthly_generations_used FROM users
   WHERE email = 'free@test.com';
   -- Should show 3
   ```

---

## Test 6: AI Generation Limits - Paid Tier User

**Goal:** Verify paid tier users respect their custom limit

### Setup
```sql
UPDATE users SET
  subscription_tier = 'paid',
  monthly_generation_limit = 50,
  monthly_generations_used = 0
WHERE email = 'paid@test.com';
```

### Steps

1. **Login as paid tier user**
2. **Generate AI content multiple times**

   **Generations 1-50:**
   - Should all succeed
   - Counter should increment

   **51st Generation:**
   - Should fail with 429 status

   **Expected Response:**
   ```json
   {
     "error": "Monthly generation limit reached. Your limit will reset next month.",
     "remaining": 0,
     "limit": 50,
     "used": 50,
     "tier": "paid"
   }
   ```

---

## Test 7: Session Persistence

**Goal:** Verify anonymous session persists across page refreshes

### Steps

1. **Open browser in incognito mode**
2. **Generate AI content once**
3. **Check cookie:** `anonymous_session` should be set
4. **Refresh page**
5. **Generate again**
6. **Verify:** Same session used, counter at 2

**Database Check:**
```sql
SELECT * FROM anonymous_ai_usage
WHERE session_id = 'anon_xxxxx';
-- Should show same record, generations_used = 2
```

---

## Test 8: IP Fallback

**Goal:** Verify IP address used when cookies blocked

### Steps

1. **Disable cookies in browser**
2. **Generate AI content**
3. **Verify:** Request still works
4. **Check database:**
   ```sql
   SELECT * FROM anonymous_ai_usage
   WHERE ip_address = 'your-ip-here';
   -- Should find record by IP instead of session
   ```

---

## Test 9: Newsletter with Empty Preferences

**Goal:** Verify users with no preferences get all articles

### Setup
```sql
UPDATE users SET category_preferences = NULL
WHERE email = 'test@test.com';
```

### Steps

1. **Create newsletter with 3 articles**
2. **Trigger send**
3. **Verify:** User receives all 3 articles
4. **Check logs:**
   ```
   Sending 3 filtered articles to test@test.com
   ```

---

## Test 10: Newsletter Skip (No Matching Articles)

**Goal:** Verify newsletter skipped when user has no matching articles

### Setup
```sql
UPDATE users SET category_preferences = ARRAY['regulations']
WHERE email = 'test@test.com';
```

### Steps

1. **Create newsletter with only "rates" and "market" articles**
2. **Trigger send**
3. **Verify:** User does NOT receive email
4. **Check logs:**
   ```
   Skipping test@test.com - no articles match category preferences
   ```

---

## Debugging Tips

### Newsletter Issues

**Check approval counter:**
```sql
SELECT COUNT(*) FROM articles
WHERE status = 'published'
AND published_at >= (
  SELECT published_at FROM newsletter_posts
  ORDER BY published_at DESC
  LIMIT 1
);
```

**Check newsletter posts:**
```sql
SELECT * FROM newsletter_posts
ORDER BY published_at DESC
LIMIT 5;
```

**Check cron logs:**
```bash
# Look for these logs in console:
[Webhook] Processing newsletter delivery for X subscribers
[Webhook] Newsletter contains articles from categories: X, Y, Z
[Webhook] Sending N filtered articles to user@example.com
```

### AI Limit Issues

**Check user limits:**
```sql
SELECT
  email,
  subscription_tier,
  monthly_generation_limit,
  monthly_generations_used,
  generation_reset_date
FROM users
WHERE email = 'your-email';
```

**Check anonymous usage:**
```sql
SELECT * FROM anonymous_ai_usage
ORDER BY created_at DESC
LIMIT 10;
```

**Check session cookie:**
```javascript
// In browser console:
document.cookie
  .split('; ')
  .find(row => row.startsWith('anonymous_session='));
```

### Common Issues

**Newsletter not triggering:**
- Check day of week (must be Mon/Wed/Fri)
- Check article count (must be >= 3)
- Check CRON_SECRET is set
- Check NEXT_PUBLIC_URL is correct

**AI limit not enforcing:**
- Check subscription_tier is set correctly
- Check monthly_generation_limit is set
- Check monthly_generations_used is incrementing
- Clear cookies and try again for anonymous

**Category filtering not working:**
- Check category_preferences field exists
- Check article.category matches user preferences
- Check for null/empty preferences (should send all)

---

## Test Data Reset

```sql
-- Reset newsletter posts
DELETE FROM newsletter_posts;

-- Reset articles to draft
UPDATE articles SET status = 'draft', published_at = NULL;

-- Reset user generation counts
UPDATE users SET monthly_generations_used = 0;

-- Clear anonymous sessions
DELETE FROM anonymous_ai_usage;
```

---

## Success Criteria

✅ Newsletter triggers on 3rd approval (Mon/Wed/Fri only)
✅ Newsletter does NOT trigger on wrong days
✅ Newsletter sends to all active subscribers
✅ Users receive only matching category articles
✅ Users with no preferences receive all articles
✅ Anonymous users can generate 3 times
✅ Free tier users can generate 3 times per month
✅ Paid tier users respect custom limits
✅ Usage counters increment correctly
✅ Session cookies persist across refreshes
✅ IP fallback works when cookies disabled
✅ Error messages are clear and actionable
✅ Article approval succeeds even if newsletter fails

---

**Last Updated:** October 21, 2025
