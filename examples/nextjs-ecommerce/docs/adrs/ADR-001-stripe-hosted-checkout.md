# ADR-001: Stripe hosted Checkout over custom Payment Element flow

Date: 2026-07-30
Status: Accepted

## Context

Payments need PCI compliance, 3DS handling and local payment methods.
Building a custom flow with Payment Element gives full UI control but makes
us responsible for the payment state machine, retries and edge cases. This
is a solo-maintained store; payment bugs are the most expensive kind.

## Decision

Use Stripe hosted Checkout Sessions. Order lifecycle is driven exclusively
by the `checkout.session.completed` webhook.

## Consequences

- Easier: PCI scope minimal, 3DS/local methods handled by Stripe, less UI code.
- Easier: one source of truth for payment state (the webhook).
- Harder: checkout page look & feel is Stripe's, limited branding.
- Harder: local dev requires the Stripe CLI forwarding webhooks.

## Alternatives considered

- Payment Element (embedded) — full control, but we own the state machine.
- Mercado Pago Checkout Pro — better AR coverage, weaker dev tooling; revisit
  if AR-only payment methods become a requirement.
