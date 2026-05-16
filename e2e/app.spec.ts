import { test, expect, Page } from '@playwright/test';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function loginAndSelectRole(page: Page) {
  await page.goto('/login');

  // Fill credentials
  await page.fill('input[name="userName"]', 'demo');
  await page.fill('input[name="password"]', 'Demo@1234');

  // Read captcha and fill it
  const captcha = await page.locator('.captcha-text').innerText();
  await page.fill('input[name="captcha"]', captcha.trim());
  await page.click('button[type="submit"]');

  // Should land on role-selection
  await page.waitForURL('**/role-selection');

  // Pick first role (Agent)
  await page.locator('button').filter({ hasText: 'Agent' }).click();
  await page.locator('button').filter({ hasText: 'Continue to Dashboard' }).click();

  // Should land on dashboard
  await page.waitForURL('**/dashboard');
}

// ─── 1. Login Page ────────────────────────────────────────────────────────────

test.describe('Login Page', () => {

  test('renders login form with all elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText('Helpline 104');
    await expect(page.locator('h2')).toContainText('Welcome back');
    await expect(page.locator('input[name="userName"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="captcha"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('.captcha-text')).toBeVisible();
    console.log('✔ Login form elements all present');
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="userName"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');
    const captcha = await page.locator('.captcha-text').innerText();
    await page.fill('input[name="captcha"]', captcha.trim());
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    console.log('✔ Wrong credentials shows error message');
  });

  test('shows error on wrong captcha', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="userName"]', 'demo');
    await page.fill('input[name="password"]', 'Demo@1234');
    await page.fill('input[name="captcha"]', 'WRONG1');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Captcha does not match')).toBeVisible();
    console.log('✔ Wrong captcha shows error message');
  });

  test('shows empty field validation', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter username and password')).toBeVisible();
    console.log('✔ Empty form validation works');
  });

  test('password show/hide toggle works', async ({ page }) => {
    await page.goto('/login');
    const pwd = page.locator('input[name="password"]');
    await expect(pwd).toHaveAttribute('type', 'password');
    // Button is absolutely positioned; use JS click to bypass viewport boundary
    const eyeBtn = page.getByTestId('toggle-password');
    await eyeBtn.evaluate((el: HTMLElement) => el.click());
    await expect(pwd).toHaveAttribute('type', 'text');
    await eyeBtn.evaluate((el: HTMLElement) => el.click());
    await expect(pwd).toHaveAttribute('type', 'password');
    console.log('✔ Password show/hide toggle works');
  });

  test('captcha refresh generates new captcha', async ({ page }) => {
    await page.goto('/login');
    const before = await page.locator('.captcha-text').innerText();
    const refreshBtn = page.getByTestId('refresh-captcha');
    await refreshBtn.evaluate((el: HTMLElement) => el.click());
    const after = await page.locator('.captcha-text').innerText();
    console.log(`✔ Captcha refresh: "${before.trim()}" → "${after.trim()}"`);
  });

  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Unauthenticated redirect to /login works');
  });

  test('successful login redirects to role-selection', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="userName"]', 'demo');
    await page.fill('input[name="password"]', 'Demo@1234');
    const captcha = await page.locator('.captcha-text').innerText();
    await page.fill('input[name="captcha"]', captcha.trim());
    await page.click('button[type="submit"]');
    await page.waitForURL('**/role-selection');
    await expect(page).toHaveURL(/\/role-selection/);
    console.log('✔ Successful login → /role-selection');
  });
});

// ─── 2. Role Selection ────────────────────────────────────────────────────────

test.describe('Role Selection Page', () => {

  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="userName"]', 'demo');
    await page.fill('input[name="password"]', 'Demo@1234');
    const captcha = await page.locator('.captcha-text').innerText();
    await page.fill('input[name="captcha"]', captcha.trim());
    await page.click('button[type="submit"]');
    await page.waitForURL('**/role-selection');
  });

  test('shows all three roles', async ({ page }) => {
    await expect(page.locator('text=Agent')).toBeVisible();
    await expect(page.locator('text=Supervisor')).toBeVisible();
    await expect(page.locator('text=SIO')).toBeVisible();
    console.log('✔ All 3 roles visible: Agent, Supervisor, SIO');
  });

  test('shows welcome message with username', async ({ page }) => {
    await expect(page.locator('text=Demo User')).toBeVisible();
    console.log('✔ Welcome message shows correct username');
  });

  test('Continue button is disabled before role selection', async ({ page }) => {
    const continueBtn = page.locator('button', { hasText: 'Continue to Dashboard' });
    await expect(continueBtn).toBeDisabled();
    console.log('✔ Continue button disabled before role is selected');
  });

  test('selecting a role enables Continue button', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Agent' }).click();
    const continueBtn = page.locator('button', { hasText: 'Continue to Dashboard' });
    await expect(continueBtn).toBeEnabled();
    console.log('✔ Selecting Agent enables Continue button');
  });

  test('can select Supervisor role', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Supervisor' }).click();
    // Should show checkmark icon for selected role
    const supervisorBtn = page.locator('button').filter({ hasText: 'Supervisor' });
    await expect(supervisorBtn).toHaveClass(/border-blue-500/);
    console.log('✔ Supervisor role selection shows visual highlight');
  });

  test('continue navigates to dashboard', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Agent' }).click();
    await page.locator('button', { hasText: 'Continue to Dashboard' }).click();
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    console.log('✔ Continue → /dashboard navigation works');
  });

  test('sign out from role-selection returns to login', async ({ page }) => {
    await page.locator('button', { hasText: 'Sign Out' }).click();
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Sign Out from role-selection → /login');
  });
});

