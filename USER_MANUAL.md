# AccentInsure Assistant — User Manual

A quick guide to using the AccentInsure Assistant chatbot. **Audience:** customers, support agents, and business users — not developers.

> Developer guide is in [README.md](README.md).

---

## What Is AccentInsure Assistant?

AccentInsure Assistant is an AI chatbot that answers everyday insurance questions in plain English. Use it to:

- Understand what's covered (and what's not) under common policy types
- Look up insurance terminology (premium, deductible, rider, endorsement, etc.)
- Get walkthroughs of how to file a claim
- Learn what documents are typically needed for different processes
- Ask follow-up questions in the same conversation — the bot remembers context

It is available across **motor, health, home, life, and travel** insurance topics.

---

## Getting Started

### 1. Open the Chatbot

Open your browser and navigate to:

```
http://localhost:4200
```

> If you're using a hosted version, your administrator will give you a different URL.

You'll see the chat window with an empty conversation.

### 2. Ask Your First Question

Type a question into the input box at the bottom and press **Enter** (or click **Send**).

The assistant will start replying within a second or two, and you'll see the answer appear word by word as it's generated.

### 3. Have a Conversation

You can ask follow-up questions naturally — the assistant remembers what you've discussed earlier in the session. For example:

> **You:** What's a deductible?
> **AccentInsure:** A deductible is the amount you pay out of pocket before your insurance starts covering costs...
>
> **You:** How is that different from a copay?
> **AccentInsure:** Good question — while a deductible is the upfront amount you pay annually, a copay is...

You do **not** need to repeat context. The bot follows the thread.

---

## Sample Questions You Can Ask

### Coverage & Policies
- "What's typically covered under a comprehensive motor insurance policy?"
- "Does home insurance cover damage from flooding?"
- "What's the difference between term life and whole life insurance?"
- "Are pre-existing conditions covered under health insurance?"

### Terminology
- "Explain 'no-claim bonus' in simple terms."
- "What's the difference between a rider and an endorsement?"
- "What does 'sum assured' mean?"

### Claims Process
- "How do I file a motor accident claim?"
- "What documents do I need to claim health insurance after hospitalization?"
- "How long does a typical claim take to settle?"

### Travel & Specialty
- "What does travel insurance cover for trip cancellations?"
- "Is COVID-19 covered under standard health policies?"

---

## Features

### Real-Time Streaming Responses
Answers appear word-by-word as the AI generates them. You don't have to wait for the full response before reading.

### Conversation Memory
The bot remembers everything you've discussed in the current session, so follow-up questions work naturally.

### Clear Chat
At the top right of the chat window, click **Clear chat** to start fresh. This:
- Erases the visible conversation history
- Resets the bot's memory of your discussion
- Useful when switching to an unrelated topic

### Multi-Line Input
Press **Shift + Enter** to add a new line without sending. Useful for longer, multi-part questions.

---

## What the Assistant Cannot Do

To set realistic expectations:

| ❌ Cannot do | ✅ Do this instead |
|--------------|---------------------|
| Quote you a specific premium amount | Visit the AccentInsure quote page or call a licensed agent |
| Approve, deny, or guarantee a claim | The bot can explain the *process*; only a claims adjuster can decide an outcome |
| Give legal or binding financial advice | Consult a licensed financial or legal professional |
| Access your personal policy details | The POC version has no access to your account or policy database |
| Process payments or modify your policy | Use the AccentInsure customer portal or call support |
| Provide medical advice | Consult a qualified healthcare professional |

If you ask something it can't answer, the bot will say so clearly and offer to connect you with a human agent.

---

## Privacy & Data Handling

### For the POC version (current deployment)
- **Do not share** real personally identifiable information (PII): full name, government ID, card numbers, full date of birth, medical record numbers, or actual policy numbers.
- Test data and hypothetical scenarios are fine.
- Conversations are stored **in server memory only** and disappear when the backend restarts.
- Messages are sent to **Cohere** (the underlying AI provider) for processing. Cohere's data handling policy applies — see https://cohere.com/privacy.

### General disclaimer
Every policy-specific answer ends with:
> *"This information is for general guidance only and is not a binding quote or legal advice."*

Treat anything the bot says as a starting point for your own research or for a follow-up with a licensed advisor — not as the final word.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| The page doesn't load | Make sure the backend is running and your administrator's URL is correct |
| The bot says "Stream connection error" | Wait a few seconds and ask again; this usually clears |
| Responses are slow or cut off | Trial-tier rate limits may be active; try again in a minute |
| The bot misunderstands a question | Rephrase more specifically (mention the policy type, country, or scenario) |
| You see error messages with code numbers | Note the message and report to your administrator |

---

## Tips for Better Answers

1. **Be specific about the policy type.** "Is theft covered?" is ambiguous; "Is theft covered under a comprehensive motor policy in India?" gets a sharper answer.
2. **Provide scenario context.** "I just had a minor fender bender — what's the right next step?" works better than "claims process".
3. **Ask follow-ups freely.** The bot keeps context — use that instead of restating everything.
4. **Use plain language.** No need to use insurance jargon; explain in your own words and the bot will translate.

---

## Feedback & Support

This is a **proof-of-concept** — your feedback shapes the production version.

- **Bug reports / unexpected answers:** Note the question you asked, the response you got, and what you expected. Send to your administrator.
- **Suggestions:** What kinds of questions would you ask most often? What would make the answers more useful? We want to know.
- **Feature requests:** Currently planned but not yet built: account login, access to your real policy details, document upload (e.g., upload a policy PDF and ask questions about it), call-center handoff.

---

## Quick Reference

| Action | How |
|--------|-----|
| Send a message | Type and press **Enter** |
| New line in input | **Shift + Enter** |
| Clear conversation | **Clear chat** button (top right) |
| Get an explanation | Just ask in plain English |

That's it — start asking.
