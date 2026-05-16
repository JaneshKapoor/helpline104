# Helpline 104 UI — Angular Migration Prototype

> **DMP 2026 Contribution Prototype**  
> Organisation: [Piramal Swasthya Management and Research Institute (PSMAI)](https://www.piramalswasthya.org/)  
> Ticket: [#129 — Angular 4 to Angular 19 + Zard UI Migration](https://github.com/PSMRI/Helpline104-UI/issues/129)  
> Contributor: **Janesh Kapoor**

**🔗 Live Demo:** [helpline104.netlify.app](https://helpline104.netlify.app/) — credentials are pre-filled, just click **Sign In**

---

## Overview

This is a prototype demonstrating the proposed migration of the **Helpline 104** healthcare support application from **Angular 4.1.3** to **Angular 21** using modern architecture patterns.

Helpline 104 is a government-operated health helpline run across Indian states by Piramal Swasthya. When a citizen calls 104, trained health workers (Agents) receive the call, register the caller as a beneficiary, record a case sheet, and provide medical guidance or escalate to a doctor. This UI is the web application those health workers use.

The existing codebase uses deprecated Angular Material 2.0.0-beta.11, `@angular/http`, RxJS 5, and Bootstrap 3 — all end-of-life. This prototype rebuilds the core infrastructure and primary user flows from scratch using the latest Angular conventions.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Angular 21 (standalone component architecture) |
| Styling | Tailwind CSS v3 |
| State Management | Angular Signals |
| HTTP Client | `@angular/common/http` with functional interceptors |
| Routing | Lazy-loaded routes with functional guards |
| Language | TypeScript 5.9 |
| Testing | Playwright (E2E — 44 tests, 44 passing) |

### Key migrations demonstrated from old codebase

| Old (Angular 4) | New (Angular 21) |
|---|---|
| `NgModule` monolith (530 lines) | Standalone components — no `NgModule` |
| `@angular/http` | `HttpClient` via `provideHttpClient()` |
| Class-based `CanActivate` guard | Functional `CanActivateFn` |
| Class-based `HttpInterceptor` | Functional `HttpInterceptorFn` |
| RxJS 5 prototype patching | RxJS 7 pipe operators |
| Bootstrap 3 grid | Tailwind CSS utility classes |
| `BrowserModule` + eager loading | Lazy-loaded feature routes |
| Mutable component state | Angular Signals (`signal()`, `computed()`) |

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # auth.guard.ts — functional CanActivateFn
│   │   ├── interceptors/    # auth.interceptor.ts — functional HttpInterceptorFn
│   │   ├── models/          # user.model.ts, call.model.ts
│   │   └── services/        # auth.service.ts, call.service.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/           # Login with captcha + validation
│   │   │   └── role-selection/  # Agent / Supervisor / SIO picker
│   │   ├── dashboard/           # Live stats, active calls, category breakdown
│   │   ├── call-management/     # Call table with real-time search
│   │   └── beneficiary/         # Patient registration cards
│   ├── layouts/
│   │   └── main-layout/     # Shell with collapsible sidebar
│   └── shared/
│       └── components/
│           └── sidebar/     # Nav with route highlights + badges
├── styles.css               # Tailwind CSS directives + global styles
e2e/
└── app.spec.ts              # 44 Playwright E2E tests
```

---

## User Flow

```
/login  ──(valid credentials)──►  /role-selection  ──(pick role)──►  /dashboard
                                                                           │
                                              ┌────────────────────────────┤
                                              ▼                            ▼
                                         /calls                     /beneficiary
                                    (call management)          (patient registration)
```

### 1. Login (`/login`)
- Username + password + captcha verification
- Inline error messages for wrong credentials or captcha mismatch
- Captcha refresh button generates a new code
- Password show/hide toggle
- On success → redirected to role selection

### 2. Role Selection (`/role-selection`)
- Displays available roles: **Agent**, **Supervisor**, **SIO**
- Continue button is disabled until a role is selected
- Visual highlight + checkmark on selected role

### 3. Dashboard (`/dashboard`)
- Live clock (updates every second)
- 4 stat cards: Total Calls · Active Now · Completed Today · Satisfaction Rate
- Active calls table with status badges (Active / On Hold / Completed / Missed)
- Recent calls panel with timestamps
- Call category breakdown (Medical Advice, Mental Health, Emergency, Follow-up, Other)
- Collapsible sidebar with nav badges

### 4. Call Management (`/calls`)
- Full table of active calls
- Real-time search by beneficiary name, phone number, or district
- Empty state when no results match

### 5. Beneficiary Registration (`/beneficiary`)
- Patient cards with gender color coding, age, phone, location
- Real-time search filter
- Register New patient flow

### 6. Auth Guard
- All protected routes redirect unauthenticated users to `/login`
- Session cleared on logout
- Unknown routes redirect to `/login`

---

## Live Demo

**[https://helpline104.netlify.app/](https://helpline104.netlify.app/)**

Credentials are pre-filled on the login page — just click **Sign In** to explore the full prototype.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/JaneshKapoor/helpline104.git
cd helpline104
npm install
```

### Development Server

```bash
npm start
```

Open `http://localhost:4200`

**Demo credentials:**
- Username: `demo`
- Password: `Demo@1234`

### Production Build

```bash
ng build --configuration production
```

### Run E2E Tests

```bash
# Requires dev server running (npm start)
npx playwright test --reporter=list
```

---

## Architecture Decisions

### Standalone Components
Every component uses `standalone: true` with explicit `imports: []`. No `NgModule` anywhere — aligning with Angular's recommended approach since v17.

### Lazy-Loaded Routes
Each feature loads its own JS chunk on demand. Build output shows separate chunks for `login`, `dashboard`, `main-layout`, `role-selection`, `call-management`, and `beneficiary`.

### Functional Guard
```typescript
// core/guards/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
```

### Functional HTTP Interceptor
```typescript
// core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userData = sessionStorage.getItem('userData');
  if (!userData) return next(req);
  const { token } = JSON.parse(userData);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
```

### Signals for State
```typescript
readonly currentUser = signal<User | null>(this.loadUser());
readonly isAuthenticated = signal<boolean>(!!this.loadUser());
```

---

## Ticket Alignment

| Ticket Requirement | Status |
|---|---|
| Scaffold Angular 19+ with standalone architecture | ✅ Angular 21, 100% standalone |
| Replace `@angular/http` with `HttpClient` | ✅ `provideHttpClient(withInterceptors([...]))` |
| Functional guards replacing class-based | ✅ `CanActivateFn` |
| Functional HTTP interceptors | ✅ `HttpInterceptorFn` |
| RxJS 7 pipe operators | ✅ `pipe()`, `throwError(() => ...)` |
| Tailwind CSS replacing Bootstrap 3 | ✅ Tailwind CSS v3 |
| Lazy-loaded feature modules | ✅ All routes lazy-loaded |
| Auth flow: login → role selection → dashboard | ✅ Full flow implemented |
| Core services and models | ✅ AuthService, CallService, typed models |

---

## E2E Test Coverage

```
Login Page           8 tests   ✅ all passing
Role Selection       7 tests   ✅ all passing
Dashboard            9 tests   ✅ all passing
Call Management      7 tests   ✅ all passing
Beneficiary          6 tests   ✅ all passing
Navigation & Guards  7 tests   ✅ all passing
──────────────────────────────────────────────
Total               44 tests   44 passed
```

---

## About

Built as part of the **Dedicated Mentoring Program (DMP) 2026** application to contribute to [PSMRI/Helpline104-UI](https://github.com/PSMRI/Helpline104-UI).

**Contributor:** Janesh Kapoor  
**Organisation:** Piramal Swasthya Management and Research Institute  
**Mentor:** @drtechie
