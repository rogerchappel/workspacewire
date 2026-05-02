export function renderText(plan) {
  const lines = [];
  lines.push(`workspacewire dry-run: ${plan.service}/${plan.operation}`);
  lines.push(`Safety: ${plan.safety.executesRequest ? 'would execute' : 'no live request'}; ${plan.safety.reason}`);
  lines.push(`Request: ${plan.request.method} ${plan.request.path}`);
  lines.push('Scopes:');
  for (const scope of plan.scopes) lines.push(`- ${scope.name} (${scope.risk}) ${scope.reason}`);
  lines.push(`Fixture: ${plan.fixture.source}; preview items: ${plan.fixture.matched}`);
  for (const item of plan.fixture.items) lines.push(`- ${item.id ?? item.email ?? item.name}: ${item.subject ?? item.summary ?? item.name ?? item.title ?? item.email}`);
  return `${lines.join('
')}
`;
}