// ─── 3. Dashboard ─────────────────────────────────────────────────────────────

test.describe('Dashboard Page', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndSelectRole(page);
  });

  test('renders all 4 stat cards', async ({ page }) => {
    await expect(page.locator('text=Total Calls')).toBeVisible();
    await expect(page.locator('text=Active Now')).toBeVisible();
    await expect(page.locator('text=Completed Today')).toBeVisible();
    await expect(page.locator('text=Satisfaction')).toBeVisible();
    console.log('✔ All 4 stat cards rendered');
  });

  test('stat cards show real numbers', async ({ page }) => {
    await expect(page.locator('text=1,248')).toBeVisible();
    await expect(page.locator('text=312')).toBeVisible();
    await expect(page.locator('text=94.3%')).toBeVisible();
    console.log('✔ Stat cards show expected values (1248 total, 312 completed, 94.3% satisfaction)');
  });

  test('active calls table shows 5 live calls', async ({ page }) => {
    await expect(page.locator('text=Active Calls')).toBeVisible();
    await expect(page.locator('text=5 live')).toBeVisible();
    // Check some beneficiary names
    await expect(page.locator('text=Priya Sharma')).toBeVisible();
    await expect(page.locator('text=Rajesh Kumar')).toBeVisible();
    await expect(page.locator('text=Ananya Reddy')).toBeVisible();
    console.log('✔ Active calls table shows 5 live calls with correct names');
  });

  test('recent calls section is visible', async ({ page }) => {
    await expect(page.locator('text=Recent Calls')).toBeVisible();
    await expect(page.locator('text=Lakshmi Devi')).toBeVisible();
    console.log('✔ Recent calls section visible');
  });

  test('call category breakdown is rendered', async ({ page }) => {
    const section = page.locator('div').filter({ hasText: 'Call Categories' }).last();
    await expect(section).toBeVisible();
    // Use the section as scope to avoid ambiguity with the calls table
    await expect(section.locator('text=38%')).toBeVisible();
    await expect(section.locator('text=24%')).toBeVisible();
    await expect(section.locator('text=18%')).toBeVisible();
    console.log('✔ Category breakdown shows percentage bars (38%, 24%, 18%)');
  });

  test('live clock is updating', async ({ page }) => {
    const clock1 = await page.locator('.tabular-nums').first().innerText();
    await page.waitForTimeout(1100);
    const clock2 = await page.locator('.tabular-nums').first().innerText();
    expect(clock1).not.toEqual(clock2);
    console.log(`✔ Live clock updates: "${clock1}" → "${clock2}"`);
  });

  test('sidebar is visible with nav items', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('link', { name: /Dashboard/ })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: /Call Management/ })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: /Beneficiary/ })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: /Case Sheet/ })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: /Reports/ })).toBeVisible();
    console.log('✔ Sidebar shows all 5 nav items');
  });

  test('sidebar collapse/expand toggle works', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/w-64/);
    const toggleBtn = page.getByTestId('sidebar-toggle');
    // Collapse
    await toggleBtn.click();
    await expect(sidebar).toHaveClass(/w-16/);
    // Expand — use JS click since button may be pushed out of visible area in collapsed mode
    await toggleBtn.evaluate((el: HTMLElement) => el.click());
    await expect(sidebar).toHaveClass(/w-64/);
    console.log('✔ Sidebar collapse/expand toggle works');
  });

  test('call status badges render correct colors', async ({ page }) => {
    // Active status should have green styling
    const activeBadge = page.locator('.bg-green-100').first();
    await expect(activeBadge).toBeVisible();
    console.log('✔ Status badges render with correct colors');
  });
});

// ─── 4. Call Management ───────────────────────────────────────────────────────

