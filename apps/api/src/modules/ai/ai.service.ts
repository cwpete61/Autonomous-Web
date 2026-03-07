import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

// ── Prompt templates from email.md ────────────────────────────────────────────

const PROMPT_1 = (v: EmailInputs) => `
You are an outbound communication assistant generating a professional cold outreach email.

Write a short email addressed to {{decision_maker_name}} from ${v.sender_company}.

The recipient works at a company operating in the ${v.industry} sector.

The purpose of the email is to briefly reference a potential improvement related to
"${v.pain_point_signal}" and introduce an idea related to "${v.primary_outcome}".

Requirements:
- Keep the email between 40 and 70 words
- Reference the industry context naturally
- Use a conversational tone
- Avoid marketing buzzwords
- End with a simple question asking if they would like more details

The sender name is ${v.sender_name}.

Return JSON with this exact structure:
{ "subject": "...", "body": "..." }
Only return the JSON object, no other text.
`.trim();

const PROMPT_2 = (v: EmailInputs) => `
You are generating the second message in an outbound outreach sequence.

The recipient works at a company in the ${v.industry} sector.

The first email referenced an opportunity related to "${v.pain_point_signal}".

Write a short follow-up email that briefly mentions the previous message and clarifies the
potential benefit connected to "${v.primary_outcome}"${v.secondary_outcome ? ` and "${v.secondary_outcome}"` : ''}.

Requirements:
- Keep the email between 40 and 70 words
- Maintain a professional tone
- Reference the earlier email politely
- Do not pressure the recipient
- End with a simple call-to-action asking if they would like a short explanation

The sender name is ${v.sender_name} from ${v.sender_company}.

Return JSON with this exact structure:
{ "subject": "...", "body": "..." }
Only return the JSON object, no other text.
`.trim();

const PROMPT_3 = (v: EmailInputs) => `
You are generating the third and final email in a short outreach sequence.

The recipient works at a company in the ${v.industry} sector.

Write a concise message that acknowledges the previous emails and offers one final
opportunity to discuss an idea related to "${v.primary_outcome}".

Requirements:
- Keep the email between 35 and 60 words
- Maintain a respectful and neutral tone
- Avoid sales language
- Allow the recipient an easy way to decline
- End with a short question inviting a reply

The sender name is ${v.sender_name} from ${v.sender_company}.

Return JSON with this exact structure:
{ "subject": "...", "body": "..." }
Only return the JSON object, no other text.
`.trim();

// Steps 4 and 5 reuse the follow-up / final patterns with an explicitly different angle
const PROMPT_4 = (v: EmailInputs) => `
You are generating a fourth outreach email in a sequence. The previous emails covered the
main benefit. This email should approach from a different angle.

The recipient is in the ${v.industry} sector.

Briefly reference "${v.secondary_outcome || v.primary_outcome}" from a new perspective —
for example, a specific result, a risk of not acting, or a simpler framing.

Requirements:
- 40–65 words
- Different angle from previous emails
- Conversational, not pushy
- One clear question at the end

Sender: ${v.sender_name} from ${v.sender_company}.

Return JSON: { "subject": "...", "body": "..." }
Only return the JSON object.
`.trim();

const PROMPT_5 = (v: EmailInputs) => `
You are generating the fifth and final email in an outreach sequence.

The recipient is in the ${v.industry} sector and has not responded to four previous emails.

Write a brief closing message that:
- Acknowledges you will not follow up again after this
- Offers one final, easy way to respond
- Keeps the door open without pressure
- Is warm and professional

35–55 words. End with a simple yes/no question.

Sender: ${v.sender_name} from ${v.sender_company}.

Return JSON: { "subject": "...", "body": "..." }
Only return the JSON object.
`.trim();

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EmailInputs {
    industry: string;
    pain_point_signal: string;
    primary_outcome: string;
    secondary_outcome?: string;
    sender_name: string;
    sender_company: string;
    step_count: number;
}

export interface GeneratedEmail {
    subject: string;
    body: string;
}

export interface GeneratedSequence {
    [key: string]: GeneratedEmail | undefined;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class AiService {
    private readonly apiKey = process.env.ANTHROPIC_API_KEY;
    private readonly model = 'claude-sonnet-4-20250514';
    private readonly apiUrl = 'https://api.anthropic.com/v1/messages';

    async generateEmailSequence(inputs: EmailInputs): Promise<GeneratedSequence> {
        if (!this.apiKey) {
            throw new HttpException(
                'ANTHROPIC_API_KEY is not configured',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }

        const prompts: ((v: EmailInputs) => string)[] = [
            PROMPT_1,
            PROMPT_2,
            PROMPT_3,
            PROMPT_4,
            PROMPT_5,
        ].slice(0, inputs.step_count);

        // Call Claude for each step in parallel
        const results = await Promise.all(
            prompts.map((buildPrompt) => this.callClaude(buildPrompt(inputs))),
        );

        const sequence: GeneratedSequence = {};
        results.forEach((result, i) => {
            sequence[`email_${i + 1}`] = result;
        });

        return sequence;
    }

    private async callClaude(prompt: string): Promise<GeneratedEmail> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey as string,
                'anthropic-version': '2023-06-01',
            } as Record<string, string>,
            body: JSON.stringify({
                model: this.model,
                max_tokens: 400,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            throw new HttpException(
                `Claude API error: ${response.status}`,
                HttpStatus.BAD_GATEWAY,
            );
        }

        const data = await response.json();
        const raw = data.content?.[0]?.text ?? '{}';

        try {
            const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
            return {
                subject: parsed.subject ?? '',
                body: parsed.body ?? '',
            };
        } catch {
            return { subject: '', body: raw };
        }
    }
}
