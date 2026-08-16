# Event Flow

**Best for:** event-driven topologies — producers publishing events to topics/queues, consumers subscribing, async fan-out through a broker (Kafka, SNS/SQS, RabbitMQ), dead-letter routing.

**Routing rule vs sequence:** sequence = ordered request/reply between named parties ("A asks B, B answers"); event flow = fire-and-forget fan-out through topics ("A announces, whoever subscribed reacts"). If your arrows need sequence numbers, go back to sequence.

## Layout conventions
- **Three vertical zones**: producers (left column), topics/queues (middle column), consumers (right column). Zone labels in the mono `eyebrow` role across the top.
- A service that both consumes and produces appears in **both columns with the same name** — never route a backward arrow across zones to reuse one box.
- **Topics get a distinct treatment** — they are infrastructure, not services: horizontal channel bars (~192×32), `paper-2` fill, 1px `muted` stroke, and a **doubled bottom edge** (second hairline 3px below the bottom border — evokes a log/queue), plus a mono type tag `TOPIC` or `QUEUE` (rx=2). The topic name is set in Geist Mono — it is a technical identifier (`orders.created`). This treatment is the type's signature.
- **Event names are past tense** (`orders.created`, `payments.captured`) — events announce facts that happened. Imperative names (`createOrder`) are commands and belong on a sequence diagram.
- Producers/consumers: white service boxes rx=6, Geist sans names, mono sublabels only where real.
- Arrows: producer → topic (publish) and topic → consumer (deliver), orthogonal r=8 elbows, muted. Each topic fans out to its consumers from distinct attach points ≥12px apart. Label an edge only when it adds information beyond the topic name (e.g. `BATCH · 5MIN` on an analytics edge).
- **DLQ / retry path**: dashed stroke to a `QUEUE`-tagged dead-letter channel — coral, because the operational risk is what the diagram exists to surface. A short italic-serif annotation may accompany it (second coral element, budget permitting — else keep one).
- Legend bottom strip: Service · Topic · Queue · Publish/deliver · Dead-letter path.

## Complexity budget
- Max topics/queues: 4. Max services: 8. Max edges: 12.
- Every topic has ≥1 producer and ≥1 consumer. An orphan topic is a modeling smell — show it honestly only if annotated as such.

## Anti-patterns
- Request/reply drawn as events — arrows that need sequence numbers mean you wanted a sequence diagram.
- Topics drawn as plain service boxes — the doubled-edge channel treatment is the point of this type.
- Imperative / command event names (`createOrder` instead of `orders.created`).
- Producer → consumer arrows that bypass the topic — that coupling is exactly what the topology removed.
- Cycle spaghetti — if the graph loops back more than once, split by domain.

## Examples
- `assets/example-event-flow.html` — minimal light (e-commerce order pipeline)
- `assets/example-event-flow-dark.html` — minimal dark
- `assets/example-event-flow-full.html` — full editorial
