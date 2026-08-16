# Deployment

**Best for:** where the software actually runs — containers placed on real infrastructure (region → cluster → nodes), one environment per diagram. **Routing rule:** architecture answers "what are the parts"; deployment answers "WHERE does each part run" — if no box names a region/cluster/node, it is not a deployment diagram.

## Layout conventions
- Infra containers, nested max 3 levels: outermost = cloud region (`paper-2` fill, hairline `rule` stroke, `rx=8`), inside it = cluster/VPC (transparent fill, dashed `ink@0.25` stroke), inside that = node groups only if needed. Each container's eyebrow is Geist Mono uppercase, top-left inside (`AWS · AP-SOUTHEAST-1`, `EKS CLUSTER`), with ≥16px between eyebrow and the first enclosed box.
- Deployed units: white boxes `rx=6` with Geist sans name + mono sublabel (image · port) + a **replica badge** — small mono tag `×3` (`rx=2`, top-right of the box). Replica count is load-bearing info on a deployment diagram.
- Managed services (RDS, ElastiCache, S3): store treatment (`ink@0.05` fill, `muted` stroke) with mono sublabel (`postgres 15 · multi-az`). They sit inside the region but outside the cluster.
- Edge chain: user/CDN outside the region at left → ALB → ingress → services. Traffic arrows orthogonal `r=8`, labeled 8px mono all-caps masked (`HTTPS`, `GRPC`, `SQL`) — inside a container, mask with that container's fill. `link` color on the public ingress path; `muted` (dashed for async) inside.
- Coral (max 2): the single point of failure or focal path — the one deployment the diagram exists to discuss — accent-stroked, plus its annotation callout.
- Legend bottom strip: Deployed unit · Managed service · Cluster boundary · Region · Public path.

## Complexity budget
- Max 3 nesting levels.
- Max 10 deployed units.
- Max 12 arrows.
- **ONE environment per diagram** — dev, staging, and prod each get their own.

## Anti-patterns
- Logical architecture redrawn with cloud icons — if no box names a region or node, it's not a deployment diagram.
- Mixing environments in one diagram.
- Icon soup without text labels.
- Omitting replica counts where scaling matters.
- Drawing every AWS service you use instead of the ones in the request path.

## Examples
- `assets/example-deployment.html` — minimal light
- `assets/example-deployment-dark.html` — minimal dark
- `assets/example-deployment-full.html` — full editorial
