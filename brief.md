1. Overview

Build a single-page web app where a user pastes anything (product, idea, movie, link, lifestyle choice), and an AI judges it as:
	•	STYLE
	•	SUBSTANCE
	•	DELUSION

The twist:
The app maintains a persistent “energy profile” that evolves with each judgment:
	•	Substance energy
	•	Style energy
	•	Delusion energy

This turns the app into:

a running portrait of the user’s taste and decision patterns

⸻

2. Core Experience

Main loop
	1.	User lands on page
	2.	Sees 3 energy bars (starting at 33 / 33 / 33)
	3.	Pastes something into input
	4.	Clicks Judge
	5.	Sees loading state
	6.	Receives:
	•	verdict (STYLE / SUBSTANCE / DELUSION)
	•	score (0–100)
	•	short explanation
	7.	Energy values update
	8.	State persists
	9.	User repeats

⸻

3. Key Product Behavior

Input

Single textarea that accepts:
	•	plain text
	•	product names
	•	ideas
	•	behaviors
	•	URLs

Placeholder:

“Paste anything: a product, movie, idea, or questionable life choice…”

⸻

Output

Return:
	•	Verdict (big, dominant)
	•	Score (0–100)
	•	Explanation (1–3 sentences)
	•	Optional: interpreted label/title

Tone:
	•	sharp
	•	insightful
	•	slightly sarcastic
	•	not mean

⸻

4. Energy System (IMPORTANT)

Initial state
Substance: 33
Style: 33
Delusion: 33

-----
⸻

Update rules

STYLE
	•	Style +10
	•	Substance -5
	•	Delusion +2

SUBSTANCE
	•	Substance +10
	•	Style -3
	•	Delusion -2

DELUSION
	•	Delusion +12
	•	Substance -6
	•	Style -3


Constraints
	•	Clamp values between 0–100
	•	No need to sum to 100
	•	These are independent meters
UI feedback (must show)

After each judgment:
+10 Style
-5 Substance
+2 Delusion
_---

Persistence

Store in localStorage:
{
  "substance": number,
  "style": number,
  "delusion": number
}


5. UX Structure

Single page layout
[ Top energy bar strip ]

[ Left small utility rail ]

[ Main panel (changes state) ]

States

1. Idle
	•	Title
	•	Textarea
	•	Button

2. Loading
	•	Centered text:
	•	“Analyzing intent…”
	•	“Detecting delusion…”
	•	etc.

3. Result
	•	Label (optional)
	•	Verdict (big)
	•	Score
	•	Explanation
	•	Energy delta
	•	“Judge again” button

⸻

6. Visual Direction

Overall feel

Old computer UI + early web + dev tool (PostHog-like)

NOT:
	•	glossy SaaS
	•	overdesigned
	•	playful illustrations

YES:
	•	structured
	•	text-first
	•	slightly brutal
	•	personality through copy

⸻

Style guidelines
	•	Framed panels with borders
	•	Minimal shadows
	•	Neutral colors
	•	Accent color ONLY for verdict

Suggested colors
	•	Background: light gray / off-white
	•	Borders: medium gray
	•	Text: near black

Verdicts:
	•	Substance → green
	•	Style → yellow/amber
	•	Delusion → red

⸻

Typography
	•	Base: Inter (or system font)
	•	Optional: mono font for labels (JetBrains Mono)

⸻

7. Tech Requirements
	•	Next.js (App Router)
	•	TypeScript
	•	Tailwind CSS
	•	API route for AI call
	•	No database
	•	No auth
	•	Vercel deployable


----
8. API Behavior

Route

POST /api/judge

Input
{ "input": "string" }

Output
{
  "label": "string",
  "verdict": "STYLE | SUBSTANCE | DELUSION",
  "score": number,
  "reason": "string"
}

Requirements
	•	Validate response
	•	Ensure verdict is valid
	•	Clamp score 0–100
	•	Handle errors gracefully

⸻

9. AI Behavior

The model must:
	•	interpret ambiguous input
	•	infer intent
	•	judge not just object, but desire behind it

Examples:
	•	“Leica camera” → likely STYLE-driven desire
	•	“ergonomic chair” → likely SUBSTANCE
	•	“third productivity notebook” → DELUSION

⸻

10. Core Components

Suggested structure:
	•	App shell (layout)
	•	Energy bars (top)
	•	Input panel
	•	Loading panel
	•	Result panel
	•	Side controls (reset button)

⸻

11. State Model

Keep simple client state:
	•	input
	•	loading
	•	result
	•	energy profile
	•	last delta
	•	error

⸻

12. Must-Haves
	•	Works end-to-end
	•	Energy updates correctly
	•	State persists on refresh
	•	Clean loading state
	•	Clean error state
	•	Deploys on Vercel

⸻

13. Explicit Non-Goals

Do NOT build:
	•	authentication
	•	database
	•	image upload
	•	scraping pipeline
	•	multiple pages
	•	complex animations

⸻

14. Product Philosophy (important for Claude)

This is not a utility tool.

It should feel like:

A system that tells you what kind of person you are becoming.

Tone and behavior should reflect:
	•	judgment
	•	insight
	•	slight discomfort
	•	but usefulness

⸻

15. Success Criteria

The app is successful if:
	•	It feels fast and satisfying
	•	Judgments feel surprisingly accurate
	•	The energy system makes users want to try multiple inputs
	•	It feels like a coherent product, not a demo


-----

now iwant you to build a plan on how to implement this product.