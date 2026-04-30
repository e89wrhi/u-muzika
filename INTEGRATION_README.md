# U Muzika: Comprehensive Integration Walkthrough

This guide provides an exhaustive, click-by-click walkthrough for setting up Clerk, Supabase, and Stripe for your U Muzika project. We will configure each service from scratch, gather the required environment variables, set up the database schema, and test webhooks locally.

---

## 1. Local Environment Preparation

Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **Ngrok** (For testing Clerk webhooks locally. [Download here](https://ngrok.com/download))
- **Stripe CLI** (For testing Stripe webhooks locally. [Download here](https://docs.stripe.com/stripe-cli))

1. Open your terminal at the root of the `u-muzika` project.
2. Navigate to the web app: `cd apps/web`.
3. If you haven't already, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file in your code editor. We will fill out its values one by one in the following sections.

---

## 2. Clerk Configuration (Authentication)

Clerk will handle user sign-ups, logins, and session management.

### Step 2.1: Create the Application
1. Go to [Clerk's Dashboard](https://dashboard.clerk.com/) and sign in.
2. Click **Create Application**.
3. Set your application name (e.g., "U Muzika").
4. Choose your sign-in methods (e.g., Email, Google, etc.) and click **Create application**.

### Step 2.2: Retrieve API Keys
1. In the Clerk Dashboard sidebar, navigate to **Configure > API Keys**.
2. Under "Standard Keys", copy the **Publishable Key** and paste it into your `.env` file as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Copy the **Secret Key** and paste it as `CLERK_SECRET_KEY`.

### Step 2.3: Configure Webhooks (Local Testing)
Clerk needs to tell your database (Supabase) via a webhook when a new user registers so we can allocate them credits. 

1. Open a new terminal tab and start **Ngrok** pointing to your app's local port (3000):
   ```bash
   ngrok http 3000
   ```
2. Ngrok will output a `Forwarding` URL that looks like `https://1234-abcd.ngrok-free.app`. Copy this URL.
3. In the Clerk Dashboard, go to **Configure > Webhooks**.
4. Click **Add Endpoint**.
5. In the **Endpoint URL** field, paste your Ngrok URL and append `/api/webhooks/clerk`.
   - *Example: `https://1234-abcd.ngrok-free.app/api/webhooks/clerk`*
6. Scroll down to "Message Filtering" and select the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Click **Create Endpoint**.
8. On the new endpoint's page, look at the bottom right for **Signing Secret**. Click the eye icon to reveal it.
9. Copy this secret and paste it into your `.env` file as `CLERK_WEBHOOK_SECRET`.

---

## 3. Supabase Configuration (Database)

Supabase will act as your reliable PostgreSQL database to store users, credits, and subscription status.

### Step 3.1: Create a Supabase Project
1. Go to the [Supabase Dashboard](https://supabase.com/dashboard/projects) and click **New Project**.
2. Select your organization, name your project ("U Muzika"), generate a secure password, and select a region close to you.
3. Click **Create new project** and wait a few minutes for the database to provision.

### Step 3.2: Retrieve Database API Keys
1. Once provisioned, look at the left sidebar and click on the **Settings (Gear Icon)**.
2. Select **API** from the Configuration menu under settings.
3. Look at the **Project URL**. Copy it and paste it into your `.env` file as `NEXT_PUBLIC_SUPABASE_URL`.
4. Under "Project API keys", copy the `anon` `public` key. Paste it into your `.env` file as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Below that, copy the `service_role` `secret` key. Paste it into your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`.

### Step 3.3: Set Up the Database Schema
You need to create the tables that store billing, users, and credits using the SQL script provided in your codebase.

1. In the Supabase Dashboard, look for the **SQL Editor** on the left sidebar (the `</>` icon).
2. Click **New query**.
3. In your code editor, open `apps/web/src/lib/migrations/001_billing_schema.sql`.
4. Select all the SQL text in that file and copy it.
5. Paste it into the Supabase SQL Editor exactly as is.
6. Click the large green **Run** button at the bottom right.
   - *If successful, it will say "Success. No rows returned." You now have the `users` and `subscriptions` tables set up with Row Level Security.*

---

## 4. Stripe Configuration (Payments & Credits)

Stripe will manage user subscriptions, payments, and dynamically issue credits.

### Step 4.1: Create a Stripe Account
1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/) and register or sign in.
2. Ensure you have **Test mode** toggled ON (top right corner of the dashboard).

### Step 4.2: Retrieve API Keys
1. Navigate to the **Developers** tab (top right header) and select **API keys** on the sidebar.
2. Copy the **Publishable key** (`pk_test_...`) and paste it into your `.env` file as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Copy the **Secret key** (`sk_test_...`) and paste it into your `.env` file as `STRIPE_SECRET_KEY`.

### Step 4.3: Create Subscription Products (Pro & Ultra)
To sell subscriptions, you need to designate "Products" in Stripe.

1. In the Stripe Dashboard, click on **Product catalog** on the main sidebar, then **Products**.
2. Click **Add product**.
3. **Draft the Pro Tier:**
   - **Name**: "Pro Tier"
   - **Pricing model**: "Standard pricing"
   - **Price**: Suggest `$9.99`
   - **Billing period**: "Monthly"
   - Click **Save product**.
4. You will be redirected to the Pro Tier product page. Look under the **Pricing** section for the "API ID" that looks like `price_1PXXX...`. Copy it and paste it into your `.env` file as `STRIPE_PRO_PRICE_ID`.
5. **Draft the Ultra Tier:**
   - Click **Products** -> **Add product** again.
   - **Name**: "Ultra Tier"
   - **Price**: Suggest `$19.99`
   - **Billing period**: "Monthly"
   - Click **Save product**.
6. Copy the "API ID" (`price_1PYYY...`) from the Ultra Tier page and paste it into `.env` as `STRIPE_ULTRA_PRICE_ID`.

### Step 4.4: Configure Webhooks (Local Testing)
Stripe needs to send events to your server when payments succeed so you can update credits in Supabase.

1. Ensure the Stripe CLI is installed and authenticated. In your terminal, run:
   ```bash
   stripe login
   ```
   *(Follow the prompt in your browser to approve the CLI).*
2. Start forwarding Stripe events to your local app:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. The terminal will immediately output a webhook signing secret. It looks like:
   `Ready! Your webhook signing secret is whsec_12345...`
4. Copy the `whsec_...` string.
5. Paste it into your `.env` file as `STRIPE_WEBHOOK_SECRET`.
6. Leave this terminal window running so Stripe can communicate with your app.

---

## 5. OpenAI Configuration (AI Assistant)

U Muzika uses the **Vercel AI SDK** with **OpenAI** to power the music discovery chat assistant.

### Step 5.1: Create an OpenAI API Key
1. Go to the [OpenAI Platform](https://platform.openai.com/) and sign in.
2. Navigate to **API Keys** in the left sidebar.
3. Click **Create new secret key**.
4. Name it "U Muzika" and click **Create secret key**.
5. Copy the key and paste it into your `.env` file as `OPENAI_API_KEY`.

### Step 5.2: Credit Integration
- Note that every chat message sent via `apps/web/src/app/api/chat/route.ts` will attempt to deduct **1 credit** from the user's Supabase balance.
- If you followed the Supabase setup in Section 3, this will work out of the box!

---

## 6. Booting the Application & Testing

You now have all the required moving parts configured.

1. Open a new terminal tab at the root of `u-muzika`.
2. Start the development server:
   ```bash
   npm run dev
   ```
3. **Verify Everything End-to-End**:
   - Go to `http://localhost:3000/register` in your browser.
   - Sign up for a brand new account using Clerk.
   - Wait ~5 seconds and look at your Supabase **Table Editor**. You should see a new row in the `users` table containing the Clerk ID. *(This means Clerk -> Ngrok -> Localhost -> Supabase webhook is working).*
   - Navigate to the **Settings** page within U Muzika and locate the Subscription/Credits UI.
   - Simulate a purchase using Stripe test cards (`4242 4242 4242 4242`).
   - If successful, your Stripe CLI terminal will show `200` responses, and your Supabase database will reflect increased credits.
   - **Test the AI**: Go to any video or album page, click the chat icon, and send a message. It should stream a response from OpenAI and deduct a credit!

You are now fully integrated and ready for development!