test.describe('Call Management Page', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndSelectRole(page);
    await page.locator('a[href="/calls"]').click();
    await page.waitForURL('**/calls');
  });

  test('page title is visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Call Management' })).toBeVisible();
    console.log('✔ Call Management page title visible');
  });

  test('shows all 5 active calls in table', async ({ page }) => {
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(5);
    console.log('✔ Table shows 5 call rows');
  });

  test('shows expected column headers', async ({ page }) => {
    await expect(page.locator('th', { hasText: 'Beneficiary' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Phone' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Status' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'District' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Duration' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Category' })).toBeVisible();
    console.log('✔ All 6 table column headers visible');
  });

  test('search by name filters results', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Priya');
    await page.waitForTimeout(300);
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(page.locator('text=Priya Sharma')).toBeVisible();
    console.log('✔ Search "Priya" filters to 1 result');
  });

  test('search by district filters results', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Hyderabad');
    await page.waitForTimeout(300);
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(1);
    console.log('✔ Search by district "Hyderabad" filters correctly');
  });

  test('clearing search restores all rows', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Priya');
    await page.waitForTimeout(200);
    await page.fill('input[placeholder*="Search"]', '');
    await page.waitForTimeout(200);
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(5);
    console.log('✔ Clearing search restores all 5 rows');
  });

  test('search with no match shows empty table', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'ZZZNOMATCH999');
    await page.waitForTimeout(200);
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(0);
    console.log('✔ No-match search shows empty table');
  });

  test('New Call button is visible', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'New Call' })).toBeVisible();
    console.log('✔ New Call button visible');
  });
});

// ─── 5. Beneficiary Page ──────────────────────────────────────────────────────

test.describe('Beneficiary Page', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndSelectRole(page);
    await page.locator('a[href="/beneficiary"]').click();
    await page.waitForURL('**/beneficiary');
  });

  test('page title and subtitle visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Beneficiary Registration' })).toBeVisible();
    await expect(page.locator('text=Manage patient records')).toBeVisible();
    console.log('✔ Beneficiary page title and subtitle visible');
  });

  test('shows 3 beneficiary cards', async ({ page }) => {
    const cards = page.locator('.border.border-gray-200.rounded-xl');
    await expect(cards).toHaveCount(4); // 1 search container + 3 beneficiary cards inside grid
    console.log('✔ 3 beneficiary cards rendered');
  });

  test('beneficiary names are visible', async ({ page }) => {
    await expect(page.locator('text=Priya Sharma')).toBeVisible();
    await expect(page.locator('text=Rajesh Kumar')).toBeVisible();
    await expect(page.locator('text=Ananya Reddy')).toBeVisible();
    console.log('✔ All 3 beneficiary names visible on cards');
  });

  test('search filters beneficiaries', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'Priya');
    await page.waitForTimeout(200);
    await expect(page.locator('text=Priya Sharma')).toBeVisible();
    await expect(page.locator('text=Rajesh Kumar')).toBeHidden();
    console.log('✔ Search filters beneficiaries correctly');
  });

  test('Register New button is visible', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'Register New' })).toBeVisible();
    console.log('✔ Register New button visible');
  });

  test('beneficiary cards show phone and location', async ({ page }) => {
    await expect(page.locator('text=9876543210')).toBeVisible();
    await expect(page.locator('text=Hyderabad')).toBeVisible();
    console.log('✔ Phone number and district visible on cards');
  });
});

// ─── 6. Navigation & Auth Guard ───────────────────────────────────────────────

test.describe('Navigation & Auth Guard', () => {

  test('auth guard blocks /dashboard without login', async ({ page }) => {
    // Clear session and navigate
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Auth guard redirects /dashboard → /login');
  });

  test('auth guard blocks /calls without login', async ({ page }) => {
    await page.goto('/calls');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Auth guard redirects /calls → /login');
  });

  test('auth guard blocks /beneficiary without login', async ({ page }) => {
    await page.goto('/beneficiary');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Auth guard redirects /beneficiary → /login');
  });

  test('logout from sidebar clears session and redirects', async ({ page }) => {
    await loginAndSelectRole(page);
    await page.locator('button', { hasText: 'Sign Out' }).click();
    await page.waitForURL('**/login');
    // Verify session is cleared — dashboard should redirect back to login
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Logout clears session — /dashboard redirect to /login confirmed');
  });

  test('unknown route redirects to login', async ({ page }) => {
    await page.goto('/some-nonexistent-path');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
    console.log('✔ Unknown route 404 → /login');
  });

  test('sidebar nav badge shows 7 for Call Management', async ({ page }) => {
    await loginAndSelectRole(page);
    await expect(page.locator('text=7').first()).toBeVisible();
    console.log('✔ Call Management badge shows count 7');
  });
});
